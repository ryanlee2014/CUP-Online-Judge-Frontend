<template>
    <div class="ui container" id="cmod" v-if="contest_mode || limit">
        <ContestMode v-if="contest_mode"></ContestMode>
        <LimitHostname :address="address" v-if="limit"></LimitHostname>
    </div>
    <div class="main screen" v-else>
        <ConfirmModal :confirm_text="confirm_text"></ConfirmModal>
        <TestrunView :hide_warning="hide_warning" :sampleinput="sampleinput"
                     :sampleoutput="sampleoutput" :submitDisabled="submitDisabled" :test_run="test_run"
                     v-model="test_run_sampleinput"></TestrunView>
        <div class="main submit layout">
            <singlePageProblemView
                :accepted="accepted"
                :bodyOnTop="bodyOnTop"
                :description="description"
                :hint="hint"
                :input="input"
                :isadmin="isadmin"
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
                :uploader="uploader" v-show="single_page">
            </singlePageProblemView>
            <sideProblemView :accepted="accepted" :append="append" :description="description" :do_submit="do_submit"
                             :hint="hint"
                             :input="input" :isadmin="isadmin" :iseditor="iseditor"
                             :lang_list="lang_list" :memory="memory" :normal_problem="normal_problem"
                             :original_id="original_id"
                             :output="output" :pre_test_run="pre_test_run"
                             :prepend="prepend" :problem_id="problem_id" :sampleinput="sampleinput"
                             :sampleoutput="sampleoutput" :source="source"
                             :source_code="source_code" :spj="spj" :submit="submit"
                             :submitDisabled="submitDisabled"
                             :switch_screen="switch_screen" :time="time" :title="temp_title" :uploader="uploader"
                             v-show="!single_page">

            </sideProblemView>
        </div>
    </div>

</template>

