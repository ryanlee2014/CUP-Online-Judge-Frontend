<template>
    <div class="padding ui container">
        <h2 class="ui dividing header">
            Status
        </h2>
        <div class="ui top attached tabular menu">
            <a :class="(current_tag == 'status'?'active':'')+' item'" @click="tag('status',$event)" id="submitstatus"
               v-cloak>提交状态</a>
            <a :class="(current_tag == 'graph'?'active':'')+' item'" @click="tag('graph',$event)" id="graph" v-cloak>提交图表</a>
            <a :class="(current_tag == 'statistics'?'active':'')+' item'" @click="tag('statistics',$event)" id="statistics"
               v-cloak>提交统计</a>
        </div>
        <div class="ui bottom attached segment" v-show="current_tag == 'status'">
            <div align=center class="input-append">
                <form class="ui form segment" method="get">
                    <div class="four fields">
                        <div class="field">
                            <label>{{$t("problem_id")}}</label>
                            <div class="ui fluid search dropdown selection" id="cur_problem" size="1">
                                <input @change="problem_id=$event.target.value" name="problem_id"
                                       type="hidden" v-model="problem_id">
                                <i class="dropdown icon"></i>
                                <div class="default text">All</div>
                                <div class="menu">
                                    <div class='item' data-value=''>{{$t("not selected")}}</div>
                                    <div :data-value="i" :key="i" class="item"
                                         v-for="i in Array.from(Array(total).keys())">
                                        {{1001 + i}}
                                    </div>
                                </div>
                            </div>
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
                                         v-for="i in Array.from(Array(language_name?language_name.local?language_name.local.length:0:0).keys())">
                                        <i :class="language_icon[i]+' color'"></i>
                                        {{language_name.local[i]}}
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
                    <div :class="'five fields center aligned'">
                        <div class="field">
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
                        <div class="field">
                            <button @click.prevent="search($event)" class="ui labeled icon mini button"><i
                                class="search icon"></i>{{$t("search")}}
                            </button>
                        </div>

                    </div>
                </form>
            </div>
            <br>
            <div class="row">
                <StatusTable :answer_class="judge_color" :answer_icon="icon_list"
                             :end="end" :finish="finish" :isadmin="isadmin"
                             :language_name="language_name"
                             :problem_list="problem_list"
                             :result="result"
                             :self="self"
                             :target="target"></StatusTable>
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
        <div class="ui attached bottom segment" v-show="current_tag == 'graph'">
            <div style="width:75%;margin:auto">
                <canvas id="canvas"></canvas>
            </div>
            <!--<h2 class="ui dividing header">PlaceHolder</h2>-->
            <div id="contest_li"></div>
            <h2 class="ui dividing header">代码长度</h2>
            <div class="amcharts" id="contest_code_length">加载中</div>
        </div>
        <div class="ui attached bottom segment" v-show="current_tag == 'statistics'">
            <Statistics :cid="cid" :finish="finish" :language_name="language_name"
                        :statistics="statistics"></Statistics>
        </div>
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
    "user statistic": "用户统计",
    "not selected": "未选择"
    },
    "en": {
    "auto refresh": "Auto Refresh",
    "show cheat only": "Show Cheating Only",
    "test run invisible": "Exclude TestRun Submission",
    "submit status": "Submit Status",
    "show user only": "Show Yourself Only",
    "submit graph": "Submission Graph",
    "result statistic": "Result Statistics",
    "user statistic": "User statistics",
    "not selected": "Not Selected"
    },
    "ja": {
    "auto refresh": "自動リフレッシュ",
    "show cheat only": "チート提出のみを表示",
    "test run invisible": "テスト提出を表示しない",
    "submit status": "提出リスト",
    "show user only": "自分だけを表示",
    "submit graph": "提出グラフ",
    "result statistics": "結果統計",
    "user statistic": "ユーザー統計",
    "not selected": "選択されていません"
    }
    }
</i18n>
<script lang="ts">
import mixins from "../../mixin/init";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import _ from "lodash";
import { Component, Mixins, Watch } from "vue-property-decorator";
import Statistics from "../../components/status/contest/Statistics.vue";
import StatusTable from "../../components/status/contest/StatusTable.vue";
import Chart from "chart.js";
import jquery from "jquery";
import StatusViewMixin from "@/mixin/StatusViewMixin";

const $: any = jquery;
const am4themes_animated = require("@amcharts/amcharts4/themes/animated").default;

