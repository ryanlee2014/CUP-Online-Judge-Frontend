<template>
    <div class="right menu" v-if="logined">
        <router-link to="/online" exact-active-class="active" class="item online_num" v-html="serverInfo"></router-link>
        <div class="ui dropdown item detail" tabindex="0">
            <div class="text"><span class="profile_group">{{nick}}</span></div>
            <i class="dropdown icon"></i>
            <div class="menu"></div>
        </div>
    </div>
    <div class="right menu" v-else>
        <div class="item">
            <router-link class="ui button" to="/login">登录</router-link>
        </div>
        <div class="item">
            <router-link class="ui primary button" to="/register">注册</router-link>
        </div>
    </div>
</template>

<script>
export default {
  name: "SocketMenu",
  props: {
    nick: {
      type: String,
      default: ""
    },
    logined: {
      type: Boolean,
      default: false
    },
    user: {
      type: Number,
      default: 0
    },
    judger: {
      type: Number,
      default: 0
    },
    connected: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {}
  },
  computed: {
    serverInfo: function () {
      if (this.connected) {
        return "<i class='users icon'></i>" + this.user + "人" + "&nbsp;<i class='microchip icon'></i>" + this.judger
      } else {
        return "与服务器连接丢失"
      }
    }
  }
}
</script>

<style scoped>

</style>
