<template>
    <div :style="{width:'100%',height:'460px',fontSize:fontSize+'px'}" cols=180
         id="source" rows=20
         style="width:100%;height:460px"></div>
</template>

<script>
    const ace = require("brace");
    const detectLang = require("../../../lib/langDetector");
    window.ace = ace;
    require("../../../lib/brace/braceMode");
    require("../../../lib/brace/braceTheme");
    const language = ["c_cpp", "c_cpp", "pascal", "java", "ruby", "bash", "python", "php", "perl", "csharp", "objectivec", "text", "scheme", "c_cpp", "c_cpp", "lua", "javascript", "go", "python", "c_cpp", "c_cpp", "c_cpp", "text", "java", "java", "python", "python", "java", "c_cpp", "c_cpp"];
    export default {
        name: "aceEditor",
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
                default: "ace/theme/monokai"
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
        mounted() {
            console.log("aceEditor get value", this.value);
            this.initEditor();
        },
        watch: {
            source_code(val) {
                this.$emit("input", val);
            },
            value(val) {
                if(val !== this.source_code) {
                    this.source_code = val;
                    this.editor.getSession().setValue(val);
                }
            },
            selected_language(val) {
                this.editor.getSession().setMode(`ace/mode/${language[val]}`);
            },
            theme(val) {
                if (val.includes("ace")) {
                    this.editor.setTheme(val);
                }
                else {
                    this.editor.setTheme("ace/theme/monokai");
                }
            }
        },
        methods: {
            initEditor() {
                const editor = this.editor = ace.edit("source");
                editor.getSession().setValue(this.value);
                editor.on("change", () => {
                    this.source_code = this.editor.getSession().getValue();
                    this.$store.commit("setCodeInfo", {
                        code: this.source_code
                    });
                });
                editor.getSession().setMode(`ace/mode/${language[this.selected_language]}`);
                editor.setTheme(this.getThemeFromStorage());
            },
            getThemeFromStorage() {
                let defaultTheme = "ace/theme/monokai";
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
