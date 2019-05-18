import Vue from 'vue'
import VueAxios from 'vue-axios'
import axios from 'axios';
import VueLazyload from 'vue-lazyload'
Vue.use(VueAxios, axios);
Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: '/assets/images/wireframe/white-image.png',
    loading: '/assets/images/wireframe/white-image.png',
    attempt: 2
})
import App from './App.vue'
import router from './router'
import store from './store'
import VueSocketIO from 'vue-socket.io'
import mavonEditor from '@ryanlee2014/mavon-editor'

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
        });
  }
});
