<template>
    <div class="ui container">
        <h2 class="ui dividing header">
            {{$t("compiler arguments")}}
        </h2>
        <div class="ui grid" style="margin-left: 0">
            <div class="row" :key="name" v-for="(value, name) in compileArguments">
                <div class="ui grid" style="margin-left: 0; margin-top: 0; width: 100%">
                    <div class="row">
                        <h2 class="ui header">
                            {{languageName[name]}}
                        </h2>
                    </div>
                    <div class="row">
                        <div class="ui input" style="width: 100%">
                            <input readonly type="text" :value="compileArguments[name].join(' ')">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import InitMixin from "../../mixin/init";
import LanguageNameConfig from "@/type/index.json";
const languageName = LanguageNameConfig.language_name.local;
@Component
export default class CompileArguments extends Mixins(InitMixin) {
    compileArguments = [];
    languageName = languageName;
    mounted () {
        this.initData();
    }

    initData () {
        this.initCompileArguments();
    }

    initCompileArguments () {
        this.axios.get("/api/system/judge/compile")
            .then(({ data }) => {
                this.compileArguments = data.data;
            });
    }
}
</script>

<style scoped>

</style>
