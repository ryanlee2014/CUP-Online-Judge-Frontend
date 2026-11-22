<template>
    <div id="right-side" style="width:65%;position:relative;" class="eleven wide column">
        <div class="ui menu borderless" id="modeBar" style="margin: 0;
        padding: 0;
        position: relative;
        height: 35px;
        color: black;width:100%;text-align:right">
            <div class="item not-compile">
                <select :class="'ui dropdown selection'" class="not-compile" id="language" name="language"
                        v-cloak v-model="selected_language">
                    <option :key="language.num" :value="language.num" v-for="language in lang_list">{{language.name}}
                    </option>
                </select>
                <div class="item">
                    <div class="ui toggle checkbox" v-cloak>
                        <input name="auto_detect" type="checkbox" v-model="auto_detect">
                        <label>{{$t("auto selected")}}</label>
                    </div>
                </div>
                <a :class="'item'" class="not-compile" data-clipboard-action="copy" id="clipbtn"
                   style="float:left;"
                   v-cloak v-if="prepend||append">{{$t("copy code")}}
                </a>
                <a :class="'item'" class="not-compile" style="float:left;" @click="formatCode" v-cloak>
                    {{$t("format")}}
                </a>
            </div>
            <div class="right menu">
                <ace-theme-selector v-if="!editorPackage" v-model="theme"></ace-theme-selector>
                <monaco-theme-selector v-else v-model="theme"></monaco-theme-selector>

            </div>
        </div>
        <ace-static :content="trimedCurrentPrepend" :fontSize="fontSize + ''" :selected_language="selected_language"
                    :static_theme="static_theme" v-if="!editorPackage && trimedCurrentPrepend"></ace-static>
        <monaco-static :content="trimedCurrentPrepend" :fontSize="fontSize + ''" :selected_language="selected_language"
                       :static_theme="static_theme" v-show="editorPackage && !!trimedCurrentPrepend"></monaco-static>
        <ace-editor :fontSize="fontSize + ''" :selected_language="selected_language" :theme="theme"
                    v-if="!editorPackage" v-model="code" :prepend-length="codePrependLines"></ace-editor>
        <monaco-editor :fontSize="fontSize + ''" :selected_language="selected_language" :theme="theme"
                       v-else v-model="code" :enable-language-server="enableLanguageServerForEditor" :prepend-length="codePrependLines">

        </monaco-editor>
        <ace-static :content="trimedCurrentAppend" :fontSize="fontSize + ''" :selected_language="selected_language"
                    :static_theme="static_theme" v-if="!editorPackage && trimedCurrentAppend" :prepend-length="appendLineStartsWith"></ace-static>
        <monaco-static :content="trimedCurrentAppend" :fontSize="fontSize + ''" :selected_language="selected_language"
                       :static_theme="static_theme" v-show="editorPackage && !!trimedCurrentAppend" :prepend-length="appendLineStartsWith"></monaco-static>
        <div class="ui menu borderless" id="statusBar" style="margin: 0;
        padding: 0;
        position: relative;
        height: 30px;
        color: black;width:100%">
            <div class="item" style="text-align:center;">
                {{$t("oj-name")}}
                <div class="item">
                    <div class="ui toggle checkbox" v-cloak v-if="!isContestRoute">
                        <input name="share" type="checkbox" v-model="share">
                        <label>{{$t("public code")}}</label>
                    </div>
                </div>
                <div class="item">
                    <div class="ui toggle checkbox">
                        <input type="checkbox" v-model="editorPackage">
                        <label>{{$t("switch editor")}}</label>
                    </div>
                </div>
                <div class="item"><span class="item">{{$t("font size")}}:</span>
                    <div class="ui input"><input id="fontsize" style="width:60px;text-align:center;height:30px"
                                                 type="text"
                                                 v-model="fontSize"></div>
                </div>
            </div>
            <div class="ui right menu">
                <span class="item hotkey-hint" :title="$t('submit') + ': ' + submitHotkey">{{ submitHotkey }}</span>
                <div class="ui buttons">
                    <input :disabled="submitDisabled" @click="do_submit" class="ui button green " id="Submit"
                           :aria-keyshortcuts="submitHotkey === 'Ctrl + Enter' ? 'Control+Enter' : 'Meta+Enter'"
                           type=button
                           :value="$t('submit')">
                    <div class="or"></div>
                    <input :disabled="submitDisabled" @click="pre_test_run" class="ui button blue" id="TestRun"
                           type=button :value="$t('test run')"
                    >&nbsp;<!--<span class="btn" id=result>状态</span>-->
                </div>
            </div>
        </div>
        <div class="ui teal progress result" data-total="3" data-value="0" id="progress" style="display:none">
            <div class="bar">
                <div class="progress"></div>
            </div>
            <div class="label progess_text">
                {{judgeInfoText}}
            </div>
        </div>
        <div :class="'ui warning message '+(hide_warning?'hidden':'')" class="ui warning message hidden ">
            <i class="close icon"></i>
            <div class="header compile same_width">
            </div>
        </div>
        <br>
        <div id="clipcp" style="display:none"></div>
    </div>
