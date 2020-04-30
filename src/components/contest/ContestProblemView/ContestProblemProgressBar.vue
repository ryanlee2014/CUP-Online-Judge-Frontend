<template>
    <progress-bar ref="progress" :popupEvent="trigger" :active="false" size="standard" color="green" :percentage="percentage"></progress-bar>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import dayjs, { Dayjs } from "dayjs";
import ProgressBar from "@/components/progress/progressBar.vue";
@Component({
    components: {
        ProgressBar
    }
})
export default class ContestProblemProgressBar extends Vue {
    @Prop({ default: dayjs() }) startTime!: Dayjs;
    @Prop({ default: dayjs() }) endTime!: Dayjs;

    start: Dayjs = dayjs();
    end: Dayjs = dayjs();
    period: number = 1 << 30;

    @Watch("startTime")
    onStartTimeChanged (val: string) {
        this.start = dayjs(val);
        this.period = Math.abs(this.end.diff(this.start));
    }

    @Watch("endTime")
    onEndTimeChanged (val: string) {
        this.end = dayjs(val);
        this.period = Math.abs(this.end.diff(this.start));
    }

    getPopupHtml () {
        return `<div class="content">
            ${this.$t("start time")}: ${this.startTime.format("YYYY-MM-DD HH:mm:ss")}
            <br>
            ${this.$t("end time")}: ${this.endTime.format("YYYY-MM-DD HH:mm:ss")}
            </div>`;
    }

    trigger (target: any) {
        $(target).popup({
            hoverable: true,
            html: this.getPopupHtml()
        }).popup("show");
    }

    get percentage () {
        const currentTime = dayjs();
        const diff = currentTime.diff(this.start);
        return Math.min(Math.max(diff, 0) * 100 / this.period, 100);
    }
}
</script>

<style scoped>

</style>
