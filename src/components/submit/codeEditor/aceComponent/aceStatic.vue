<template>
    <div :ace-mode="'ace/mode/'+language[selected_language]" :ace-theme="static_theme"
         ace-gutter="true" class="prepend code"
         ref="staticElement"
         style="width: 100%;padding:0px;line-height:1.2;text-align:left;margin-bottom:0px;"
         v-text="content">
    </div>
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
export default class AceStatic extends Vue {
    @Prop({ default: "" }) content!: string;
    @Prop({ default: 0 }) selected_language!: number;
    @Prop({ default: "monokai" }) static_theme!: string;
    highlight: any = null;
    dirty = false;
    language = language;
    mounted () {
        this.initHighlight();
    }

    initHighlight () {
        const that = this;
        require("brace/ext/static_highlight");
        // @ts-ignore
        ace.acequire(["ace/ext/static_highlight"], function (fn) {
            that.highlight = fn;
            if (that.dirty) {
                that.renderHighlight();
            }
        });
    }
    renderHighlight () {
        const h = this.highlight;
        if (typeof h === "function") {
            const highlight = h;
            const val: any = this.$refs.staticElement;
            this.dirty = false;
            this.$nextTick(() => {
                highlight(val, {
                    mode: val.getAttribute("ace-mode"),
                    theme: val.getAttribute("ace-theme"),
                    startLineNumber: 1,
                    showGutter: val.getAttribute("ace-gutter"),
                    trim: true
                }, function () {});
            });
        }
        else {
            this.dirty = true;
        }
    }

    @Watch("content")
    @Watch("static_theme")
    onWatchChanged () {
        this.renderHighlight();
    }
}
</script>

<style scoped>

</style>
