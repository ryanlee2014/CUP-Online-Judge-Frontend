<template>
    <div id="navbar-small" class="ui borderless network secondary menu">
        <div class="ui container">
            <div class="msg header item">
                <router-link class="item" to="/"><i class="home icon"></i>首页</router-link>
            </div>
            <router-link to="problemset" class="item">问题</router-link>
            <router-link class="item" to="/status">历史
            </router-link>
            <router-link class="item" to="/ranklist">排名</router-link>
            <router-link class="item" to="/contest">竞赛&amp;作业</router-link>
            <div tabindex="0" class="ui dropdown item">
                <div class="text">其他</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    <router-link class="item" to="/faq">常见问答</router-link>
                    <router-link class="item" to="/extra/software">常用软件</router-link>
                    <router-link class="item" to="/extra/whiteboard">白板(β版测试)</router-link>
                </div>
            </div>
            <SocketMenu :nick="nick" :logined="logined" :user="user" :judger="judger" :connected="connected"
            ></SocketMenu>
        </div>
    </div>
</template>

<script>
import SocketMenu from "../../components/SocketMenu";
export default {
    name: "Small",
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
    }
};
</script>

<style scoped>

</style>