function draw (_result: any) {
    let result = _result.result;
    let _label = _result.label;
    let _labels: any = [];
    let _submits: any = [];
    let _accepteds: any = [];
    let _persent: any = [];
    let total_submit = 0;
    let total_accepted = 0;
    _.forEach(result, function (i) {
        if (i[_label[0]] && i[_label[1]]) {
            _labels.push(i[_label[0]] + "-" + i[_label[1]]);
            total_submit += i.submit;
            total_accepted += i.accepted;
            _submits.push(total_submit || 0);
            _accepteds.push(total_accepted || 0);
            _persent.push((total_accepted / total_submit * 100).toString().substring(0, 5));
        }
    });
    let config: any = {
        type: "line",
        data: {
            labels: _labels,
            datasets: [{
                label: "总提交",
                yAxisID: "submit",
                backgroundColor: window.chartColors.red,
                borderColor: window.chartColors.red,
                data: _submits,
                fill: false
            }, {
                label: "正确",
                yAxisID: "submit",
                fill: false,
                backgroundColor: window.chartColors.blue,
                borderColor: window.chartColors.blue,
                data: _accepteds
            }, {
                label: "正确率",
                fill: false,
                yAxisID: "per",
                backgroundColor: window.chartColors.green,
                borderColor: window.chartColors.green,
                data: _persent
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: "统计信息"
            },
            tooltips: {
                mode: "index",
                intersect: false
            },
            hover: {
                mode: "nearest",
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: _label[0] + " : " + _label[1]
                    }
                }],
                yAxes: [{
                    id: "submit",
                    position: "left",
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: "提交"
                    }
                }, {
                    id: "per",
                    type: "linear",
                    position: "right",
                    scaleLabel: {
                        display: true,
                        labelString: "正确率"
                    },
                    ticks: {
                        max: 100,
                        min: 0
                    }
                }]
            }
        }
    };
    let ctx = (document!.getElementById!("canvas")! as any).getContext("2d");
    window.myLine = new Chart(ctx, config);
}

let hasDrawLineChart: any = {};

function drawLineChart (data: any, target = "default") {
// Themes begin

    // Themes end
    let data_array: any = [];

    if (!hasDrawLineChart[target]) {
        hasDrawLineChart[target] = true;
        _.forEach(data, function (val) {
            data_array.push({ date: new Date(val.in_date), value: val.code_length });
        });
    }
    else {
        return;
    }
    am4core.useTheme(am4themes_animated);
    let chart = am4core.create("contest_code_length", am4charts.XYChart);

    chart.data = data_array;

    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 60;

    chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    let series: any = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value";
    series.dataFields.dateX = "date";
    series.tooltipText = "{value}";

    series.tooltip.pointerOrientation = "vertical";

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.snapToSeries = series;
    chart.cursor.xAxis = dateAxis;

    // chart.scrollbarY = new am4core.Scrollbar();
    chart.scrollbarX = new am4core.Scrollbar();
}

    @Component({
        components: {
            StatusTable,
            Statistics
        }
    })
export default class ContestStatus extends Mixins(mixins, StatusViewMixin) {
        problem_list: any = [];
        icon_list = [];
        judge_color = [];
        target = {};
        language_name = {};
        language_icon = [];
        judge_icon = [];
        result = [];
        self = "";
        isadmin = false;
        page_cnt = 0;
        dim = false;
        end = false;
        finish = false;
        total = 0;
        stat = [];
        cid: any = null;
        res = ["WT", "WR", "CPL", "RN", "AC", "PE", "WA", "TLE", "MLE", "OLE", "RE", "CE", "CF", "TR",
            "SP", "SR", "SE"];
        sockets: any;

