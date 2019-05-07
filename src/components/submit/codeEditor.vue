<template>
    <div>
        <div class="ui menu borderless" id="modeBar" style="margin: 0;
        padding: 0;
        position: relative;
        height: 35px;
        color: black;width:100%;text-align:right">
            <div class="item not-compile">
                <select :class="'ui dropdown selection'" class="not-compile" id="language" name="language"
                        v-cloak v-model="selected_language">
                    <option :key="language" :value="language.num" v-for="language in lang_list">{{language.name}}
                    </option>
                </select>
                <div class="item">
                    <div class="ui toggle checkbox" v-cloak>
                        <input type="checkbox" v-model="auto_detect">
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
                    <span>主题:</span>
                    <select class="ui selection dropdown search" id="theme" size="1">
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
                    </select>
                </div>
            </div>
        </div>
        <div :ace-mode="'ace/mode/'+language_template[selected_language]" ace-theme="ace/theme/monokai"
             class="prepend code"
             id="prepend"
             style="width: 100%;padding:0;line-height:1.2;text-align:left;margin-bottom:0;"
             v-if="prepend" v-text="current_prepend">
        </div>
        <div :style="{width:'100%',height:'460px',fontSize:fontSize+'px'}" cols=180
             id="source" rows=20
             style="width:100%;height:460px"></div>
        <div :ace-mode="'ace/mode/'+language_template[selected_language]" ace-theme="ace/theme/monokai" class="append code"
             id="append"
             style="width: 100%; padding:0; line-height:1.2;text-align:left;margin-bottom:0;"
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
                    <div class="ui input"><input @keyup="resize($event)" id="fontsize"
                                                 style="width:60px;text-align:center;height:30px"
                                                 type="text" value=""></div>
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
    </div>
</template>

<script>
    const defaultConfig = {
        lang: 'c_cpp',
        theme: 'monokai',
        options: {
            useSoftTabs: true,
            tabSize: 4
        }
    };
    const ace = require("brace");
    export default {
        name: "codeEditor",
        data() {
            return {
                temp_value: (() => this.value)(),
                fontSize: 18,
                editor: null,
                auto_detect: false,
                submitDisabled: false,
                hide_warning: true
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
            value: {
                type: String,
                default: ''
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
            selected_language: {
                type: Number,
                default: 0
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
            }
        },
        watch: {
            value: function (val, oldVal) {
                this.temp_value = val;
            },
            temp_value: function (val, oldVal) {
                this.$emit('input', val);
            },
            selected_language: function (val, oldVal) {
                this.$emit("valueChange", {key: "selected_language", value: val});
            }
        },
        methods: {
            resize: function ($event) {
                const size = $event.target.value;
                localStorage.setItem('font-size', size);
                this.fontSize = size;
            },
            do_submit: function () {
                //TODO: complete do_submit
            },
            pre_test_run: function () {
                //TODO: complete pre_test_run
            }
        },
        computed: {
            editorConfig() {
                return Object.assign({}, defaultConfig, this.config)
            }
        },
        beforeDestroy() {
            this.editor.destory();
            this.editor.container.remove();
        },
        mounted() {
            let vm = this,
                {
                    lang,
                    theme
                } = this.editorConfig,
                editor;

            lang === 'html' && require('brace/ext/emmet');
            require('brace/ext/language_tools');
            require('brace/mode/' + lang);
            require('brace/theme/' + theme);
            require('brace/snippets/' + lang);

            this.editor = editor = ace.edit(this.$el);

            editor.setTheme('ace/theme/' + theme);
            editor.setOption("enableEmmet", true);
            editor.getSession().setMode('ace/mode/' + lang);
            editor.$blockScrolling = Infinity;
            editor.setFontSize(this.fontSize);
            editor.setValue(this.value);
            this.editorConfig.options && editor.setOptions(this.editorConfig.options);

            this.$emit('init', editor);

            editor.on('change', () => {
                vm.$emit('input', editor.getValue());
            });
        }
    }
</script>

<style scoped>

</style>
