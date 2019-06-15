<template>
    <monaco-editor v-if="render" :selected_language="selected_language" :theme="static_theme" v-model="content" :readOnly="true" :height="22*content.split('\n').length"></monaco-editor>
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
                return 22 * this.lines;
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
