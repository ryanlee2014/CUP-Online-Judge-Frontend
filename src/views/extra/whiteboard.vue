<template>
    <div class="ui container padding">
        <div class="ui grid">
            <div class="row">
                <div class="column">
                    <div class="ui menu borderless" id="modeBar" style="margin: 0;
        padding: 0;
        position: relative;
        height: 35px;
        color: black;width:100%;text-align:right">
                        <div class="right menu">
                            <ace-theme-selector v-if="!editorPackage" v-model="theme"></ace-theme-selector>
                            <monaco-theme-selector v-else v-model="theme"></monaco-theme-selector>

                        </div>
                    </div>
                    <ace-editor :fontSize="fontSize" :selected_language="selected_language" :theme="theme"
                                v-if="!editorPackage" v-model="code"></ace-editor>
                    <monaco-editor :fontSize="fontSize" :selected_language="selected_language" :theme="theme"
                                   v-else v-model="code">

                    </monaco-editor>
                    <div class="ui menu borderless" id="statusBar" style="margin: 0;
        padding: 0;
        position: relative;
        height: 30px;
        color: black;width:100%">
                        <div class="item" style="text-align:center;">
                            CUP Online Judge&nbsp;&nbsp;
                            <div class="item">
                                <div class="ui toggle checkbox">
                                    <input type="checkbox" v-model="editorPackage">
                                    <label>切换编辑器</label>
                                </div>
                            </div>
                            <div class="item" v-show="!editorPackage"><span class="item">字号:</span>
                                <div class="ui input"><input id="fontsize"
                                                             style="width:60px;text-align:center;height:30px"
                                                             type="text"
                                                             v-model="fontSize"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    const langMap = {
        "c11": 0,
        "cpp17": 1,
        "pascal": 2,
        "java10": 3,
        "ruby": 4,
        "bash": 5,
        "python2": 6,
        "php": 7,
        "perl": 8,
        "csharp": 9,
        "obj-c": 10,
        "freebasic": 11,
        "schema": 12,
        "clang": 13,
        "clangpp": 14,
        "lua": 15,
        "javascript": 16,
        "go": 17,
        "python3": 18,
        "cpp11": 19,
        "cpp98": 20,
        "c99": 21,
        "kotlin": 22,
        "java8": 23,
        "java7": 24,
        "pypy": 25,
        "pypy3": 26,
        "java6": 27,
        "clang11": 28,
        "clangpp17": 29
    };
    import aceEditor from '../../components/submit/codeEditor/aceEditor'
    import aceThemeSelector from '../../components/submit/codeEditor/aceComponent/aceThemeSelector'
    import monacoEditor from '../../components/submit/codeEditor/monacoEditor'
    import monacoThemeSelector from '../../components/submit/codeEditor/monacoComponent/monacoThemeSelector'

    const detectLang = require("../../lib/langDetector");
    export default {
        name: "whiteboard",
        components: {
            aceEditor,
            aceThemeSelector,
            monacoEditor,
            monacoThemeSelector
        },
        data() {
            return {
                theme: "ace/theme/monokai",
                code: "",
                editorPackage: true,
                fontSize: "16",
                selected_language: 0
            }
        },
        watch: {
            editorPackage(val) {
                if (val) {
                    this.theme = "vs-dark";
                } else {
                    this.theme = "ace/theme/monokai"
                }
            },
            code(val) {
                if (val) {
                    this.detectLanguageDebouncer();
                }
            }
        },
        mounted() {

        },
        methods: {
            detectLanguageDebouncer() {
                const that = this;
                (_.debounce(() => {
                    const detected_lang = detectLang(that.code, Object.values(langMap));
                    if (that.selected_language != detected_lang) {
                        that.selected_language = detected_lang;
                    }
                }, 100))();
            }
        }
    }
</script>

<style scoped>

</style>
