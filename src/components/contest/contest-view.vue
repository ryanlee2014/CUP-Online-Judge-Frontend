<template>
    <table class='ui padded celled unstackable selectable table' width=90%>
        <thead>
        <tr align=center class=toprow>
            <th width=55%>{{$t("title")}}</th>
            <th width=25%>{{$t("status")}}</th>
            <th width=7%>{{$t("privilege")}}</th>
            <th width="13%">{{$t("creator")}}</th>
        </tr>
        </thead>
        <tbody>
        <tr :class="`${(key % 2 === 0 ? 'evenrow' : 'oddrow')} ${row.defunct === 'Y' ? 'active' : ''}`"
            :key="key"
            v-for="(row,key) in contest_list">
            <td>
                <router-link :to="`/contest/${row.contest_id}`">
                    {{`Contest ${row.contest_id}: ${row.title}`}}
                </router-link>
            </td>
            <td>
                <p style="margin-bottom: 0.25em" v-html="contestTimeFormat(row)"></p>
                <progress-bar :active="contestIsRunning(row)" :color="progressBarColor(row)" :percentage="percentageRunning(row)"
                              :size="'tiny'"></progress-bar>
            </td>
            <td>
                {{row.private ? $t("private") : $t("public")}}
            </td>
            <td>
                <router-link :to="`/user/${row.user_id}`">
                    {{row.user_id}}
                </router-link>
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import Vue from "vue";
import dayjs, { Dayjs } from "dayjs";
import ProgressBar from "../progress/progressBar.vue";
import { Interval } from "@/module/Decorator/method";
import TimerMixin from "@/mixin/TimerMixin";
@Component({
    components: {
        ProgressBar
    }
})
export default class ContestView extends Mixins(Vue, TimerMixin) {
    @Prop({ default: [] }) contest_list!: any[];
    current_time:Dayjs = dayjs();

    mounted () {
        this.updateCurrentTime();
    }

    @Interval(10000)
    updateCurrentTime () {
        this.current_time = dayjs();
    }
    contestTimeFormat (row: any) {
        if (Object.prototype.hasOwnProperty.call(row, "_format_") && typeof row._format_ === "string") {
            return row._format_;
        }
        let startTime: Dayjs;
        if (!dayjs.isDayjs(row.start_time)) {
            startTime = dayjs(row.start_time);
        }
        let endTime: Dayjs;
        if (!dayjs.isDayjs(row.end_time)) {
            endTime = dayjs(row.end_time);
        }
        const currentTime: Dayjs = this.current_time;
        if (row.isEnd || currentTime.isAfter(endTime!)) {
            row.isEnd = true;
            // eslint-disable-next-line no-return-assign
            return row._format_ = `${endTime!.format("YYYY-MM-DD HH:mm")}${this.$t("end")}`;
        }
        else if (currentTime.isBefore(startTime!)) {
            return `${startTime!.format("YYYY-MM-DD HH:mm")}${this.$t("start")}`;
        }
        else {
            return `${startTime!.format("YYYY-MM-DD HH:mm")} ${this.$t("start")}<br>${endTime!.format("YYYY-MM-DD HH:mm")} ${this.$t("end")}`;
        }
    }

    contestIsRunning (row: any) {
        let startTime: Dayjs;
        if (!dayjs.isDayjs(row.start_time)) {
            startTime = dayjs(row.start_time);
        }
        let endTime: Dayjs;
        if (!dayjs.isDayjs(row.end_time)) {
            endTime = dayjs(row.end_time);
        }
        const currentTime: Dayjs = this.current_time;
        return currentTime.isBefore(endTime!) && currentTime.isAfter(startTime!);
    }

    progressBarColor (row: any) {
        return this.contestIsRunning(row) ? "green" : "grey";
    }

    percentageRunning (row: any) {
        let startTime: Dayjs;
        if (row.isEnd === true) {
            return 100;
        }
        if (!dayjs.isDayjs(row.start_time)) {
            startTime = dayjs(row.start_time);
        }
        let endTime: Dayjs;
        if (!dayjs.isDayjs(row.end_time)) {
            endTime = dayjs(row.end_time);
        }
        const currentTime: Dayjs = this.current_time;
        if (currentTime.isBefore(startTime!)) {
            return 0;
        }
        else if (currentTime.isAfter(endTime!)) {
            row.isEnd = true;
            return 100;
        }
        else {
            let diffTime = currentTime.diff(startTime!, "second");
            let totalDiff = endTime!.diff(startTime!, "second");
            return Math.trunc(Math.floor(diffTime * 100 / totalDiff));
        }
    }
}
</script>

<style scoped>
    td {
        text-align: center !important;
    }
</style>
