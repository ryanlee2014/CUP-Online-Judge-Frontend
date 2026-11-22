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
import { initMixin } from "@/mixin/init";
import { defineComponent } from "vue";
export default defineComponent({
    name: "MonacoThemeSelector",
    mixins: [initMixin],
    props: {
        value: { type: String, default: "vs-dark" }
    },
    data () {
        return {
            theme: "vs-dark"
        };
    },
    watch: {
        value (val: string) {
            if (this.theme !== val && (val.includes("vs") || val.includes("hc-black"))) {
                this.theme = val;
            }
        },
        theme (val: string) {
            this.$emit("input", val);
        }
    },
    mounted () {
        if (this.value.includes("vs") || this.value.includes("hc-black")) {
            this.theme = this.value;
        }
    }
});
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
