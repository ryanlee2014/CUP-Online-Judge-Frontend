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
        <ace-static :content="current_prepend" :fontSize="fontSize + ''" :selected_language="selected_language" :static_theme="static_theme" v-if="!editorPackage && prepend"></ace-static>
        <monaco-static :content="current_prepend" :fontSize="fontSize + ''" :selected_language="selected_language" :static_theme="static_theme" v-if="editorPackage && prepend"></monaco-static>
        <ace-editor :fontSize="fontSize + ''" :selected_language="selected_language" :theme="theme"
                    v-if="!editorPackage" v-model="code"></ace-editor>
        <monaco-editor :fontSize="fontSize + ''" :selected_language="selected_language" :theme="theme"
                       v-else v-model="code">

        </monaco-editor>
        <ace-static :content="current_append" :fontSize="fontSize + ''" :selected_language="selected_language" :static_theme="static_theme" v-if="!editorPackage && append"></ace-static>
        <monaco-static :content="current_append" :fontSize="fontSize + ''" :selected_language="selected_language" :static_theme="static_theme" v-if="editorPackage && append"></monaco-static>
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
            <div class="label progess_text"></div>
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
<i18n src="../../../locales/components/submit/sidePage/rightPanel.json"></i18n>
<script>
import aceEditor from "../../../components/submit/codeEditor/aceEditor";
import aceThemeSelector from "../../../components/submit/codeEditor/aceComponent/aceThemeSelector";
import aceStatic from "../../../components/submit/codeEditor/aceComponent/aceStatic";
import monacoEditor from "../../../components/submit/codeEditor/monacoEditor";
import monacoThemeSelector from "../../../components/submit/codeEditor/monacoComponent/monacoThemeSelector";
import monacoStatic from "../../../components/submit/codeEditor/monacoComponent/monacoStatic";
import envConfig from "../../../../config/environment";
const ace = require("brace");
const Clipboard = require("clipboard");
const detectLang = require("../../../lib/langDetector");
const _ = require("lodash");
const $ = require("jquery");
window.ace = ace;
require("../../../lib/brace/braceMode");
require("../../../lib/brace/braceTheme");
const language = ["c_cpp", "c_cpp", "pascal", "java", "ruby", "bash", "python", "php", "perl", "csharp", "objectivec", "text", "scheme", "c_cpp", "c_cpp", "lua", "javascript", "go", "python", "c_cpp", "c_cpp", "c_cpp", "text", "java", "java", "python", "python", "java", "c_cpp", "c_cpp"];
const language_ext = ["c", "cc", "pas", "java", "rb", "sh", "py", "php", "pl", "cs", "m", "bas", "scm", "c", "cc", "lua", "js", "go", "py", "cpp", "cpp", "c", "kt", "java", "java", "python", "python", "java", "c", "cc"];
export default {
    name: "rightPanel",
    components: {
        aceEditor,
        aceThemeSelector,
        monacoEditor,
        monacoThemeSelector,
        aceStatic,
        monacoStatic
    },
    data () {
        let _baseData = {
            selected_language: 0,
            auto_detect: false,
            share: false,
            fontSize: "16",
            theme: "ace/theme/monokai",
            static_theme: "ace/theme/monokai",
            prependView: null,
            config: {},
            appendView: null,
            editorPackage: false,
            code: "",
            language,
            title: envConfig.title,
            current_prepend: "",
            current_append: "",
            dirty: false
        };
        const config = this.initConfig();
        Object.assign(_baseData, config);
        Object.assign(_baseData.config, config);
        return _baseData;
    },
    props: {
        prepend: {
            type: Object,
            default: () => {
                return {};
            }
        },
        append: {
            type: Object,
            default: () => {
                return {};
            }
        },
        iscontest: {
            type: Boolean,
            default: false
        },
        lang_list: {
            type: Array,
            default: () => []
        },
        language_template: {
            type: Array,
            default: () => []
        },
        do_submit: {
            type: Function,
            default: () => {
            }
        },
        pre_test_run: {
            type: Function,
            default: () => {
            }
        },
        submitDisabled: {
            type: Boolean,
            default: false
        },
        hide_warning: {
            type: Boolean,
            default: false
        },
        source_code: {
            type: String,
            default: ""
        }
    },
    watch: {
        selected_language: function (val) {
            this.$store.commit("setCodeInfo", {
                language: val
            });
            require(`brace/mode/${language[val]}`);
            $("#language").dropdown("set selected", val.toString());
            let prepend = this.prepend;
            let append = this.append;
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
        editorPackage (val, oldVal) {
            this.config.editorPackage = val;
            localStorage.submitConfig = JSON.stringify(this.config);
            if (val) {
                this.theme = "vs-dark";
            }
            else {
                this.theme = "ace/theme/monokai";
            }
        },
        static_theme (val) {
            this.config.static_theme = val;
            localStorage.submitConfig = JSON.stringify(this.config);
        },
        theme: function (val) {
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
        },
        auto_detect: function (val) {
            if (val) {
                this.detectLanguageDebouncer();
            }
        },
        prepend: function (val) {
            if (!val) {
                return;
            }
            if (!val[this.selected_language] && val.length && val.length > 0) {
                this.selected_language = parseInt(Object.keys(val)[0]);
            }
            this.current_prepend = val[this.selected_language];
        },
        append: function (val) {
            if (!val) {
                return;
            }
            if (!val[this.selected_language] && val.length && val.length > 0) {
                this.selected_language = parseInt(Object.keys(val)[0]);
            }
            this.current_append = val[this.selected_language];
        },
        share: function (val) {
            this.$store.commit("setCodeInfo", {
                share: !!val
            });
        },
        source_code: function (val) {
            this.code = val;
        },
        code: function (val) {
            if (val && this.auto_detect) {
                this.detectLanguageDebouncer();
            }
        },
        fontSize (val) {
            this.config.fontSize = val;
            localStorage.submitConfig = JSON.stringify(this.config);
        }
    },
    mounted () {
        this.initConfig();
        this.initClipboard();
        this.initSolutionCode();
    },
    methods: {
        initConfig () {
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
        },
        initSolutionCode () {
            if (this.$route.params.solution_id) {
                this.axios.get("/api/status/solution", { params: { sid: this.$route.params.solution_id } })
                    .then(({ data }) => {
                        this.selected_language = parseInt(data.data.language);
                    });
            }
        },
        detectLanguageDebouncer () {
            const that = this;
            (_.debounce(() => {
                const detected_lang = detectLang(that.code, that.lang_list.map(function (e) {
                    return e.num;
                }));
                if (that.selected_language !== detected_lang) {
                    that.selected_language = detected_lang;
                }
            }, 100))();
        }
    }
};
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
