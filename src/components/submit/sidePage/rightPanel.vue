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
                        :class="'item'" class="not-compile" data-clipboard-action="copy" id="clipbtn" style="float:left;"
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
        <div :ace-mode="'ace/mode/'+language_template[selected_language]" ace-theme="ace/theme/monokai"
             class="prepend code"
             id="prepend"
             style="width: 100%;padding:0px;line-height:1.2;text-align:left;margin-bottom:0px;"
             v-if="prepend" v-text="current_prepend">
        </div>
        <div :style="{width:'100%',height:'460px',fontSize:fontSize+'px'}" cols=180
             id="source" rows=20
             style="width:100%;height:460px"></div>
        <div :ace-mode="'ace/mode/'+language_template[selected_language]" ace-theme="ace/theme/monokai" class="append code"
             id="append"
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
    const detectLang = require("../../../lib/langDetector");
    const _ = require("lodash");
    const $ = require("jquery");
    window.ace = ace;
    require('../../../lib/brace/braceMode');
    require('../../../lib/brace/braceTheme');
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
                appendView: null
            }
        },
        props: {
            prepend: {
                type: Object,
                default: () => {return {}}
            },
            append: {
                type: Object,
                default: () => {return {}}
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
            current_prepend: {
                type: String,
                default: ""
            },
            current_append: {
                type: String,
                default: ""
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
            }
        },
        watch: {
            selected_language: function (val) {
                require(`brace/mode/${language[val]}`);
                const editor = this.editor;
                editor.getSession().setMode(`ace/mode/${language[val]}`);
                $("#language").dropdown("set selected", val.toString());
                let prepend = this.prepend;
                let append = this.append;
                if (prepend && prepend[val] !== this.current_prepend) {
                    this.current_prepend = prepend[val];
                    if(this.prependView) {
                        this.prependView.getSession().setValue(this.current_prepend);
                    }
                }
                if (append && append[val] !== this.current_append) {
                    this.current_append = append[val];
                    if(this.appendView) {
                        this.appendView.getSession().setValue(this.current_append);
                    }
                }
            },
            theme: function (val) {
                const editor = this.editor;
                editor.setTheme(val);
                const prependView = this.prependView;
                if(prependView) {
                    this.prependView.setTheme(val);
                }
                const appendView = this.appendView;
                if(appendView) {
                    this.appendView.setTheme(val);
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
                        console.log("detectLang", detected_lang);
                        console.log("that.selected_language", that.selected_language);
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
            prepend: function(val) {
                if(!val) {
                    return;
                }
                const prependView = this.prependView = ace.edit("prepend");
                $("#prepend").css({
                    fontSize: "18px"
                });
                if(!val[this.selected_language]) {
                    this.selected_language = parseInt(Object.keys(val)[0]);
                }
                prependView.getSession().setMode(`ace/mode/${language[this.selected_language]}`);
                prependView.setTheme(this.theme);
                prependView.setReadOnly(true);
                prependView.getSession().setValue(val[this.selected_language]);
            },
            append: function(val) {
                if(!val) {
                    return;
                }
                let appendView = this.appendView;
                if(this.appendView === null) {
                    appendView = this.appendView = ace.edit("append");
                }
                if(!val[this.selected_language]) {
                    this.selected_language = parseInt(Object.keys(val)[0]);
                }
                appendView.getSession().setMode(`ace/mode/${language[this.selected_language]}`);
                appendView.setTheme(this.theme);
                appendView.getSession().setValue(val[this.selected_language]);
                appendView.setReadOnly(true);
            }
        },
        mounted() {
            this.initEditor();
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
</style>
