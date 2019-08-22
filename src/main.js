import browserUpdate from "browser-update";
import Vue from "vue";
import VueAxios from "vue-axios";
import axios from "axios";
import VueLazyload from "vue-lazyload";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueSocketIO from "vue-socket.io";
import VueWorker from "vue-worker";
import mavonEditor from "./lib/mavon-editor/mavon-editor";
import VueObserveVisibility from "vue-observe-visibility";
import i18n from "./i18n";
import Injection from "./injection/index";
import AxiosInterceptors from "./router/middleware/AxiosInterceptors";
Injection();
AxiosInterceptors();
browserUpdate({ required: { e: -3, f: -3, o: -3, s: -3, c: -6 }, insecure: true, unsupported: true, api: 2019.05 });
Vue.use(VueAxios, axios);
Vue.use(VueWorker);
Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: "/assets/images/wireframe/white-image.png",
    loading: "/assets/images/wireframe/white-image.png",
    attempt: 2
});
Vue.use(new VueSocketIO({
    debug: process.env.NODE_ENV === "development",
    connection: location.origin,
    vuex: {
        store
    }
}));
Vue.config.productionTip = false;
Vue.config.performance = true;

Vue.use(mavonEditor);
Vue.use(VueObserveVisibility);
new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount("#app");
