<template>
    <div :ace-mode="'ace/mode/'+language[selected_language]" :ace-theme="static_theme"
         ace-gutter="true" class="prepend code"
         ref="staticElement"
         :style="'width: 100%;padding:0px;line-height:1.2;text-align:left;margin-bottom:0px;' + `font-size: ${fontSize}px;`"
         v-text="content">
    </div>
</template>

<script lang="ts">
import * as ace from "brace";
import "@/lib/brace/braceMode";
import "@/lib/brace/braceTheme";
import Vue from "vue";
import { Prop, Component, Watch } from "vue-property-decorator";
import { Lock } from "@/module/Decorator/method";
import AwaitLock from "await-lock";
// @ts-ignore
window.ace = ace;
const language = ["c_cpp", "c_cpp", "pascal", "java", "ruby", "sh", "python", "php", "perl", "csharp", "objectivec", "text", "scheme", "c_cpp", "c_cpp", "lua", "javascript", "go", "python", "c_cpp", "c_cpp", "c_cpp", "text", "java", "java", "python", "python", "java", "c_cpp", "c_cpp"];
@Component
export default class AceStatic extends Vue {
    @Prop({ default: "" }) content!: string;
    @Prop({ default: 0 }) selected_language!: number;
    @Prop({ default: "monokai" }) static_theme!: string;
    @Prop({ default: 0 }) prependLength!: number;
    @Prop({ default: 16 }) fontSize!: number;
    highlight: any = null;
    dirty = false;
    language = language;
    mounted () {
        this.initHighlight();
        window.render = this.renderHighlight;
    }

    initHighlight () {
        const that = this;
        require("brace/ext/static_highlight");
        // @ts-ignore
        ace.acequire(["ace/ext/static_highlight"], function (fn) {
            that.highlight = fn;
            that.renderHighlight();
        });
    }

    @Lock(new AwaitLock())
    async renderHighlight () {
        return new Promise((resolve) => {
            const h = this.highlight;
            if (typeof h === "function") {
                const highlight = h;
                const val: any = this.$refs.staticElement;
                $(val).text(this.content);
                this.$nextTick(() => {
                    highlight(val, {
                        mode: val.getAttribute("ace-mode"),
                        theme: val.getAttribute("ace-theme"),
                        firstLineNumber: Math.max(this.prependLength, 0) + 1,
                        showGutter: val.getAttribute("ace-gutter"),
                        trim: true
                    }, function () { resolve(null); });
                });
            }
        });
    }

    @Watch("content")
    @Watch("static_theme")
    @Watch("prependLength")
    onWatchChanged () {
        this.renderHighlight();
    }
}
</script>

<style scoped>

</style>
