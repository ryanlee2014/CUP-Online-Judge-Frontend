<template>
    <div class="ui container padding" v-cloak>
        <div class="ui grid">
            <div class="row">
                <h2 class="ui header">
                    Title
                </h2>
            </div>
            <div class="two column row">
                <div class="column">
                    <div class="ui input" style="width:100%">
                        <input type="text" v-model="title">
                    </div>
                </div>
                <div class="column" style="z-index: 1700;">
                    <select @change="label = select('.label.selection.ui.dropdown').dropdown('get value')" class="ui search dropdown label selection"
                            multiple>
                        <option :key="lb" :value="lb" v-for="lb in all_label" v-text="lb"></option>
                    </select>
                </div>

            </div>
            <div class="three column row">
                <div class="column">
                    <div class="ui labeled input">
                        <div class="ui label">
                            Time
                        </div>
                        <input type="text" v-model="time">
                    </div>
                </div>
                <div class="column">
                    <div class="ui labeled input">
                        <div class="ui label">
                            Memory
                        </div>
                        <input type="text" v-model="memory">
                    </div>
                </div>
                <div class="column" style="margin: auto">
                    <div class="ui toggle checkbox">
                        <input :checked="spj" type="checkbox" v-model="spj">
                        <label>Special Judge</label>
                    </div>

                </div>
            </div>
            <div class="row">
                <h2 class="ui header">
                    Description
                </h2>
            </div>
            <div class="row">
                <mavon-editor :markInstance="descriptionInstance" v-model="description"></mavon-editor>
            </div>
            <br>
            <div class="row">
                <h2 class="ui header">
                    Input
                </h2>
            </div>
            <div class="row">
                <mavon-editor :markInstance="inputInstance" v-model="input"></mavon-editor>
            </div>
            <br>
            <div class="row">
                <h2 class="ui header">
                    Output
                </h2>
            </div>
            <div class="row">
                <mavon-editor :markInstance="outputInstance" v-model="output"></mavon-editor>
            </div>
            <br>
            <div class="row">
                <h2 class="ui header">
                    Sample Input
                </h2>
            </div>
            <div class="row">
                <div class="ui form" style="min-width:85%">
                    <div class="field">
                        <textarea v-model="sampleinput"></textarea>
                    </div>
                </div>
            </div>
            <br>
            <div class="row">
                <h2 class="ui header">
                    Sample Output
                </h2>
            </div>
            <div class="row">
                <div class="ui form" style="min-width:85%">
                    <div class="field">
                        <textarea v-model="sampleoutput"></textarea>
                    </div>
                </div>
            </div>
            <div class="row">
                <h2 class="ui header">Files</h2>
            </div>
            <div class="row">
                <a :href="makeHref(file_name)" :key="file_name" class="ui label" v-for="file_name in files">{{file_name}}</a>
            </div>
            <div class="row">
                <h2 class="ui header">
                    Prepend Code
                </h2>
            </div>
            <div class="row">
                <div class="four wide column">
                    <div class="ui attached vertical fluid pointing menu"
                         style="height: 370px; overflow-y: scroll; overflow-x: hidden;">
                        <a class="item">C
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">GNU
                                C99/C11 LLVM Clang
                            </div>
                        </a>
                        <a class="item">C++
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">GNU
                                C++11/C++89/C++17 LLVM Clang++
                            </div>
                        </a>
                        <a class="item">Pascal
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">fpc
                                Pascal
                            </div>
                        </a>
                        <a class="item">Java
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">
                                openJDK 1.6/1.7/1.8/1.10
                            </div>
                        </a>
                        <a class="item">JavaScript
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">
                                NodeJS 10.13.0
                            </div>
                        </a>
                        <a class="item">Python
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">
                                Python 2.7/3.6 PyPy2/3
                            </div>
                        </a>
                        <a class="item">C#
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">
                                Mono
                            </div>
                        </a>
                    </div>
                </div>
                <div class="ten wide column"></div>
            </div>
            <div class="row">
                <h2 class="ui header">
                    Append Code
                </h2>
            </div>
            <div class="row">
                <div class="four wide column">
                    <div class="ui attached vertical fluid pointing menu"
                         style="height: 370px; overflow-y: scroll; overflow-x: hidden;">
                        <a class="item">C
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">GNU
                                C99/C11 LLVM Clang
                            </div>
                        </a>
                        <a class="item">C++
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">GNU
                                C++11/C++89/C++17 LLVM Clang++
                            </div>
                        </a>
                        <a class="item">Pascal
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">fpc
                                Pascal
                            </div>
                        </a>
                        <a class="item">Java
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">
                                openJDK 1.6/1.7/1.8/1.10
                            </div>
                        </a>
                        <a class="item">JavaScript
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">
                                NodeJS 10.13.0
                            </div>
                        </a>
                        <a class="item">Python
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">
                                Python 2.7/3.6 PyPy2/3
                            </div>
                        </a>
                        <a class="item">C#
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">
                                Mono
                            </div>
                        </a>
                    </div>
                </div>
                <div class="ten wide column"></div>
            </div>
            <div class="row" v-if="from === 'local'">
                <h2 class="ui header">
                    Hint
                </h2>
            </div>
            <div class="row" v-if="from === 'local'">
                <mavon-editor :markInstance="hintInstance" :test="'1'" v-model="hint"></mavon-editor>
            </div>
            <a @click="submit" class="ui button">提交</a>
        </div>

    </div>