<script>
import singlePageProblemView from "../../components/submit/singlePageProblemView";
import sideProblemView from "../../components/submit/sideProblemView";
import TestrunView from "../../components/submit/testrunView";
import markdownIt from "../../lib/markdownIt/markdownIt";
import Fingerprint2 from "fingerprintjs2";
import ContestMode from "../../components/contestMode/block";
import LimitHostname from "../../components/contestMode/limitHostname";
import mixins from "../../mixin/init";
import Middleware from "../../module/Middleware/core";
import ConfirmModal from "../../components/submit/modal/confirms";
const doc = document.createElement("div");
const dayjs = require("dayjs");
const Clipboard = require("clipboard");
const _ = require("lodash");
let $ = window.$ = window.jQuery = require("jquery");
let $modal;
require("../../static/js/semantic.min");
export default {
    name: "submitter",
    mixins: [mixins],
    components: {
        TestrunView,
        singlePageProblemView,
        sideProblemView,
        ContestMode,
        LimitHostname,
        ConfirmModal
    },
    data: function () {
        return {
            bodyOnTop: true,
            isRenderBodyOnTop: false,
            temp_title: "",
            problem_id: 0,
            contest_mode: false,
            limit: false,
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
            address: "",
            sampleoutput: "",
            test_run_sampleinput: "",
            test_run_sampleoutput: "",
            hint: "",
            fingerprint: "",
            fingerprintRaw: "",
            submit: "",
            accepted: "",
            source: "",
            show_style: "preview",
            not_show_toolbar: false,
            spj: false,
            single_page: false,
            source_code: "",
            language_name: "",
            prepend: {},
            append: {},
            langmask: 0,
            isadmin: false,
            iseditor: false,
            share: false,
            selected_language: 0,
            language_template: [],
            fontSize: 18,
            hide_warning: true,
            confirm_text: "",
            submitDisabled: false,
            resume_time: 0,
            finished: false
        };
    },
    mounted () {
        document.title = `Problem ${this.problem_id} -- ${document.title}`;
        this.$store.commit("setCodeInfo", { code: "" });
        this.asyncFunc();
        this.registerSocketListener();
    },
    updated () {
        const that = this;
        this.$nextTick(() => {
            if (that.single_page && !that.isRenderBodyOnTop) {
                that.isRenderBodyOnTop = true;
                $(".ui.vertical.segment.single")
                    .visibility({
                        once: false,
                        offset: 20,
                        observeChanges: false,
                        continuous: true,
                        refreshOnLoad: true,
                        refreshOnResize: true,
                        onTopPassed: function (val) {
                            that.bodyOnTop = val.topVisible;
                        },
                        onTopPassedReverse: function (val) {
                            that.bodyOnTop = val.topVisible;
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
                $("#Submit")
                    .popup({
                        position: "top center",
                        title: "本题包含前后置代码",
                        content: "本题仅需提交代码中需要补充的部分，无需将前后置代码一同填入提交框提交,判题机会自动补充前后置代码到你编写的程序"
                    });
            }
        });
    },
    methods: {
        convertHTML (html) {
            doc.innerText = html;
            return doc.innerHTML.split(" ").join("&nbsp;");
        },
        bindClipboard () {
            const copyContent = new Clipboard(".copy.context", {
                text: function (trigger) {
                    return $(trigger).parent().next().text().trim();
                }
            });
            copyContent.on("success", function (e) {
                $(e.trigger)
                    .popup({
                        title: "Finished",
                        content: "Context is in your clipboard",
                        on: "click"
                    })
                    .popup("show");
            });
        },
        asyncFunc: async function () {
            let copyParams = JSON.parse(JSON.stringify(this.$route.params));
            let { problem_id, contest_id, topic_id, num, solution_id } = copyParams;
            let parseData = {
                id: problem_id,
                cid: contest_id,
                tid: topic_id,
                pid: num,
                sid: solution_id
            };
            this.escapeParameter(parseData);
            await new Promise(resolve => {
                this.axios.get("/api/problem/local", { params: parseData })
                    .then(({ data }) => {
                        if (data.status === "error") {
                            if (data.statement) {
                                alert(data.statement);
                            }
                            this.contest_mode = data.contest_mode;
                            this.limit = false;
                            return;
                        }
                        let addr = data.limit_hostname;
                        if (data.isadmin) {
                            addr = null;
                        }
                        if (addr && location.href.indexOf("addr") === -1) {
                            this.limit = true;
                            this.contest_mode = false;
                            this.address = addr;
                            return;
                        }
                        const d = data.problem;
                        const sourceCode = data.source;
                        const iseditor = data.editor;
                        const isadmin = data.isadmin;
                        this.$store.commit("setCodeInfo", { code: sourceCode });
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
                            source_code: sourceCode,
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
                            finished: false
                        };
                        if (_data.input && _data.input.indexOf(".in") !== -1) {
                            _data.input += "\n\n**(输入文件不需要用户调用文件操作，仅需使用标准输入输出即可)**";
                        }
                        if (_data.output && _data.output.indexOf(".out") !== -1) {
                            _data.output += "\n\n**(输出文件不需要用户调用文件操作，仅需使用标准输入输出即可)**";
                        }
                        if (this.$route.params.problem_id) {
                            _data.problem_id = d.problem_id;
                        }
                        else {
                            _data.problem_id = 1001 + parseInt(this.$route.params.num);
                        }
                        document.title = _data.problem_id + ":" + _data.temp_title + " -- CUP Online Judge";
                        Object.assign(this, _data);
                        $(".not-compile").removeClass("not-compile");
                        resolve();
                    });
            });
            this.markdownItRender();
            this.bindClipboard();
            $modal = $(".ui.basic.confirms.modal");
        },
        escapeParameter: function (val) {
            for (let i in val) {
                if (val.hasOwnProperty(i) && typeof val[i] === "undefined") {
                    delete val[i];
                }
            }
        },
        markdownItRender: function () {
            const that = this;
            const id = this.original_id;
            let descriptionMarkdownIt = this.descriptionMarkdownIt = markdownIt.newInstance("description", that.original_id);
            let inputMarkdownIt = this.inputMarkdownIt = markdownIt.newInstance("input", that.original_id);
            let outputMarkdownIt = this.outputMarkdownIt = markdownIt.newInstance("output", that.original_id);
            let hintMarkdownIt = this.hintMarkdownIt = markdownIt.newInstance("hint", that.original_id);
            $.get("/api/photo/description/" + id, function (data) {
                if (data.status === "OK") {
                    descriptionMarkdownIt.__image = {};
                    _.forEach(data.data, function (val) {
                        descriptionMarkdownIt.__image[val.name] = val.data;
                        that.description = descriptionMarkdownIt.render(that.original_content.description || "");
                    });
                }
            });
            $.get("/api/photo/input/" + id, function (data) {
                if (data.status === "OK") {
                    inputMarkdownIt.__image = {};
                    _.forEach(data.data, function (val) {
                        inputMarkdownIt.__image[val.name] = val.data;
                        that.input = inputMarkdownIt.render(that.original_content.input || "");
                    });
                }
            });
            $.get("/api/photo/output/" + id, function (data) {
                if (data.status === "OK") {
                    outputMarkdownIt.__image = {};
                    _.forEach(data.data, function (val) {
                        outputMarkdownIt.__image[val.name] = val.data;
                        that.output = outputMarkdownIt.render(that.original_content.output || "");
                    });
                }
            });
            $.get("/api/photo/hint/" + id, function (data) {
                if (data.status === "OK") {
                    hintMarkdownIt.__image = {};
                    _.forEach(data.data, function (val) {
                        hintMarkdownIt.__image[val.name] = val.data;
                        that.hint = hintMarkdownIt.render(that.original_content.hint || "");
                    });
                }
            });
            Fingerprint2.get(function (components) {
                let values = components.map(function (component) {
                    return component.value;
                });
                that.fingerprintRaw = Fingerprint2.x64hash128(values.join(""), 31);
                $.get("/api/status/ip", function (data) {
                    const ip = data.ip;
                    values.push(ip);
                    that.fingerprint = Fingerprint2.x64hash128(values.join(""), 31);
                });
            });

            this.description = descriptionMarkdownIt.render(this.description || "");
            this.input = inputMarkdownIt.render(this.input || "");
            this.output = outputMarkdownIt.render(this.output || "");
            this.hint = hintMarkdownIt.render(this.hint || "");
        },
        switch_screen: function () {
            this.single_page = !this.single_page;
            document.documentElement.scrollTop = 0;
            if (this.single_page) {
                $(".topmenu").css({
                    borderBottom: "none",
                    boxShadow: "none"
                });
            }
            else {
                $(".topmenu").css({
                    borderBottom: "",
                    boxShadow: ""
                });
            }
        },
        codeTooShort (options, next) {
            let ret;
            if (this.$store.getters.code.length < 15) {
                this.confirm_text += "<h2><div style=\"text-align: center;\">代码过短</div></h2>";
                ret = true;
            }
            else {
                ret = false;
            }
            if (typeof next === "function") {
                next();
            }
            return ret;
        },
        isCLanguage (options, next) {
            const languageName = require("../../type/index.json").language_name.local;
            const cRegex = /C[A-Za-z0-9]+/;
            let ret;
            ret = cRegex.test(languageName[this.$store.getters.language]);
            if (typeof next === "function") {
                next();
            }
            return ret;
        },
        checkCppButInCLanguage (options, next) {
            const code = this.$store.getters.code;
            const cppRegex = /#include[\s]+?[<"][a-zA-Z]{1,20}[>"]/;
            let ret;
            if (cppRegex.test(code) && this.isCLanguage()) {
                ret = true;
                this.confirm_text += "<h2><div style=\"text-align: center;\">您提交的代码包含C++的头文件，而您选择的语言为C。是否提交?</div></h2>";
            }
            else {
                ret = false;
            }
            if (typeof next === "function") {
                next();
            }
            return ret;
        },
        initConfirms (options, next) {
            this.confirm_text = "";
            if (typeof next === "function") {
                next();
            }
        },
        ModalPopup (options, next) {
            if (this.confirm_text && this.confirm_text.length && this.confirm_text.length) {
                $modal.modal({
                    offset: 400,
                    onApprove: next
                }).modal("show");
            }
            else {
                next();
            }
        },
        do_submit: function () {
            if (!this.$socket.connected) {
                alert("WebSocket服务未启动，请等待服务启动后提交\nWebSocket服务启动标志未:\n右上角显示在线人数");
                return;
            }
            this.hide_warning = true;
            const middleware = new Middleware();
            middleware
                .use(this.initConfirms)
                .use(this.codeTooShort)
                .use(this.checkCppButInCLanguage)
                .use(this.ModalPopup)
                .use(this.presubmit);
            middleware.commit();
        },
        presubmit: function () {
            let that = this;
            const submitLanguage = parseInt(this.$store.getters.language);
            if (!this.checkJava(submitLanguage)) {
                return;
            }
            let type = "problem";
            if (!isNaN(this.$route.params.contest_id)) {
                type = "contest";
            }
            else if (!isNaN(this.$route.params.topic_id)) {
                type = "topic";
            }
            this.submitDisabled = true;
            $(".ui.teal.progress").show();
            $(".progess_text").text("提交");
            const $progressResult = $(".progress.result");
            $progressResult.progress({
                percent: 0
            });
            $progressResult.progress("set active");
            let postdata = {
                id: this.$route.params.problem_id,
                cid: this.$route.params.contest_id,
                tid: this.$route.params.topic_id,
                pid: this.$route.params.num,
                input_text: this.test_run_sampleinput,
                language: submitLanguage,
                source: this.$store.getters.code,
                share: this.$store.getters.share,
                type: type,
                fingerprintRaw: that.fingerprintRaw,
                fingerprint: that.fingerprint
            };
            this.$socket.emit("submit", {
                submission_id: "",
                val: postdata
            });
        },
        error_callback: function (data) {
            alert(data.statement);
            this.resume();
            $(".ui.teal.progress").hide();
        },
        resume: function () {
            if (--this.resume_time <= 0) {
                this.submitDisabled = false;
                clearInterval(window.handler_interval);
            }
            else {
                window.handler_interval = setTimeout(this.resume, 1000);
            }
        },
        checkJava: function (submit_language) {
            let code;
            switch (submit_language) {
            case 3:
            case 23:
            case 24:
            case 27:
                code = this.$store.getters.code;
                if (code.indexOf("Main") === -1 || code.indexOf("main") === -1 || code.indexOf("package") !== -1) {
                    alert("Java语言提交时必须使用Main作为主类\n使用static main作为入口函数\n并且不能存在包名(如package helloworld)");
                    return false;
                }
                return true;
            default:
                return true;
            }
        },
        pre_test_run: function () {
            if (!this.$socket || (this.$socket && !this.$socket.connected)) {
                alert("WebSocket服务未启动，请等待服务启动后提交\nWebSocket服务启动标志未:\n右上角显示在线人数");
                return;
            }
            let now = parseInt(dayjs() + "");
            localStorage.setItem("test_run_time", now + 300 * 1000);
            let submit_language = parseInt(this.$store.getters.language);
            if (!this.checkJava(submit_language)) {
                return;
            }
            let that = this;
            if (this.$store.getters.code.length < 15) {
                $(".ui.basic.confirms.modal")
                    .modal({
                        offset: 400,
                        onShow: function () {
                            that.confirm_text = "<h2><center>代码过短</center></h2>";
                        }
                    })
                    .modal("show");
                return;
            }
            $("#test_run_modal")
                .modal({
                    blurring: false
                })
                .modal("show");
        },
        test_run: function () {
            const that = this;
            $("#out").html("样例输出为:\n" + this.sampleoutput);
            if (that.test_run_sampleinput && that.test_run_sampleinput.length > 1000) {
                alert("测试运行输入用例长度不能超过1000字!");
                return;
            }
            if (window.handler_interval) window.clearInterval(window.handler_interval);
            if (this.$store.getters.code.length < 10) return alert("too short!");
            let type = "problem";
            if (!isNaN(this.$route.params.contest_id)) {
                type = "contest";
            }
            else if (!isNaN(this.$route.params.topic_id)) {
                type = "topic";
            }
            this.hide_warning = true;
            let postdata;
            if (typeof this.$socket === "object") {
                postdata = {
                    id: -Math.abs(parseInt(this.$route.params.problem_id)) || -Math.abs(parseInt(that.original_id)),
                    cid: -Math.abs(parseInt(this.$route.params.contest_id)) || null,
                    tid: -Math.abs(parseInt(this.$route.params.topic_id)) || null,
                    pid: this.$route.params.num,
                    share: this.share,
                    input_text: this.test_run_sampleinput,
                    language: this.$store.getters.language,
                    source: this.$store.getters.code,
                    type: type,
                    fingerprint: that.fingerprint,
                    fingerprintRaw: that.fingerprintRaw
                };
            }
            this.$socket.emit("submit", {
                submission_id: "",
                val: postdata
            });

            this.submitDisabled = true;
            this.resume_time = 20;
            window.handler_interval = setTimeout(that.resume, 1000);
            $("#test_run_modal").modal("set").clickaway();
        },
        registerSocketListener: function () {
            this.sockets.subscribe("result", (data) => {
                this.wsresult(data);
                this.wsfs_result(data);
            });
            this.sockets.subscribe("reject_submit", (data) => {
                this.error_callback(data);
            });
        },
        wsresult: function (data) {
            // let res = data.split(',');
            const judge_result = [
                "等待",
                "等待重判",
                "编译中",
                "运行并评判",
                "答案正确",
                "格式错误",
                "答案错误",
                "时间超限",
                "内存超限",
                "输出超限",
                "运行错误",
                "编译错误",
                "编译成功",
                "运行完成",
                "已加入队列",
                "提交被拒绝",
                "系统错误",
                ""
            ];
            const that = this;
            let status = parseInt(data["state"]);
            let compileInfo = data["compile_info"];
            let passPoint = data["pass_point"];
            let time = data["time"];
            let memory = data["memory"];
            let sim = data.sim;
            let simSourceID = data.sim_s_id;
            let passRate = (data["pass_rate"] ? data["pass_rate"] : 1) * 100;
            let $progressResult = $(".progress.result");
            if (status > 3) {
                this.submitDisabled = false;
                this.resume();
            }
            if (status > 4 && status !== 13) {
                $("#right-side").transition("shake");
            }
            if (status === 0) {
                $(".progess_text").text(judge_result[status]);
                // setTimeout("frush_result(" + runner_id + ")", 250);
                $progressResult.progress({
                    percent: 20
                });
            }
            else if (status === 2) {
                $(".progess_text").text(judge_result[status]);
                // setTimeout("frush_result(" + runner_id + ")", 250);
                $progressResult.progress({
                    percent: 40
                });
            }
            else if (status === 3) {
                $(".progess_text").text(judge_result[status] + " 已通过测试点:" + passPoint + "  通过率:" + passRate.toString().substring(0, 3) + "%");
                // setTimeout("frush_result(" + runner_id + ")", 250);
                $progressResult.progress({
                    percent: 40
                });
            }
            else if (status === 4) {
                // count=0;
                let str = judge_result[status] + " 内存使用:" + memory + "KB 运行时间:" + time + "ms";
                if (sim) {
                    str += " 触发判重 与运行号: " + simSourceID + "代码重复 重复率:" + sim + "%";
                }
                $(".progess_text").text(str);
                $progressResult.progress({
                    percent: 100
                });
                $progressResult.progress("set success");
                let contestID = parseInt(this.$route.params.contest_id);
                if (!isNaN(contestID) && contestID > 1000) {
                    $.get(`/api/contest/rest/${contestID}`, function (data) {
                        let json = data.data;
                        for (let i of json) {
                            for (let j in i) {
                                if (i.hasOwnProperty(j) && i[j] === null) {
                                    i[j] = 0;
                                }
                            }
                        }
                        setTimeout(function () {
                            $(".mainwindow").html("").animate({ width: 0, borderRadius: 0, padding: 0 });
                        }, 500);
                        let str = "<a class='item'><h3>剩下未完成的题目</h3></a>";
                        if (json.length === 0) {
                            str += "<a class='item'><h2>恭喜AK</h2>";
                        }
                        else {
                            json.sort(function (a, b) {
                                if (a["pnum"] > b["pnum"]) return 1;
                                else if (parseInt(a["pnum"]) === parseInt(b["pnum"])) return 0;
                                else return -1;
                            });
                        }
                        for (let i in json) {
                            if (json.hasOwnProperty(i)) {
                                str += "<a class='item' href='" + `/contest/problem/${contestID}/${json[i].pnum}` + "'><div class='ui small teal label'>通过:&nbsp;" + json[i]["accepted"] + "</div><div class='ui small label'>提交:&nbsp;" + json[i]["submit"] + "</div>" + json[i]["pnum"] + " . " + json[i]["title"] + "</a>";
                            }
                        }
                        let plainHTML = "<div id=\"next_problem\"><div class=\"ui massive vertical menu\" style=\"position:relative;float:left;margin-left:20px\">" + str + "</div></div>";
                        const $acMenu = $(".ui.massive.vertical.menu");
                        if ($acMenu.length === 0) {
                            $("#total_control").append(plainHTML);
                        }
                        else {
                            $acMenu.html(str).fadeIn();
                        }
                    });
                }
            }
            else if (status === 5 || status === 6) {
                $(".progess_text").text("在第" + (passPoint + 1) + "个测试点发生 " + judge_result[status] + "  通过率:" + passRate.toString().substring(0, 3) + "%");
                $progressResult.progress({
                    percent: 100
                });
                $progressResult.progress("set error");
            }
            else if (status === 13) {
                if (typeof compileInfo !== "undefined") compileInfo = this.nl2br(compileInfo);
                else compileInfo = "";
                $(".progess_text").text("在第" + (passPoint + 1) + "个测试点发生 " + judge_result[status] + " 内存使用:" + memory + "KB 运行时间:" + time + "ms");
                compileInfo = compileInfo.split(" ").join("&nbsp;");
                if (compileInfo && compileInfo.trim().length > 0) {
                    $(".compile.header").html("<br>" + compileInfo);
                    $(".warning.message").show();
                }
                $progressResult.progress({
                    percent: 100
                });
                $progressResult.progress("set warning");
            }
            else {
                if (typeof compileInfo !== "undefined") compileInfo = "<br>" + this.convertHTML(compileInfo);
                else compileInfo = "";
                $(".progess_text").text("在第" + (passPoint + 1) + "个测试点发生 " + judge_result[status] + "  通过率:" + passRate.toString().substring(0, 3) + "%");
                if (compileInfo.length > 0) {
                    $(".compile.header").html(compileInfo);
                    $(".warning.message").show();
                }
                $progressResult.progress({
                    percent: 100
                });
                $progressResult.progress("set warning");
            }
        },
        wsfs_result: function (data) {
            let state = data["state"];
            let testRunResult = data["test_run_result"];
            let compileInfo = this.convertHTML(data["compile_info"]);
            if (state >= 4) {
                if (testRunResult || compileInfo) {
                    $("#out").text("运行结果:\n" + (testRunResult || "") + (compileInfo || ""));
                }
            }
        },
        nl2br: function (str, is_xhtml) {
            let breakTag = (is_xhtml || typeof is_xhtml === "undefined") ? "<br />" : "<br>";
            return (str + "").replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, "$1" + breakTag + "$2");
        }
    },
    computed: {
        lang_list: function () {
            const len = this.language_name.length - 1;
            const _langmask = ~this.langmask;
            let result = [];
            for (let cnt = 0; cnt < len; ++cnt) {
                if (_langmask & (1 << cnt)) {
                    result.push({
                        num: cnt,
                        name: this.language_name[cnt]
                    });
                }
            }
            result.sort(function (a, b) {
                if (a.name < b.name) return -1;
                else if (a.name > b.name) return 1;
                else return 0;
            });
            return result;
        }
    }
};
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
