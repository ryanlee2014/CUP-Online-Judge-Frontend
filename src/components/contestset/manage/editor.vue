<template>
    <div class="ui container padding">
        <div class="ui form">
            <div class="field">
                <label>{{$t("title")}}</label>
                <div class="two fields">
                    <div class="field">
                        <input name="title" placeholder="" type="text" v-model="title">
                    </div>
                    <div class="field">
                        <div class="two fields">
                            <div class="field">
                                <div class="ui toggle checkbox" ref="visible">
                                    <input @click="visibleCallback" class="hidden" tabindex="0" type="checkbox"
                                           v-model="visible">
                                    <label>{{$t("visible")}}</label>
                                </div>
                            </div>
                            <div class="field">
                                <div class="ui toggle checkbox" ref="defunct">
                                    <input @click="reverseDefunct" class="hidden" tabindex="0" type="checkbox">
                                    <label>{{$t("enable")}}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="field">
                <div class="field">
                    <label>{{$t("contest list")}}</label>
                    <div class="ui fluid multiple search selection dropdown" ref="contestList">
                        <input @change="select1 = $event.target.value" type="hidden">
                        <i class="dropdown icon"></i>
                        <div class="default text"></div>
                        <div class="menu">
                            <div v-for="(row, key) in totalContestList" :key="key" class="item"
                                 :data-value="row.contest_id">
                                {{`Contest${row.contest_id} ${row.title}`}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="field">
                <div class="field">
                    <label>{{$t("description")}}</label>
                    <mavon-editor ref="description" v-model="description" :markInstance="markdownIt"></mavon-editor>
                </div>
            </div>
            <div class="field">
                <div class="two fields">
                    <div class="field">
                        <button class="ui primary button" @click="emitData">
                            Submit
                        </button>
                    </div>
                    <div class="field">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import markdownIt from "@/lib/markdownIt/markdownIt";
import jquery from "jquery";
import { IContestSetEditDTO, IContestSetRequestDTO, IContestSetResponseDTO } from "@/types/contestset";
const $: any = jquery;

@Component
export default class ContestSetEditor extends Mixins(Vue) implements IContestSetRequestDTO {
        contestIdList: (string | number)[] = [];
        defunct: string = "N";
        description: string = "";
        title: string = "";
        visible: boolean = true;
        select1: any = "";
        totalContestList: any[] = [];
        contestSetId: string = "";
        markdownIt = markdownIt;

        @Prop({ default: {} }) contestSetInfo!: IContestSetEditDTO;
        @Prop({ default: [] }) contestList!: (string | number)[];

        @Watch("contestList")
        onContestListChanged (val: (string | number)[]) {
            if (val.length > 0) {
                this.contestIdList = val;
                this.$nextTick(() => {
                    this.initJQuery();
                });
            }
        }

        @Watch("contestSetInfo")
        onContestSetInfoChanged (val: IContestSetEditDTO) {
            if (val && val.title && val.title.length > 0) {
                this.visible = val.visible;
                this.defunct = val.defunct;
                this.description = val.description;
                this.title = val.title;
                if (val.contestset_id) {
                    this.contestSetId = val.contestset_id + "";
                }
                this.$nextTick(() => {
                    this.initJQuery();
                });
            }
        }

        created () {
            this.contestSetId = this.$route.params.contestSetId;
        }

        mounted () {
            this.initTotalContest();
            this.initJQuery();
        }

        initJQuery () {
            this.$nextTick(() => {
                $(this.$refs.visible).checkbox(this.visible ? "check" : "uncheck");
                $(this.$refs.defunct).checkbox(this.defunct === "N" ? "check" : "uncheck");
                $(this.$refs.contestList).dropdown("set selected", this.contestIdList);
            });
        }

        initTotalContest () {
            this.axios.get("/api/contest/list/all")
                .then(({ data }) => {
                    this.totalContestList = data.data;
                });
        }

        reverseDefunct () {
            const $defunct = $(this.$refs.defunct);
            if (this.defunct === "Y") {
                this.defunct = "N";
                $defunct.checkbox("checked");
            }
            else {
                this.defunct = "Y";
                $defunct.checkbox("unchecked");
            }
        }

        visibleCallback () {
            this.visible = !this.visible;
            const $visible = $(this.$refs.visible);
            if (this.visible) {
                $visible.checkbox("checked");
            }
            else {
                $visible.checkbox("unchecked");
            }
        }

        emitData () {
            const payload: IContestSetRequestDTO = {
                contestIdList: this.select1.split(","),
                defunct: this.defunct,
                description: this.description,
                title: this.title,
                visible: this.visible,
                contestSetId: this.contestSetId
            };
            this.$emit("postData", payload);
        }
}
</script>

<style scoped>

</style>
