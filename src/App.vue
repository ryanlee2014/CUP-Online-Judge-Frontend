<template>
    <div id="app">
        <AdminNavbar :admin="admin" :avatar="avatar" :email="email" :contest="contest" :homepage="homepage" :logined="logined"
                     :nick="nick"
                     :user_id="user_id" v-if="adminView"></AdminNavbar>
        <Navbar :admin="admin" :avatar="avatar" :email="email" :contest="contest" :homepage="homepage" :logined="logined" :nick="nick"
                :user_id="user_id" :topic="topic" v-else></Navbar>
        <transition name="fade">
            <router-view class="router"/>
        </transition>
        <Bottom/>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
import Navbar from "./components/navigator/Navbar.vue";
import AdminNavbar from "./components/navigator/AdminNavbar.vue";
import Bottom from "./components/bottom/Bottom.vue";
import util from "./lib/util";
import { mapGetters } from "vuex";
import $ from "jquery";
import { Component, Watch } from "vue-property-decorator";
import { Route } from "vue-router";
import store from "@/store";

@Component({
    components: {
        Navbar: Navbar,
        Bottom: Bottom,
        AdminNavbar: AdminNavbar
    },
    computed: mapGetters(["logined", "avatar", "admin", "user_id", "nick", "email"])
})
export default class App extends Vue {
    homepage?: boolean;
    contest!: boolean;
    topic!: boolean;
    adminView?: boolean;
    $socket: any;
    sockets: any;
    created () {
        const fullPath = this.$route.fullPath;
        const path = this.$route.path;
        this.updateRouteFlags(path, fullPath);
    }

    mounted () {
        this.$store.dispatch("NavStatus");
        util.initToTopButton();
        this.initWebSocket();
        setTimeout(() => {
            this.connectTry(10);
        }, 1500);
    }

    initWebSocket () {
        if (this.$socket && this.$socket.connect && this.$store.getters.logined) {
            this.$socket.connect();
        }
    }

    isViewOf (path: string, name: string) {
        const idx = path.indexOf(name);
        return idx >= 0 && idx <= 1;
    }

    isContestView (path: string) {
        return this.isViewOf(path, "contest\/");
    }

    isTopicView (path: string) {
        return this.isViewOf(path, "topic\/");
    }

    isAdminView (path: string) {
        return this.isViewOf(path, "admin\/");
    }

    updateRouteFlags (path: string, fullPath: string) {
        this.homepage = path === "/";
        this.contest = this.isContestView(fullPath);
        this.topic = this.isTopicView(fullPath);
        this.adminView = this.isAdminView(fullPath);
        this.$store.commit("setRouteInfo", { path, fullPath });
        this.$store.commit("setHomepage", { homepage: this.homepage });
        this.$socket.emit("updateURL", { url: fullPath });
        this.initForRouter();
    }

    @Watch("$route")
    onRouteChange (to: Route) {
        const fullPath = to.fullPath;
        const path = to.path;
        this.updateRouteFlags(path, fullPath);
    }

    initForRouter () {
        this.$nextTick(() => {
            if (this.homepage) {
                $("#app").animate({ marginTop: 0 });
                $(".ui.borderless.network.secondary.menu").addClass("inverted");
            }
            else {
                $("#app").animate({ marginTop: "60px" });
                if (!this.$store.getters.darkMode) {
                    $(".ui.borderless.network.secondary.menu").removeClass("inverted");
                }
            }
        });
    }

    connectTry (times: number) {
        if (!this.$store.getters.logined) {
            return;
        }
        (async () => {
            const Promise = require("bluebird");
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
