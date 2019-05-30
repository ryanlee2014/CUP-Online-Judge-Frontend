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
                    <select multiple class="ui search dropdown label selection"  @change="label = select('.label.selection.ui.dropdown').dropdown('get value');">
                        <option :key="lb" v-for="lb in all_label" :value="lb" v-text="lb"></option>
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
                <div class="column"  style="margin: auto">
                    <div class="ui toggle checkbox">
                        <input type="checkbox" :checked="spj" v-model="spj">
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
                <mavon-editor v-model="description" :markInstance="descriptionInstance"></mavon-editor>
            </div>
            <br>
            <div class="row">
                <h2 class="ui header">
                    Input
                </h2>
            </div>
            <div class="row">
                <mavon-editor v-model="input" :markInstance="inputInstance"></mavon-editor>
            </div>
            <br>
            <div class="row">
                <h2 class="ui header">
                    Output
                </h2>
            </div>
            <div class="row">
                <mavon-editor v-model="output" :markInstance="outputInstance"></mavon-editor>
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
                <a :key="file_name" class="ui label" v-for="file_name in files">{{file_name}}</a>
            </div>
            <div class="row">
                <h2 class="ui header">
                    Prepend Code
                </h2>
            </div>
            <div class="row">
                <div class="four wide column">
                    <div class="ui attached vertical fluid pointing menu" style="height: 370px; overflow-y: scroll; overflow-x: hidden;">
                        <a class="item">C
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">GNU C99/C11 LLVM Clang</div>
                        </a>
                        <a class="item">C++
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">GNU C++11/C++89/C++17 LLVM Clang++</div>
                        </a>
                        <a class="item">Pascal
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">fpc Pascal</div>
                        </a>
                        <a class="item">Java
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">openJDK 1.6/1.7/1.8/1.10</div>
                        </a>
                        <a class="item">JavaScript
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">NodeJS 10.13.0</div>
                        </a>
                        <a class="item">Python
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">Python 2.7/3.6 PyPy2/3</div>
                        </a>
                        <a class="item">C#
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">Mono</div>
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
                    <div class="ui attached vertical fluid pointing menu" style="height: 370px; overflow-y: scroll; overflow-x: hidden;">
                        <a class="item">C
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">GNU C99/C11 LLVM Clang</div>
                        </a>
                        <a class="item">C++
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">GNU C++11/C++89/C++17 LLVM Clang++</div>
                        </a>
                        <a class="item">Pascal
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">fpc Pascal</div>
                        </a>
                        <a class="item">Java
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">openJDK 1.6/1.7/1.8/1.10</div>
                        </a>
                        <a class="item">JavaScript
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">NodeJS 10.13.0</div>
                        </a>
                        <a class="item">Python
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">Python 2.7/3.6 PyPy2/3</div>
                        </a>
                        <a class="item">C#
                            <div class="ui right floated" style="opacity: 0.4; margin-top: 8px; font-size: 0.7em; ">Mono</div>
                        </a>
                    </div>
                </div>
                <div class="ten wide column"></div>
            </div>
            <div class="row"  v-if="from === 'local'">
                <h2 class="ui header">
                    Hint
                </h2>
            </div>
            <div class="row" v-if="from === 'local'">
                <mavon-editor v-model="hint" :markInstance="hintInstance" :test="'1'"></mavon-editor>
            </div>
            <a class="ui button" @click="submit">提交</a>
        </div>

    </div>
</template>

<script>
import mixins from "../../mixin/init";
import markdownIt from "../../lib/markdownIt/markdownIt";
const $ = require("jquery");
const _ = require("lodash");
window.$ = window.jQuery = $;
export default {
    name: "edit",
    mixins: [mixins],
    data: function () {
        const d = {};
        return {
            title: "",
            description: "",
            time: "",
            memory: "",
            input: "",
            output: "",
            spj: false,
            sampleinput: d.sample_input,
            sampleoutput: d.sample_output,
            descriptionInstance: markdownIt.newInstance(),
            inputInstance: markdownIt.newInstance(),
            outputInstance: markdownIt.newInstance(),
            hintInstance: markdownIt.newInstance(),
            hint: d.hint,
            source: "",
            from: "local",
            label: d.label ? d.label.split(" ") : [],
            all_label: [],
            files: [],
            id: this.$route.params.problem_id,
            select: $
        };
    },
    methods: {
        submit: function () {
            let from = "local";
            const id = this.id;
            var send_obj = { imageData: {} };
            for (var i of this.$children) {
                var target = i.$vnode.data.model;
                send_obj[target.expression] = target.value;
                send_obj.imageData[target.expression] = i.markdownIt.__image || {};
            }

            send_obj["time"] = this.time;
            send_obj["memory"] = this.memory;
            send_obj["title"] = this.title;
            send_obj["sampleinput"] = this.sampleinput;
            send_obj["sampleoutput"] = this.sampleoutput;
            send_obj["spj"] = Number(this.spj);
            var labels = this.label;
            function unique (array) {
                var res = array.filter(function (item, index, array) {
                    return array.indexOf(item) === index;
                });
                return res;
            }

            send_obj["label"] = unique(labels).join(" ");
            $.post("/api/problem/" + this.source + "/" + id, { json: send_obj }, function (data) {
                if (data.status == "OK") {
                    $.get("/api/problem/" + from + "?id=" + id);
                    alert("提交成功");
                }
            });
        },
        imageHandler: function (key, data) {
            var mx = 0;
            var that = this;
            that.$children[key].markdownIt.__image = {};
            _.forEach(data.data, function (val, idx) {
                that.$children[key].markdownIt.__image[val.name] = val.data;
                mx = Math.max(mx, parseInt(val.name));
            });
            that.$children[key].$children[0].num = mx + 1;
            that.$children[key].iRender();
        },
        initData: function () {
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
                    $.get("/api/problem/" + this.source + "/?label=true", function (data) {
                        that.all_label = data.data;
                        let has_label = that.label;
                        $(".label.selection.ui.dropdown")
                            .dropdown({
                                allowAdditions: true
                            })
                            .on("click", function () {
                                that.label = $(".label.selection.ui.dropdown").dropdown("get value");
                            });
                        for (let i = 0; i < has_label.length; ++i) {
                            $(".label.selection.ui.dropdown").dropdown("set selected", has_label[i]);
                        }
                    });
                    $.get("/api/photo/description/" + id, function (data) {
                        if (data.status == "OK") {
                            that.imageHandler(0, data);
                        }
                    });
                    $.get("/api/photo/input/" + id, function (data) {
                        if (data.status == "OK") {
                            that.imageHandler(1, data);
                        }
                    });
                    $.get("/api/photo/output/" + id, function (data) {
                        if (data.status == "OK") {
                            that.imageHandler(2, data);
                        }
                    });
                    $.get("/api/photo/hint/" + id, function (data) {
                        if (data.status == "OK") {
                            that.imageHandler(3, data);
                        }
                    });
                    $.get("/api/file/" + id, function (data) {
                        that.files = data.data;
                    });
                });
        }
    },
    mounted: function () {
        document.title = `Problem ${this.id} Edit -- ${document.title}`;
        this.initData();
    }
};
</script>

<style scoped>

</style>
