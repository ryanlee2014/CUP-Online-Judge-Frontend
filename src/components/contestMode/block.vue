<template>
    <div class="ui negative message">
        <div class="header">
            <i class="ban icon"></i>{{$t("contest mode")}}</div>
        <p>{{$t("context")}}</p>
    </div>
</template>
<i18n>
    {
        "zh-cn": {
            "context": "根据管理员设置，该页面禁止进入"
        },
        "en": {
            "context": "According to admin setup, you don't have privilege to access target page"
        },
        "ja": {
            "context": "都合によって、このページはアクセス禁止されている"
        }
    }
</i18n>
<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "vue";
@Component
export default class Block extends Vue {
}
</script>

<style scoped>

</style>
