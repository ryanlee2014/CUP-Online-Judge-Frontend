<template>
    <div
        class="ui grid"
        id="total_control"
        style="max-width:1300px;position:relative;margin:auto;border-radius: 10px">
        <leftPanel :accepted="accepted" :description="description" :hint="hint" :input="input" :isadmin="isadmin"
                   :iseditor="iseditor"
                   :memory="memory"
                   :normal_problem="normal_problem" :original_id="original_id" :output="output" :problem_id="problem_id"
                   :sampleinput="sampleinput"
                   :sampleoutput="sampleoutput"
                   :source="source" :spj="spj" :submit="submit" :switch_screen="switch_screen"
                   :time="time"
                   :title="title" :uploader="uploader"></leftPanel>
        <rightPanel :append="append" :do_submit="do_submit" :lang_list="lang_list" :pre_test_run="pre_test_run"
                    :prepend="prepend" :source_code="source_code" :submitDisabled="submitDisabled"
                    :judge-info-text="judgeInfoText"
                    :source_code_language="source_code_language"></rightPanel>

    </div>
</template>

<script lang="ts">
import leftPanel from "./sidePage/leftPanel.vue";
import rightPanel from "./sidePage/rightPanel.vue";
import { Component, Prop } from "vue-property-decorator";
import Vue from "vue";
@Component({
    components: {
        leftPanel,
        rightPanel
    }
})
export default class SideProblemView extends Vue {
    @Prop({ default: "" }) title!: string;
    @Prop({ default: false }) submitDisabled!: boolean;
    @Prop({ default: "" }) source_code!: string;
    @Prop({ default: 0 }) time!:number;
    @Prop({ default: 0 }) memory!: number;
    @Prop({ default: false }) spj!: boolean;
    @Prop({ default: 0 }) submit!: number;
    @Prop({ default: 0 }) accepted!: number;
    @Prop({ default: 0 }) original_id!: number;
    @Prop({ default: false }) iseditor!: boolean;
    @Prop({ default: false }) isadmin!: boolean;
    @Prop({ default: "" }) description!: string;
    @Prop({ default: "" }) input!: string;
    @Prop({ default: "" }) output!: string;
    @Prop({ default: "" }) sampleinput!: string;
    @Prop({ default: "" }) sampleoutput!: string;
    @Prop({ default: "" }) hint!: string;
    @Prop({ default: "Administrator" }) uploader!: string;
    @Prop({ default: () => () => undefined }) switch_screen!: (...arg: any[]) => any;
    @Prop({ default: true }) normal_problem!: boolean;
    @Prop({ default: "" }) source!: string;
    @Prop({ default: 0 }) problem_id!: number;
    @Prop({ default: () => [] }) lang_list!: any[];
    @Prop({ default: () => {} }) do_submit!: (...arg: any[]) => any;
    @Prop({ default: () => {} }) pre_test_run!: (...arg: any[]) => any;
    @Prop({ default: () => { return {}; } }) prepend!: any;
    @Prop({ default: () => { return {}; } }) append!: any;
    @Prop({ default: "" }) judgeInfoText!: string;
    @Prop({ default: null }) source_code_language!: number | null;
}
</script>

<style scoped>
    .ui.modal {
        top: 3%;
    }

    script {
        display: none;
    }

    .not-compile {
        display: none;
    }

    .sample_input {
        color: #ad1457;
    }

    #total_control {
        min-height: -moz-available; /* WebKit-based browsers will ignore this. */
        min-height: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */
        min-height: fill-available;
    }

    .sample_output {
        color: #ad1457;
    }

    .following.bar.title.light.fixed {
        top: 40px;
        transition: top 0.4s;
    }

    .following.bar.title {
        top: 60px;
        transition: top 0.4s;
    }

    .ui.vertical.center.aligned.grid {
        padding-top: 1em;
        padding-bottom: 2em;
    }

    .row.no.padding {
        padding-top: 0em;
        padding-bottom: 0em;
    }

    .main.submit.layout img {
        display: block;
        margin-left: auto;
        margin-right: auto;
    }
</style>
