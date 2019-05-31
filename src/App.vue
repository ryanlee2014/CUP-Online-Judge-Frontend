<template>
    <div id="app">
        <Navbar :homepage="homepage" :contest="contest" :admin="admin" :avatar="avatar" :logined="logined" :nick="nick" :user_id="user_id"></Navbar>
        <transition name="fade">
            <router-view/>
        </transition>
        <Bottom></Bottom>
    </div>
</template>
<script>
import Navbar from "./components/nav/Navbar";
import Bottom from "./components/bottom/Bottom";
import { mapGetters } from "vuex";
const $ = require("jquery");

export default {
    name: "App",
    components: { Navbar, Bottom },
    data: function () {
        return {
            homepage: this.$route.path === "/",
            contest: this.$route.fullPath.includes("contest")
        };
    },
    mounted () {
        this.$store.dispatch("NavStatus");
    },
    watch: {
        $route (to) {
            this.homepage = to.path === "/";
            const matchedPath = to.matched[0].path.substring(1);
            this.contest = matchedPath !== "contest" && matchedPath.includes("contest");
            this.$store.commit("setRouteInfo", { path: to.path, fullPath: to.fullPath });
            this.$socket.emit("updateURL", { url: to.fullPath });
            this.initForRouter();
        }
    },
    methods: {
        initForRouter () {
            this.$nextTick(() => {
                if (this.homepage) {
                    $("#app").animate({ marginTop: 0 });
                    $(".ui.borderless.network.secondary.menu").addClass("inverted");
                }
                else {
                    $("#app").animate({ marginTop: "60px" });
                    $(".ui.borderless.network.secondary.menu").removeClass("inverted");
                }
            });
        }
    },
    computed: mapGetters(["logined", "avatar", "admin", "user_id", "nick"])
};
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
    @import "../node_modules/@ryanlee2014/mavon-editor/dist/css/index.css";
    @media only screen and (min-width: 1200px) {
        .ui.container {
            width: 70%
        }
    }
</style>
