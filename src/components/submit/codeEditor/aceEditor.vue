<template>
    <div :style="{width:'100%',height:`${height}px`,fontSize:fontSize+'px'}"
         ref="source" style="width:100%;height:460px"></div>
</template>

<script lang="ts">
import * as ace from "brace";
import "@/lib/brace/braceMode";
import "@/lib/brace/braceTheme";
import Vue from "vue";
import { Prop, Component, Watch } from "vue-property-decorator";
// @ts-ignore
window.ace = ace;
const language = ["c_cpp", "c_cpp", "pascal", "java", "ruby", "bash", "python", "php", "perl", "csharp", "objectivec", "text", "scheme", "c_cpp", "c_cpp", "lua", "javascript", "go", "python", "c_cpp", "c_cpp", "c_cpp", "text", "java", "java", "python", "python", "java", "c_cpp", "c_cpp"];
@Component
export default class AceEditor extends Vue {
    @Prop({ default: "18" }) fontSize!: string;
    @Prop({ default: 0 }) selected_language!: number;
    @Prop({ default: "ace/theme/monokai" }) theme!: string;
    @Prop({ default: "" }) value!: string;
    @Prop({ default: 460 }) height!: number;

    $refs: any;

    editor: any = null;
    source_code: any = "";

    mounted () {
        this.initEditor();
    }

    @Watch("source_code")
    onSourceCodeChanged (val: string) {
        this.$emit("input", val);
    }

    @Watch("value")
    onValueChanged (val: string) {
        if (val !== this.source_code) {
            this.source_code = val;
            this.editor.getSession().setValue(val);
        }
    }

    @Watch("selected_language")
    onSelectedLanguageChanged (val: string) {
        this.editor!.getSession().setMode(`ace/mode/${language[parseInt(val)]}`);
    }

    @Watch("theme")
    onThemeChanged (val: string) {
        if (val.includes("ace")) {
            this.editor.setTheme(val);
        }
        else {
            this.editor.setTheme("ace/theme/monokai");
        }
    }

    initEditor () {
        const editor = this.editor = ace.edit(this.$refs.source);
        editor.getSession().setValue(this.value);
        editor.on("change", () => {
            this.source_code = this.editor.getSession().getValue();
            this.$store.commit("setCodeInfo", {
                code: this.source_code
            });
        });
        editor.getSession().setMode(`ace/mode/${language[this.selected_language]}`);
        editor.setTheme(this.getThemeFromStorage());
    }
    getThemeFromStorage () {
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
</script>

<style scoped>

</style>
