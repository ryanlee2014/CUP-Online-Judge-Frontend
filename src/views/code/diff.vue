<template>
    <div class="ui container padding">
        <h2 class="ui dividing header">
            {{$t("code compare")}}
        </h2>
        <div class="ui grid">
            <div class="row">
                <div class="sixteen wide column">
                    <h3>Problem <router-link :to="`/problem/submit/${problem_id}`">{{problem_id}}</router-link></h3>
                </div>
            </div>
            <div class="row">
                    <CodeInfo wrapper-class="eight wide column"
                    :user-id="leftUserID"
                    :solution-id="leftSolutionID"
                    :date="left.code.in_date"
                    :language="left.language"
                    :memory="left.memory"
                    :time="left.time"
                    :code-length="left.length"
                    :trim-length="left.trimlength"
                    :judge-color="left.judge_color"
                    :icon="left.icon"
                    :result="left.result"></CodeInfo>
                <CodeInfo wrapper-class="eight wide column"
                :user-id="rightUserID"
                :solution-id="rightSolutionID"
                :date="right.code.in_date"
                :language="right.language"
                :memory="right.memory"
                :time="right.time"
                :code-length="right.length"
                :trim-length="right.trimlength"
                :judge-color="right.judge_color"
                :icon="right.icon"
                :result="right.result">
                </CodeInfo>
            </div>
            <div class="row">
                <div id="container" style="min-width:100%;height:600px;border:1px solid #ccc">
                </div>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import Vue from "vue";
import * as monaco from "monaco-editor";
import mixins from "../../mixin/init";
import { init, format } from "wastyle";
import languageMap from "../../lib/constants/monaco-editor/language-map";
import dayjs, { Dayjs } from "dayjs";
import { Mixins, Component } from "vue-property-decorator";
import CodeInfo from "@/components/code/code-info.vue";
const astyle = require("wastyle/dist/astyle.wasm").default;
import editor = monaco.editor;
import IDiffEditor = editor.IDiffEditor;
interface ICode {
    code: {
        // eslint-disable-next-line camelcase
        in_date: Dayjs,
        source?: string,
    },
    language: string,
    memory: string,
    time: string,
    judge_color: string,
    result: string,
    icon: string,
    length?: number,
    trimlength?: number
}

@Component({
    components: { CodeInfo }
})
export default class CodeDiff extends Mixins(mixins) {
    diffEditor?: IDiffEditor;
    problem_id = 0;
    leftUserID = "";
    rightUserID = "";
    leftSolutionID = "";
    rightSolutionID = "";
    created () {
        this.leftSolutionID = this.$route.params.left;
        this.rightSolutionID = this.$route.params.right;
    }

    left: ICode = {
        code: {
            in_date: dayjs()
        },
        language: "",
        memory: "",
        judge_color: "",
        time: "",
        icon: "",
        result: ""
    };

    right: ICode = {
        code: {
            in_date: dayjs()
        },
        language: "",
        memory: "",
        time: "",
        judge_color: "",
        icon: "",
        result: ""
    };

    dayjs = dayjs;
    async mounted () {
        document.title = `Code compare -- ${document.title}`;
        const leftPromise = this.axios.get(`/api/source/local/${this.$route.params.left}?raw=1`).then(({ data }) => data);
        const rightPromise = this.axios.get(`/api/source/local/${this.$route.params.right}?raw=1`).then(({ data }) => data);
        const initFormat = init(astyle);
        const [leftData, rightData] = await Promise.all([leftPromise, rightPromise, initFormat]);
        this.leftUserID = leftData.data.user_id;
        this.left = leftData.data;
        this.left.length = this.left.code.source!.length;
        this.left.trimlength = this.left.code.source!.split(" ").join("").split("\n").join("").length;
        this.rightUserID = rightData.data.user_id;
        this.right = rightData.data;
        this.right.length = this.right.code.source!.length;
        this.right.trimlength = this.right.code.source!.split(" ").join("").split("\n").join("").length;
        this.problem_id = leftData.data.code.problem_id;
        leftData.data.code.source = await format(leftData.data.code.source, "pad-oper style=google")[1];
        rightData.data.code.source = await format(rightData.data.code.source, "pad-oper style=google")[1];
        const originalModel = monaco.editor.createModel(leftData.data.code.source, languageMap[leftData.data.code.language]);
        const modifiedModel = monaco.editor.createModel(rightData.data.code.source, languageMap[rightData.data.code.language]);
        this.$forceUpdate();
        this.$nextTick(() => {
            const diffEditor = this.diffEditor = monaco.editor.createDiffEditor(document.getElementById("container")!, {
                scrollBeyondLastLine: false
            });
            diffEditor.setModel({
                original: originalModel,
                modified: modifiedModel
            });
        });
    }

    beforeDestroy () {
        if (this.diffEditor) {
            this.diffEditor.dispose();
        }
    }
}
</script>

<style scoped>

</style>