        get statistics () {
            let lang: any = {};
            let status: any = {};
            let maxResult: any = 0;
            let minResult: any = 19;
            let maxNum: any = 0;
            let used_lang: any = {};
            _.forEach(this.stat, function (val: any) {
                if (!status[val.num]) {
                    status[val.num] = {};
                }
                if (!lang[val.num]) {
                    lang[val.num] = {};
                }
                maxResult = Math.max(maxResult, val.result);
                minResult = Math.min(minResult, val.result);
                maxNum = Math.max(maxNum, val.num);
                if (!status[val.num][val.result]) {
                    status[val.num][val.result] = 0;
                }
                lang[val.num][val.language] = 0;
                used_lang[val.language] = val.language;
            });
            used_lang = _.values(used_lang);
            used_lang.sort((a: number, b: number) => a - b);
            for (let i = 0; i <= maxNum; ++i) {
                if (!status[i]) {
                    status[i] = {};
                }
            }
            _.forEach(status, function (val, index) {
                for (let i = minResult; i <= maxResult; ++i) {
                    status[index][i] = 0;
                }
            });
            for (let i = 0; i <= maxNum; ++i) {
                if (!lang[i]) {
                    lang[i] = {};
                }
                _.forEach(used_lang, function (val: any) {
                    lang[i][val] = 0;
                });
            }
            _.forEach(this.stat, function (val: any) {
                ++status[val.num][val.result];
                ++lang[val.num][val.language];
            });
            _.forEach(lang, function (_val: any, index: any) {
                _.forEach(used_lang, function (val: any) {
                    if (!lang[index][val]) {
                        lang[index][val] = 0;
                    }
                });
            });
            let totalSumProblem: any = {};
            _.forEach(status, function (val: any, index: any) {
                if (!totalSumProblem[index]) {
                    totalSumProblem[index] = 0;
                }
                _.forEach(status[index], function (val2: any) {
                    totalSumProblem[index] += val2;
                });
            });
            let totalSumResult: any = {};
            _.forEach(lang, function (val: any, index: any) {
                if (!totalSumResult[index]) {
                    totalSumResult[index] = 0;
                }
                _.forEach(lang[index], function (val2: any) {
                    totalSumResult[index] += val2;
                });
            });
            let langsum: any = {};
            _.forEach(lang, function (val: any) {
                _.forEach(val, function (v: any, idx: any) {
                    if (!langsum[idx]) {
                        langsum[idx] = v;
                    }
                    else {
                        langsum[idx] += v;
                    }
                });
            });
            let statsum: any = {};
            _.forEach(status, function (val: any) {
                _.forEach(val, function (v: any, idx: any) {
                    if (!statsum[idx]) {
                        statsum[idx] = v;
                    }
                    else {
                        statsum[idx] += v;
                    }
                });
            });
            let d: any = _.reduce(totalSumProblem, function (a, b) {
                return a + b;
            }, 0);
            if (maxResult === 0) {
                maxNum = -1;
            }
            let tot_res = [];
            for (let i = minResult; i <= maxResult; ++i) tot_res.push(i);
            return {
                total_problem: maxNum || 0,
                total_result: tot_res || [],
                status: this.res || [],
                stat_data: status || [],
                used_lang: used_lang,
                lang_data: lang,
                lang_sum: langsum || [],
                stat_sum: statsum || [],
                totalSumResult: totalSumResult,
                totalSumProblem: totalSumProblem,
                total_submit: d
            };
        }

        set statistics (val: any) {
            if (val.status === "OK") {
                this.total = val.total;
                this.stat = JSON.parse(JSON.stringify(val.data));
            }
        }

        created () {
            this.cid = parseInt(this.$route.params.contest_id);
            this.fetchData();
        }

        fetchData () {
            let problem_id = (this.problem_id = this.getProblemID() || null) || "null";
            let user_id = (this.user_id = this.getUserId() || null) || "null";
            let language = (this.language = this.getLanguage() || -1) == -1 ? "null" : this.getLanguage();
            let result = (this.problem_result = this.getResult() || -1) == -1 ? "null" : this.problem_result;
            let cid = this.cid || "";
            this.axios.get(`/api/status/${problem_id}/${user_id}/${language}/${result}/0/${cid}`)
                .then(({ data }) => {
                    this.dim = false;
                    this.finish = true;
                    this.search_func(data);
                });
        }

        @Watch("current_tag")
        onCurrentTagChanged (newVal: string) {
            if (newVal === "graph") {
                this.axios.get(`/api/status/problem/code_length/contest/${this.cid}`)
                    .then(({ data }) => {
                        _.delay(drawLineChart, 0, data.data);
                    });
            }
        }

        search_func (data: any) {
            let that = this;
            this.setQuery();
            that.problem_list = data.result;
            that.icon_list = data.const_list.icon_list;
            that.judge_color = data.const_list.judge_color;
            that.judge_icon = data.const_list.judge_icon;
            that.language_icon = data.const_list.language_icon;

            that.target = data.const_list.language.cn.status;
            that.language_name = data.const_list.language_name;
            that.result = data.const_list.result.cn;
            that.self = data.self;
            that.end = data.end;
            that.isadmin = data.isadmin || data.browse_code;
        }

