<template>
    <div class="ui negative message">
        <div class="header">
            <i class="ban icon"></i>访问限制</div>
        <p>根据管理员设置的策略，本次contest请使用{{address}}访问</p>
    </div>
</template>

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
