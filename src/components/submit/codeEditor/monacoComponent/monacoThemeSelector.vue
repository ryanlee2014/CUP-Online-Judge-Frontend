<template>
    <div class="item">
        <span>{{$t("theme")}}:</span>
    <select class="ui selection dropdown search" size="1" v-model="theme">
        <option value="vs-dark">Visual Studio Dark</option>
        <option value="vs">Visual Studio</option>
        <option value="hc-black">High Contrast Dark</option>
    </select>
    </div>
</template>

<script lang="ts">
import { Prop, Component, Watch, Mixins } from "vue-property-decorator";
import InitMixin from "@/mixin/init";

@Component
export default class MonacoThemeSelector extends Mixins(InitMixin) {
    @Prop({ default: "vs-dark" }) value!: string;
    theme = "vs-dark";
    @Watch("value")
    onValueChanged (val: string) {
        if (this.theme !== val) {
            if (val.includes("vs") || val.includes("hc-black")) {
                this.theme = val;
            }
        }
    }

    @Watch("theme")
    onThemeChanged (val: string) {
        this.$emit("input", val);
    }

    mounted () {
        if (this.value.includes("vs") || this.value.includes("hc-black")) {
            this.theme = this.value;
        }
    }
}
</script>

<style scoped>
    select {
        height: 30px;
        line-height: 30px;
    }

    select {
        width: 220px;
        background-color: #fff;
        border: 1px solid #bbb;
    }
</style>