</template>

<script lang="ts">
import mixins from "../../mixin/init";
import markdownIt from "../../lib/markdownIt/markdownIt";
import { Component, Mixins } from "vue-property-decorator";
import jquery from "jquery";
import * as _ from "lodash";

const $: any = jquery;

interface ICodeSet {
    [id: string]: string
}

function unique (array: any[]) {
    return array.filter(function (item, index, array) {
        return array.indexOf(item) === index;
    });
}

@Component
export default class ProblemEdit extends Mixins(mixins) {
        title = "";
        description = "";
        time = "";
        memory = "";
        input = "";
        output = "";
        spj = false;
        sampleinput = undefined;
        sampleoutput = undefined;
        descriptionInstance = markdownIt.newInstance();
        inputInstance = markdownIt.newInstance();
        outputInstance = markdownIt.newInstance();
        hintInstance = markdownIt.newInstance();
        hint = undefined;
        source = "";
        from = "local";
        label = [];
        all_label = [];
        prepend: ICodeSet = {
        };
        append: ICodeSet = {
        };
        files = [];
        id = "0";
        select = $;
        $children: any;

        created () {
            this.id = this.$route.params.problem_id;
        }

        mounted () {
            document.title = `Problem ${this.id} Edit -- ${document.title}`;
            this.initData();
        }

        makeHref (fileName: string) {
            return `/api/admin/problem/download/data/${this.id}/${fileName}`;
        }

        submit () {
            let from = "local";
            const id = this.id;
            const sendObj: any = { imageData: {} };
            for (const i of this.$children) {
                const target = i.$vnode.data.model;
                sendObj[target.expression] = target.value;
                sendObj.imageData[target.expression] = i.markdownIt.__image || {};
            }

            sendObj["time"] = this.time;
            sendObj["memory"] = this.memory;
            sendObj["title"] = this.title;
            sendObj["sampleinput"] = this.sampleinput;
            sendObj["sampleoutput"] = this.sampleoutput;
            sendObj["prepend"] = this.prepend;
            sendObj["append"] = this.append;
            sendObj["spj"] = Number(this.spj);
            const labels = this.label;

            sendObj["label"] = unique(labels).join(" ");
            this.axios.post(`/api/problem/${this.source}/${id}`, { json: sendObj })
                .then(({ data }) => {
                    if (data.status === "OK") {
                        this.axios.get(`/api/problem/${from}?id=${id}`);
                        alert("提交成功");
                    }
                });
        }

        imageHandler (key: number | string, data: any) {
            let mx = -1;
            const that = this;
            _.forEach(data.data, function (val, idx) {
                that.$children[key].markdownIt.image_add_with_check(val.name, val.data);
                mx = Math.max(mx, parseInt(val.name));
            });
            this.$children[key].$children[0].num = mx + 1;
            this.$children[key].iRender();
        }

        initData () {
            const that = this;
            const id = this.id;
            this.axios.get("/api/problem/local", { params: { id: this.id, raw: "" } })
                .then(({ data }) => {
                    const d = data.problem;
                    const _data = {
                        title: d.title,
                        description: d.description,
                        time: d.time_limit,
                        memory: d.memory_limit,
                        input: d.input,
                        output: d.output,
                        spj: !!parseInt(d.spj),
                        sampleinput: d.sample_input,
                        sampleoutput: d.sample_output,
                        hint: d.hint,
                        source: "local",
                        label: d.label ? d.label.split(" ") : [],
                        all_label: [],
                        files: []
                    };
                    Object.assign(this, _data);
                    this.axios.get(`/api/problem/${this.source}/?label=true`)
                        .then(({ data }) => {
                            const $dropdown = $(".label.selection.ui.dropdown");
                            that.all_label = data.data;
                            const hasLabel = that.label;
                            $dropdown
                                .dropdown({
                                    allowAdditions: true
                                })
                                .on("click", function () {
                                    that.label = $dropdown.dropdown("get value");
                                });
                            for (let i = 0; i < hasLabel.length; ++i) {
                                $dropdown.dropdown("set selected", hasLabel[i]);
                            }
                        });
                    this.initMarkdown("description", id, 0);
                    this.initMarkdown("input", id, 1);
                    this.initMarkdown("output", id, 2);
                    this.initMarkdown("hint", id, 3);
                    this.axios.get(`/api/file/${id}`)
                        .then(({ data }) => {
                            if (data.status === "OK") {
                                this.files = data.data;
                            }
                        });
                });
        }

        initMarkdown (path: string, id: string, code: number | string) {
            this.axios.get(`/api/photo/${path}/${id}`)
                .then(({ data }) => {
                    if (data.status === "OK") {
                        this.imageHandler(code, data);
                    }
                });
        }
}
</script>

<style scoped>

</style>