        search () {
            this.dim = true;
            this.page_cnt = 0;
            let problem_id = this.problem_id || "null";
            let user_id = this.user_id || "null";
            let language = this.language == -1 ? "null" : this.language;
            let result = this.problem_result == -1 ? "null" : this.problem_result;
            let page_cnt = this.page_cnt * 20;
            let cid = this.cid || "";
            let sim = Number(this.sim_checkbox);
            let pri = Number(this.privilege);
            this.axios.get(`/api/status/${problem_id}/${user_id}/${language}/${result}/${page_cnt}/${cid}/${sim}/${pri}`)
                .then(({ data }) => {
                    this.dim = false;
                    this.search_func(data);
                });
        }

        page (num: any) {
            this.dim = true;
            this.page_cnt += num;
            let problem_id = this.problem_id || "null";
            let user_id = this.user_id || "null";
            let language = this.language == -1 ? "null" : this.language;
            let result = this.problem_result == -1 ? "null" : this.problem_result;
            let page_cnt = this.page_cnt * 20;
            let cid = this.cid || "";
            let sim_checkbox = Number(this.sim_checkbox);
            let pri = Number(this.privilege);
            this.axios.get(`/api/status/${problem_id}/${user_id}/${language}/${result}/${page_cnt}/${cid}/${sim_checkbox}/${pri}`)
                .then(({ data }) => {
                    this.dim = false;
                    this.search_func(data);
                });
        }

        Submit (data: any) {
            if (!this.auto_refresh) {
                return;
            }
            let obj: any = {};
            if ((!this.user_id || this.user_id === data.user_id) && (!~this.problem_result || data.val.result === this.problem_result) && (this.language === -1 || this.language === data.val.language) && !this.page_cnt && (!this.problem_id || parseInt(this.problem_id) === Math.abs(data.val.pid))) {
                obj.problem_id = Math.abs(data.val.id);
                obj.solution_id = data.submission_id;
                obj.nick = data.nick;
                obj.user_id = data.user_id;
                obj.contest_id = Math.abs(parseInt(data.val.cid));
                obj.num = parseInt(data.val.pid);
                obj.length = data.val.source.length;
                obj.sim = false;
                obj.language = data.val.language;
                obj.memory = obj.time = 0;
                obj.in_date = new Date().toISOString();
                obj.ip = data.val.ip;
                obj.fingerprint = data.val.fingerprint;
                obj.fingerprintRaw = data.val.fingerprintRaw;
                obj.judger = "RATH";
                obj.avatar = !!data.val.avatar;
                obj.result = 0;
                this.problem_list.pop();
                this.problem_list.unshift(obj);
            }
        }

        Update (data: any) {
            if (!this.auto_refresh) {
                return;
            }
            if (this.privilege && isNaN(data.contest_id)) {
                return;
            }
            let solution_id = data.solution_id;
            let status = data.state;
            let time = data.time;
            let memory = data.memory;
            let pass_rate = data.pass_rate;
            let contest_id = parseInt(data.contest_id);
            let num = parseInt(data.num);
            let sim = parseInt(data.sim);
            let sim_s_id = parseInt(data.sim_s_id);
            for (let i of this.problem_list) {
                if (i.solution_id == solution_id) {
                    console.warn("int", i);
                    i.result = status;
                    i.time = time;
                    i.memory = memory;
                    i.pass_rate = pass_rate;
                    i.contest_id = contest_id;
                    i.num = num;
                    i.sim = sim;
                    i.sim_id = sim_s_id;
                    return;
                }
            }
        }

        tag (tag_name: any) {
            this.current_tag = tag_name;
        }

        updated () {
            this.$nextTick(function () {
                $("#cur_problem").dropdown("set selected", this.problem_id);
            });
        }

        mounted () {
            document.title = `Contest ${this.cid} Status -- ${document.title}`;
            this.axios.get(`/api/status/graph?cid=${this.cid}`)
                .then(({ data }) => {
                    draw(data);
                });
            this.axios.get(`/api/contest/statistics/${this.cid}`)
                .then(({ data }) => {
                    this.statistics = data;
                });
            this.sockets.subscribe("submit", (data: any) => {
                if (!isNaN(data.val.cid) && Math.abs(parseInt(data.val.cid)) === this.cid) {
                    this.Submit(data);
                }
            });
            this.sockets.subscribe("result", (data: any) => {
                if (!isNaN(data.contest_id) && Math.abs(parseInt(data.contest_id)) === this.cid) {
                    this.Update(data);
                }
            });
        }

        beforeDestory () {
            this.sockets.unsubscribe("submit");
            this.sockets.unsubscribe("result");
        }
}
</script>

<style scoped>
    .ui.form .fields .field .ui.checkbox {
        margin-top: inherit !important;
    }
</style>
