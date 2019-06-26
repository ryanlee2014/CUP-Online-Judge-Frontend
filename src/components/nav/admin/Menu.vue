<template>
    <div class="ui borderless network secondary menu invertTarget" id="navbar-large">
        <div class="ui container">
            <router-link class="item" exact-active-class="active" to="/">
                <i class="home icon"></i>
                {{$t("return home")}}
            </router-link>
            <div class="ui dropdown item" tabindex="0">
                <div class="text">
                    <i class="database icon"></i>
                    {{$t("problem manage")}}
                </div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    <router-link class="item" exact-active-class="active" to="/admin/problem/list">
                        <i class="list icon"></i>
                        {{$t("problem list")}}
                    </router-link>
                </div>
            </div>
            <div class="ui dropdown item">
                <div class="text">
                    <i class="database icon"></i>
                    {{$t("contest manage")}}
                </div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    <router-link class="item" exact-active-class="active" to="/admin/contest/list">
                        <i class="list icon"></i>
                        {{$t("contest list")}}
                    </router-link>
                </div>
            </div>
            <div class="ui dropdown item">
                <div class="text">
                    <i class="database icon"></i>
                    {{$t("user manage")}}
                </div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    <router-link class="item" exact-active-class="active" to="/admin/user/privilege">
                        <i class="list icon"></i>
                        {{$t("privilege manage")}}
                    </router-link>
                    <router-link class="item" exact-active-class="active" to="/admin/user/check">
                        <i class="user check icon"></i>
                        {{$t("account checker")}}
                    </router-link>
                    <router-link to="/admin/user/ban" class="item" exact-active-class="active">
                        <i class="bell slash icon"></i>
                        {{$t("ban manage")}}
                    </router-link>
                </div>
            </div>
            <div class="ui dropdown item">
                <div class="text">
                    <i class="laptop icon"></i>
                        {{$t("judge manage")}}
                </div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    <router-link class="item" exact-active-class="active" to="/admin/judge/rejudge">
                        <i class="check double icon"></i>
                        {{$t("rejudge manage")}}
                    </router-link>
                </div>
            </div>
            <SocketMenu :connected="connected" :judger="judger" :logined="logined" :nick="nick"
                        :user="user"></SocketMenu>
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
    .ui.container {
        width: 95%!important
    }
</style>
