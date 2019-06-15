<template>
    <div class="ui container padding">
        <h2 class="ui dividing header">
            Code Compare
        </h2>
        <div class="ui grid">
            <div class="row">
                <div class="sixteen wide column">
                    <h3>Problem <router-link :to="`/problem/submit/${problem_id}`">{{problem_id}}</router-link></h3>
                </div>
            </div>
            <div class="row">
                <div class="eight wide column">
                    <div class="ui header">
                        User ID: <router-link :to="`/user/${this.leftUserID}`">{{this.leftUserID}}</router-link> Solution ID: {{this.leftSolutionID}}
                    </div>
                    <div class="ui content">
                        <p><b>Date: </b>{{dayjs(this.left.code.in_date).format("YYYY-MM-DD HH:mm:ss")}}</p>
                        <p><b>Language: </b> {{this.left.language}}&nbsp;&nbsp;<b>Memory: </b> {{this.left.memory}}KB&nbsp;&nbsp;<b>Time: </b> {{this.left.time}}ms</p>
                        <p><b>Code Length: </b> {{this.left.length}}B&nbsp;&nbsp;<b>Code length without space: </b> {{this.left.trimlength}}B</p>
                        <p :class="this.left.judge_color"><b>Result: </b> <i :class="`${this.left.icon} icon`"></i>{{this.left.result}}</p>
                    </div>
                </div>
                <div class="eight wide column">
                    <div class="ui header">
                        User ID: <router-link :to="`/user/${this.rightUserID}`">{{this.rightUserID}}</router-link> Solution ID: {{this.rightSolutionID}}
                    </div>
                    <div class="ui content">
                        <p><b>Date: </b>{{dayjs(this.right.code.in_date).format("YYYY-MM-DD HH:mm:ss")}}</p>
                        <p><b>Language: </b> {{this.right.language}}&nbsp;&nbsp;<b>Memory: </b> {{this.right.memory}}KB&nbsp;&nbsp;<b>Time: </b> {{this.right.time}}ms</p>
                        <p><b>Code Length: </b> {{this.right.length}}B&nbsp;&nbsp;<b>Code length without space: </b> {{this.right.trimlength}}B</p>
                        <p :class="this.right.judge_color"><b>Result: </b> <i :class="`${this.right.icon} icon`"></i>{{this.right.result}}</p>
                    </div>
                </div>
            </div>
            <div class="row">
                <div id="container" style="min-width:100%;height:600px;border:1px solid #ccc">
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import * as monaco from "monaco-editor";
import mixins from "../../mixin/init";
const dayjs = require("dayjs");
export default {
    name: "diff",
    mixins: [mixins],
    data () {
        return {
            diffEditor: null,
            problem_id: 0,
            leftUserID: "",
            rightUserID: "",
            leftSolutionID: this.$route.params.left,
            rightSolutionID: this.$route.params.right,
            left: {},
            right: {},
            dayjs
        };
    },
    async mounted () {
        document.title = `Code compare -- ${document.title}`;
        let leftPromise = new Promise(resolve => {
            this.axios.get(`/api/source/local/${this.$route.params.left}?raw=1`).then(({ data }) => {
                resolve(data);
            });
        });
        let rightPromise = new Promise(resolve => {
            this.axios.get(`/api/source/local/${this.$route.params.right}?raw=1`).then(({ data }) => {
                resolve(data);
            });
        });
        let [leftData, rightData] = await Promise.all([leftPromise, rightPromise]);
        this.leftUserID = leftData.data.user_id;
        this.left = leftData.data;
        this.left.length = this.left.code.source.length;
        this.left.trimlength = this.left.code.source.split(" ").join("").split("\n").join("").length;
        this.rightUserID = rightData.data.user_id;
        this.right = rightData.data;
        this.right.length = this.right.code.source.length;
        this.right.trimlength = this.right.code.source.split(" ").join("").split("\n").join("").length;
        this.problem_id = leftData.data.code.problem_id;
        let originalModel = monaco.editor.createModel(leftData.data.code.source, "cpp");
        let modifiedModel = monaco.editor.createModel(rightData.data.code.source, "cpp");
        this.$forceUpdate();
        this.$nextTick(() => {
            const diffEditor = this.diffEditor = monaco.editor.createDiffEditor(document.getElementById("container"), {
                scrollBeyondLastLine: false
            });
            diffEditor.setModel({
                original: originalModel,
                modified: modifiedModel
            });
        });
    },
    beforeDestroy () {
        if (this.diffEditor) {
            this.diffEditor.dispose();
        }
    }
};
</script>

<style scoped>

</style>
