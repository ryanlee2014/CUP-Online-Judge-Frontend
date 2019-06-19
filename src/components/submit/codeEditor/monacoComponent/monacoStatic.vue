<template>
    <monaco-editor v-if="render" :fontSize="fontSize" :selected_language="selected_language" :theme="static_theme" v-model="content" :readOnly="true" :height="height" :minimap="false"></monaco-editor>
</template>

<script>
import monacoEditor from "../monacoEditor";
export default {
    name: "monacoStatic",
    components: {
        monacoEditor
    },
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
            default: "vs-dark"
        },
        fontSize: {
            type: String,
            default: "16"
        }
    },
    data () {
        return {
            render: false,
            lines: 0
        };
    },
    computed: {
        height: {
            get () {
                let fontSize = parseInt(this.fontSize);
                if (fontSize < 6) {
                    fontSize = 6;
                }
                let heightOfEachLine = Math.round((fontSize * 4 + 2) / 3);
                return heightOfEachLine * this.lines + 10;
            },
            set (val) {
                this.lines = val;
                if (val > 0) {
                    this.render = true;
                }
            }
        }
    },
    watch: {
        content (val) {
            this.height = val.split("\n").length;
        }
    }
};
</script>

<style scoped>

</style>
