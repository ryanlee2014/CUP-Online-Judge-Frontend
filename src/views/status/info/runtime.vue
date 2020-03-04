<template>
    <div class="ui container">
        <h2 class="ui dividing header">Runtime Information</h2>
        <div class="ui segment same_width">
            <div></div>
            <div v-show="!diffmode">
                <h3 class="ui dividing header">运行结果</h3>
                <div class="plain_text row" v-text="info">

                </div>
            </div>
            <div class="ui grid" v-show="diffmode">
                <div class="row">
                    <div class="eight wide column">
                        <h3 class="ui header">
                            标准输出
                        </h3>
                    </div>
                    <div class="eight wide column">
                        <h3 class="ui header">
                            用户输出
                        </h3>
                    </div>
                </div>
            </div>
            <div class="margin">
                <div id="container" style="min-width:100%;height:600px;border:1px solid #ccc" v-show="diffmode"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import mixins from "../../../mixin/init";
import { Component, Mixins } from "vue-property-decorator";
import * as monaco from "monaco-editor";
import * as _ from "lodash";
import editor = monaco.editor;
import IDiffEditor = editor.IDiffEditor;

@Component
export default class RuntimeInfo extends Mixins(mixins) {
        info = "";
        solution_id?: string;
        diffEditor: IDiffEditor | null = null;
        diffmode = false;

        created () {
            this.solution_id = this.$route.params.solution_id;
        }

        mounted () {
            document.title = `${this.solution_id} Runtime Information -- ${document.title}`;
            this.axios.get(`/api/status/runtime_info/${this.solution_id}`)
                .then(({ data }) => {
                    if (data.status === "OK") {
                        const text = data.data.info;
                        this.initContext(text);
                    }
                    else {
                        this.info = "您无权访问";
                    }
                });
        }

        initContext (text: string) {
            let leftIndex = 0;
            let rightIndex = 0;
            let left: any = [];
            let right: any = [];
            let cnt = 10;
            text = text.split("------测试输出前100行-----").join("[TestRunOut]").split("------用户输出前100行-----").join("[UserOut]")
                .split("------测试输出(左)与用户输出(右)前200行的区别-----").join("[DIFF]");
            while (leftIndex !== -1 && rightIndex !== -1) {
                leftIndex = text.indexOf("[TestRunOut]", leftIndex + 1);
                rightIndex = text.indexOf("[UserOut]", rightIndex + 1);
                if (!(leftIndex !== -1 && rightIndex !== -1)) {
                    break;
                }
                left.push(text.substring(leftIndex, rightIndex) + "\n");
                --cnt;
                if (cnt <= 0) {
                    break;
                }
            }
            leftIndex = rightIndex = 0;
            cnt = 10;
            // eslint-disable-next-line no-constant-condition
            while (true) {
                leftIndex = text.indexOf("[UserOut]", leftIndex + 1);
                rightIndex = text.indexOf("[DIFF]", rightIndex + 1);
                if (!(leftIndex !== -1 && rightIndex !== -1)) {
                    break;
                }
                right.push(text.substring(leftIndex, rightIndex) + "\n");
                console.log(text.substring(leftIndex, rightIndex));
                --cnt;
                if (cnt <= 0) {
                    break;
                }
            }
            const files: any = text.match(/[0-9A-Za-z]+\.out/g);
            const left_array = left;
            const right_array = right;
            left = "";
            right = "";
            let idx = 0;
            _.forEach(left_array, function (data) {
                left += files[idx++] + "\n" + data;
            });
            idx = 0;
            _.forEach(right_array, function (data) {
                right += files[idx++] + "\n" + data;
            });
            if (text && text.length && left && left.length) {
                this.diffmode = true;
                left = left.split("[TestRunOut]").join("");
                right = right.split("[UserOut]").join("");
                const originalModel = monaco.editor.createModel(left, "plain/text");
                const modifiedModel = monaco.editor.createModel(right, "plain/text");
                this.$forceUpdate();
                this.$nextTick(() => {
                    const diffEditor = this.diffEditor = monaco.editor.createDiffEditor(document.getElementById("container")!, { scrollBeyondLastLine: false });
                    diffEditor.setModel({
                        original: originalModel,
                        modified: modifiedModel
                    });
                });
            }
            else {
                this.info = text;
            }
        }

        beforeDestroy () {
            if (this.diffEditor) {
                this.diffEditor!.dispose();
            }
        }
}
</script>

<style scoped>
    .margin {
        margin-top: 1em;
        margin-bottom: 1em;
    }
    .plain_text {
        white-space: pre-wrap;
    }
</style>
