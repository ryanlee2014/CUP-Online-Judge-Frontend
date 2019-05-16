<template>
    <div id="right-side" style="width:65%;position:relative;float:left;">
        <textarea class="sample_input" cols=40 id="ipt" name="input_text"
                  rows=5 style="display:none">样例输入</textarea>
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
                        <label>自动选择</label>
                    </div>
                </div>
                <a
                        :class="'item'" class="not-compile" data-clipboard-action="copy" id="clipbtn"
                        style="float:left;"
                        v-cloak v-if="prepend||append">复制代码</a>

            </div>
            <div class="right menu">
                <div class="item">
                </div>

                <div class="item">
                    <span>主题:</span><select class="ui selection dropdown search" id="theme" size="1" v-model="theme">

                    <optgroup label="Bright">
                        <option value="ace/theme/chrome">Chrome</option>
                        <option value="ace/theme/clouds">Clouds</option>
                        <option value="ace/theme/crimson_editor">Crimson Editor</option>
                        <option value="ace/theme/dawn">Dawn</option>
                        <option value="ace/theme/dreamweaver">Dreamweaver</option>
                        <option value="ace/theme/eclipse">Eclipse</option>
                        <option value="ace/theme/github">GitHub</option>
                        <option value="ace/theme/iplastic">IPlastic</option>
                        <option value="ace/theme/solarized_light">Solarized Light</option>
                        <option value="ace/theme/textmate">TextMate</option>
                        <option value="ace/theme/tomorrow">Tomorrow</option>
                        <option value="ace/theme/xcode">XCode</option>
                        <option value="ace/theme/kuroir">Kuroir</option>
                        <option value="ace/theme/katzenmilch">KatzenMilch</option>
                        <option value="ace/theme/sqlserver">SQL Server</option>
                    </optgroup>
                    <optgroup label="Dark">
                        <option value="ace/theme/ambiance">Ambiance</option>
                        <option value="ace/theme/chaos">Chaos</option>
                        <option value="ace/theme/clouds_midnight">Clouds Midnight</option>
                        <option value="ace/theme/cobalt">Cobalt</option>
                        <option value="ace/theme/gruvbox">Gruvbox</option>
                        <option value="ace/theme/idle_fingers">idle Fingers</option>
                        <option value="ace/theme/kr_theme">krTheme</option>
                        <option value="ace/theme/merbivore">Merbivore</option>
                        <option value="ace/theme/merbivore_soft">Merbivore Soft</option>
                        <option value="ace/theme/mono_industrial">Mono Industrial</option>
                        <option value="ace/theme/monokai">Monokai</option>
                        <option value="ace/theme/pastel_on_dark">Pastel on dark</option>
                        <option value="ace/theme/solarized_dark">Solarized Dark</option>
                        <option value="ace/theme/terminal">Terminal</option>
                        <option value="ace/theme/tomorrow_night">Tomorrow Night</option>
                        <option value="ace/theme/tomorrow_night_blue">Tomorrow Night Blue</option>
                        <option value="ace/theme/tomorrow_night_bright">Tomorrow Night Bright</option>
                        <option value="ace/theme/tomorrow_night_eighties">Tomorrow Night 80s</option>
                        <option value="ace/theme/twilight">Twilight</option>
                        <option value="ace/theme/vibrant_ink">Vibrant Ink</option>
                    </optgroup>
                </select></div>
            </div>
        </div>
        <div :ace-mode="'ace/mode/'+language[selected_language]" :ace-theme="theme"
             class="prepend code"
             id="prependCodeHighlight"
             style="width: 100%;padding:0px;line-height:1.2;text-align:left;margin-bottom:0px;"
             v-if="prepend" v-text="current_prepend">
        </div>
        <div :style="{width:'100%',height:'460px',fontSize:fontSize+'px'}" cols=180
             id="source" rows=20
             style="width:100%;height:460px"></div>
        <div :ace-mode="'ace/mode/'+language[selected_language]" :ace-theme="theme" class="append code"
             id="appendCodeHighlight"
             style="width: 100%; padding:0px; line-height:1.2;text-align:left;margin-bottom:0px;"
             v-html="current_append" v-if="append">
        </div>
        <div class="ui menu borderless" id="statusBar" style="margin: 0;
        padding: 0;
        position: relative;
        height: 30px;
        color: black;width:100%">
            <div class="item" style="text-align:center;">
                CUP Online Judge&nbsp;&nbsp;
                <div class="item">
                    <div class="ui toggle checkbox" v-cloak v-if="!iscontest">
                        <input name="share" type="checkbox" v-model="share">
                        <label>允许他人查看代码</label>
                    </div>
                </div>
                <div class="item"><span class="item">字号:</span>
                    <div class="ui input"><input id="fontsize" style="width:60px;text-align:center;height:30px"
                                                 type="text"
                                                 v-model="fontSize"></div>
                </div>
            </div>
            <div class="ui right menu">
                <div class="ui buttons">
                    <input :disabled="submitDisabled" @click="do_submit" class="ui button green " id="Submit"
                           type=button
                           value="提交">
                    <div class="or"></div>
                    <input :disabled="submitDisabled" @click="pre_test_run" class="ui button blue" id="TestRun"
                           type=button value="测试运行"
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
        <div :class="'ui warning message '+(hide_warning?'hidden':'')" class="ui warning message hidden">
            <i class="close icon"></i>
            <div class="header compile">
            </div>
        </div>
        <br>
        <div id="clipcp" style="display:none"></div>
    </div>
