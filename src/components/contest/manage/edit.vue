<template>
    <div class="ui container padding" v-lazy-container="{ selector: 'img' }">
        <div class="ui form">
            <div class="field">
                <label>{{$t("title")}}</label>
                <div class="two fields">
                    <div class="field">
                        <input name="title" placeholder="contest title" type="text" v-model="title">
                    </div>
                    <div class="field">
                        <div class="four fields">
                            <div class="field">
                                <div class="ui toggle checkbox" ref="public">
                                    <input @click="Private = !Private" class="hidden" tabindex="0" type="checkbox"
                                           v-model="Private">
                                    <label>{{$t("private contest")}}</label>
                                </div>
                            </div>
                            <div class="field">
                                <div class="ui toggle checkbox" ref="defunct">
                                    <input @click="defunct = !defunct" class="hidden" tabindex="0" type="checkbox"
                                           v-model="defunct">
                                    <label>{{$t("hide contest")}}</label>
                                </div>
                            </div>
                            <div class="field">
                                <div class="ui toggle checkbox" ref="contest">
                                    <input @click="ContestMode = !ContestMode" class="hidden" tabindex="0"
                                           type="checkbox" v-model="ContestMode">
                                    <label>{{$t("contest mode available only")}}</label>
                                </div>
                            </div>
                            <div class="field">
                                <div class="ui toggle checkbox" ref="show_all_ranklist">
                                    <input class="hidden" tabindex="0" type="checkbox" v-model="showAllRanklist">
                                    <label>{{$t("show_all_ranklist")}}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="two fields">
                    <div class="field">
                        <button v-if="contest_id" class="ui primary button" @click="exportSolution">{{$t("export solution")}}</button>
                    </div>
                    <div class="field">
                        <div class="four fields">
                            <div class="field">
                                <div class="ui toggle checkbox" ref="showSim">
                                    <input @click="showSim = !showSim" class="hidden" tabindex="0" type="checkbox"
                                           v-model="showSim">
                                    <label>{{$t("show sim")}}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="field">
                <div class="two fields">
                    <div class="field">
                        <label>{{$t("start time")}}</label>
                        <div class="ui calendar" id="rangestart">
                            <div class="ui input left icon">
                                <i class="calendar icon"></i>
                                <input id="startTime" placeholder="Start" type="text" autocomplete="off"
                                       v-model="startTime">
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <label>{{$t("end time")}}</label>
                        <div class="ui calendar" id="rangeend">
                            <div class="ui input left icon">
                                <i class="calendar icon"></i>
                                <input id="endTime" placeholder="End" type="text" v-model="endTime" autocomplete="off">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="field">
                <div class="three fields">
                    <div class="field">
                        <label>{{$t("contest password")}}</label>
                        <input name="password" placeholder="contest password" type="text" v-model="password">
                    </div>
                    <div class="field">
                        <label>{{$t("limit classroom")}}</label>
                        <div class="ui fluid multiple search selection dropdown" id="limitClassroom">
                            <input @change="classroomSelected = $event.target.value" name="country"
                                   type="hidden" v-model="classroomSelected">
                            <i class="dropdown icon"></i>
                            <div class="default text">{{$t("limit classroom")}}</div>
                            <div class="menu">
                                <div class="item" data-value="403">
                                    403
                                </div>
                                <div class="item" data-value="404">
                                    404
                                </div>
                                <div class="item" data-value="405">
                                    405
                                </div>
                                <div class="item" data-value="502">
                                    502
                                </div>
                                <div class="item" data-value="503">
                                    503
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <label>{{$t("limit hostname")}}</label>
                        <div class="ui fluid search dropdown selection" size="1" id="limitHostname">
                            <input @change="hostname=$event.target.value" type="hidden"
                                   v-model="hostname">
                            <i class="dropdown icon"></i>
                            <div class="default text">All</div>
                            <div class="menu">
                                <div class='item' data-value=''>All<i class="dropdown icon"
                                                                      style="visibility: hidden; "></i></div>
                                <div class="item" data-value="acm.cup.edu.cn">
                                    acm.cup.edu.cn
                                </div>
                                <div class="item" data-value="www.cupacm.com">
                                    www.cupacm.com
                                </div>
                                <div class="item" data-value="oj.cupacm.com">
                                    oj.cupacm.com
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="field">
                <div class="field">
                    <label>{{$t("select language")}}</label>
                    <div class="ui fluid multiple search selection dropdown" id="selectedLanguage">
                        <input @change="languageSelected = $event.target.value" name="country" type="hidden">
                        <i class="dropdown icon"></i>
                        <div class="default text">{{$t("select language")}}</div>
                        <div class="menu">
                            <div :data-value="key" :key="key" class="item" v-for="(row,key) in languageSet">
                                {{row}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="field">
                <div class="field">
                    <label>{{$t("problem list")}}</label>
                    <input type="text" v-model="problemSelected">
                </div>
            </div>
            <div class="field">
                <label>{{$t("description")}}</label>
                <textarea v-model="description"></textarea>
            </div>
            <div class="field">
                <div class="two fields">
                    <div class="field">
                        <label>{{$t("selected user")}}</label>
                        <div class="ui middle aligned animated list">
                            <div :key="key" class="item" v-for="(row,key) in userList">
                                {{key + 1}}
                                <img :data-src="`/avatar/${row}.jpg`" class="ui avatar image">
                                <div class="content">
                                    <div class="header">{{row}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <label>{{$t("selected user input")}}</label>
                        <textarea style="min-height: 100%; height: 100%; box-sizing: border-box;"
                                  v-model="userListText">
                        </textarea>
                    </div>
                </div>
            </div>
            <div class="padding field">
                <div class="two fields">
                    <div class="field"></div>
                    <div class="field">
                        <div class="fields">
                            <div class="field">
                                <button class="ui secondary button">
                                    Reset
                                </button>
                            </div>
                            <div class="field">
                                <button class="ui primary button" @click="emitData">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Type from "../../../type/index.json";
import { saveAs } from "file-saver";
import _ from "lodash";
import jquery from "jquery";
import { Prop, Component, Watch } from "vue-property-decorator";
import Vue from "vue";
const $: any = jquery;

@Component({
    i18n: {
        messages: {
            "zh-cn": {
                show_all_ranklist: "显示详细排行信息",
                "show sim": "显示判重信息"
            },
            en: {
                show_all_ranklist: "Show All Rank Detail",
                "show sim": "Show sim information"
            },
            ja: {
                show_all_ranklist: "ランキング詳しく内容表示",
                "show sim": "剽窃表示"
            }
        }
    }
})
export default class BaseManage extends Vue {
    @Prop({ default: () => { return {}; } }) contestInfo!: any;
    @Prop({ default: "" }) externalUserListText!: string;
    @Prop({ default: "" }) externalProblemSelected!: string;
    created () {
        this.contest_id = this.$route.params.contest_id;
    }

    contest_id = "";
    title = "";
    defunct = false;
    Private = true;
    ContestMode = false;
    startTime: any = "";
    endTime: any = "";
    password = "";
    description = "";
    languageSelected = "";
    classroomSelected = "";
    problemSelected = "";
    showAllRanklist = false;
    showSim = false;
    languageSet = Type.language_name.local;
    hostname = "";
    userListText = "";
    userList: any[] = [];

    debug (name: string, value?: any) {
        console.log(name);
        if (typeof value !== "undefined") {
            console.log(value);
        }
    }

    /**
     * @return {number}
     */
    LanguageSelectedToLangmask () {
        const byteLength = this.languageSet.length;
        let target = (2 ** byteLength) - 1;
        const languageSet = this.languageSelected.split(",").map(el => parseInt(el));
        languageSet.forEach(el => {
            target ^= (2 ** el);
        });
        return target;
    }

    LangmaskToLanguageSelected (langmask: number) {
        let cnt = 0;
        const languageSet = Array.from(Array(this.languageSet.length).keys());
        while (langmask > 0) {
            if ((langmask & 1) === 1) {
                languageSet.splice(languageSet.indexOf(cnt), 1);
            }
            langmask >>= 1;
            ++cnt;
        }
        this.languageSelected = languageSet.join(",");
    }

    exportSolution () {
        const contestId = this.contest_id;
        this.axios({
            url: `/api/admin/solution/download/contest/${contestId}`,
            method: "GET",
            responseType: "blob"
        }).then((response) => {
            const headerLine = response.headers["Content-Disposition"] || response.headers["content-disposition"];
            let filename: string;
            if (headerLine === null || headerLine === undefined) {
                filename = `Contest ${contestId}.txt`;
            }
            else {
                const startFileNameIndex = headerLine.indexOf("\"") + 1;
                const endFileNameIndex = headerLine.lastIndexOf("\"");
                filename = headerLine.substring(startFileNameIndex, endFileNameIndex);
            }
            saveAs(response.data, filename);
        });
    }

    emitData () {
        const tempData = _.cloneDeep(this.$data);
        tempData.langmask = this.LanguageSelectedToLangmask();
        tempData.Public = !tempData.Private;
        this.$emit("postData", tempData);
    }

    initjQuery () {
        const that: any = this;
        const $rangeStart = $("#rangestart");
        const $rangeEnd = $("#rangeend");
        $rangeStart.calendar({
            initialDate: this.startTime ? this.startTime : null,
            endCalendar: $rangeEnd,
            onChange (value: any) {
                that.startTime = new Date(value);
            }
        });
        $rangeEnd.calendar({
            initialDate: this.endTime ? this.endTime : null,
            startCalendar: $rangeStart,
            onChange (value: any) {
                that.endTime = new Date(value);
            }
        });
        $(".ui.dropdown").dropdown();
        $("#limitClassroom").dropdown("set selected", this.classroomSelected.split(","));
        $("#limitHostname").dropdown("set selected", this.hostname.split(","));
        $("#selectedLanguage").dropdown("set selected", this.languageSelected.split(","));
        $(this.$refs.public).checkbox(this.checkbox(this.Private));
        $(this.$refs.contest).checkbox(this.checkbox(this.ContestMode));
        $(this.$refs.defunct).checkbox(this.checkbox(this.defunct));
        $(this.$refs.show_all_ranklist).checkbox(this.checkbox(this.showAllRanklist));
        $(this.$refs.showSim).checkbox(this.checkbox(this.showSim));
    }

    checkbox (flag: boolean) {
        return flag ? "check" : "uncheck";
    }

    mounted () {
        this.initjQuery();
    }

    @Watch("userListText")
    onUserListTextChanged (newVal: string, oldVal: string) {
        if (oldVal === newVal) {
            return;
        }
        if (newVal.trim().length === 0) {
            this.userList = [];
        }
        else {
            this.userList = newVal.split("\n").map(el => el.trim()).filter(el => el.length > 0);
        }
        this.$nextTick(() => {
            this.$Lazyload.lazyLoadHandler();
            this.$forceUpdate();
        });
    }

    @Watch("externalUserListText")
    onExternalUserListTextChanged (val: string) {
        this.userListText = val;
    }

    @Watch("externalProblemSelected")
    onExternalProblemSelected (val: string) {
        this.problemSelected = val;
    }

    @Watch("contestInfo")
    onContestInfoChanged (data: any) {
        if (data.data.length > 0) {
            const res = data.data[0];
            this.title = res.title;
            this.startTime = new Date(res.start_time);
            this.endTime = new Date(res.end_time);
            this.description = res.description;
            this.defunct = res.defunct === "Y";
            this.Private = !!res.private;
            this.ContestMode = !!res.cmod_visible;
            this.LangmaskToLanguageSelected(res.langmask);
            this.password = res.password;
            this.classroomSelected = res.ip_policy;
            this.showAllRanklist = !!res.show_all_ranklist;
            this.showSim = !!res.show_sim;
            this.hostname = res.limit_hostname ? res.limit_hostname : "";
            this.$nextTick(() => {
                this.initjQuery();
            });
        }
    }
}
</script>

<style scoped>

</style>
