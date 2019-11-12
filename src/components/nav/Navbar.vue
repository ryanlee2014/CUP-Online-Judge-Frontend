<template>
    <div>
        <div class="following bar topmenu" style="z-index: 900;">
            <Large :connected="socketConnected" :judger="judger" :logined="logined" :nick="nick" :user="user" v-if="!contest"></Large>
            <Small :connected="socketConnected" :judger="judger" :logined="logined" :nick="nick" :user="user" v-if="!contest"></Small>
            <Nano :connected="socketConnected" :judger="judger" :logined="logined" :nick="nick" :user="user" v-if="!contest"></Nano>
            <LargeContest :connected="socketConnected" :judger="judger" :logined="logined" :nick="nick" :user="user" v-if="contest"></LargeContest>
        </div>
        <ProfileCard :admin="admin" :avatar="avatar" :nick="nick" :user_id="user_id"/>
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
const Promise = require("bluebird");

const $ = require("jquery");
@Component({
    components: {
        Large: Large,
        Small: Small,
        Nano: Nano,
        ProfileCard: ProfileCard,
        LargeContest
    }
})
export default class Navbar extends Mixins(NavbarMixin) {
}
</script>

<style scoped>
    .ui.container {
        width: 95%!important
    }
</style>
