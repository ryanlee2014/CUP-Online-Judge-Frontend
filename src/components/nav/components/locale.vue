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

<script>
export default {
    name: "locale",
    methods: {
        locale (el) {
            this.$i18n.locale = el.target.getAttribute("locale");
            localStorage.locale = this.$i18n.locale;
        }
    },
    mounted () {
        if (localStorage.hasOwnProperty("locale")) {
            this.$i18n.locale = localStorage.locale;
        }
    }
};
</script>

<style scoped>

</style>
