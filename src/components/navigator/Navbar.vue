<template>
    <div>
        <div class="following bar topmenu" style="z-index: 900;">
            <Large :connected="socketConnected" :judger="judger" :logined="logined" :nick="nick" :user="user" v-if="showNavBar('normal')"></Large>
            <Small :connected="socketConnected" :judger="judger" :logined="logined" :nick="nick" :user="user" v-if="showNavBar('normal')"></Small>
            <Nano :connected="socketConnected" :judger="judger" :logined="logined" :nick="nick" :user="user" v-if="showNavBar('normal')"></Nano>
            <LargeContest :connected="socketConnected" :judger="judger" :logined="logined" :nick="nick" :user="user" v-if="showNavBar('contest')"></LargeContest>
            <TopicNav :connected="socketConnected" :judger="judger" :logined="logined" :nick="nick" :user="user" v-if="showNavBar('topic')"></TopicNav>
        </div>
        <ProfileCard :admin="admin" :avatar="avatar" :nick="nick" :email="email" :user_id="user_id"/>
    </div>
</template>

<script lang="ts">
import Large from "./size/large/large.vue";
import LargeContest from "./size/large/ContestNav.vue";
import Small from "./size/Small/Small.vue";
import Nano from "./size/nano/nano.vue";
import ProfileCard from "./components/ProfileCard.vue";
import NavbarMixin from "../../mixin/NavbarMixin";
import { Component, Mixins } from "vue-property-decorator";
import TopicNav from "@/components/navigator/size/large/TopicNav.vue";
@Component({
    components: {
        TopicNav,
        Large: Large,
        Small: Small,
        Nano: Nano,
        ProfileCard: ProfileCard,
        LargeContest
    }
})
export default class Navbar extends Mixins(NavbarMixin) {
    showNavBar (name: string) {
        if (name === "contest" && this.contest) {
            return true;
        }
        else if (name === "topic" && this.topic) {
            return true;
        }
        else {
            return name === "normal" && !this.contest && !this.topic;
        }
    }
}
</script>

<style scoped>
    .ui.container {
        width: 95%!important
    }
</style>
