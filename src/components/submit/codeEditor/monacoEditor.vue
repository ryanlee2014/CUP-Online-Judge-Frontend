<template>
    <div :style="{width:'100%',height:`${height}px`,fontSize:fontSize+'px'}" cols=180
         ref="source" rows=20
         style="width:100%;height:460px"></div>
</template>

<script lang="ts">
import * as monaco from "monaco-editor";
import languageMap from "../../../lib/constants/monaco-editor/language-map";
import { defineComponent } from "vue";
import { createLanguageServer } from "@/module/Editor/monaco-client";

export default defineComponent({
    name: "MonacoEditor",
    props: {
        fontSize: { type: [String, Number], default: "18" },
        selected_language: { type: [Number, String], default: 0 },
        theme: { type: String, default: "vs-dark" },
        value: { type: String, default: "" },
        height: { type: [Number, String], default: 460 },
        readOnly: { type: Boolean, default: false },
        minimap: { type: Boolean, default: true },
        enableLanguageServer: { type: Boolean, default: false },
        prependLength: { type: Number, default: 0 }
    },
    data () {
        return {
            source_code: ""
        };
    },
    watch: {
        source_code (val: string) {
            this.$emit("input", val);
        },
        value (val: string) {
            if (val !== this.source_code) {
                this.source_code = val;
                this.getEditor()!.getModel()!.setValue(val);
            }
        },
        selected_language (val: any, oldVal: any) {
            const editor = this.getEditor();
            if (editor && languageMap[val] !== languageMap[oldVal]) {
                this.closeLanguageServer();
                const oldModel = editor.getModel()!;
                const newModel = monaco.editor.createModel(oldModel.getValue(), languageMap[parseInt(val)], this.getMonacoUri(languageMap[val]));
                editor.setModel(newModel);
                if (oldModel) {
                    oldModel.dispose();
                }
                this.getNewLanguageServer(editor, this.value, languageMap[val]);
                this.modelEventRegistry();
            }
        },
        theme (val: string) {
            if (this.getEditor()) {
                if (val.includes("vs") || val.includes("hc-black")) {
                    monaco.editor.setTheme(val);
                }
                else {
                    monaco.editor.setTheme("vs-dark");
                }
            }
        },
        fontSize (val: string) {
            const editor = this.getEditor();
            if (editor && !isNaN(parseInt(val))) {
                editor.updateOptions({
                    fontSize: parseInt(val)
                });
            }
        },
        height () {
            if (this.getEditor()) {
                this.$nextTick(() => {
                    this.getEditor()!.layout();
                });
            }
        },
        prependLength (val: number) {
            if (this.getEditor()) {
                this.$nextTick(() => {
                    this.getEditor()!.updateOptions({
                        lineNumbers: (line: number) => (val + line).toString()
                    });
                });
            }
        },
        enableLanguageServer (val: boolean) {
            if (!val) {
                this.$nextTick(() => {
                    this.getEditor()!.dispose();
                    this.closeLanguageServer(true);
                    this.buildEditor();
                });
            }
            else {
                this.getNewLanguageServer(this.getEditor()!, this.value, languageMap[this.selected_language as number]);
            }
        }
    },
    mounted () {
        this.buildEditor();
    },
    beforeDestroy () {
        this.closeLanguageServer();
        const editor = this.getEditor();
        if (editor) {
            editor.dispose();
        }
    },
    methods: {
        // The editor and language server live off the reactive data on purpose.
        getEditor (): monaco.editor.IStandaloneCodeEditor | null {
            return (this as any).editor_ || null;
        },
        getMonacoUri (languageSuffix: string): monaco.Uri {
            const uri = `file:///tmp/cupoj-language-server${this.readOnly ? "" : "/intellisense"}/${this.languageServerId()}/Main.${languageSuffix}`;
            return monaco.Uri.parse(uri);
        },
        getNewLanguageServer (editor: monaco.editor.IStandaloneCodeEditor, value: string, language: string): void {
            if (this.enableLanguageServer) {
                try {
                    (this as any).languageServer_ = createLanguageServer(editor, value, language);
                }
                catch (e) {
                    // Language server is optional (completion only); keep the editor usable.
                    console.warn("language server unavailable:", e);
                }
            }
        },
        closeLanguageServer (enableServer = false): void {
            const languageServer = (this as any).languageServer_;
            if (this.enableLanguageServer || enableServer) {
                if (languageServer && languageServer.close) {
                    languageServer.close();
                }
            }
        },
        buildEditor (): void {
            this.$nextTick(() => {
                this.initEditor();
            });
        },
        languageServerId (): string {
            return `${(+(new Date())).toString()}${this.$store.getters.user_id}${Math.trunc(Math.random() * 1000).toString()}`;
        },
        initEditor (): void {
            const language = languageMap[this.selected_language as number];
            const editor = (this as any).editor_ = monaco.editor.create(this.$refs.source as HTMLElement, {
                model: monaco.editor.createModel(this.value, language, this.getMonacoUri(language)),
                value: this.value,
                lineNumbers: (line: number) => (this.prependLength + line).toString(),
                language,
                minimap: {
                    enabled: this.minimap
                },
                glyphMargin: true,
                lightbulb: {
                    enabled: true
                },
                fontLigatures: true,
                scrollBeyondLastLine: false,
                readOnly: this.readOnly
            });
            // Wire the content listener first: anything below failing must not leave the
            // editor disconnected from v-model / the store (code would silently not be submitted).
            this.modelEventRegistry();
            editor.updateOptions({
                fontSize: this.getFontSizeFromStorage()
            });
            monaco.editor.setTheme(this.getThemeFromStorage());
            this.getNewLanguageServer(editor, this.value, language);
        },
        // Editor-level content event: keeps firing after setModel() (language switch / rebuild),
        // unlike a listener bound to one model. Registered once per editor instance.
        modelEventRegistry (): void {
            const editor: any = this.getEditor();
            if (!editor || editor.__kcContentListener) {
                return;
            }
            editor.__kcContentListener = editor.onDidChangeModelContent(() => {
                this.source_code = editor.getValue();
                this.$store.commit("setCodeInfo", {
                    code: this.source_code
                });
                this.valueChanged(this.source_code);
            });
        },
        valueChanged (newVal: string): void {
            this.$emit("input", newVal);
        },
        getDataFromStorage (defaultValue: any, key: string): any {
            let data;
            try {
                data = JSON.parse(localStorage.submitConfig)[key];
            }
            catch (e) {
                data = defaultValue;
            }
            return data;
        },
        getThemeFromStorage (): string {
            return this.getDataFromStorage("vs-dark", "theme");
        },
        getFontSizeFromStorage (): number {
            return this.getDataFromStorage(16, "fontSize");
        }
    }
});
</script>

<style scoped>

</style>
