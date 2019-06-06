<template>
    <div id="app">
        <AdminNavbar :admin="admin" :avatar="avatar" :contest="contest" :homepage="homepage" :logined="logined" :nick="nick"
                     :user_id="user_id" v-if="adminView"></AdminNavbar>
        <Navbar :admin="admin" :avatar="avatar" :contest="contest" :homepage="homepage" :logined="logined" :nick="nick"
                :user_id="user_id" v-else></Navbar>
        <transition name="fade">
            <router-view/>
        </transition>
        <Bottom></Bottom>
    </div>
</template>
<script>
import Navbar from "./components/nav/Navbar";
import AdminNavbar from "./components/nav/AdminNavbar";
import Bottom from "./components/bottom/Bottom";
import { mapGetters } from "vuex";

const $ = require("jquery");

export default {
    name: "App",
    components: {
        Navbar,
        Bottom,
        AdminNavbar
    },
    data: function () {
        return {
            homepage: this.$route.path === "/",
            contest: this.$route.fullPath.includes("contest"),
            adminView: this.$route.fullPath.indexOf("/admin") === 0
        };
    },
    mounted () {
        this.$store.dispatch("NavStatus");
        setTimeout(() => {
            this.connectTry(10);
        }, 1500);
    },
    watch: {
        $route (to) {
            this.homepage = to.path === "/";
            this.adminView = to.fullPath.indexOf("/admin") === 0;
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
        },
        async connectTry (times) {
            while (times-- > 0) {
                if (this.$socket && this.$socket.connect && typeof this.$socket.connect === "function") {
                    if (!this.$socket.connected) {
                        this.$socket.connect();
                        this.$socket.emit("getUser");
                    }
                    else {
                        break;
                    }
                }
                await Promise.delay(500);
            }
        }
    },
    computed: mapGetters(["logined", "avatar", "admin", "user_id", "nick"])
};
</script>
<style>
    @import "../semantic/semantic-ui/semantic.css";
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
