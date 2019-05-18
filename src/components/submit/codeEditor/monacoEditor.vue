<template>
    <div :style="{width:'100%',height:'460px',fontSize:fontSize+'px'}" cols=180
         id="source" rows=20
         style="width:100%;height:460px"></div>
</template>

<script>
    import * as monaco from 'monaco-editor';
    const languageMap = [
        "cpp",
        "cpp",
        "pascal",
        "java",
        "ruby",
        "bash",
        "python",
        "php",
        "perl",
        "csharp",
        "objectivec",
        "freebasic",
        "schema",
        "cpp",
        "cpp",
        "lua",
        "javascript",
        "go",
        "python",
        "cpp",
        "cpp",
        "cpp",
        "kotlin",
        "java",
        "java",
        "python",
        "python",
        "java",
        "cpp",
        "cpp",
        ""
    ];
    export default {
        name: "monacoEditor",
        props: {
            fontSize: {
                type: String,
                default: "18"
            },
            selected_language: {
                type: Number,
                default: 0
            },
            theme: {
                type: String,
                default: "vs-dark"
            },
            value: {
                type: String,
                default: ""
            }
        },
        data() {
            return {
                editor: null,
                source_code: ""
            }
        },
        watch: {
            source_code(val) {
                this.$emit("input", val);
            },
            selected_language(val) {
                if(this.editor) {
                    const oldModel = this.editor.getModel();
                    const newModel = monaco.editor.createModel(oldModel.getValue(), languageMap[val]);
                    this.editor.setModel(newModel);
                    if (oldModel) {
                        oldModel.dispose();
                    }
                }
            },
            value(val) {
                if (val !== this.source_code) {
                    this.source_code = val;
                    this.editor.getModel().setValue(val);
                }
            },
            theme(val) {
                if(this.editor) {
                    if (val.includes("vs") || val.includes("hc-black")) {
                        monaco.editor.setTheme(val);
                    }
                    else {
                        monaco.editor.setTheme("vs-dark");
                    }
                }
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.initEditor();
            })
        },
        methods: {
            initEditor() {
                this.editor = monaco.editor.create(document.getElementById("source"), {
                    value: this.value,
                    language: languageMap[this.selected_language],
                    fontLigatures: true
                });
                const currentModel = this.editor.getModel();
                monaco.editor.setTheme(this.getThemeFromStorage());
                currentModel.onDidChangeContent(() => {
                    this.source_code = this.editor.getModel().getValue();
                    this.$store.commit("setCodeInfo", {
                        code: this.source_code
                    });
                });
            },
            getThemeFromStorage() {
                let defaultTheme = "vs-dark";
                let theme;
                try {
                    theme = JSON.parse(localStorage.submitConfig).theme;
                }
                catch (e) {
                    theme = defaultTheme;
                }
                return theme;
            }
        }
    }
</script>

<style scoped>

</style>
