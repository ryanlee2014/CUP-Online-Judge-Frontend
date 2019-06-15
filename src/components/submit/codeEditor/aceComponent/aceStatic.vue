<template>
    <div :ace-mode="'ace/mode/'+language[selected_language]" :ace-theme="static_theme"
         ace-gutter="true" class="prepend code"
         ref="staticElement"
         style="width: 100%;padding:0px;line-height:1.2;text-align:left;margin-bottom:0px;"
         v-text="content">
    </div>
</template>

<script>
const ace = require("brace");
require("../../../../lib/brace/braceMode");
require("../../../../lib/brace/braceTheme");
const language = ["c_cpp", "c_cpp", "pascal", "java", "ruby", "bash", "python", "php", "perl", "csharp", "objectivec", "text", "scheme", "c_cpp", "c_cpp", "lua", "javascript", "go", "python", "c_cpp", "c_cpp", "c_cpp", "text", "java", "java", "python", "python", "java", "c_cpp", "c_cpp"];
export default {
    name: "aceStatic",
    props: {
        content: {
            type: String,
            default: ""
        },
        selected_language: {
            type: Number,
            default: 0
        },
        static_theme: {
            type: String,
            default: "monokai"
        }
    },
    data () {
        return {
            highlight: null,
            dirty: false,
            language
        };
    },
    mounted () {
        this.initHighlight();
    },
    methods: {
        initHighlight () {
            const that = this;
            require("brace/ext/static_highlight");
            ace.acequire(["ace/ext/static_highlight"], function (fn) {
                that.highlight = fn;
                if (that.dirty) {
                    that.renderHighlight();
                }
            });
        },
        renderHighlight () {
            const h = this.highlight;
            if (typeof h === "function") {
                const highlight = h;
                const val = this.$refs.staticElement;
                this.dirty = false;
                this.$nextTick(() => {
                    highlight(val, {
                        mode: val.getAttribute("ace-mode"),
                        theme: val.getAttribute("ace-theme"),
                        startLineNumber: 1,
                        showGutter: val.getAttribute("ace-gutter"),
                        trim: true
                    }, function (highlighted) {});
                });
            }
            else {
                this.dirty = true;
            }
        }
    },
    watch: {
        content () {
            this.renderHighlight();
        },
        static_theme () {
            this.renderHighlight();
        }
    }
};
</script>

<style scoped>

</style>
