<template>
    <div id="app">
        <Navbar :user_id="user_id" :nick="nick" :admin="admin" :avatar="avatar" :logined="logined"></Navbar>
        <transition name="fade">
            <router-view/>
        </transition>
        <Bottom></Bottom>
    </div>
</template>
<script>
    import Navbar from './components/nav/Navbar'
    import Bottom from './components/bottom/Bottom'
    import { mapState } from 'vuex'
    export default {
        name: 'App',
        components: {Navbar, Bottom},
        data: function () {
            return {}
        },
        mounted() {
            this.$store.dispatch("NavStatus");
        },
        computed: mapState({
            logined: state => state.logined,
            avatar: state => state.userInfo.avatar,
            admin: state => state.userInfo.admin,
            user_id: state => state.userInfo.user_id,
            nick: state => state.userInfo.nick
        })
    }
</script>
<style>
    @import "./static/css/semantic.min.css";
    @import "./static/devicon/devicon.min.css";
    @import "./static/css/judge.css";
    @import "./static/css/home.css";
    @import "./static/css/animate.css";
    @import "./static/css/style.css";
    @import "./static/css/github-markdown.css";
    @import "./static/css/github.min.css";
    @import "./static/css/katex.min.css";

    #app {
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
