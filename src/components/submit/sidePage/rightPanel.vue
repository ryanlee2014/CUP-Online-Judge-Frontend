<template>
    <div style="width:65%;position:relative;float:left;" id="right-side">
        <textarea style="display:none" cols=40 rows=5 name="input_text"
                  id="ipt" class="sample_input">样例输入</textarea>
        <div id="modeBar" style="margin: 0;
        padding: 0;
        position: relative;
        height: 35px;
        color: black;width:100%;text-align:right" class="ui menu borderless">
            <div class="item not-compile">
                <select class="not-compile" v-cloak :class="'ui dropdown selection'" id="language"
                        name="language" v-model="selected_language">
                    <option :key="language.num" v-for="language in lang_list" :value="language.num">{{language.name}}</option>
                </select>
                <div class="item">
                    <div class="ui toggle checkbox" v-cloak>
                        <input type="checkbox" name="auto_detect" v-model="auto_detect">
                        <label>自动选择</label>
                    </div>
                </div>
                <a
                        :class="'item'" class="not-compile" v-cloak id="clipbtn" data-clipboard-action="copy"
                        style="float:left;" v-if="prepend||append">复制代码</a>

            </div>
            <div class="right menu">
                <div class="item">
                </div>

                <div class="item">
                    <span>主题:</span><select v-model="theme" class="ui selection dropdown search" id="theme" size="1">

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
        <div v-if="prepend" class="prepend code"
             style="width: 100%;padding:0px;line-height:1.2;text-align:left;margin-bottom:0px;"
             :ace-mode="'ace/mode/'+language_template[selected_language]"
             ace-theme="ace/theme/monokai"
             id="prepend" v-text="current_prepend">
        </div>
        <div style="width:100%;height:460px" :style="{width:'100%',height:'460px',fontSize:fontSize+'px'}"
             cols=180 rows=20
             id="source"></div>
        <div v-if="append" id="append" class="append code"
             style="width: 100%; padding:0px; line-height:1.2;text-align:left;margin-bottom:0px;"
             :ace-mode="'ace/mode/'+language_template[selected_language]"
             ace-theme="ace/theme/monokai" v-html="current_append">
        </div>
        <div id="statusBar" style="margin: 0;
        padding: 0;
        position: relative;
        height: 30px;
        color: black;width:100%" class="ui menu borderless">
            <div style="text-align:center;" class="item">
                CUP Online Judge&nbsp;&nbsp;
                <div class="item">
                    <div class="ui toggle checkbox" v-cloak v-if="!iscontest">
                        <input type="checkbox" name="share" v-model="share">
                        <label>允许他人查看代码</label>
                    </div>
                </div>
                <div class="item"><span class="item">字号:</span>
                    <div class="ui input"><input type="text" v-model="fontSize"
                                                 style="width:60px;text-align:center;height:30px"
                                                 id="fontsize"></div>
                </div>
            </div>
            <div class="ui right menu">
                <div class="ui buttons">
                    <input id="Submit" class="ui button green " :disabled="submitDisabled" type=button
                           value="提交"
                           @click="do_submit">
                    <div class="or"></div>
                    <input id="TestRun" class="ui button blue" @click="pre_test_run" :disabled="submitDisabled"
                           type=button value="测试运行"
                    >&nbsp;<!--<span class="btn" id=result>状态</span>-->
                </div>
            </div>
        </div>
        <div class="ui teal progress result" data-value="0" data-total="3" id="progress" style="display:none">
            <div class="bar">
                <div class="progress"></div>
            </div>
            <div class="label progess_text"></div>
        </div>
        <div class="ui warning message hidden" :class="'ui warning message '+(hide_warning?'hidden':'')">
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
    const language = ["c_cpp", "c_cpp", "pascal", "java", "ruby", "bash", "python", "php", "perl", "csharp", "objectivec", "text", "scheme", "c_cpp", "c_cpp", "lua", "javascript", "go","python","c_cpp","c_cpp","c_cpp", "text","java","java","python","python","java","c_cpp","c_cpp"];
    const language_ext = ["c", "cc", "pas", "java", "rb", "sh", "py", "php", "pl", "cs", "m", "bas", "scm", "c", "cc", "lua", "js", "go","py","cpp","cpp","c","kt","java","java","python","python","java","c","cc"];
    export default {
        name: "rightPanel",
        data() {
            return {
                selected_language: 0,
                auto_detect: false,
                share: false,
                fontSize: 18,
                theme: "ace/theme/monokai",
                editor: null
            }
        },
        props: {
            prepend: {
                type: Boolean,
                default: false
            },
            append: {
                type: Boolean,
                default: false
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
                default: () => {}
            },
            pre_test_run: {
                type: Function,
                default: () => {}
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
            },
            theme: function (val) {
                require(val.replace("ace", "brace"));
                const editor = this.editor;
                editor.getSession().setTheme(val);
            }
        },
        mounted() {
            this.initEditor();
        },
        methods: {
            initEditor() {
                const editor = this.editor = ace.edit("source");
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
