import store from "@/store";
import { io } from "socket.io-client";
import VueSocketIO from "@/lib/socketio-plugin";
import {VueConstructor} from "vue";
import {Vue} from "vue/types/vue";

export default function (vue: VueConstructor<Vue>) {
    vue.use(new VueSocketIO({
        debug: process.env.NODE_ENV === "development",
        connection: io(location.origin, { autoConnect: false }),
        vuex: {
            store
        }
    }));
    return vue;
}
