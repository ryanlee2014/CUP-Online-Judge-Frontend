<template>
    <div :class="'ui ' + (now.isAfter(end_time)?'red':now.isBefore(start_time)?'grey':'green') + ' label'">
        <span class="red" v-if="now.isAfter(end_time)">{{$t("end")}}</span>
        <span class="red" v-else-if="now.isBefore(start_time)">Pending</span>
        <span class="green" v-else>{{$t("running")}}</span>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import dayjs, { Dayjs } from "dayjs";
import { Interval } from "@/module/Decorator/method";
@Component
export default class ContestRunningLabel extends Vue {
    @Prop({ default: dayjs() }) start_time!: Dayjs;
    @Prop({ default: dayjs() }) end_time!: Dayjs;
    now = dayjs();

    mounted () {
        this.updateNow();
    }

    @Interval(1000)
    updateNow () {
        this.now = dayjs();
    }
}
</script>

<style scoped>

</style>
