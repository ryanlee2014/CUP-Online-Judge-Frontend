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
                <mavon-editor ref="description" :markInstance="descriptionInstance" v-model="description"></mavon-editor>
            </div>
            <br>
            <div class="row">
                <h2 class="ui header">
                    Input
                </h2>
            </div>
            <div class="row">
                <mavon-editor ref="input" :markInstance="inputInstance" v-model="input"></mavon-editor>
            </div>
            <br>
            <div class="row">
                <h2 class="ui header">
                    Output
                </h2>
            </div>
            <div class="row">
                <mavon-editor ref="output" :markInstance="outputInstance" v-model="output"></mavon-editor>
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
                        <a :class="prependSelected === 0 ? 'item' : 'active item'" @click="prependSelected = 0">C
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">GNU
                                C99/C11 LLVM Clang
                            </div>
                        </a>
                        <a :class="prependSelected === 1 ? 'item' : 'active item'" @click="prependSelected = 1">C++
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">GNU
                                C++11/C++89/C++17 LLVM Clang++
                            </div>
                        </a>
                        <a :class="prependSelected === 2 ? 'item' : 'active item'" @click="prependSelected = 2">Pascal
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">fpc
                                Pascal
                            </div>
                        </a>
                        <a :class="prependSelected === 3 ? 'item' : 'active item'" @click="prependSelected = 3">Java
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">
                                openJDK 1.6/1.7/1.8/1.10
                            </div>
                        </a>
                        <a :class="prependSelected === 16 ? 'item' : 'active item'" @click="prependSelected = 16">JavaScript
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">
                                NodeJS 10.13.0
                            </div>
                        </a>
                        <a :class="prependSelected === 6 ? 'item' : 'active item'" @click="prependSelected = 6">Python
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">
                                Python 2.7/3.6 PyPy2/3
                            </div>
                        </a>
                        <a :class="prependSelected === 9 ? 'item' : 'active item'" @click="prependSelected = 9">C#
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">
                                Mono
                            </div>
                        </a>
                    </div>
                </div>
                <div class="ten wide column">
                    <monaco-editor v-model="prepend[prependSelected]"/>
                </div>
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
                        <a :class="appendSelected === 0 ? 'item' : 'active item'" @click="appendSelected = 0">C
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">GNU
                                C99/C11 LLVM Clang
                            </div>
                        </a>
                        <a :class="appendSelected === 1 ? 'item' : 'active item'" @click="appendSelected = 1">C++
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">GNU
                                C++11/C++89/C++17 LLVM Clang++
                            </div>
                        </a>
                        <a :class="appendSelected === 2 ? 'item' : 'active item'" @click="appendSelected = 2">Pascal
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">fpc
                                Pascal
                            </div>
                        </a>
                        <a :class="appendSelected === 3 ? 'item' : 'active item'" @click="appendSelected = 3">Java
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">
                                OpenJDK 1.6/1.7/1.8/1.10
                            </div>
                        </a>
                        <a :class="appendSelected === 16 ? 'item' : 'active item'" @click="appendSelected = 16">JavaScript
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">
                                NodeJS 10.13.0
                            </div>
                        </a>
                        <a :class="appendSelected === 6 ? 'item' : 'active item'" @click="appendSelected = 6">Python
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">
                                Python 2.7/3.6 PyPy2/3
                            </div>
                        </a>
                        <a :class="appendSelected === 9 ? 'item' : 'active item'" @click="appendSelected = 9">C#
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">
                                Mono
                            </div>
                        </a>
                    </div>
                </div>
                <div class="ten wide column">
                    <monaco-editor v-model="append[appendSelected]"/>
                </div>
            </div>
            <div class="row" v-if="from === 'local'">
                <h2 class="ui header">
                    Hint
                </h2>
            </div>
            <div class="row" v-if="from === 'local'">
                <mavon-editor ref="hint" :markInstance="hintInstance" :test="'1'" v-model="hint"></mavon-editor>
            </div>
            <a @click="submit" class="ui button">提交</a>
        </div>

    </div>
</template>

<script lang="ts">
import mixins from "../../mixin/init";
import markdownIt from "../../lib/markdownIt/markdownIt";
import monacoEditor from "@/components/submit/codeEditor/monacoEditor.vue";
import { Component, Mixins } from "vue-property-decorator";
import jquery from "jquery";
import * as _ from "lodash";

const $: any = jquery;

interface IKeyValueString {
    [id: string]: string
}

interface ICodeSet extends IKeyValueString {
}

interface IMavonEditorVueComponent extends IKeyValueString{}

interface IKeyValue {
    [id: string]: any
}

interface IPrependAppendPayload {
    language: string,
    code: string
}

interface ICodePayload {
    language: number,
    code: string
}

