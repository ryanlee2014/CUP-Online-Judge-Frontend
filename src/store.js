import Vue from 'vue'
import Vuex from 'vuex'
import userInfo from './store/userInfo'
import socket from './store/socket'
import getters from './store/getters'
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    userInfo,
    socket
  },
  getters
})
