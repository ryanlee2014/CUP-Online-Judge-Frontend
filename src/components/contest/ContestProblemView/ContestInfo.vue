<template>
    <div class="ui raised segment">
        <div class="ui grid">
            <div class="row"></div>
            <div class="row"></div>
            <div class="row">
                <div class="sixteen wide column">
                    <contest-problem-progress-bar :start-time="start_time"
                                                  :end-time="end_time"></contest-problem-progress-bar>
                </div>
            </div>
            <div class="row">
                <p style="padding: 1em">{{description}}</p>
            </div>
            <!--2018 2019 2020年 中国石油大学（北京）团委 不发ICPC/CCPC奖学金-->
        </div>
        <div :class="'ui top right attached label ' + (private_contest ?'red':'green')">
            {{ private_contest ?$t("private"):$t("public")}}
        </div>
        <div
            :class="'ui top left attached ' + (now.isAfter(end_time)?'red':now.isBefore(start_time)?'grey':'green') + ' label'">
            <span class="red" v-if="now.isAfter(end_time)">{{$t("end")}}</span>
            <span class="red" v-else-if="now.isBefore(start_time)">Pending</span>
            <span class="green" v-else>{{$t("running")}}</span>
        </div>
    </div>
</template>

<script lang="ts">
import dayjs, { Dayjs } from "dayjs";
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import ContestProblemProgressBar from "@/components/contest/ContestProblemView/ContestProblemProgressBar.vue";

@Component({
    components: {
        ContestProblemProgressBar
    }
})
export default class ContestInfo extends Vue {
    @Prop({ default: dayjs() }) start_time!: Dayjs;
    @Prop({ default: dayjs() }) end_time!: Dayjs;
    @Prop({ default: "" }) description!: string;
    @Prop({ default: "" }) title!: string;
    @Prop({ default: false }) admin!: boolean;
    @Prop({ default: false }) private_contest!: boolean;
    @Prop({ default: 0 }) cid!: number;
    now = dayjs();
    mounted () {
        setInterval(() => {
            this.now = dayjs();
        }, 1000);
    }
}
</script>

<style scoped>

</style>
