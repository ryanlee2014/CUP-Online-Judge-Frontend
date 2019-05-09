<template>
    <div class="ui container">
        <div class="main screen">
            <div class="main submit layout">
                <single-page-problem-view
                        :accepted="accepted"
                        :bodyOnTop="bodyOnTop"
                        :description="description"
                        :hint="hint"
                        :input="input"
                        :iseditor="iseditor"
                        :memory="memory"
                        :normal_problem="normal_problem"
                        :original_id="original_id"
                        :output="output"
                        :problem_id="problem_id"
                        :sampleinput="sampleinput"
                        :sampleoutput="sampleoutput"
                        :source="source"
                        :spj="spj"
                        :submit="submit"
                        :switch_screen="switch_screen"
                        :time="time"
                        :title="temp_title"
                        :uploader="uploader">
                </single-page-problem-view>
            </div>
        </div>
    </div>
</template>

<script>
    import singlePageProblemView from '../../components/submit/singlePageProblemView'
    import markdownIt from '../../lib/markdownIt/markdownIt'
    import Fingerprint2 from 'fingerprintjs2'

    const _ = require("lodash");
    const $ = require("jquery");
    export default {
        name: "submitter",
        components: {
            singlePageProblemView
        },
        data: function () {
            return {
                bodyOnTop: true,
                isRenderBodyOnTop: false,
                temp_title: "",
                problem_id: 0,
                original_id: 0,
                iscontest: false,
                normal_problem: !this.$route.params.contest_id && !this.$route.params.topic_id,
                description: "",
                original_content: {
                    description: "",
                    input: "",
                    output: "",
                    hint: ""
                },
                time: "",
                memory: "",
                input: "",
                output: "",
                uploader: "",
                sampleinput: "",
                sampleoutput: "",
                test_run_sampleinput: "",
                test_run_sampleoutput: "",
                hint: "",
                fingerprint: "",
                auto_detect: false,
                fingerprintRaw: "",
                submit: "",
                accepted: "",
                source: "",
                show_style: "preview",
                not_show_toolbar: false,
                spj: false,
                single_page: true,
                source_code: "",
                language_name: "",
                prepend: [],
                append: [],
                langmask: 0,
                isadmin: false,
                iseditor: false,
                share: false,
                sselected_language: 0,
                language_template: [],
                fontSize: 18,
                hide_warning: true,
                confirm_text: "",
                submitDisabled: false,
                resume_time: 0,
                finished: false,
                current_prepend: "",
                current_append: ""
            };
        },
        mounted() {
            this.asyncFunc();
        },
        updated() {
            const that = this;
            this.$nextTick(function () {
                if (that.single_page && !that.isRenderBodyOnTop) {
                    that.isRenderBodyOnTop = true;
                    $('.ui.vertical.center.aligned.segment.single')
                        .visibility({
                            once: false,
                            offset: 30,
                            observeChanges: false,
                            continuous: false,
                            refreshOnLoad: true,
                            refreshOnResize: true,
                            onTopPassedReverse: function () {
                                that.bodyOnTop = true;
                            },
                            onTopPassed: function () {
                                that.bodyOnTop = false;
                            }
                        });
                    that.bodyOnTop = true;
                }
                if (!that.single_page) {
                    $("#left-side").css({
                        height: $("#right-side").height()
                    });
                }
                if (that.prepend || that.append) {
                    $('#Submit')
                        .popup({
                            position: 'top center',
                            title: '本题包含前后置代码',
                            content: '本题仅需提交代码中需要补充的部分，无需将前后置代码一同填入提交框提交,判题机会自动补充前后置代码到你编写的程序'
                        })
                    ;
                }
            })
        },
        methods: {
            asyncFunc: async function () {
                let temp_object = JSON.parse(JSON.stringify(this.$route.params));
                for (let i in temp_object) {
                    if (typeof temp_object[i] === "undefined") {
                        temp_object[i] = "";
                    }
                }
                let {problem_id, contest_id, topic_id, num} = temp_object;
                await new Promise((resolve => {
                    this.axios.get(`/api/problem/local?id=${problem_id}&cid=${contest_id}&tid=${topic_id}&num=${num}`)
                        .then(({data}) => {
                            const d = data.problem;
                            const source_code = data.source;
                            const iseditor = data.editor;
                            const isadmin = data.isadmin;
                            let _data = {
                                temp_title: d.title,
                                problem_id: d.problem_id,
                                original_id: d.problem_id,
                                iscontest: !!this.$route.params.contest_id,
                                description: d.description,
                                original_content: {
                                    description: d.description,
                                    input: d.input,
                                    output: d.output,
                                    hint: d.hint
                                },
                                time: "时间限制:" + d.time_limit + "秒",
                                memory: "内存限制:" + d.memory_limit + "MB",
                                input: d.input,
                                output: d.output,
                                uploader: d.uploader,
                                sampleinput: d.sample_input,
                                sampleoutput: d.sample_output,
                                test_run_sampleinput: d.sample_input,
                                test_run_sampleoutput: d.sample_output,
                                hint: d.hint,
                                fingerprint: "",
                                auto_detect: false,
                                fingerprintRaw: "",
                                submit: "提交:" + d.submit,
                                accepted: "正确:" + d.accepted,
                                source: d.source,
                                show_style: "preview",
                                not_show_toolbar: false,
                                spj: Boolean(parseInt(d.spj)),
                                single_page: false,
                                bodyOnTop: true,
                                isRenderBodyOnTop: false,
                                source_code: source_code,
                                language_name: d.language_name,
                                prepend: d.prepend,
                                append: d.append,
                                langmask: d.langmask,
                                isadmin: isadmin,
                                iseditor: iseditor,
                                share: false,
                                selected_language: localStorage.getItem("lastlang") && Boolean(1 << parseInt(localStorage.getItem("lastlang")) & (~d.langmask)) ? parseInt(localStorage.getItem("lastlang")) : Math.log2(~d.langmask & -~d.langmask),
                                language_template: d.language_template,
                                fontSize: 18,
                                hide_warning: true,
                                confirm_text: "",
                                submitDisabled: false,
                                resume_time: 0,
                                finished: false,
                                current_prepend: "",
                                current_append: ""
                            };
                            if (_data.input && _data.input.indexOf(".in") !== -1) {
                                _data.input += '\n\n**(输入文件不需要用户调用文件操作，仅需使用标准输入输出即可)**'
                            }
                            if (_data.output && _data.output.indexOf(".out") !== -1) {
                                _data.output += '\n\n**(输出文件不需要用户调用文件操作，仅需使用标准输入输出即可)**'
                            }
                            if (this.$route.params.problem_id) {
                                _data.problem_id = d.problem_id;
                            } else {
                                _data.problem_id = 1001 + parseInt(this.$route.params.num);
                            }
                            if (_data.prepend && _data.prepend[_data.selected_language]) {
                                _data.current_prepend = _data.prepend[_data.selected_language];
                            }
                            if (_data.append && _data.append[_data.selected_language]) {
                                _data.current_append = _data.append[_data.selected_language];
                            }
                            $("title").html(_data.problem_id + ":" + _data.temp_title + " -- CUP Online Judge");
                            Object.assign(this, _data);
                            $(".not-compile").removeClass("not-compile");
                            resolve();
                        })
                }));
                this.markdownItRender();
            },
            markdownItRender: function () {
                const that = this;
                const id = this.original_id;
                var descriptionMarkdownIt = this.descriptionMarkdownIt = markdownIt.newInstance("description", that.original_id);
                var inputMarkdownIt = this.inputMarkdownIt = markdownIt.newInstance("input", that.original_id);
                var outputMarkdownIt = this.outputMarkdownIt = markdownIt.newInstance("output", that.original_id);
                var hintMarkdownIt = this.hintMarkdownIt = markdownIt.newInstance("hint", that.original_id);
                $.get("/api/photo/description/" + id, function (data) {
                    if (data.status == "OK") {
                        descriptionMarkdownIt.__image = {};
                        _.forEach(data.data, function (val) {
                            descriptionMarkdownIt.__image[val.name] = val.data;
                            that.description = descriptionMarkdownIt.render(that.original_content.description || '');
                        });
                    }
                });
                $.get("/api/photo/input/" + id, function (data) {
                    if (data.status == "OK") {
                        inputMarkdownIt.__image = {};
                        _.forEach(data.data, function (val) {
                            inputMarkdownIt.__image[val.name] = val.data;
                            that.input = inputMarkdownIt.render(that.original_content.input || '');
                        });
                    }
                });
                $.get("/api/photo/output/" + id, function (data) {
                    if (data.status == "OK") {
                        outputMarkdownIt.__image = {};
                        _.forEach(data.data, function (val) {
                            outputMarkdownIt.__image[val.name] = val.data;
                            that.output = outputMarkdownIt.render(that.original_content.output || '');
                        });
                    }
                });
                $.get("/api/photo/hint/" + id, function (data) {
                    if (data.status == "OK") {
                        hintMarkdownIt.__image = {};
                        _.forEach(data.data, function (val) {
                            hintMarkdownIt.__image[val.name] = val.data;
                            that.hint = hintMarkdownIt.render(that.original_content.hint || '');
                        });
                    }
                });
                Fingerprint2.get(function (components) {
                    var values = components.map(function (component) {
                        return component.value
                    })
                    that.fingerprintRaw = Fingerprint2.x64hash128(values.join(''), 31);
                    $.get("../api/status/ip", function (data) {
                        var ip = data.ip;
                        values.push(ip);
                        that.fingerprint = Fingerprint2.x64hash128(values.join(''), 31);
                    })
                })

                this.description = descriptionMarkdownIt.render(this.description || '');
                this.input = inputMarkdownIt.render(this.input || '');
                this.output = outputMarkdownIt.render(this.output || '');
                this.hint = hintMarkdownIt.render(this.hint || '');
            },
            switch_screen: function () {
                this.single_page = !this.single_page;
                document.documentElement.scrollTop = 0;
                if (this.single_page) {
                    $(".topmenu").css({
                        borderBottom: "none",
                        boxShadow: "none"
                    });
                } else {
                    $(".topmenu").css({
                        borderBottom: "",
                        boxShadow: ""
                    });
                }
            }
        }
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

    .code {
        width: 50%;
        white-space: pre-wrap;
        border: solid lightgrey 1px
    }
</style>
