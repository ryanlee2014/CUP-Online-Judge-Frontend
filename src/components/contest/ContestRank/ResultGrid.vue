<template>
    <td :class="gridBackgroundClass" :data-html="generateDataHTML" ref="block"
        style="text-align:center">
        <b :class="'text '+ (problem.accept.length > 0 ? problem.first_blood?'first accept':'accept':'red')">
            {{ (problem.accept.length > 0 || problem.submit.length > 0)?"+":""}}
            {{problem.try_time > 0 ? problem.try_time : problem.accept.length == 0 && problem.submit.length >
            0?problem.submit.length : ""}}</b>
        <br v-if="problem.accept.length > 0">
        <span :class="problem.first_blood?'first accept text':''"
              v-if="problem.accept.length > 0 && typeof problem.accept[0].diff === 'function'">
                {{format_date(problem.accept[0].diff(problem.start_time,"second"))}}
            </span>
    </td>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import jquery from "jquery";
const $: any = jquery;
@Component
export default class ResultGrid extends Vue {
    @Prop({ default: 0 }) gridBackground!: number;
    @Prop({ default: () => {} }) lock!: any;
    @Prop({
        default: () => {
            return {
                accept: [],
                submit: []
            };
        }
    }) problem!: any;

    @Prop({ default: () => () => {} }) format_date!: (...ang: any[]) => any;
    get generateDataHTML () {
        let htmlBuilder = "<div class=\"ui list\">";
        htmlBuilder += this.buildItem();
        htmlBuilder += "</div>";
        return htmlBuilder;
    }

    get gridBackgroundClass () {
        const gridBackground = this.gridBackground;
        if (gridBackground === 0) {
            return "";
        }
        else if (gridBackground === 1) {
            return "first accept";
        }
        else {
            return "accept";
        }
    }

    mounted () {
        this.triggerPopup();
    }

    triggerPopup () {
        const lock = this.lock;
        const submit = this.problem.submit;
        const accept = this.problem.accept;
        if (submit.length > 0 || accept.length > 0) {
            // const getLock = lock.tryAcquire();
            // if (getLock) {
            $(this.$refs.block).popup({
                hoverable: true
            }).popup();
            // lock.release();
            // }
        }
    }

    buildItem () {
        const submit = this.problem.submit;
        const accept = this.problem.accept;
        const total = [...submit.map((e: any) => { return { pass: false, time: e }; }), ...accept.map((e: any) => { return { pass: true, time: e }; })];
        total.sort((a, b) => a.time.isBefore(b.time) ? -1 : a.time.isAfter(b.time) ? 1 : 0);
        let html = "";
        const TRIM_UPPER = 13;
        const trim = total.length > TRIM_UPPER;
        const totalLength = total.length;
        while (total.length > TRIM_UPPER) total.shift();
        if (trim) {
            html += `<div class="item"><i class="icon"></i><div class="content"><div class="header">Trim ${totalLength - TRIM_UPPER} submission</div> </div></div>`;
        }
        for (const submission of total) {
            let htmlBuilder = "<div class=\"item\">";
            if (!submission.pass) {
                htmlBuilder += "<i class=\"remove important icon\"></i>";
            }
            else {
                htmlBuilder += "<i class=\"checkmark important icon\"></i>";
            }
            htmlBuilder += "<div class=\"content\">";
            htmlBuilder += `<div class="header">${submission.pass ? "Passed" : "Failed"}</div>`;
            htmlBuilder += `<div class="description">${submission.time.format("YYYY-MM-DD HH:mm:ss")}</div>`;
            htmlBuilder += "</div></div>";
            html += htmlBuilder;
        }
        return html;
    }
}
</script>

<style scoped>

    .accept {
        background-color: #e0ffe4 !important;
    }

    .accept.first {
        background-color: #16ab39 !important;
    }

    .text.accept {
        color: #21BA45 !important;
    }

    .text.accept.first {
        color: #FFFFFF !important;
    }

    .text.red {
        color: #DB2828 !important;
    }
</style>
