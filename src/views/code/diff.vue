<template>
    <div class="ui container padding">
        <h2 class="ui dividing header">
            ode Cfsa3121ompare
        </h2>
        <div class="ui grid">
            <div class="row">
                <div class="sixteen wide column">
                    <h3>Problem {{problem_id}}</h3>
                </div>
            </div>
            <div class="row">
                <div class="eight wide column">
                    <div class="ui header">
                        UserID: {{this.leftUserID}} Solution ID: {{this.leftSolutionID}}
                    </div>
                </div>
                <div class="eight wide column">
                    <div class="ui header">
                        UserID: {{this.rightUserID}} Solution ID: {{this.rightSolutionID}}
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
    import * as monaco from 'monaco-editor';
    import mixins from '../../mixin/init'

    export default {
        name: "diff",
        mixins: [mixins],
        data() {
            return {
                diffEditor: null,
                problem_id: 0,
                leftUserID: "",
                rightUserID: "",
                leftSolutionID: this.$route.params.left,
                rightSolutionID: this.$route.params.right
            }
        },
        async mounted() {
            let leftPromise = new Promise(resolve => {
                    this.axios.get(`/api/source/local/${this.$route.params.left}?raw=1`).then(({data}) => {
                        resolve(data)
                    })
                }),
                rightPromise = new Promise(resolve => {
                    this.axios.get(`/api/source/local/${this.$route.params.right}?raw=1`).then(({data}) => {
                        resolve(data)
                    })
                });
            let [leftData, rightData] = await Promise.all([leftPromise, rightPromise]);
            this.leftUserID = leftData.data.user_id;
            this.rightUserID = rightData.data.user_id;
            this.problem_id = leftData.data.code.problem_id;
            let originalModel = monaco.editor.createModel(leftData.data.code.source, "cpp");
            let modifiedModel = monaco.editor.createModel(rightData.data.code.source, "cpp");
            console.log(monaco.languages.getLanguages());
            this.$forceUpdate();
            this.$nextTick(() => {
                const diffEditor = this.diffEditor = monaco.editor.createDiffEditor(document.getElementById("container"));
                diffEditor.setModel({
                    original: originalModel,
                    modified: modifiedModel
                });
            });
        },
        beforeDestroy() {
            if (this.diffEditor) {
                this.diffEditor.dispose();
            }
        }
    }
</script>

<style scoped>

</style>
