<template>
    <div :style="{width:'100%',height:`${height}px`,fontSize:fontSize+'px'}"
         ref="source" style="width:100%;height:460px"></div>
</template>

<script lang="ts">
import * as ace from "brace";
import "@/lib/brace/braceMode";
import "@/lib/brace/braceTheme";
import "brace/ext/language_tools";
import { defineComponent } from "vue";
// @ts-ignore
window.ace = ace;
const language = ["c_cpp", "c_cpp", "pascal", "java", "ruby", "sh", "python", "php", "perl", "csharp", "objectivec", "text", "scheme", "c_cpp", "c_cpp", "lua", "javascript", "golang", "python", "c_cpp", "c_cpp", "c_cpp", "text", "java", "java", "python", "python", "java", "c_cpp", "c_cpp", "c_cpp"];
export default defineComponent({
    name: "AceEditor",
    props: {
        fontSize: { type: [String, Number], default: "18" },
        selected_language: { type: [Number, String], default: 0 },
        theme: { type: String, default: "ace/theme/monokai" },
        value: { type: String, default: "" },
        height: { type: Number, default: 460 },
        prependLength: { type: Number, default: 0 }
    },
    data () {
        return {
            source_code: "" as string
        };
    },
    watch: {
        source_code (val: string) {
            this.$emit("input", val);
        },
        value (val: string) {
            if (val !== this.source_code) {
                this.source_code = val;
                this.getEditor().getSession().setValue(val);
            }
        },
        prependLength (val: number) {
            this.getEditor().setOption("firstLineNumber", val + 1);
        },
        selected_language (val: string | number) {
            this.getEditor().getSession().setMode(`ace/mode/${language[parseInt(val as string)]}`);
        },
        theme (val: string) {
            this.getEditor().setTheme(val.includes("ace") ? val : "ace/theme/monokai");
        }
    },
    mounted () {
        this.initEditor();
    },
    methods: {
        // Kept off the reactive data: the editor instance must not be made reactive.
        getEditor (): any {
            return (this as any).editor_;
        },
        initEditor (): void {
            ace.acequire("ace/ext/language_tools");
            const editor: any = (this as any).editor_ = ace.edit(this.$refs.source as HTMLElement);
            editor.setOptions({
                enableBasicAutocompletion: true,
                enableSnippets: true,
                enableLiveAutocompletion: true,
                firstLineNumber: Math.max(this.prependLength, 1)
            });
            editor.getSession().setValue(this.value);
            editor.on("change", () => {
                this.source_code = editor.getSession().getValue();
                this.$store.commit("setCodeInfo", {
                    code: this.source_code
                });
            });
            editor.getSession().setMode(`ace/mode/${language[this.selected_language as number]}`);
            editor.setTheme(this.getThemeFromStorage());
        },
        getThemeFromStorage (): string {
            const defaultTheme = "ace/theme/monokai";
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
});
</script>

<style scoped>

</style>
