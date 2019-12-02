<template>
    <h3 class="ui header">
        当前时间:{{current_time}}
        <div class="sub header" v-if="start_time">
            起始时间:{{dayjs(start_time).format("YYYY-MM-DD HH:mm:ss")}},
            {{format_time(dayjs().diff(start_time,"second"))}}
        </div>
    </h3>
</template>

<script lang="ts">
import dayjs, { Dayjs } from "dayjs";
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";

@Component
export default class TimeView extends Vue {
    @Prop({ default: dayjs() }) start_time!: Dayjs;
    current_time: string = "";
    dayjs = dayjs;
    created () {
        this.current_time = this.currentTime();
    }

    currentTime () {
        return dayjs().format("YYYY-MM-DD HH:mm:ss");
    }

    mounted () {
        const that: any = this;
        setInterval(() => {
            this.current_time = this.currentTime();
        }, 1000);
    }

    format_time (second: number) {
        let arr = ["还有", "已经过"];
        let passed = Number(second > 0);
        return arr[passed] + this.format_date(second);
    }

    fillZero (str: string) {
        if (str.length < 2) {
            return "0" + str;
        }
        else {
            return str;
        }
    }

    format_date (second: number, mode = 0) {
        second = Math.abs(second);
        let hour = String(second / 3600);
        hour = this.fillZero(hour);

        let minute = String((second - parseInt(hour) * 3600) / 60);
        minute = this.fillZero(minute);
        let sec = String(second % 60);
        sec = this.fillZero(sec);
        if (mode) {
            return hour + " : " + minute + " : " + sec;
        }
        else {
            return hour + ":" + minute + ":" + sec;
        }
    }
}
</script>

<style scoped>

</style>
