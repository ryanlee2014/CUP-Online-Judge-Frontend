// @ts-ignore
import browserUpdate from "browser-update";
import Vue from "vue";
import VueAxios from "vue-axios";
import axios from "axios";
import VueLazyload from "vue-lazyload";
import App from "./App.vue";
import { applyBodyClass } from "./util/uiMode";
import router from "./router";
import store from "./store";

import VueObserveVisibility from "vue-observe-visibility";
import i18n from "./i18n";
import VueSocketIo from "./lib/vue-socketio";
import Injection from "./injection/index";
import AxiosInterceptors from "./router/middleware/AxiosInterceptors";
import AsyncComputedPlugin from "vue-async-computed";
// @ts-ignore
import Gravatar from "@ryanlee2014/vue-gravatar";
Injection();
AxiosInterceptors();
browserUpdate({ required: { e: -3, f: -3, o: -3, s: -3, c: -6 }, insecure: true, unsupported: true, api: 2019.05 });
Vue.use(VueAxios, axios);
Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: require("@/static/image/white-image.png"),
    loading: require("@/static/image/white-image.png"),
    attempt: 2
});
Vue.component("v-gravatar", Gravatar);
VueSocketIo(Vue);
Vue.use(AsyncComputedPlugin);
Vue.config.productionTip = false;
Vue.config.performance = true;

// mavon-editor (~1.7MB) is only needed on editing pages: load it on first use instead of
// shipping it in the entry bundle of every page.
Vue.component("mavon-editor", () => import(/* webpackChunkName: "mavon-editor" */ "@ryanlee2014/mavon-editor")
    // @ts-ignore
    .then(m => m.mavonEditor || m.default.mavonEditor));
Vue.use(VueObserveVisibility);
applyBodyClass();

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount("#app");
