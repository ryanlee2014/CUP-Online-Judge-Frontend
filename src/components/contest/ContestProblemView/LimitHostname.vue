<template>
    <div class="ui negative message">
        <div class="header"><i class="ban icon"></i>访问限制</div>
        <p>{{content}}</p>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
@Component
export default class LimitHostname extends Vue {
    @Prop({ default: "" }) content!: string;
}
</script>

<style scoped>

</style>
