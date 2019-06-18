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

<script>
import Large from "./size/large/large";
import LargeContest from "./size/large/ContestNav";
import Small from "./size/Small/Small";
import Nano from "./size/nano/nano";
import ProfileCard from "./components/ProfileCard";
import NavbarMixin from "../../mixin/NavbarMixin";
const Promise = require("bluebird");

const $ = require("jquery");
export default {
    name: "Navbar",
    mixins: [NavbarMixin],
    components: {
        Large,
        Small,
        Nano,
        ProfileCard,
        LargeContest
    }
};
</script>

<style scoped>
    .ui.container {
        width: 95%!important
    }
</style>