</template>
<i18n src="../../../locales/rightPanel.json"></i18n>
<script lang="ts">
import aceEditor from "@/components/submit/codeEditor/aceEditor.vue";
import aceThemeSelector from "@/components/submit/codeEditor/aceComponent/aceThemeSelector.vue";
import aceStatic from "@/components/submit/codeEditor/aceComponent/aceStatic.vue";
import monacoEditor from "@/components/submit/codeEditor/monacoEditor.vue";
import monacoThemeSelector from "@/components/submit/codeEditor/monacoComponent/monacoThemeSelector.vue";
import monacoStatic from "@/components/submit/codeEditor/monacoComponent/monacoStatic.vue";
import { init, format } from "wastyle";
import Clipboard from "clipboard";
import jquery from "jquery";
import "@/lib/brace/braceMode";
import "@/lib/brace/braceTheme";
import { defineComponent, PropType } from "vue";
import * as _ from "lodash-es";
import { toast } from "@/util/toast";

const astyle = require("wastyle/dist/astyle.wasm").default;
const $: any = jquery;
const detectLang = require("../../../lib/langDetector");
type Fn = (...arg: any[]) => any;

// Shared by every instance, like the former @Debounce(100) decorator.
const detectLanguageDebouncer = _.debounce(function (this: any) {
    const detectedLang = detectLang(this.code, this.lang_list.map(function (e: any) {
        return e.num;
    }));
    if (this.selected_language !== detectedLang) {
        this.selected_language = detectedLang;
    }
}, 100);

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent);

