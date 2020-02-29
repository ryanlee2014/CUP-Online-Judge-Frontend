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
                   v-cloak v-if="prepend||append">{{$t("copy code")}}</a>
            </div>
            <div class="right menu">
                <ace-theme-selector v-if="!editorPackage" v-model="theme"></ace-theme-selector>
                <monaco-theme-selector v-else v-model="theme"></monaco-theme-selector>

            </div>
        </div>
        <ace-static :content="current_prepend" :fontSize="fontSize + ''" :selected_language="selected_language"
                    :static_theme="static_theme" v-if="!editorPackage && prepend"></ace-static>
        <monaco-static :content="current_prepend" :fontSize="fontSize + ''" :selected_language="selected_language"
                       :static_theme="static_theme" v-if="editorPackage && prepend"></monaco-static>
        <ace-editor :fontSize="fontSize + ''" :selected_language="selected_language" :theme="theme"
                    v-if="!editorPackage" v-model="code"></ace-editor>
        <monaco-editor :fontSize="fontSize + ''" :selected_language="selected_language" :theme="theme"
                       v-else v-model="code">

        </monaco-editor>
        <ace-static :content="current_append" :fontSize="fontSize + ''" :selected_language="selected_language"
                    :static_theme="static_theme" v-if="!editorPackage && append"></ace-static>
        <monaco-static :content="current_append" :fontSize="fontSize + ''" :selected_language="selected_language"
                       :static_theme="static_theme" v-if="editorPackage && append"></monaco-static>
        <div class="ui menu borderless" id="statusBar" style="margin: 0;
        padding: 0;
        position: relative;
        height: 30px;
        color: black;width:100%">
            <div class="item" style="text-align:center;">
                {{title}}
                <div class="item">
                    <div class="ui toggle checkbox" v-cloak v-if="!iscontest">
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
                <div class="ui buttons">
                    <input :disabled="submitDisabled" @click="do_submit" class="ui button green " id="Submit"
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
import aceEditor from "../../../components/submit/codeEditor/aceEditor.vue";
import aceThemeSelector from "../../../components/submit/codeEditor/aceComponent/aceThemeSelector.vue";
import aceStatic from "../../../components/submit/codeEditor/aceComponent/aceStatic.vue";
import monacoEditor from "../../../components/submit/codeEditor/monacoEditor.vue";
import monacoThemeSelector from "../../../components/submit/codeEditor/monacoComponent/monacoThemeSelector.vue";
import monacoStatic from "../../../components/submit/codeEditor/monacoComponent/monacoStatic.vue";
import envConfig from "../../../../config/environment.json";
import Clipboard from "clipboard";
import jquery from "jquery";
import "@/lib/brace/braceMode";
import "@/lib/brace/braceTheme";
import { Prop, Watch, Component } from "vue-property-decorator";
import Vue from "vue";
import { Debounce } from "../../../module/Decorator/method";

const $: any = jquery;
const detectLang = require("../../../lib/langDetector");
const language_ext = ["c", "cc", "pas", "java", "rb", "sh", "py", "php", "pl", "cs", "m", "bas", "scm", "c", "cc", "lua", "js", "go", "py", "cpp", "cpp", "c", "kt", "java", "java", "python", "python", "java", "c", "cc"];
    @Component({
        components: {
            aceEditor,
            aceThemeSelector,
            monacoEditor,
            monacoThemeSelector,
            aceStatic,
            monacoStatic
        }
    })
export default class RightPanel extends Vue {
        selected_language = 0;
        auto_detect = false;
        share = false;
        fontSize = "16";
        theme = "ace/theme/monokai";
        static_theme = "ace/theme/monokai";
        prependView: any = null;
        config: any = {};
        appendView: any = null;
        editorPackage = false;
        code = "";
        language = ["c_cpp", "c_cpp", "pascal", "java", "ruby", "bash", "python", "php", "perl", "csharp", "objectivec", "text", "scheme", "c_cpp", "c_cpp", "lua", "javascript", "go", "python", "c_cpp", "c_cpp", "c_cpp", "text", "java", "java", "python", "python", "java", "c_cpp", "c_cpp"];
        title = envConfig.title;
        current_prepend = "";
        current_append = "";
        dirty = false;

        created () {
            const config = this.initConfig();
            Object.assign(this, config);
            Object.assign(this.config, config);
        }

