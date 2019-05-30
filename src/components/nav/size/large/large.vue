<template>
    <div class="ui borderless network secondary menu" id="navbar-large">
        <div class="ui container">
            <router-link class="item" exact-active-class="active" to="/"><i class="home icon"></i>首页</router-link>
            <router-link class="item" exact-active-class="active" to="/problemset"><i class="browser icon"></i>问题</router-link>
            <router-link class="item" exact-active-class="active" to="/status"><i
                    class="tasks icon"></i>历史
            </router-link>
            <router-link class="item" exact-active-class="active" to="/ranklist"><i class="trophy icon"></i>排名</router-link>
            <router-link class="item" exact-active-class="active" to="/discuss"><i class="comment alternate icon"></i>讨论</router-link>
            <router-link class="item" exact-active-class="active" to="/contest"><i class="puzzle icon"></i>竞赛&amp;作业</router-link>
            <div class="ui dropdown item" tabindex="0">
                <div class="text"><i class="options icon"></i>功能</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    <router-link class="item" exact-active-class="active" to="/faq"><i class="help icon"></i>常见问答</router-link>
                    <router-link class="item" exact-active-class="active" to="/extra/software"><i class="plug icon"></i>常用软件</router-link>
                    <router-link class="item" exact-active-class="active" to="/extra/whiteboard"><i class="calendar outline icon"></i>白板(β版测试)</router-link>
                    <router-link class="item" exact-active-class="active" to="/about/fame"><i class="chess queen icon"></i>Hall of Fame</router-link>
                </div>
            </div>
            <SocketMenu :nick="nick" :logined="logined" :user="user" :judger="judger" :connected="connected"
            ></SocketMenu>
        </div>
    </div>
</template>

<script>
import SocketMenu from "../../components/SocketMenu"
export default {
  name: "large",
  components: {
    SocketMenu
  },
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
  methods: {
    item_active ($event) {
      console.log($event)
      return false
    }
  }
}
</script>

<style scoped>

</style>
