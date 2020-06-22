import VueConstructor from "vue";
import { Component } from "vue-property-decorator";

@Component
export default class RouterBackMixin extends VueConstructor {
    routerBack (pushPath?: string) {
        if (window.history.length <= 1) {
            this.$router.push(pushPath || "/");
        }
        else {
            this.$router.back();
        }
    }
}
