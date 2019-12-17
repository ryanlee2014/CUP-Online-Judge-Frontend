<template>
    <div class="ui borderless network secondary menu" id="navbar-nano">
        <div class="ui container">
            <div class="msg header item">
                <router-link class="item" to="/"><i class="home icon"></i>首页</router-link>
            </div>
            <div class="ui dropdown item" tabindex="0">
                <div class="text">通用</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    <router-link class="item" to="/faq">常见问答</router-link>

                    <router-link class="item" to="/problemset">问题</router-link>
                    <router-link class="item" to="/status">历史
                    </router-link>
                    <router-link class="item" to="/ranklist">排名</router-link>
                    <div class="item" tabindex="0"><i class="right dropdown icon"></i>
                        <div class="text">其他</div>
                        <div class="menu">
                            <router-link class="item" to="/contest">竞赛&amp;作业</router-link>
                            <router-link class="item" to="/extra/software">常用软件</router-link>
                            <router-link class="item" to="/extra/whiteboard">白板(β版测试)</router-link>
                        </div>
                    </div>
                </div>
            </div>
            <SocketMenu :nick="nick" :logined="logined" :user="user" :judger="judger" :connected="connected"
            ></SocketMenu>
        </div>
    </div>
</template>

<script lang="ts">
import SocketMenu from "../../components/SocketMenu.vue";
import { Component, Mixins } from "vue-property-decorator";
import MenuMixin from "@/mixin/menu/MenuMixin";
@Component({
    components: {
        SocketMenu
    }
})
export default class NanoMenu extends Mixins(MenuMixin) {

}
</script>

<style scoped>

</style>
