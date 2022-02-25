<template>
    <div class="ui container padding">
        <div class="ui grid">
            <div class="row">
                <div class="ui large header">{{$t("export problem")}}</div>
            </div>
            <div class="row">
                <div class="ui eight wide column">
                    <div class="ui action labeled input">
                        <div class="ui label">{{ $t("contest") }}</div>
                        <input v-model="contestId" type="text">
                        <button :class="contestDownloadButtonClass" @click="exportContestProblem">{{ $t("download") }}<div v-if="contestDownloading" class="ui active blue elastic loader"></div></button>
                    </div>
                </div>
            </div>
        </div>
        <div ref="problem" style="display: none">
            <h2 class="ui header">Problem {{original_id}} {{title}}</h2>
            <h3 class='ui header hidden'>{{$t("problem description")}}</h3>
            <div class='ui hidden'><span v-html="description"></span></div>
            <h3 class='ui header hidden'>{{$t("input")}}</h3>
            <div class='ui hidden' v-html="input||''"></div>
            <h3 class='ui header hidden'>{{$t("output")}}</h3>
            <div class='ui hidden' v-html="output||''"></div>
            <h3 class='ui header hidden'>{{$t("sampleinput")}}</h3>
            <div class="ui bottom attached segment hidden sample_input">
                <div class="ui top attached label"><a class="copy context" data-clipboard-target=".sample_input">Copy
                    Sample Input</a></div>
                <pre v-text='sampleinput'></pre>
            </div>
            <h3 class='ui header'>{{$t("sampleoutput")}}</h3>
            <div class="ui bottom attached segment">
                <div class="ui top attached label"><a class="copy context" data-clipboard-target=".sample_output">Copy
                    Sample Output</a></div>
                <pre class='sample_output' v-text='sampleoutput'></pre>
            </div>
            <h3 class='ui header'>{{$t("hint")}}</h3>
            <div class='ui' v-html="hint"></div>
            <h3 class='ui header'>{{$t("from")}}</h3>
            <div class='ui'><p>
                <router-link :to="`/problemset?tag=${encodeURI(source)}`" v-text="source"></router-link>
            </p>
                <p>{{$t("uploader")}}:
                    <router-link v-if="uploader!=='Administrator'" :to="`/user/${uploader}`">{{uploader}}</router-link>
                    <a v-else>Administrator</a>
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import InitMixin from "@/mixin/init";
import HTMLtoDOCX from "html-to-docx";
import { saveAs } from "file-saver";

const tagsToReplace: {[x: string]: string} = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;"
};

function replaceTag (tag: string) {
    return tagsToReplace[tag] || tag;
}

function safe_tags_replace (str: string) {
    return str.replace(/[&<>]/g, replaceTag);
}
@Component
export default class ProblemExport extends Mixins(InitMixin) {
    contestId = "0"

    sockets: any;
    bodyOnTop= true;
    isRenderBodyOnTop= false;
    title= "";
    state= 0;
    judgeInfoText: string = "";
    problem_id= 0;
    contest_mode= false;
    limit= false;
    original_id= 0;
    iscontest= false;
    normal_problem= true;
    description= "";
    original_conten= {
        description: "",
        input: "",
        output: "",
        hint: ""
    };

    time= 0;
    memory= 0;
    input= "";
    output= "";
    uploader= "";
    sampleinput= "";
    address= "";
    sampleoutput= "";
    test_run_sampleinput= "";
    test_run_sampleoutput= "";
    hint= "";
    fingerprint= "";
    fingerprintRaw= "";
    fill_in_blank_problem=0;
    submit= 0;
    accepted= 0;
    source= "";
    show_style= "preview";
    not_show_toolbar= false;
    spj= false;
    single_page= false;
    source_code= "";
    language_name= "";
    prepend= {};
    append= {};
    langmask= 0;
    isadmin= false;
    iseditor= false;
    share= false;
    selected_language= 0;
    language_template= [];
    fontSize= 18;
    hide_warning= true;
    confirm_text= "";
    submitDisabled= false;
    resume_time= 0;
    finished= false;
    source_code_language: any = null;
    timeInterval: any = 0;
    contestDownloading = false;

    get contestDownloadButtonClass () {
        if (this.contestDownloading) {
            return "ui disabled primary button";
        }
        return "ui primary button";
    }

    async exportContestProblem () {
        const fileName = this.contestId;
        this.contestDownloading = true;
        this.axios.get(`/api/contest/problem_info/${this.contestId}`)
            .then(async ({ data }) => {
                const problemList = data.data;
                const problemIdList: number[] = problemList.map((e: any) => e.problem_id);
                let htmlBody = "";
                const result = await Promise.all(problemIdList.map(e => this.initData({ id: e })));
                for (const resultElement of result) {
                    Object.assign(this, resultElement);
                    this.$forceUpdate();
                    await new Promise((resolve) => {
                        this.$nextTick(() => { resolve(null); });
                    });
                    htmlBody += this.queryInnerHtml() + "\n";
                }
                await this.renderProblem(htmlBody, fileName);
                this.contestDownloading = false;
            })
            .catch(() => {
                this.contestDownloading = false;
            });
    }

    queryInnerHtml () {
        return (this.$refs.problem as Element).innerHTML;
    }

    async renderProblem (html: string, fileName: string) {
        console.log(html);
        const fileBuffer: Blob = await HTMLtoDOCX(html, null, {
            table: { row: { cantSplit: true } },
            footer: true,
            pageNumber: true
        }) as Blob;

        saveAs(fileBuffer, `${fileName}.docx`);
    }

    async initData (parseData: any) {
        return this.axios.get("/api/problem/local", { params: parseData })
            .then(({ data }) => {
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
                let sourceCode = data.source;
                let language = localStorage.getItem("lastlang") && Boolean(2 ** parseInt(localStorage.getItem("lastlang")!) & (~d.langmask)) ? parseInt(localStorage.getItem("lastlang")!) : Math.log2(~d.langmask & -~d.langmask);
                if (typeof sourceCode !== "string") {
                    language = sourceCode.language;
                    sourceCode = sourceCode.source_code;
                }
                const iseditor = data.editor;
                const isadmin = data.isadmin;
                const _data = {
                    title: d.title,
                    problem_id: d.problem_id,
                    original_id: d.problem_id,
                    source_code_language: language,
                    iscontest: !!this.$route.params.contest_id,
                    description: d.description,
                    original_content: {
                        description: d.description,
                        input: d.input,
                        output: d.output,
                        hint: d.hint
                    },
                    time: parseFloat(d.time_limit),
                    memory: parseInt(d.memory_limit),
                    input: d.input,
                    fill_in_blank_problem: d.fill_in_blank_problem,
                    output: d.output,
                    uploader: d.uploader,
                    sampleinput: d.sample_input,
                    sampleoutput: d.sample_output,
                    test_run_sampleinput: d.sample_input,
                    test_run_sampleoutput: d.sample_output,
                    hint: d.hint,
                    fingerprint: "",
                    fingerprintRaw: "",
                    submit: parseInt(d.submit),
                    accepted: parseInt(d.accepted),
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
                    selected_language: localStorage.getItem("lastlang") && Boolean(2 ** parseInt(localStorage.getItem("lastlang")!) & (~d.langmask)) ? parseInt(localStorage.getItem("lastlang")!) : Math.log2(~d.langmask & -~d.langmask),
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
                return _data;
            })
            .catch(({ data }) => {
                if (data.statement) {
                    alert(data.statement);
                }
                this.limit = false;
            });
    }
}
</script>

<style scoped>

</style>
