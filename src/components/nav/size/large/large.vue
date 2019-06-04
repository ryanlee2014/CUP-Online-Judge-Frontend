<template>
    <div class="ui borderless network secondary menu" id="navbar-large">
        <div class="ui container">
            <router-link class="item" exact-active-class="active" to="/"><i class="home icon"></i>{{$t("home")}}</router-link>
            <router-link class="item" exact-active-class="active" to="/problemset"><i class="browser icon"></i>{{$t("problemset")}}</router-link>
            <router-link class="item" exact-active-class="active" to="/status"><i
                    class="tasks icon"></i>{{$t("history")}}
            </router-link>
            <router-link class="item" exact-active-class="active" to="/ranklist"><i class="trophy icon"></i>{{$t("ranklist")}}</router-link>
            <router-link class="item" exact-active-class="active" to="/discuss"><i class="comment alternate icon"></i>{{$t("discuss")}}</router-link>
            <router-link class="item" exact-active-class="active" to="/contest"><i class="puzzle icon"></i>{{$t("contest")}}&amp;{{$t("homework")}}</router-link>
            <div class="ui dropdown item" tabindex="0">
                <div class="text"><i class="options icon"></i>{{$t("feature")}}</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    <router-link class="item" exact-active-class="active" to="/faq"><i class="help icon"></i>{{$t("faq")}}</router-link>
                    <router-link class="item" exact-active-class="active" to="/extra/software"><i class="plug icon"></i>{{$t("useful")}}{{$t("software")}}</router-link>
                    <router-link class="item" exact-active-class="active" to="/extra/whiteboard"><i class="calendar outline icon"></i>{{$t("whiteboard")}}</router-link>
                    <router-link class="item" exact-active-class="active" to="/about/fame"><i class="chess queen icon"></i>{{$t("hall of fame")}}</router-link>
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
    }
};
</script>

<style scoped>
</style>
