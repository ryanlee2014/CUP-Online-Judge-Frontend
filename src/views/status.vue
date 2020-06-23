<template>
    <div class="ui container padding" v-if="contestMode">
        <ContestMode/>
    </div>
    <div class="padding ui container" v-else>
        <h2 class="ui dividing header">
            {{$t("status")}}
        </h2>
        <div class="ui top attached tabular menu">
            <a :class="(current_tag == 'status'?'active':'')+' item'" @click="tag('status',$event)" id="submitstatus"
               v-cloak>{{$t("submit status")}}</a>
            <a :class="(current_tag == 'graph'?'active':'')+' item'" @click="tag('graph',$event)" id="graph" v-cloak>{{$t("submit graph")}}</a>
            <a :class="(current_tag == 'result'?'active':'') + ' item'" @click="tag('result',$event)">
                {{$t("result statistic")}}
            </a>
            <a :class="(current_tag == 'user'?'active':'') + ' item'" @click="tag('user',$event)">
                {{$t("user statistic")}}
            </a>
        </div>
        <div class="ui bottom attached segment" v-show="current_tag === 'status'">
            <div align=center class="input-append">
                <form class="ui form segment" id=simform method="get">
                    <div class="four fields">
                        <div class="field">
                            <label>{{$t("problem_id")}}</label>
                            <input class="form-control" name=problem_id size=4 type=text v-model="problem_id">
                        </div>
                        <div class="field">
                            <label>{{$t("user_id")}}</label>
                            <input class="form-control" name=user_id size=4 type=text v-model="user_id"
                                   value=''>
                        </div>
                        <div class="field">
                            <label>{{$t("language")}}</label>
                            <div class="ui fluid search dropdown selection" size="1">
                                <input @change="language=$event.target.value" name="language"
                                       type="hidden" v-model="language">
                                <i class="dropdown icon"></i>
                                <div class="default text">All</div>
                                <div class="menu">
                                    <div class='item' data-value='-1'>All<i class="dropdown icon"
                                                                            style="visibility: hidden; "></i></div>
                                    <div :data-value="i" :key="i" class="item"
                                         v-for="i in Array.from(Array(language_name?language_name.length:0).keys())">
                                        <i :class="language_icon[i]+' color'"></i>
                                        {{language_name[i]}}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field">
                            <label>{{$t("result")}}</label>
                            <div class="ui fluid search dropdown selection" size="1">
                                <input @change="problem_result=$event.target.value"
                                       type="hidden" v-model="problem_result">
                                <i class="dropdown icon"></i>
                                <div class="default text">All</div>
                                <div class="menu">
                                    <div class='item' data-value='-1'>All<i class="dropdown icon"
                                                                            style="visibility: hidden; "></i></div>
                                    <div :data-value="i" :key="i" class="item"
                                         v-for="i in Array.from(Array(judge_color ? judge_color.length : 0).keys())">
                                        <span :class="judge_color[i]">
                                        <i :class="judge_icon[i]+' icon'"></i>
                                        {{result[i]}}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div :class="(isadmin ? 'five' : 'four')+' fields center aligned'">
                        <div class="field" style="margin:auto">
                            <div class="ui toggle checkbox">
                                <input @click="auto_refresh=!auto_refresh" checked="true" type="checkbox">
                                <label>{{$t("auto refresh")}}</label>
                            </div>
                        </div>
                        <div class="field" style="margin:auto">
                            <div class="ui toggle checkbox">
                                <input @click="sim_checkbox=!sim_checkbox" type="checkbox">
                                <label>{{$t("show cheat only")}}</label>
                            </div>
                        </div>
                        <div class="field" style="margin:auto" v-if="isadmin">
                            <div class="ui toggle checkbox">
                                <input @click="privilege=!privilege" type="checkbox">
                                <label>{{$t("test run invisible")}}</label>
                            </div>
                        </div>
                        <div class="field" style="margin:auto">
                            <div class="ui toggle checkbox">
                                <input @click="list_self_only" type="checkbox">
                                <label>{{$t("show user only")}}</label>
                            </div>
                        </div>
                        <div class="field" style="margin:auto">
                            <button @click.prevent="search($event)" class="ui labeled icon mini button">
                                <i class="search icon"></i>{{$t("search")}}
                            </button>
                        </div>

                    </div>
                </form>
            </div>
            <br>
            <div class="row">
                <status-table :answer_class="judge_color" :answer_icon="icon_list"
                              :isadmin="isadmin" :language_name="language_name" :problem_list="problem_list"
                              :result="result"
                              :self="self"
                              :target="target"></status-table>
                <div class="ui active inverted dimmer" v-if="dim">
                    <div class="ui large text loader">Loading</div>
                </div>
            </div>
            <br>
            <div class="row">
                <a :class="'ui button '+(page_cnt == 0?'disabled':'')" @click="page_cnt != 0 && page(-page_cnt,$event)"
                   v-cloak>Top</a>
                <div class="ui buttons">
                    <button :class="'ui left labeled icon button '+(page_cnt == 0?'disabled':'')" @click="page_cnt!=0&&page(-1,$event)"
                            v-cloak>
                        <i class="left arrow icon"></i>
                        Prev
                    </button>
                    <div class="or" v-cloak></div>
                    <button :class="'ui right labeled icon button '+(problem_list.length == 0?'disabled':'')" @click="problem_list.length != 0 && page(1,$event)"
                            v-cloak>
                        <i class="right arrow icon"></i>
                        Next
                    </button>
                </div>
            </div>
        </div>
        <keep-alive>
            <Graph v-if="current_tag === 'graph'" ref="graph"></Graph>
            <ResultGraph v-if="current_tag === 'result'" :label-name="labelName"></ResultGraph>
            <UserGraph v-if="current_tag === 'user'"></UserGraph>
        </keep-alive>
    </div>
