<template>
    <div :class="progressBarClass" @mouseenter="trigger" ref="progressBarElement" v-observe-visibility="visibilityChanged">
        <div class="bar"></div>
    </div>
</template>

<script lang="ts">
import SemanticEnvMixin from "@/mixin/SemanticEnvMixin";
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import jquery from "jquery";
const $: any = jquery;
@Component
export default class ProgressBar extends Mixins(SemanticEnvMixin) {
    prevPercentage = 0;
    element:any = null;
    visibilityChanged (isVisible: boolean, entry: any) {
        if (isVisible && this.active) {
            this.element!.progress("set active");
        }
        else {
            this.element!.progress("remove active");
        }
    }

    @Prop({ default: "" }) size!: string;
    @Prop({ default: "" }) color!: string;
    @Prop({ default: false }) active!: boolean;
    @Prop({ default: 0 }) percentage!: number;
    @Prop({ default: (target: any) => undefined }) popupEvent!: (target: any) => void;
    updated () {
        this.mountFunc();
    }

    mounted () {
        this.mountFunc();
    }

    mountFunc () {
        if (this.element === null) {
            this.element = $(this.$refs.progressBarElement);
        }
        if (this.prevPercentage !== this.percentage) {
            this.element.progress({
                percent: this.percentage,
                autoSuccess: false
            });
            this.prevPercentage = this.percentage;
        }
    }

    get progressBarClass () {
        const classArray = ["ui", "progress"];
        if (this.size.length > 0) {
            classArray.push(this.size);
        }
        if (this.color.length > 0) {
            classArray.push(this.color);
        }
        if (this.active) {
            classArray.push("active");
        }
        return classArray;
    }

    trigger () {
        this.popupEvent(this.$refs.progressBarElement);
    }

    forceUpdate () {
        if (this.prevPercentage !== this.percentage) {
            this.$nextTick(this.$forceUpdate);
        }
    }

    @Watch("size")
    onSizeChange () {
        this.forceUpdate();
    }

    @Watch("color")
    onColorChange () {
        this.forceUpdate();
    }

    @Watch("active")
    onActiveChange () {
        this.forceUpdate();
    }

    @Watch("percentage")
    onPercentageChange () {
        this.forceUpdate();
    }
}
</script>

<style scoped>
    .ui.progress {
        margin-bottom: 0!important;
    }
</style>
