<template>
    <div id="app">
        <AdminNavbar :admin="admin" :avatar="avatar" :contest="contest" :homepage="homepage" :logined="logined"
                     :nick="nick"
                     :user_id="user_id" v-if="adminView"></AdminNavbar>
        <Navbar :admin="admin" :avatar="avatar" :contest="contest" :homepage="homepage" :logined="logined" :nick="nick"
                :user_id="user_id" v-else></Navbar>
        <transition name="fade">
            <router-view class="router"/>
        </transition>
        <Bottom></Bottom>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
import Navbar from "./components/nav/Navbar.vue";
import AdminNavbar from "./components/nav/AdminNavbar.vue";
import Bottom from "./components/bottom/Bottom.vue";
import util from "./lib/util";
import { mapGetters } from "vuex";
import $ from "jquery";
import { Component, Watch } from "vue-property-decorator";
import { Route } from "vue-router";

@Component({
    components: {
        Navbar: Navbar,
        Bottom: Bottom,
        AdminNavbar: AdminNavbar
    },
    computed: mapGetters(["logined", "avatar", "admin", "user_id", "nick"])
})
export default class App extends Vue {
    homepage?: boolean;
    contest?: boolean;
    adminView?: boolean;
    $socket: any;
    sockets: any;
    created () {
        this.homepage = this.$route.path === "/";
        this.contest = this.$route.fullPath.includes("contest");
        this.adminView = this.$route.fullPath.indexOf("/admin") === 0;
    }
    mounted () {
        this.$store.dispatch("NavStatus");
        util.initToTopButton();
        setTimeout(() => {
            this.connectTry(10);
        }, 1500);
    }

    @Watch("$route")
    onRouteChange (to: Route) {
        this.homepage = to.path === "/";
        this.adminView = to.fullPath.indexOf("/admin") === 0;
        const matchedPath = to.matched[0].path.substring(1);
        this.contest = matchedPath !== "contest" && matchedPath.includes("contest");
        this.$store.commit("setRouteInfo", { path: to.path, fullPath: to.fullPath });
        this.$store.commit("setHomepage", { homepage: this.homepage });
        this.$socket.emit("updateURL", { url: to.fullPath });
        this.initForRouter();
    }

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

    connectTry (times: number) {
        (async () => {
            let Promise = require("bluebird");
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
        })();
    }
}
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
    .router {
        min-height: 90%;
    }
</style>