</template>
<i18n>
    {
    "zh-cn": {
    "auto refresh": "自动刷新",
    "show cheat only": "仅显示判重提交",
    "test run invisible": "不显示测试运行",
    "show user only": "仅显示本人提交",
    "submit status": "提交状态",
    "submit graph": "提交图表",
    "result statistic": "结果统计",
    "user statistic": "用户统计"
    },
    "en": {
    "auto refresh": "Auto Refresh",
    "show cheat only": "Show Cheating Only",
    "test run invisible": "Exclude Test Run",
    "submit status": "Submit Status",
    "show user only": "Show Yourself Only",
    "submit graph": "Submission Graph",
    "result statistic": "Result Statistics",
    "user statistic": "User statistics"
    },
    "ja": {
    "auto refresh": "自動リフレッシュ",
    "show cheat only": "チート提出のみを表示",
    "test run invisible": "テスト提出非表示",
    "submit status": "提出リスト",
    "show user only": "自分だけを表示",
    "submit graph": "提出グラフ",
    "result statistics": "結果統計",
    "user statistic": "ユーザー統計"
    }
    }
</i18n>
<script lang="ts">
import statusTable from "../components/status/status-table.vue";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import ContestMode from "../components/contestMode/block.vue";
import mixins from "../mixin/init";
import jquery from "jquery";
import Chart from "chart.js";
import _ from "lodash";
import { Component, Mixins, Watch } from "vue-property-decorator";
import StatusViewMixin from "@/mixin/StatusViewMixin";
import AwaitLock from "await-lock";
import { Lock, RunOnceEachKey } from "@/module/Decorator/method";
import { mapGetters } from "vuex";
import Graph from "@/components/status/graph.vue";
import ResultGraph from "@/components/status/ResultGraph.vue";
import UserGraph from "@/components/status/UserGraph.vue";

const $: any = jquery;

const hasRendered: any = {};
    @Component({
        components: {
            UserGraph,
            ResultGraph,
            Graph,
            statusTable,
            ContestMode
        },
        computed: mapGetters(["contestMode"])
    })
export default class GeneralStatus extends Mixins(mixins, StatusViewMixin) {
        problem_list: any[] = [];
        icon_list = [];
        judge_color = [];
        judge_icon = [];
        target = {};
        hasDrawedGraph = false;
        language_name = [];
        result = [];
        language_icon = [];
        self = "";
        isadmin = false;
        page_cnt = 0;
        dim = false;
        sockets: any;
        prevSolutionId = 0;
        labelName = [];

        search_func (data: any) {
            const that = this;
            this.setQuery();
            that.problem_list = data.result;
            that.icon_list = data.const_list.icon_list;
            that.judge_color = data.const_list.judge_color;
            that.target = data.const_list.language.cn.status;
            that.judge_icon = data.const_list.judge_icon;
            that.language_icon = data.const_list.language_icon;
            that.language_name = data.const_list.language_name.local;
            that.result = data.const_list.result.cn;
            that.self = data.self;
            that.isadmin = data.isadmin || data.browse_code;
        }

        search () {
            this.dim = true;
            this.page_cnt = 0;
            const problemId = this.problem_id || "null";
            const userId = this.user_id || "null";
            const language = this.language == -1 ? "null" : this.language;
            const result = this.problem_result == -1 ? "null" : this.problem_result;
            const pageCount = this.page_cnt * 20;
            const sim = Number(this.sim_checkbox);
            const pri = Number(this.privilege);
            return this.axios.get(`/api/status/${problemId}/${userId}/${language}/${result}/${pageCount}/${sim}/${pri}`)
                .then(({ data }) => {
                    this.dim = false;
                    this.search_func(data);
                });
        }

