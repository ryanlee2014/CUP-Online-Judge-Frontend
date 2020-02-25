<template>
    <div :class="wrapperClass">
        <div class="ui header">
            {{$t("user_id")}}: <router-link :to="`/user/${userId}`">{{userId}}</router-link> {{$t("solution_id")}}: {{solutionId}}
        </div>
        <div class="ui content">
            <p><b>{{$t("submit_time")}}: </b>{{dayjs(date).format("YYYY-MM-DD HH:mm:ss")}}</p>
            <p><b>{{$t("programming language")}}: </b> {{language}}&nbsp;&nbsp;<b>{{$t("memory")}}: </b> {{memory}}KB&nbsp;&nbsp;<b>{{$t("time")}}: </b> {{time}}ms</p>
            <p><b>{{$t("length")}}: </b> {{codeLength}}B&nbsp;&nbsp;<b>Code length without space: </b> {{trimLength}}B</p>
            <p :class="judgeColor"><b>{{$t("result")}}: </b> <i :class="`${icon} icon`"></i>{{result}}</p>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import dayjs from "dayjs";
@Component
export default class CodeInfo extends Vue {
    @Prop({ default: "" }) wrapperClass!: string;
    @Prop({ default: "" }) userId!: string;
    @Prop({ default: "" }) solutionId!: string;
    @Prop({ default: "" }) date!: string;
    @Prop({ default: "" }) language!: string;
    @Prop({ default: "" }) memory!: string;
    @Prop({ default: "" }) time!: string;
    @Prop({ default: "" }) codeLength!: string;
    @Prop({ default: "" }) trimLength!: string;
    @Prop({ default: "" }) judgeColor!: string;
    @Prop({ default: "" }) icon!: string;
    @Prop({ default: "" }) result!: string;
    dayjs = dayjs;
}
</script>

<style scoped>

</style>
