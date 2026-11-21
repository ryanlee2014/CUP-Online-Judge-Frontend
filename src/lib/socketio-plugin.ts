/**
 * Minimal local replacement for vue-socket.io@3.0.10, targeting socket.io-client 4.x.
 *
 * vue-socket.io ships a prebuilt bundle that inlines socket.io-client 2.x, so it would
 * add a second client copy to the build. This plugin keeps the same public API that the
 * app relies on:
 *   - Vue.prototype.$socket            -> the socket.io-client Socket instance
 *   - Vue.prototype.$vueSocketIo       -> plugin instance (emitter / io)
 *   - component `this.sockets.subscribe(event, fn)` / `this.sockets.unsubscribe(event)`
 *     (unsubscribe removes every listener of that event registered by the component)
 *   - component option `sockets: { event () {} }` (auto subscribe on mount / unsubscribe on destroy)
 *   - vuex: dispatches `${actionPrefix}${event}` actions (default "SOCKET_") and, when
 *     `mutationPrefix` is set, commits `${mutationPrefix}${event}` mutations.
 * Listener payload semantics match vue-socket.io: a single argument is passed as-is,
 * multiple arguments are passed as an array.
 */
import { VueConstructor } from "vue";
import { Store } from "vuex";
import { Socket } from "socket.io-client";

interface IVuexOptions {
    store?: Store<any>;
    actionPrefix?: string;
    mutationPrefix?: string;
}

interface IVueSocketIOOptions {
    connection: Socket;
    vuex?: IVuexOptions;
    debug?: boolean;
}

interface IListener {
    callback: (...args: any[]) => any;
    component: any;
}

// Reserved events emitted by the Socket itself.
const SOCKET_EVENTS = ["connect", "connect_error", "disconnect"];
// Reserved events that socket.io-client >= 3 emits on the Manager instead of the Socket.
const MANAGER_EVENTS = ["error", "reconnect", "reconnect_attempt", "reconnect_error", "reconnect_failed", "ping"];

class Logger {
    debug = false;
    info (text: string, data: any = "") {
        if (this.debug) {
            window.console.info("%cVue-Socket.io: " + text, "color: blue; font-weight: 600", data);
        }
    }
}

const logger = new Logger();

class EventEmitter {
    store?: Store<any>;
    actionPrefix: string;
    mutationPrefix?: string;
    listeners = new Map<string, IListener[]>();

    constructor (vuex: IVuexOptions = {}) {
        this.store = vuex.store;
        this.actionPrefix = vuex.actionPrefix ? vuex.actionPrefix : "SOCKET_";
        this.mutationPrefix = vuex.mutationPrefix;
    }

    addListener (event: string, callback: (...args: any[]) => any, component: any) {
        if (typeof callback !== "function") {
            throw new Error("callback must be a function");
        }
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)!.push({ callback, component });
        logger.info(`#${event} subscribe, component: ${component.$options.name}`);
    }

    removeListener (event: string, component: any) {
        if (this.listeners.has(event)) {
            const listeners = this.listeners.get(event)!.filter(listener => listener.component !== component);
            if (listeners.length > 0) {
                this.listeners.set(event, listeners);
            }
            else {
                this.listeners.delete(event);
            }
            logger.info(`#${event} unsubscribe, component: ${component.$options.name}`);
        }
    }

    emit (event: string, args: any) {
        if (this.listeners.has(event)) {
            logger.info(`Broadcasting: #${event}, Data:`, args);
            // copy so that (un)subscribing inside a callback does not affect this dispatch
            this.listeners.get(event)!.slice().forEach(listener => {
                listener.callback.call(listener.component, args);
            });
        }
        if (event !== "ping" && event !== "pong") {
            this.dispatchStore(event, args);
        }
    }

    dispatchStore (event: string, args: any) {
        const store: any = this.store;
        if (store && store._actions) {
            const actionName = this.actionPrefix + event;
            for (const key in store._actions) {
                if (key.split("/").pop() === actionName) {
                    logger.info(`Dispatching Action: ${key}, Data:`, args);
                    store.dispatch(key, args);
                }
            }
            if (this.mutationPrefix) {
                const mutationName = this.mutationPrefix + event;
                for (const key in store._mutations) {
                    if (key.split("/").pop() === mutationName) {
                        logger.info(`Commiting Mutation: ${key}, Data:`, args);
                        store.commit(key, args);
                    }
                }
            }
        }
    }
}

const mixin = {
    beforeCreate (this: any) {
        if (!this.sockets) this.sockets = {};
        this.sockets.subscribe = (event: string, callback: (...args: any[]) => any) => {
            this.$vueSocketIo.emitter.addListener(event, callback, this);
        };
        this.sockets.unsubscribe = (event: string) => {
            this.$vueSocketIo.emitter.removeListener(event, this);
        };
    },
    mounted (this: any) {
        if (this.$options.sockets) {
            Object.keys(this.$options.sockets).forEach(event => {
                if (event !== "subscribe" && event !== "unsubscribe") {
                    this.$vueSocketIo.emitter.addListener(event, this.$options.sockets[event], this);
                }
            });
        }
    },
    beforeDestroy (this: any) {
        if (this.$options.sockets) {
            Object.keys(this.$options.sockets).forEach(event => {
                this.$vueSocketIo.emitter.removeListener(event, this);
            });
        }
    }
};

export default class VueSocketIO {
    io: Socket;
    emitter: EventEmitter;

    constructor ({ connection, vuex, debug }: IVueSocketIOOptions) {
        logger.debug = !!debug;
        this.io = connection;
        this.emitter = new EventEmitter(vuex);
        this.register();
    }

    private register () {
        this.io.onAny((event: string, ...args: any[]) => {
            this.emitter.emit(event, args.length === 1 ? args[0] : args);
        });
        SOCKET_EVENTS.forEach(event => {
            this.io.on(event as any, (args: any) => this.emitter.emit(event, args));
        });
        MANAGER_EVENTS.forEach(event => {
            this.io.io.on(event as any, (args: any) => this.emitter.emit(event, args));
        });
    }

    install (Vue: VueConstructor) {
        Vue.prototype.$socket = this.io;
        Vue.prototype.$vueSocketIo = this;
        Vue.mixin(mixin);
        logger.info("Vue-Socket.io plugin enabled");
    }
}