        page (num: number) {
            this.dim = true;
            this.page_cnt += num;
            const problemId = this.problem_id || "null";
            const userId = this.user_id || "null";
            const language = this.language == -1 ? "null" : this.language;
            const result = this.problem_result == -1 ? "null" : this.problem_result;
            const pageCount = this.page_cnt * 20;
            const simCheckbox = Number(this.sim_checkbox);
            const pri = Number(this.privilege);
            this.axios.get(`/api/status/${problemId}/${userId}/${language}/${result}/${pageCount}/${simCheckbox}/${pri}`)
                .then(({ data }) => {
                    this.dim = false;
                    this.search_func(data);
                });
        }

        @Lock(new AwaitLock())
        @RunOnceEachKey
        async Submit (data: any) {
            if (!this.auto_refresh) {
                return;
            }
            if (data.submission_id <= this.prevSolutionId) {
                return;
            }
            this.prevSolutionId = data.submission_id;
            if (this.privilege && (data.val.id <= 0 || (data.val.cid && data.val.cid <= 0))) {
                return;
            }
            if (this.sim_checkbox || this.privilege) {
                return;
            }
            if ((!this.user_id || this.user_id === data.user_id) && (this.problem_result === -1) && (this.language === -1 || this.language === data.val.language) && !this.page_cnt && (!this.problem_id || parseInt(this.problem_id) === Math.abs(data.val.id))) {
                const obj: any = {};
                obj.problem_id = Math.abs(data.val.id);
                obj.solution_id = data.submission_id;
                obj.nick = data.nick;
                obj.user_id = data.user_id;
                obj.length = data.val.source.length;
                obj.language = data.val.language;
                obj.memory = obj.time = 0;
                obj.in_date = new Date().toISOString();
                obj.judger = "RATH";
                obj.result = 0;
                obj.ip = data.val.ip;
                obj.total_point = 0;
                obj.fingerprint = data.val.fingerprint;
                obj.fingerprintRaw = data.val.fingerprintRaw;
                obj.sim = false;
                obj.avatar = !!data.val.avatar;
                obj.contest_id = data.val.cid ? Math.abs(data.val.cid) : null;
                obj.sim_id = null;
                this.problem_list.pop();
                this.problem_list.unshift(obj);
            }
        }

        Update (data: any) {
            if (!this.auto_refresh) {
                return;
            }
            const solution_id = data.solution_id;
            const status = data.state;
            const time = data.time;
            const memory = data.memory;
            const pass_rate = data.pass_rate;
            const sim = data.sim;
            const ip = data.ip;
            const total_point = parseInt(data.total_point) || 0;
            const fingerprint = data.fingerprint;
            const fingerprintRaw = data.fingerprintRaw;
            const pass_point = data.pass_point;
            const that = this;
            _.forEach(this.problem_list, function (val: any, key: any) {
                const i = that.problem_list[key];
                if (i.solution_id == solution_id) {
                    i.result = status;
                    i.time = time;
                    i.memory = memory;
                    i.sim = sim;
                    i.sim_id = data.sim_s_id;
                    i.pass_rate = pass_rate;
                    i.total_point = total_point;
                    i.pass_point = pass_point;
                    i.contest_id = data.contest_id ? Math.abs(data.contest_id) : null;
                    i.ip = ip;
                    i.fingerprint = fingerprint;
                    i.fingerprintRaw = fingerprintRaw;
                }
            });
        }

        initData () {
            this.fetchData()
                .then((data) => {
                    this.labelName = data.const_list.result.cn;
                });
        }

        fetchData () {
            const problem_id = (this.problem_id = this.getProblemID() || null) || "null";
            const user_id = (this.user_id = this.getUserId() || null) || "null";
            const language = (this.language = this.getLanguage() || -1) == -1 ? "null" : this.getLanguage();
            const result = (this.problem_result = this.getResult() || -1) == -1 ? "null" : this.problem_result;
            return this.axios.get(`/api/status/${problem_id}/${user_id}/${language}/${result}/0/`)
                .then(({ data }) => {
                    this.dim = false;
                    this.search_func(data);
                    return data;
                });
        }

        beforeDestroy () {
            this.sockets.unsubscribe("submit");
            this.sockets.unsubscribe("result");
        }

        mounted () {
            document.title = `Status -- ${document.title}`;
            this.initData();
            this.sockets.subscribe("submit", (data: any) => {
                this.Submit(data);
            });
            this.sockets.subscribe("result", (data: any) => {
                this.Update(data);
            });
        }
}
</script>

<style scoped>
    .ui.form .fields .field .ui.checkbox {
        margin-top: inherit !important;
    }
</style>
