<template>
    <div class="ui borderless network secondary menu invertTarget" id="navbar-large">
        <div class="ui container">
            <router-link class="item" exact-active-class="active" to="/"><i class="home icon"></i>{{ $t("home") }}
            </router-link>
            <router-link class="item" exact-active-class="active" to="/problemset"><i
                class="browser icon"></i>{{ $t("problemset") }}
            </router-link>
            <router-link class="item" exact-active-class="active" to="/status"><i
                class="tasks icon"></i>{{ $t("history") }}
            </router-link>
            <router-link class="item" exact-active-class="active" to="/ranklist"><i
                class="trophy icon"></i>{{ $t("ranklist") }}
            </router-link>
            <router-link class="item" exact-active-class="active" to="/discuss"><i
                class="comment alternate icon"></i>{{ $t("discuss") }}
            </router-link>
            <div class="ui dropdown item" tabindex="0">
                <div class="text">
                    <i class="keyboard icon"></i>
                    {{ $t("contest") }}&amp;{{ $t("homework") }}
                </div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    <router-link class="item" exact-active-class="active" to="/contest"><i
                        class="puzzle icon"></i>{{ $t("contest") }}&amp;{{ $t("homework") }}
                    </router-link>
                    <router-link class="item" exact-active-class="active" to="/topic">
                        <i class="paperclip icon"></i>
                        {{ $t("contest topic") }}
                    </router-link>
                    <a class="item" @click="toSelection"><i
                        class="book icon"></i>选择题考试</a>
                </div>
            </div>
            <div class="ui dropdown item" tabindex="0">
                <div class="text"><i class="options icon"></i>{{ $t("feature") }}</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    <router-link class="item" exact-active-class="active" to="/faq"><i
                        class="help icon"></i>{{ $t("faq") }}
                    </router-link>
                    <router-link class="item" exact-active-class="active" to="/extra/software"><i class="plug icon"></i>{{ $t("useful") }}{{ $t("software") }}
                    </router-link>
                    <router-link class="item" exact-active-class="active" to="/extra/whiteboard"><i
                        class="calendar outline icon"></i>{{ $t("whiteboard") }}
                    </router-link>
                    <router-link class="item" exact-active-class="active" to="/about/fame"><i
                        class="chess queen icon"></i>{{ $t("hall of fame") }}
                    </router-link>
                    <a href="https://docs.cupacm.com" class="item" target="_blank"><i
                        class="book icon"></i>{{ $t("cupacm docs") }}</a>
                    <router-link class="item" exact-active-class="active" to="/system/version_control"><i
                        class="node js icon"></i>{{ $t("version control") }}
                    </router-link>
                </div>
            </div>
            <SocketMenu :nick="nick" :logined="logined" :user="user" :judger="judger" :connected="connected"
            ></SocketMenu>
        </div>
    </div>
</template>

<script lang="ts">
import SocketMenu from "../../components/SocketMenu.vue";
import { Component, Mixins } from "vue-property-decorator";
import MenuMixin from "@/mixin/menu/MenuMixin";
import { mapGetters } from "vuex";

@Component({
    components: {
        SocketMenu
    },
    computed: {
        ...mapGetters(["user_id", "admin", "nick"])
    }
})
export default class LargeMenu extends Mixins(MenuMixin) {
    toSelection () {
        const userId = this.$store.getters.user_id;
        const admin = this.$store.getters.admin;
        const nick = this.$store.getters.nick;
        window.open(`http://localhost:8088/#/?userId=${userId}&admin=${admin}&nick=${nick}`, "_blank");
    }
}
</script>

<style scoped>
.ui.container {
    width: 95% !important
}
</style>
