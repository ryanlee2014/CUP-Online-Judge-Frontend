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
import { defineComponent } from "vue";
import AwaitLock from "await-lock";
// @ts-ignore
window.ace = ace;
const language = ["c_cpp", "c_cpp", "pascal", "java", "ruby", "sh", "python", "php", "perl", "csharp", "objectivec", "text", "scheme", "c_cpp", "c_cpp", "lua", "javascript", "golang", "python", "c_cpp", "c_cpp", "c_cpp", "text", "java", "java", "python", "python", "java", "c_cpp", "c_cpp"];
// Shared by every instance, like the former @Lock(new AwaitLock()) decorator.
const renderLock = new AwaitLock();
export default defineComponent({
    name: "AceStatic",
    props: {
        content: { type: String, default: "" },
        selected_language: { type: Number, default: 0 },
        static_theme: { type: String, default: "monokai" },
        prependLength: { type: Number, default: 0 },
        fontSize: { type: [Number, String], default: 16 }
    },
    data () {
        return {
            highlight: null as any,
            dirty: false,
            language
        };
    },
    watch: {
        content () {
            this.renderHighlight();
        },
        static_theme () {
            this.renderHighlight();
        },
        prependLength () {
            this.renderHighlight();
        }
    },
    mounted () {
        this.initHighlight();
        window.render = this.renderHighlight;
    },
    methods: {
        initHighlight (): void {
            const that = this;
            require("brace/ext/static_highlight");
            // @ts-ignore
            ace.acequire(["ace/ext/static_highlight"], function (fn) {
                that.highlight = fn;
                that.renderHighlight();
            });
        },
        async renderHighlight (): Promise<unknown> {
            await renderLock.acquireAsync();
            const resp = new Promise((resolve) => {
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
            renderLock.release();
            return resp;
        }
    }
});
</script>

<style scoped>

</style>
