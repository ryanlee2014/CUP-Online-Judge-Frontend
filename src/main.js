import Vue from 'vue'
import VueAxios from 'vue-axios'
import axios from 'axios';
Vue.use(VueAxios, axios);
import App from './App.vue'
import router from './router'
import store from './store'
import VueSocketIO from 'vue-socket.io'
Vue.config.productionTip = false;
Vue.use(new VueSocketIO({
    debug: process.env.NODE_ENV === "development",
    connection: location.origin,
    vuex: {
        store
    }
}));
const $ = require("jquery");

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

Vue.directive('tableUpdated', {
  componentUpdated: function () {
    $('.ui.sticky.element')
        .sticky({
          context: '#problemset',
          offset: 40,
          observeChanges: false,
          refreshOnLoad: true,
          refreshOnResize: true,
        })
    ;
  }
});
