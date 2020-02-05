import store from "@/store";
import SocketIo from "socket.io-client";
// @ts-ignore
import VueSocketIO from "vue-socket.io";
import {VueConstructor} from "vue";
import {Vue} from "vue/types/vue";

export default function (vue: VueConstructor<Vue>) {
    vue.use(new VueSocketIO({
        debug: process.env.NODE_ENV === "development",
        connection: SocketIo(location.origin, { autoConnect: false }),
        vuex: {
            store
        }
    }));
    return vue;
}