        @Prop({
            default: () => {
                return {};
            }
        }) prepend!: any;
        @Prop({
            default: () => {
                return {};
            }
        }) append!: any;
        @Prop({ default: null }) source_code_language!: number | null;
        @Prop({ default: false }) iscontest!: boolean;
        @Prop({ default: "" }) judgeInfoText!: string;
        @Prop({ default: () => [] }) lang_list!: any[];
        @Prop({ default: () => [] }) language_template!: any[];
        @Prop({
            default: () => {
            }
        }) do_submit!: (...arg: any[]) => any;
        @Prop({
            default: () => {
            }
        }) pre_test_run!: (...arg: any[]) => any;
        @Prop({ default: false }) submitDisabled!: boolean;
        @Prop({ default: false }) hide_warning!: boolean;
        @Prop({ default: "" }) source_code!: string;

        @Watch("source_code_language")
        onSourceCodeLanguageChanged (val: any) {
            if (!isNaN(val)) {
                this.selected_language = val;
            }
        }

        @Watch("selected_language")
        onSelectedLanguageChanged (val: any) {
            this.$store.commit("setCodeInfo", {
                language: val
            });
            require(`brace/mode/${this.language[val]}`);
            $("#language").dropdown("set selected", val.toString());
            let prepend: any = this.prepend;
            let append: any = this.append;
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
        }

        @Watch("editorPackage")
        onEditorPackageChanged (val: any) {
            this.config.editorPackage = val;
            localStorage.submitConfig = JSON.stringify(this.config);
            if (val) {
                this.theme = "vs-dark";
            }
            else {
                this.theme = "ace/theme/monokai";
            }
        }

        @Watch("static_theme")
        onStaticThemeChanged (val: any) {
            this.config.static_theme = val;
            localStorage.submitConfig = JSON.stringify(this.config);
        }

        @Watch("theme")
        onThemeChanged (val: any) {
            if (val === "") {
                return;
            }
            this.config.theme = val;
            localStorage.submitConfig = JSON.stringify(this.config);
            this.static_theme = val;
            const prependView = this.prependView;
            if (prependView) {
                this.prependView.setTheme(val);
            }
            const appendView = this.appendView;
            if (appendView) {
                this.appendView.setTheme(val);
            }
            if (this.current_prepend || this.current_append) {
                this.current_prepend = this.current_append = "";
                this.$forceUpdate();
                this.$nextTick(() => {
                    this.$nextTick(() => {
                        this.current_prepend = this.prepend[this.selected_language] || "";
                        this.current_append = this.append[this.selected_language] || "";
                        this.$forceUpdate();
                    });
                });
            }
        }

        @Watch("auto_detect")
        onAutoDetectChanged (val: any) {
            if (val) {
                this.detectLanguageDebouncer();
            }
        }

        @Watch("prepend")
        onPrependChanged (val: any) {
            if (!val) {
                return;
            }
            if (!val[this.selected_language] && val.length && val.length > 0) {
                this.selected_language = parseInt(Object.keys(val)[0]);
            }
            this.current_prepend = val[this.selected_language];
        }

        @Watch("append")
        onAppendChanged (val: any) {
            if (!val) {
                return;
            }
            if (!val[this.selected_language] && val.length && val.length > 0) {
                this.selected_language = parseInt(Object.keys(val)[0]);
            }
            this.current_append = val[this.selected_language];
        }

        @Watch("share")
        onShareChanged (val: any) {
            this.$store.commit("setCodeInfo", {
                share: !!val
            });
        }

        @Watch("source_code")
        onSourceCodeChanged (val: any) {
            this.code = val;
        }

        @Watch("code")
        onCodeChanged (val: any) {
            if (val && this.auto_detect) {
                this.detectLanguageDebouncer();
            }
        }

        @Watch("fontSize")
        onFontSizeChanged (val: any) {
            this.config.fontSize = val;
            localStorage.submitConfig = JSON.stringify(this.config);
        }

        mounted () {
            this.initConfig();
            this.initClipboard();
            this.initSolutionCode();
        }

        initConfig () {
            this.iscontest = this.$route.fullPath.includes("contest");
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
        }

        initClipboard () {
            let obj = document.getElementById("clipbtn");
            const that = this;
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
                clipboard.on("success", function (e) {
                    alert("复制到剪贴板成功!");
                    console.log(e);
                });
                clipboard.on("error", function (e) {
                    console.error(e);
                    console.log("复制失败！请手动复制代码");
                });
            }
        }

        initSolutionCode () {
            if (this.$route.params.solution_id) {
                this.axios.get("/api/status/solution", { params: { sid: this.$route.params.solution_id } })
                    .then(({ data }) => {
                        this.selected_language = parseInt(data.data.language);
                    });
            }
        }

        @Debounce(100)
        detectLanguageDebouncer () {
            const detectedLang = detectLang(this.code, this.lang_list.map(function (e) {
                return e.num;
            }));
            if (this.selected_language !== detectedLang) {
                this.selected_language = detectedLang;
            }
        }
}
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

    .same_width {
        font-family: Consolas, "Courier New", Courier, FreeMono, monospace !important;
    }
</style>
