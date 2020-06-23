import _ from "lodash";
import md5 from "md5";

import { log, logFactory } from "@/util/logger";
import AwaitLock from "await-lock";
import { parameterHash } from "@/util/util";

const decoratorLog = logFactory("Decorator mounted: ");
interface IPropertyDescriptor extends PropertyDescriptor {
    timer_?: any[]
}

interface IWebSocketPropertyDescriptor extends PropertyDescriptor {
    $socket?: any;
    sockets?: any;
}

export function Debounce (wait?: number, options?: any) {
    return function (target: any, propertyName: string, propertyDescriptor: PropertyDescriptor) {
        decoratorLog(`debounce, target:${target.constructor.name}, propertyName:${propertyName}`);
        const method = propertyDescriptor.value;
        propertyDescriptor.value = _.debounce(method, wait, options);
        return propertyDescriptor;
    };
}

export function Interval (wait = 0) {
    return function (target: any, propertyName: string, propertyDescriptor: IPropertyDescriptor) {
        decoratorLog(`Interval, target:${target.constructor.name}, propertyName:${propertyName}`);
        const method = propertyDescriptor.value;
        propertyDescriptor.value = function (...args: any[]) {
            if (typeof this.timer_ === "undefined" || typeof this.timer_.length === "undefined") {
                throw new Error("You should mixin TimerMixin to your component");
            }
            method.apply(this, args);
            this.timer_.push(setInterval(() => { decoratorLog(`${target.constructor.name}.${propertyName} called.`); method.apply(this, args); }, wait));
        };
        log("mounted interval");
    };
}

export function Debuglogging (target: any, propertyName: string, propertyDescriptor: IPropertyDescriptor) {
    decoratorLog(`Debuglogging, target:${target.constructor.name}, propertyName:${propertyName}`);
    const method = propertyDescriptor.value;
    propertyDescriptor.value = function (...args: any[]) {
        const params = args.map(a => JSON.stringify(a)).join();
        const result = method.apply(this, args);
        const r = JSON.stringify(result);
        log(`Call: ${propertyName}(${params}) => ${r}`);
        return result;
    };
}

export function DebugloggingAsync (target: any, propertyName: string, propertyDescriptor: IPropertyDescriptor) {
    decoratorLog(`DebugloggingAsync, target:${target.constructor.name}, propertyName:${propertyName}`);
    const method = propertyDescriptor.value;
    propertyDescriptor.value = async function (...args: any[]) {
        const params = args.map(a => JSON.stringify(a)).join();
        const result = await method.apply(this, args);
        const r = JSON.stringify(result);
        log(`Call: ${propertyName}(${params}) => ${r}`);
        return result;
    };
}

export function WebSocketRequest (target: any, propertyName: string, propertyDescriptor: IWebSocketPropertyDescriptor) {
    decoratorLog(`WebSocketRequest, target:${target.constructor.name}, propertyName:${propertyName}`);
    const method = propertyDescriptor.value;
    propertyDescriptor.value = function (...args: any[]) {
        if (!this.$socket!.connected) {
            alert("WebSocket服务未启动，请等待服务启动后提交\nWebSocket服务启动标志未:\n右上角显示在线人数");
            return;
        }
        return method.apply(this, args);
    };
}

export function Lock (lock: AwaitLock) {
    return function (target: any, propertyName: string, propertyDescriptor: IWebSocketPropertyDescriptor) {
        decoratorLog(`Lock, target:${target.constructor.name}, propertyName:${propertyName}`);
        const method = propertyDescriptor.value;
        propertyDescriptor.value = async function (...args: any) {
            await lock.acquireAsync();
            const resp = method.apply(this, args);
            lock.release();
            return resp;
        };
    };
}

export function ErrorAlert (target: any, propertyName: string, propertyDescriptor: PropertyDescriptor) {
    decoratorLog(`ErrorAlert, target:${target.constructor.name}, propertyName:${propertyName}`);
    const method = propertyDescriptor.value;
    propertyDescriptor.value = function (...args: any) {
        try {
            return method.apply(this, args);
        }
        catch (e) {
            alert(e.message);
        }
    };
}

export function Cache (target: any, propertyName: string, propertyDescriptor: PropertyDescriptor) {
    decoratorLog(`Cache, target:${target.constructor.name}, propertyName:${propertyName}`);
    const method = propertyDescriptor.value;
    const cache: any = {};
    propertyDescriptor.value = function (...args: any) {
        const keyHash = parameterHash(args);
        // eslint-disable-next-line no-return-assign
        return cache[keyHash] ? cache[keyHash] : cache[keyHash] = method.apply(this, args);
    };
}

export function RunOnceEachKey (target: any, propertyName: string, propertyDescriptor: PropertyDescriptor) {
    decoratorLog(`RunOnceEachKey, target:${target.constructor.name}, propertyName:${propertyName}`);
    const method = propertyDescriptor.value;
    const cache: any = {};
    propertyDescriptor.value = function (...args: any[]) {
        const keyHash = md5(parameterHash(args));
        if (!cache[keyHash]) {
            cache[keyHash] = true;
            return method.apply(this, args);
        }
    };
}