export default defineComponent({
    name: "RightPanel",
    components: {
        aceEditor,
        aceThemeSelector,
        monacoEditor,
        monacoThemeSelector,
        aceStatic,
        monacoStatic
    },
    props: {
        prepend: { default: () => ({}) as any },
        append: { default: () => ({}) as any },
        source_code_language: { type: Number as PropType<number | null>, default: null },
        iscontest: { type: Boolean, default: false },
        judgeInfoText: { type: String, default: "" },
        lang_list: { type: Array as PropType<any[]>, default: () => [] },
        language_template: { type: Array as PropType<any[]>, default: () => [] },
        do_submit: { type: Function as PropType<Fn>, default: () => () => undefined },
        pre_test_run: { type: Function as PropType<Fn>, default: () => () => undefined },
        submitDisabled: { type: Boolean, default: false },
        hide_warning: { type: Boolean, default: false },
        source_code: { type: String, default: "" },
        fill_in_blank_problem: { type: Number, default: 0 }
    },
    data () {
        return {
            selected_language: 0,
            auto_detect: false,
            share: false,
            fontSize: "16",
            theme: "ace/theme/monokai",
            static_theme: "ace/theme/monokai",
            prependView: null as any,
            config: {} as any,
            appendView: null as any,
            editorPackage: false,
            code: "",
            codeLine: 0,
            language: ["c_cpp", "c_cpp", "pascal", "java", "ruby", "sh", "python", "php", "perl", "csharp", "objectivec", "text", "scheme", "c_cpp", "c_cpp", "lua", "javascript", "go", "python", "c_cpp", "c_cpp", "c_cpp", "text", "java", "java", "python", "python", "java", "c_cpp", "c_cpp", "c_cpp"],
            current_prepend: "" as any,
            current_append: "" as any,
            dirty: false,
            // was assigned onto the iscontest prop before; kept as local state
            isContestRoute: false,
            submitHotkey: isMac ? "⌘ + Enter" : "Ctrl + Enter"
        };
    },
    computed: {
        appendLineStartsWith (): number {
            if (typeof this.current_prepend === "string") {
                return this.trimedCurrentPrepend.split("\n").length + this.codeLine;
            }
            return 0;
        },
        enableLanguageServerForEditor (): boolean {
            return !(this.trimedCurrentPrepend || this.trimedCurrentAppend);
        },
        trimedCurrentPrepend (): any {
            return typeof this.current_prepend === "string" ? this.current_prepend.trim() : this.current_prepend;
        },
        trimedCurrentAppend (): any {
            return typeof this.current_append === "string" ? this.current_append.trim() : this.current_append;
        },
        codePrependLines (): number {
            return typeof this.current_prepend === "string" ? this.trimedCurrentPrepend.split("\n").length : 0;
        }
    },
    watch: {
        source_code_language (val: any) {
            if (!isNaN(val)) {
                this.selected_language = val;
            }
        },
        selected_language (val: any) {
            if (val === undefined || val < 0) {
                return;
            }
            localStorage.setItem("lastlang", val);
            this.$store.commit("setCodeInfo", {
                language: val
            });
            require(`brace/mode/${this.language[val]}`);
            $("#language").dropdown("set selected", val.toString());
            const prepend: any = this.prepend;
            const append: any = this.append;
            if (prepend && prepend[val] !== this.current_prepend) {
                this.current_prepend = prepend[val];
                if (this.prependView) {
                    this.prependView.getSession().setValue(this.current_prepend);
                }
            }
            if (append && append[val] !== this.current_append) {
                this.current_append = append[val];
                if (this.appendView) {
                    this.appendView.getSession().setValue(this.current_append);
                }
            }
        },
        editorPackage (val: any) {
            this.config.editorPackage = val;
            localStorage.submitConfig = JSON.stringify(this.config);
            this.theme = val ? "vs-dark" : "ace/theme/monokai";
        },
        static_theme (val: any) {
            this.config.static_theme = val;
            localStorage.submitConfig = JSON.stringify(this.config);
        },
        theme (val: any) {
            if (val === "") {
                return;
            }
            this.config.theme = val;
            localStorage.submitConfig = JSON.stringify(this.config);
            this.static_theme = val;
            if (this.prependView) {
                this.prependView.setTheme(val);
            }
            if (this.appendView) {
                this.appendView.setTheme(val);
            }
            if (this.current_prepend || this.current_append) {
                this.current_prepend = this.current_append = "";
                this.$forceUpdate();
                this.$nextTick(() => {
                    this.$nextTick(() => {
                        this.current_prepend = (this.prepend as any)[this.selected_language] || "";
                        this.current_append = (this.append as any)[this.selected_language] || "";
                        this.$forceUpdate();
                    });
                });
            }
        },
        auto_detect (val: any) {
            if (val) {
                this.detectLanguageDebouncer();
            }
        },
        prepend (val: any) {
            if (!val) {
                return;
            }
            if (!val[this.selected_language] && val.length && val.length > 0) {
                this.selected_language = parseInt(Object.keys(val)[0]);
            }
            this.current_prepend = val[this.selected_language];
        },
        append (val: any) {
            if (!val) {
                return;
            }
            if (!val[this.selected_language] && val.length && val.length > 0) {
                this.selected_language = parseInt(Object.keys(val)[0]);
            }
            this.current_append = val[this.selected_language];
        },
        share (val: any) {
            this.$store.commit("setCodeInfo", {
                share: !!val
            });
        },
        source_code (val: any) {
            this.code = val;
        },
        code (val: string) {
            if (val && this.auto_detect) {
                this.detectLanguageDebouncer();
            }
            else if (val) {
                this.codeLine = val.split("\n").length;
            }
        },
        fontSize (val: any) {
            this.config.fontSize = val;
            localStorage.submitConfig = JSON.stringify(this.config);
        }
    },
    created () {
        const config = this.initConfig();
        Object.assign(this, config);
        Object.assign(this.config, config);
    },
    mounted () {
        this.initConfig();
        this.initClipboard();
        this.initSolutionCode();
    },
    methods: {
        initConfig (): any {
            this.isContestRoute = this.$route.fullPath.includes("contest");
            const defaultConfig = {
                editorPackage: false,
                theme: "ace/theme/monokai",
                static_theme: "ace/theme/monokai",
                fontSize: "16"
            };
            let config;
            if (!localStorage.submitConfig) {
                localStorage.submitConfig = JSON.stringify(config = defaultConfig);
            }
            else {
                try {
                    config = JSON.parse(localStorage.submitConfig);
                }
                catch (e) {
                    config = defaultConfig;
                }
            }
            return config;
        },
        initClipboard (): void {
            const obj = document.getElementById("clipbtn");
            const that: any = this;
            if (obj) {
                const clipboard = new Clipboard(obj, {
                    text: function () {
                        let mergetext = that.prepend[that.selected_language] || "";
                        mergetext += "\n/*请在下方编写你的代码,仅需提交填写的部分*/\n";
                        if (that.$store.getters.code.length !== 0) {
                            mergetext += that.$store.getters.code;
                        }
                        else {
                            mergetext += "\n\n\n\n";
                        }
                        mergetext += "\n/*请在上方填写你的代码,仅需提交填写的部分*/\n";
                        mergetext += that.append[that.selected_language] || "";
                        return mergetext;
                    }
                });
                clipboard.on("success", () => {
                    toast(that.$t("Context is in your clipboard") as string, { type: "success" });
                });
                clipboard.on("error", function (e) {
                    console.error(e);
                    console.log("复制失败！请手动复制代码");
                });
            }
        },
        initSolutionCode (): void {
            if (this.$route.params.solution_id) {
                this.axios.get("/api/status/solution", { params: { sid: this.$route.params.solution_id } })
                    .then(({ data }) => {
                        this.selected_language = parseInt(data.data.language);
                    });
            }
        },
        detectLanguageDebouncer (): void {
            detectLanguageDebouncer.call(this);
        },
        async formatCode (): Promise<void> {
            await init(astyle);
            this.code = await format(this.code, "pad-oper style=google")[1];
        }
    }
});
</script>

<style scoped>
    .ui.modal {
        top: 3%;
    }

    .code {
        width: 50%;
        white-space: pre-wrap;
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

    .hotkey-hint {
        color: #999;
        font-size: 12px;
        white-space: nowrap;
    }

    .same_width {
        font-family: Consolas, "Courier New", Courier, FreeMono, monospace !important;
    }
</style>
