<template>
    <div class="ui negative message">
        <div class="header">
            <i class="ban icon"></i>{{$t("access limit")}}</div>
        <p>{{$t("context")}}</p>
        <router-link :to="address">{{address}}</router-link>
    </div>
</template>
<i18n>
    {
        "zh-cn": {
            "access limit": "访问限制",
            "context": "根据管理员设置的策略，本次contest请使用以下地址访问"
        },
        "en": {
            "access limit": "Access Limitation",
            "context": "According to current system policy setting by admin, you should access this page by using this url:"
        },
        "ja": {
            "access limit": "訪問制限",
            "context": "アドミニストレーターの設定によって、下のURLを使ってください"
        }
    }
</i18n>
<script lang="ts">

import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
@Component
export default class LimitHostName extends Vue {
    @Prop({ default: location.href }) address!: string;
}
</script>

<style scoped>

</style>