interface IPrefileDTOPayload {
    payload: ICodePayload[],
    problemId: number | string
}

function unique (array: any[]) {
    return array.filter(function (item, index, array) {
        return array.indexOf(item) === index;
    });
}

@Component({
    components: {
        monacoEditor
    }
})
export default class ProblemEdit extends Mixins(mixins) implements IKeyValue {
        title = "";
        description = "";
        time = "";
        memory = "";
        input = "";
        output = "";
        spj = false;
        sampleinput = "";
        sampleoutput = "";
        descriptionInstance = markdownIt.newInstance();
        inputInstance = markdownIt.newInstance();
        outputInstance = markdownIt.newInstance();
        hintInstance = markdownIt.newInstance();
        hint: any = "";
        source = "";
        from = "local";
        label = [];
        all_label = [];
        prepend: ICodeSet = {
        };
        prependSelected = 0;
        append: ICodeSet = {
        };
        appendSelected = 0;
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

        PrependAppendLanguage (key: string, defaultKey: number | string, defaultSet: number[]) {
            const baseValue = (this as IKeyValue)[key][defaultKey];
            if (typeof baseValue !== "undefined") {
                defaultSet.forEach(e => {
                    (this as IKeyValue)[key][e] = baseValue;
                });
            }
        }

        submit () {
            let from = "local";
            this.PrependAppendLanguage("prepend", 0, [21, 13, 28]);
            this.PrependAppendLanguage("prepend", 1, [19, 20, 14, 29]);
            this.PrependAppendLanguage("prepend", 3, [23, 24, 27]);
            this.PrependAppendLanguage("append", 3, [23, 24, 27]);
            this.PrependAppendLanguage("append", 0, [21, 13, 28]);
            this.PrependAppendLanguage("append", 1, [19, 20, 14, 29]);
            const id = this.id;
            const sendObj: any = { imageData: {} };
            const prependDTO: IPrefileDTOPayload = {
                payload: [],
                problemId: id
            };
            Object.keys(this.prepend).forEach(e => {
                if (this.prepend[e].trim().length > 0) {
                    prependDTO.payload.push({
                        language: parseInt(e),
                        code: this.prepend[e]
                    });
                }
            });
            const appendDTO: IPrefileDTOPayload = {
                payload: [],
                problemId: id
            };
            Object.keys(this.append).forEach(e => {
                if (this.append[e].trim().length > 0) {
                    appendDTO.payload.push({
                        language: parseInt(e),
                        code: this.append[e]
                    });
                }
            });
            for (const i of this.$children) {
                if (typeof i.markdownIt === "undefined") {
                    continue;
                }
                const target = i.$vnode.data.model;
                sendObj[target.expression] = target.value;
                sendObj.imageData[target.expression] = i.markdownIt.__image || {};
            }

            sendObj["time"] = this.time;
            sendObj["memory"] = this.memory;
            sendObj["title"] = this.title;
            sendObj["sampleinput"] = this.sampleinput;
            sendObj["sampleoutput"] = this.sampleoutput;
            sendObj["spj"] = Number(this.spj);
            sendObj["hint"] = this.hint;
            const labels = this.label;

            sendObj["label"] = unique(labels).join(" ");
            this.axios.post(`/api/problem/${this.source}/${id}`, { json: sendObj })
                .then(({ data }) => {
                    if (data.status === "OK") {
                        this.axios.get(`/api/problem/${from}?id=${id}`);
                        alert("提交成功");
                    }
                });
            console.log(prependDTO);
            console.log(appendDTO);
            this.axios.post("/api/problem/prefile/prepend", prependDTO);
            this.axios.post("/api/problem/prefile/append", appendDTO);
        }

        imageHandler (key: number | string, data: any) {
            const map: IMavonEditorVueComponent = {
                "0": "description",
                "1": "input",
                "2": "output",
                "3": "hint"
            };
            let mx = -1;
            const that = this;
            _.forEach(data.data, (val, idx) => {
                (this.$refs[map[key]] as any).markdownIt.image_add_with_check(val.name, val.data);
                mx = Math.max(mx, parseInt(val.name));
            });
            (this.$refs[map[key]] as any).$children[0].num = mx + 1;
            (this.$refs[map[key]] as any).iRender();
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
            this.initPrependAppendCode("prepend", "prepend");
            this.initPrependAppendCode("append", "append");
        }

        initPrependAppendCode (target: string, scheme: string) {
            this.axios.get(`/api/problem/prefile/${scheme}/${this.id}`)
                .then(({ data }) => {
                    data = data.data;
                    if (data.payload && data.payload.length && data.payload.length > 0) {
                        const payload: IPrependAppendPayload[] = data.payload;
                        payload.forEach(e => {
                            (this as IKeyValue)[target][e.language] = e.code;
                        });
                    }
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
