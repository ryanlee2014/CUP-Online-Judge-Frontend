import Vue from 'vue'
import App from './App.vue'
import router from './router'
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
const $ = require("jquery");
const _get = $.get;
$.get = function() {
  let addr = arguments[0];
  if(addr.indexOf("api") !== -1) {
    arguments[0] = `http://192.168.28.150:3000${addr.substring(addr.indexOf("api") + 3)}`
  }
  _get.apply($, arguments);
}
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