</template>

<script>
    const ace = require("brace");
    const Clipboard = require("clipboard");
    const detectLang = require("../../../lib/langDetector");
    const _ = require("lodash");
    const $ = require("jquery");
    window.ace = ace;
    require('../../../lib/brace/braceMode');
    require('../../../lib/brace/braceTheme');
    require("brace/ext/static_highlight");

    const defaultConfig = {
        lang: 'c_cpp',
        theme: 'monokai',
        options: {
            useSoftTabs: true,
            tabSize: 4
        }
    };
    const language = ["c_cpp", "c_cpp", "pascal", "java", "ruby", "bash", "python", "php", "perl", "csharp", "objectivec", "text", "scheme", "c_cpp", "c_cpp", "lua", "javascript", "go", "python", "c_cpp", "c_cpp", "c_cpp", "text", "java", "java", "python", "python", "java", "c_cpp", "c_cpp"];
    const language_ext = ["c", "cc", "pas", "java", "rb", "sh", "py", "php", "pl", "cs", "m", "bas", "scm", "c", "cc", "lua", "js", "go", "py", "cpp", "cpp", "c", "kt", "java", "java", "python", "python", "java", "c", "cc"];
    export default {
        name: "rightPanel",
        data() {
            return {
                selected_language: 0,
                auto_detect: false,
                share: false,
                fontSize: 18,
                theme: "ace/theme/monokai",
                editor: null,
                prependView: null,
                appendView: null,
                language,
                current_prepend: "",
                current_append: "",
                highlight: new Promise((resolve) => {
                    ace.acequire(["ace/ext/static_highlight"], function (fn) {
                        resolve(fn);
                    })
                })
            }
        },
        props: {
            prepend: {
                type: Object,
                default: () => {
                    return {}
                }
            },
            append: {
                type: Object,
                default: () => {
                    return {}
                }
            },
            iscontest: {
                type: Boolean,
                default: false
            },
            config: {
                type: Object,
                default: function () {
                    return defaultConfig
                }
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
                    share: this.share,
                    code: this.editor.getSession().getValue(),
                    language: val
                });
                require(`brace/mode/${language[val]}`);
                const editor = this.editor;
                editor.getSession().setMode(`ace/mode/${language[val]}`);
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
            theme: function (val) {
                const editor = this.editor;
                editor.setTheme(val);
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
            auto_detect: function (newVal, oldVal) {
                const that = this;
                const editor = this.editor;
                if (newVal === oldVal) {
                    return;
                }
                if (newVal) {
                    const detectLanguageDebouncer = _.debounce(function () {
                        const detected_lang = detectLang(editor.getSession().getValue(), that.lang_list.map(function (e) {
                            return e.num
                        }));
                        if (that.selected_language != detected_lang) {
                            that.selected_language = detected_lang;
                        }
                    }, 100);
                    detectLanguageDebouncer();
                    editor.on("change", function (event) {
                        detectLanguageDebouncer();
                    });
                } else {
                    editor.off("change");
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
            current_append: function (val) {
                if (!val) {
                    return;
                }
                const h = this.highlight;
                h.then((highlight) => {
                    this.$nextTick(() => {
                        _.forEach(document.querySelectorAll("#appendCodeHighlight"), function (val, index) {
                            highlight(val, {
                                mode: val.getAttribute("ace-mode"),
                                theme: val.getAttribute("ace-theme"),
                                startLineNumber: 1,
                                showGutter: val.getAttribute("ace-gutter"),
                                trim: true
                            }, function (highlighted) {
                            });
                        });
                    })
                })
            },
            current_prepend: function (val) {
                if (!val) {
                    return;
                }
                const h = this.highlight;
                h.then((highlight) => {
                    this.$nextTick(() => {
                        _.forEach(document.querySelectorAll("#prependCodeHighlight"), function (val, index) {
                            highlight(val, {
                                mode: val.getAttribute("ace-mode"),
                                theme: val.getAttribute("ace-theme"),
                                startLineNumber: 1,
                                showGutter: val.getAttribute("ace-gutter"),
                                trim: true
                            }, function (highlighted) {
                            });
                        });
                    })
                });
            },
            share: function (val) {
                this.$store.commit("setCodeInfo", {
                    share: !!val,
                    code: this.editor.getSession().getValue(),
                    language: this.selected_language
                });
            },
            source_code: function (val) {
                const that = this;
                const editor = this.editor;
                editor.getSession().setValue(val);
            }
        },
        mounted() {
            this.initEditor();
            this.initClipboard();
            this.initSolutionCode();
        },
        methods: {
            initEditor() {
                const editor = this.editor = ace.edit("source");
                editor.on("change", () => {
                    this.$store.commit("setCodeInfo", {
                        share: this.share,
                        code: this.editor.getSession().getValue(),
                        language: this.selected_language
                    });
                });
                editor.getSession().setMode(`ace/mode/${language[this.selected_language]}`);
                editor.setTheme(this.theme);
            },
            initClipboard() {
                let obj = document.getElementById('clipbtn');
                const that = this;
                if (obj) {
                    var clipboard = new Clipboard(obj, {
                        text: function (trigger) {
                            var mergetext = that.prepend[that.selected_language];
                            mergetext += "\n/*请在下方编写你的代码,仅需提交填写的部分*/\n";
                            if (that.$store.getters.code.length !== 0) {
                                mergetext += that.$store.getters.code;
                            } else {
                                mergetext += "\n\n\n\n";
                            }
                            mergetext += "\n/*请在上方填写你的代码,仅需提交填写的部分*/\n";
                            mergetext += that.append[that.selected_language];
                            return mergetext;
                        }
                    });
                    clipboard.on('success', function (e) {
                        alert("复制到剪贴板成功!");
                        console.log(e);
                    });
                    clipboard.on('error', function (e) {
                        console.error(e);
                        console.log("复制失败！请手动复制代码");
                        console.log("Firefox 有一定几率报错，待修复");
                    });
                }
            },
            initSolutionCode() {
                if (this.$route.params.solution_id) {
                    this.axios.get("/api/status/solution", {params: {sid: this.$route.params.solution_id}})
                        .then(({data}) => {
                            this.selected_language = parseInt(data.data.language);
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

    .code {
        width: 50%;
        white-space: pre-wrap;
        border: solid lightgrey 1px
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
</style>
