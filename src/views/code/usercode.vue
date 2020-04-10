<template>
    <ContestMode v-if="contest_mode || contestMode"></ContestMode>
    <div v-else class="ui container padding">
        <h2 class="ui dividing header">
            {{$t("source code")}}
        </h2>
        <div class="ui existing segment" v-cloak>
            <div class="ui raised segment" v-cloak>
                <div class="ui tiny statistics" v-if="code">
                    <div class="statistic">
                        <div class="value none-transform">
                            {{from+' '+problem_id}}
                            <span class="subscript">&nbsp;</span>
                        </div>
                        <div class="label none-transform">
                            Problem
                        </div>
                    </div>
                    <div class="statistic">
                        <div class="value none-transform">
                            {{user_id}}
                            <span class="subscript">&nbsp;</span>
                        </div>
                        <div class="label none-transform">
                            User
                        </div>
                    </div>
                    <div class="statistic">
                        <div class="value none-transform">
                            {{time}}
                            <span class="subscript">ms</span>
                        </div>
                        <div class="label none-transform">
                            Running Time
                        </div>
                    </div>
                    <div class="statistic">
                        <div class="value none-transform">
                            {{memory}}
                            <span class="subscript">KB</span>
                        </div>
                        <div class="label none-transform">
                            Used Memory
                        </div>
                    </div>
                    <div class="statistic">
                        <div class="value none-transform">
                            {{language}}
                            <span class="subscript">&nbsp;</span>
                        </div>
                        <div class="label none-transform">
                            Language
                        </div>
                    </div>
                    <div class="statistic">
                        <div :class="'value none-transform '+judge_color">
                            <i :class="icon+' icon'"></i>
                            {{result}}
                            <span class="subscript">&nbsp;</span>
                        </div>
                        <div class="label none-transform">
                            Result
                        </div>
                    </div>
                    <div class="statistic" v-if="privilege">
                        <div class="value none-transform">
                            <a @click="rejudge" style="cursor:pointer">重新判题</a>
                            <span class="subscript">&nbsp;</span>
                        </div>
                        <div class="label none-transform">
                            <a @click="ban" style="cursor:pointer">封禁</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="ui raised segment" v-if="code">
                <div class="ui top right attached label"><a data-clipboard-target="#code" id="copy">Copy Source Code</a>
                </div>
                <div class="ui top left attached label">
                    <a @click.prevent="show_formatted = !show_formatted">{{ show_formatted ? "Show original code" : "Show formatted code"}}</a>
                </div>
                <div id="code" v-html="show_formatted ? formatted_code_html : code_html">
                </div>
            </div>
            <div class="ui existing segment" v-if="statement" v-text="statement">

            </div>
        </div>

    </div>
</template>

<script lang="ts">
import mixins from "../../mixin/init";
import ContestMode from "../../components/contestMode/block.vue";
import { Component, Mixins, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import jquery from "jquery";
import languageMap from "@/lib/constants/monaco-editor/language-map";
import { init, format } from "wastyle";
import markdownIt from "@/lib/markdownIt/markdownIt";
import MarkdownWorkerMixin from "@/mixin/MarkdownWorkerMixin";
const Clipboard = require("clipboard");
const clipboard = new Clipboard("#copy");
const path = require("wastyle/dist/astyle.wasm").default;
const $: any = jquery;
window.markdownIt = markdownIt;
@Component({
    components: {
        ContestMode: ContestMode
    },
    computed: mapGetters(["contestMode"])
})
export default class UserCode extends Mixins(mixins, MarkdownWorkerMixin) {
    code = "";
    time = 0;
    memory = 0;
    problem_id = 0;
    result = 0;
    language = 0;
    user_id = "";
    language_id = 0;
    judge_color = [];
    icon = [];
    from = "";
    statement = false;
    contest_mode = false;
    privilege = false;
    show_formatted = false;
    error = false;
    formatted_code_html = "";
    code_html = "";

    created () {
        this.user_id = this.$store.getters.user_id;
    }

    mounted () {
        const solutionId = this.$route.params.solution_id;
        document.title = `Solution ${solutionId} -- ${document.title}`;
        this.bindClipboardDOM();
        this.initData();
    }

    markdownCSSPack (html: string) {
        return `<div class="markdown-body">${html}</div>`;
    }

    async buildSourceCode (code: string, language: number) {
        return this.markdownCSSPack(markdownIt.renderPlain(this.buildMarkdownCode(code, language)));
    }

    buildMarkdownCode (code: string, language: number) {
        const source = ["```" + languageMap[language], code, "```"].join("\n");
        return source;
    }

    async renderCode (code: string, language: number) {
        this.code_html = await this.buildSourceCode(code, this.language_id);
        await init(path);
        this.formatted_code_html = await this.buildSourceCode((await format(code, "pad-oper style=google"))[1], this.language_id);
    }

    initData () {
        this.axios.get(`/api/source/${this.$route.params.from}/${this.$route.params.solution_id}?raw=1`)
            .then(response => {
                const data = response.data;
                if (data.status === "OK") {
                    Object.assign(this, data.data);
                    this.code = data.data.code.source;
                    this.language_id = data.data.code.language;
                    this.renderCode(this.code, this.language_id);
                    this.privilege = data.privilege && this.$route.params.from === "local";
                    this.problem_id = Math.abs(data.data.problem);
                }
                else {
                    if (data.contest_mode) {
                        this.contest_mode = true;
                        return;
                    }
                    this.code = "";
                    this.statement = data.statement;
                    this.error = true;
                }
            });
    }

    bindClipboardDOM () {
        clipboard.on("success", function () {
            $("#copy")
                .popup({
                    title: "Finished",
                    content: "Your code is in your clipboard",
                    on: "click"
                })
                .popup("show");
        });
    }

    ban () {
        this.axios.post("/api/status/ban_submission", { solution_id: this.$route.params.solution_id })
            .then(response => {
                alert("Server receive your request");
                console.log(response.data);
            });
    }

    rejudge () {
        this.axios.post("/api/status/rejudge", { solution_id: this.$route.params.solution_id })
            .then(response => {
                alert("Server receive youre request");
                console.log(response.data);
            });
    }
}
</script>

<style scoped>
    .subscript{
        font-size: 1rem;
    }
    .none-transform{
        text-transform: none !important;
    }
</style>
