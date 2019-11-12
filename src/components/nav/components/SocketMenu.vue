<template>
    <div class="right menu" v-if="logined">
        <Locale></Locale>
        <router-link to="/online" exact-active-class="active" class="item online_num" v-html="serverInfo"></router-link>
        <div class="ui dropdown item detail" tabindex="0">
            <div class="text"><span class="profile_group">{{nick}}</span></div>
            <i class="dropdown icon"></i>
            <div class="menu"></div>
        </div>
    </div>
    <div class="right menu" v-else>
        <Locale></Locale>
        <div class="item">
            <router-link class="ui button" to="/login">登录</router-link>
        </div>
        <div class="item">
            <!--
            <router-link class="ui primary button" to="/register">注册</router-link>
            -->
            <a href="/registerpage.php" class="ui primary button">注册</a>
        </div>
    </div>
</template>

<script lang="ts">
import Locale from "../components/locale.vue";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component({
    components: {
        Locale: Locale
    }
})
export default class SocketMenu extends Vue {
    @Prop({ default: "" }) nick!: string;
    @Prop({ default: false }) logined!: boolean;
    @Prop({ default: 0 }) user!: number;
    @Prop({ default: 0 }) judger!: number;
    @Prop({ default: false }) connected!: boolean;

    get serverInfo () {
        if (this.connected) {
            return "<i class='users icon'></i>" + this.user + "人" + "&nbsp;<i class='microchip icon'></i>" + this.judger;
        }
        else {
            return "与服务器连接丢失";
        }
    }
}
</script>

<style scoped>

</style>
