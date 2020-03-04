<template>
    <div class="ui container padding">
        <h2 class="ui dividing header">
            {{$t("compile arguments")}}
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
                            <input type="text" v-model="compileArguments[name]">
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <a class="ui primary button" @click.prevent="submitCompileArguments">{{$t("submit")}}</a>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import InitMixin from "../../../mixin/init";
import _ from "lodash";
import languageNameConfig from "@/type/index.json";
import { ICompileArguments } from "@/types/judge/compile";

const languageName = languageNameConfig.language_name.local;

interface ICompileEditArguments {
    [id: string]: string
}

@Component
export default class CompileView extends Mixins(InitMixin) {
        compileArguments: ICompileEditArguments = {};
        languageName = languageName;
        mounted () {
            this.initCompileArguments();
        }

        initCompileArguments () {
            this.axios.get("/api/admin/system/compile/compile_arguments")
                .then(({ data }) => {
                    const compileArguments = data.data;
                    _.forEach(compileArguments, (value, index) => {
                        compileArguments[index] = value.join(" ");
                    });
                    this.compileArguments = compileArguments;
                });
        }

        submitCompileArguments () {
            const compileArguments = {} as ICompileArguments;
            _.forEach(this.compileArguments, (value, index) => {
                compileArguments[index] = value.split(" ").map(e => e.trim());
            });
            this.axios.post("/api/admin/system/compile/compile_arguments", {
                payload: compileArguments
            })
                .then(({ data }) => {
                    alert(this.$t("success"));
                });
        }
}
</script>

<style scoped>

</style>
