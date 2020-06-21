<template>
    <div :style="{width:'100%',height:`${height}px`,fontSize:fontSize+'px'}" cols=180
         ref="source" rows=20
         style="width:100%;height:460px"></div>
</template>

<script lang="ts">
import * as monaco from "monaco-editor";
import languageMap from "../../../lib/constants/monaco-editor/language-map";
import Vue from "vue";
import { Prop, Component, Watch } from "vue-property-decorator";
import { createLanguageServer } from "@/module/Editor/monaco-client";

@Component
export default class MonacoEditor extends Vue {
    @Prop({ default: "18" }) fontSize!: string;
    @Prop({ default: 0 }) selected_language!: number;
    @Prop({ default: "vs-dark" }) theme!: string;
    @Prop({ default: "" }) value!: string;
    @Prop({ default: 460 }) height!: number;
    @Prop({ default: false }) readOnly!: boolean;
    @Prop({ default: true }) minimap!: boolean;
    @Prop({ default: false }) enableLanguageServer!: boolean;
    @Prop({ default: 0 }) prependLength!: number;

    $refs: any;

    editor: monaco.editor.IStandaloneCodeEditor | null = null;
    source_code = "";
    languageServer!: WebSocket;

    @Watch("source_code")
    onSourceCodeChanged (val: string) {
        this.$emit("input", val);
    }

    @Watch("value")
    onValueChanged (val: string) {
        if (val !== this.source_code) {
            this.source_code = val;
            this.editor!.getModel()!.setValue(val);
        }
    }

    getMonacoUri (languageSuffix: string) {
        const uri = `file:///tmp/cupoj-language-server${this.readOnly ? "" : "/intellisense"}/${this.languageServerId()}/Main.${languageSuffix}`;
        console.log(uri);
        return monaco.Uri.parse(uri);
    }

    @Watch("selected_language")
    onSelectedLanguageChanged (val: any, oldVal: any) {
        if (this.editor && languageMap[val] !== languageMap[oldVal]) {
            console.log("Changed");
            this.closeLanguageServer();
            const oldModel = this.editor.getModel()!;
            const newModel = monaco.editor.createModel(oldModel.getValue(), languageMap[parseInt(val)], this.getMonacoUri(languageMap[val]));
            this.editor.setModel(newModel);
            if (oldModel) {
                oldModel.dispose();
            }
            this.getNewLanguageServer(this.editor, this.value, languageMap[val]);
            this.modelEventRegistry();
        }
    }

    getNewLanguageServer (editor: monaco.editor.IStandaloneCodeEditor, value: string, language: string) {
        if (this.enableLanguageServer) {
            this.languageServer = createLanguageServer(editor, value, language);
        }
    }

    closeLanguageServer () {
        if (this.enableLanguageServer) {
            if (this.languageServer && this.languageServer.close) {
                this.languageServer.close();
            }
        }
    }

    @Watch("theme")
    onThemeChanged (val: string) {
        if (this.editor) {
            if (val.includes("vs") || val.includes("hc-black")) {
                monaco.editor.setTheme(val);
            }
            else {
                monaco.editor.setTheme("vs-dark");
            }
        }
    }

    @Watch("fontSize")
    onFontSizeChanged (val: string) {
        if (this.editor && !isNaN(parseInt(val))) {
            this.editor.updateOptions({
                fontSize: parseInt(val)
            });
        }
    }

    @Watch("height")
    onHeightChanged (val: string) {
        if (this.editor) {
            this.$nextTick(() => {
                this.editor!.layout();
            });
        }
    }

    @Watch("prependLength")
    onPrependLengthChanged (val: number) {
        if (this.editor) {
            this.$nextTick(() => {
                this.editor!.updateOptions({
                    lineNumbers: (line: number) => (val + line).toString()
                });
            });
        }
    }

    mounted () {
        this.$nextTick(() => {
            this.initEditor();
        });
    }

    beforeDestroy () {
        this.closeLanguageServer();
        this.editor!.dispose();
    }

    languageServerId () {
        const id = `${(+(new Date())).toString()}${this.$store.getters.user_id}${Math.trunc(Math.random() * 1000).toString()}`;
        console.log("langid:", id);
        return id;
    }

    initEditor () {
        this.editor = monaco.editor.create(this.$refs.source, {
            model: monaco.editor.createModel(this.value, languageMap[this.selected_language], this.getMonacoUri(languageMap[this.selected_language])),
            value: this.value,
            lineNumbers: (line: number) => (this.prependLength + line).toString(),
            language: languageMap[this.selected_language],
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
        this.getNewLanguageServer(this.editor, this.value, languageMap[this.selected_language]);
        this.editor.updateOptions({
            fontSize: this.getFontSizeFromStorage()
        });
        monaco.editor.setTheme(this.getThemeFromStorage());
        this.modelEventRegistry();
    }

    modelEventRegistry () {
        const currentModel = this.editor!.getModel();
        currentModel!.onDidChangeContent(() => {
            this.source_code = this.editor!.getModel()!.getValue();
            this.$store.commit("setCodeInfo", {
                code: this.source_code
            });
            this.valueChanged(this.source_code);
        });
    }

    valueChanged (newVal: string) {
        this.$emit("input", newVal);
    }

    getDataFromStorage (defaultValue: any, key: string) {
        let data;
        try {
            data = JSON.parse(localStorage.submitConfig)[key];
        }
        catch (e) {
            data = defaultValue;
        }
        return data;
    }

    getThemeFromStorage () {
        return this.getDataFromStorage("vs-dark", "theme");
    }

    getFontSizeFromStorage () {
        return this.getDataFromStorage(16, "fontSize");
    }
}
</script>

<style scoped>

</style>
