<template>
    <div id="app">
        <Navbar :admin="admin" :avatar="avatar" :logined="logined" :nick="nick" :user_id="user_id"></Navbar>
        <transition name="fade">
            <router-view/>
        </transition>
        <Bottom></Bottom>
    </div>
</template>
<script>
    import Navbar from './components/nav/Navbar'
    import Bottom from './components/bottom/Bottom'
    import {mapGetters} from 'vuex'

    export default {
        name: 'App',
        components: {Navbar, Bottom},
        data: function () {
            return {}
        },
        mounted() {
            this.$store.dispatch("NavStatus");
        },
        watch: {
            $route(to) {
                this.$socket.emit("updateURL", {url: to.fullPath});
            }
        },
        computed: mapGetters(["logined", "avatar", "admin", "user_id", "nick"])
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
