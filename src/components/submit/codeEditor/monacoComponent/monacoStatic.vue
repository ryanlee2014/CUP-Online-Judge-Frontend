<template>
    <monaco-editor v-if="render" :fontSize="fontSize" :selected_language="selected_language" :theme="static_theme" v-model="content" :readOnly="true" :height="height" :minimap="false"></monaco-editor>
</template>

<script lang="ts">
import monacoEditor from "../monacoEditor.vue";
import Vue from "vue";
import { Prop, Component, Watch } from "vue-property-decorator";

@Component({
    components: {
        monacoEditor
    }
})
export default class MonacoStatic extends Vue {
    @Prop({ default: "" }) content!: string;
    @Prop({ default: 0 }) selected_language!: number;
    @Prop({ default: "vs-dark" }) static_theme!: string;
    @Prop({ default: "16" }) fontSize!: string;
    render = false;
    lines = 0;
    get height () {
        let fontSize = parseInt(this.fontSize);
        if (fontSize < 6) {
            fontSize = 6;
        }
        let heightOfEachLine = Math.round((fontSize * 4 + 2) / 3);
        return heightOfEachLine * this.lines + 10;
    }

    set height (val: any) {
        this.lines = val;
        if (val > 0) {
            this.render = true;
        }
    }

    @Watch("content")
    onContentChanged (val: string) {
        this.height = val.split("\n").length;
    }
}
</script>

<style scoped>

</style>
