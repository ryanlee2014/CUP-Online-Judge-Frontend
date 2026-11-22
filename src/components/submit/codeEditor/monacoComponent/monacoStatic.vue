<template>
    <monaco-editor v-if="render" :fontSize="fontSize" :enable-language-server="false" :prepend-length="prependLength" :selected_language="selected_language" :theme="static_theme" :value="content" :readOnly="true" :height="height" :minimap="false"></monaco-editor>
</template>

<script lang="ts">
import monacoEditor from "../monacoEditor.vue";
import { defineComponent } from "vue";
export default defineComponent({
    name: "MonacoStatic",
    components: {
        monacoEditor
    },
    props: {
        content: { type: String, default: "" },
        selected_language: { type: Number, default: 0 },
        static_theme: { type: String, default: "vs-dark" },
        fontSize: { type: String, default: "16" },
        prependLength: { type: Number, default: 0 }
    },
    data () {
        return {
            render: false,
            lines: 0
        };
    },
    computed: {
        height: {
            get (): number {
                let fontSize = parseInt(this.fontSize);
                if (fontSize < 6) {
                    fontSize = 6;
                }
                const heightOfEachLine = Math.round((fontSize * 4 + 2) / 3);
                return heightOfEachLine * this.lines + 10;
            },
            set (val: any) {
                this.lines = val;
                if (val > 0) {
                    this.render = true;
                }
            }
        }
    },
    watch: {
        content (val: string) {
            this.height = val.split("\n").length;
        }
    }
});
</script>

<style scoped>

</style>
