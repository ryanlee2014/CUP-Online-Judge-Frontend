<template>
    <div class="ui borderless network secondary menu" id="navbar-large">
        <div class="ui container">
            <router-link class="item" exact-active-class="active" to="/"><i class="home icon"></i>{{$t("problem manage")}}</router-link>
            <SocketMenu :nick="nick" :logined="logined" :user="user" :judger="judger" :connected="connected"></SocketMenu>
        </div>
    </div>
</template>

<script>
import SocketMenu from "../components/SocketMenu";
export default {
    name: "Menu",
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
