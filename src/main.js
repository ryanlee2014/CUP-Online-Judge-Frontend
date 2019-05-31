import browserUpdate from "browser-update";
import Vue from "vue";
import VueAxios from "vue-axios";
import axios from "axios";
import VueLazyload from "vue-lazyload";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueSocketIO from "vue-socket.io";
import mavonEditor from "./lib/mavon-editor/mavon-editor";
import i18n from "./i18n";
browserUpdate({ required: { e: -3, f: -3, o: -3, s: -3, c: -6 }, insecure: true, unsupported: true, api: 2019.05 });
Vue.use(VueAxios, axios);
Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: "/assets/images/wireframe/white-image.png",
    loading: "/assets/images/wireframe/white-image.png",
    attempt: 2
});

Vue.config.productionTip = false;
Vue.use(new VueSocketIO({
    debug: process.env.NODE_ENV === "development",
    connection: location.origin,
    vuex: {
        store
    }
}));
Vue.use(mavonEditor);
const $ = require("jquery");

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount("#app");

Vue.directive("tableUpdated", {

});
