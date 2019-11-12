<template>
    <div class="ui dropdown item">
        <div class="text">{{$t("language")}}</div>
        <i class="dropdown icon">
        </i>
        <div class="menu">
            <a class="item" @click="locale" locale="zh-cn">中文(简体)</a>
            <a class="item" @click="locale" locale="en">English</a>
            <a class="item" @click="locale" locale="ja">日本語</a>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
@Component
export default class Locale extends Vue {
    locale (el: any) {
        this.$i18n.locale = el.target.getAttribute("locale");
        localStorage.locale = this.$i18n.locale;
    }
    mounted () {
        if (Object.prototype.hasOwnProperty.call(localStorage, "locale")) {
            this.$i18n.locale = localStorage.locale;
        }
    }
}
</script>

<style scoped>

</style>
