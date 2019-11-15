<template>
    <div class="ui container padding">
        <h2 class="ui dividing header">
            发生错误
            <div class="sub header">
                请把以下内容反馈给老师、助教或本平台的开发者Ryan Lee(李昊元)
            </div>
        </h2>
        <div class="ui segment">
            <div class="ui error message">
                <div class="header">
                    错误信息内容
                </div>
                <br>
                <h5 class="ui header">URL:{{location.href}}</h5>
                <br>
                <b><p v-html="errormsg"></p></b>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class ErrorView extends Vue {
    @Prop({ default: "" }) errormsg!: string;
    location = location;
}
</script>

<style scoped>

</style>
