<template>
    <div :style="{width:'100%',height:`${height}px`,fontSize:fontSize+'px'}" cols=180
         ref="source" rows=20
         style="width:100%;height:460px"></div>
</template>

<script>
import * as monaco from "monaco-editor";
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
        },
        readOnly: {
            type: Boolean,
            default: false
        },
        height: {
            type: Number,
            default: 460
        },
        minimap: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            editor: null,
            source_code: ""
        };
    },
    watch: {
        source_code (val) {
            this.$emit("input", val);
        },
        selected_language (val) {
            if (this.editor) {
                const oldModel = this.editor.getModel();
                const newModel = monaco.editor.createModel(oldModel.getValue(), languageMap[val]);
                this.editor.setModel(newModel);
                if (oldModel) {
                    oldModel.dispose();
                }
                this.modelEventRegistry();
            }
        },
        value (val) {
            if (val !== this.source_code) {
                this.source_code = val;
                this.editor.getModel().setValue(val);
            }
        },
        theme (val) {
            if (this.editor) {
                if (val.includes("vs") || val.includes("hc-black")) {
                    monaco.editor.setTheme(val);
                }
                else {
                    monaco.editor.setTheme("vs-dark");
                }
            }
        },
        fontSize (val) {
            if (this.editor && !isNaN(val)) {
                this.editor.updateOptions({
                    fontSize: parseInt(val)
                });
            }
        },
        height () {
            if (this.editor) {
                this.$nextTick(() => {
                    this.editor.layout();
                });
            }
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.initEditor();
        });
    },
    methods: {
        initEditor () {
            this.editor = monaco.editor.create(this.$refs.source, {
                value: this.value,
                language: languageMap[this.selected_language],
                minimap: {
                    enabled: this.minimap
                },
                fontLigatures: true,
                scrollBeyondLastLine: false,
                readOnly: this.readOnly
            });
            this.editor.updateOptions({
                fontSize: this.getFontSizeFromStorage()
            });
            monaco.editor.setTheme(this.getThemeFromStorage());
            this.modelEventRegistry();
        },
        modelEventRegistry () {
            const currentModel = this.editor.getModel();
            currentModel.onDidChangeContent(() => {
                this.source_code = this.editor.getModel().getValue();
                this.$store.commit("setCodeInfo", {
                    code: this.source_code
                });
            });
        },
        getDataFromStorage (defaultValue, key) {
            let data;
            try {
                data = JSON.parse(localStorage.submitConfig)[key];
            }
            catch (e) {
                data = defaultValue;
            }
            return data;
        },
        getThemeFromStorage () {
            return this.getDataFromStorage("vs-dark", "theme");
        },
        getFontSizeFromStorage () {
            return this.getDataFromStorage(16, "fontSize");
        }
    }
};
</script>

<style scoped>

</style>
