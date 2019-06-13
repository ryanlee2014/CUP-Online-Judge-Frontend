<template>
    <div class="padding ui container">
        <h2 class="ui dividing header">
            Status
        </h2>
        <div class="ui top attached tabular menu">
            <a v-cloak :class="(current_tag == 'status'?'active':'')+' item'" @click="tag('status',$event)" id="submitstatus">提交状态</a>
            <a v-cloak :class="(current_tag == 'graph'?'active':'')+' item'" @click="tag('graph',$event)" id="graph">提交图表</a>
            <a v-cloak :class="(current_tag == 'statistics'?'active':'')+' item'" @click="tag('statistics',$event)" id="statistics">提交统计</a>
        </div>
        <div class="ui bottom attached segment" v-show="current_tag == 'status'">
            <div align=center class="input-append">
                <form class="ui form segment" method="get">
                    <div class="four fields">
                        <div class="field">
                            <label>{{$t("problem_id")}}</label>
                            <div class="ui fluid search dropdown selection" size="1" id="cur_problem">
                                <input v-model="problem_id" @change="problem_id=$event.target.value"
                                       type="hidden" name="problem_id">
                                <i class="dropdown icon"></i>
                                <div class="default text">All</div>
                                <div class="menu">
                                    <div class='item' data-value=''>{{$t("not selected")}}</div>
                                    <div :key="i" v-for="i in Array.from(Array(total).keys())" class="item" :data-value="i">
                                        {{1001 + i}}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field">
                            <label>{{$t("user_id")}}</label>
                            <input v-model="user_id" class="form-control" type=text size=4 name=user_id
                                   value=''>
                        </div>
                        <div class="field">
                            <label>{{$t("language")}}</label>
                            <div class="ui fluid search dropdown selection" size="1">
                                <input v-model="language" @change="language=$event.target.value"
                                       type="hidden" name="language">
                                <i class="dropdown icon"></i>
                                <div class="default text">All</div>
                                <div class="menu">
                                    <div class='item' data-value='-1'>All<i class="dropdown icon"
                                                                            style="visibility: hidden; "></i></div>
                                    <div :key="i" class="item" :data-value="i" v-for="i in Array.from(Array(language_name?language_name.local?language_name.local.length:0:0).keys())">
                                        <i :class="language_icon[i]+' color'"></i>
                                        {{language_name.local[i]}}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field">
                            <label>{{$t("result")}}</label>
                            <div class="ui fluid search dropdown selection" size="1">
                                <input v-model="problem_result" @change="problem_result=$event.target.value"
                                       type="hidden" name="jresult">
                                <i class="dropdown icon"></i>
                                <div class="default text">All</div>
                                <div class="menu">
                                    <div class='item' data-value='-1'>All<i class="dropdown icon"
                                                                            style="visibility: hidden; "></i></div>
                                    <div :key="i" class="item" :data-value="i" v-for="i in Array.from(Array(judge_color ? judge_color.length : 0).keys())">
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
                                <input type="checkbox" @click="auto_refresh=!auto_refresh" checked="true">
                                <label>{{$t("auto refresh")}}</label>
                            </div>
                        </div>
                        <div class="field" style="margin:auto">
                            <div class="ui toggle checkbox">
                                <input type="checkbox" @click="sim_checkbox=!sim_checkbox">
                                <label>{{$t("show cheat only")}}</label>
                            </div>
                        </div>
                        <div v-if="isadmin" class="field" style="margin:auto">
                            <div class="ui toggle checkbox">
                                <input type="checkbox" @click="privilege=!privilege">
                                <label>{{$t("test run invisible")}}</label>
                            </div>
                        </div>
                        <div class="field" style="margin:auto">
                            <div class="ui toggle checkbox">
                                <input type="checkbox" @click="list_self_only">
                                <label>{{$t("show user only")}}</label>
                            </div>
                        </div>
                        <div class="field">
                            <button class="ui labeled icon mini button" @click.prevent="search($event)"><i
                                    class="search icon"></i>{{$t("search")}}</button>
                        </div>

                    </div>
                </form>
            </div>
            <br>
            <div class="row">
                <StatusTable :target="target" :problem_list="problem_list"
                              :answer_class="judge_color" :answer_icon="icon_list" :language_name="language_name"
                              :self="self"
                              :result="result"
                              :end="end"
                              :isadmin="isadmin"
                              :finish="finish"></StatusTable>
                <div class="ui active inverted dimmer" v-if="dim"><div class="ui large text loader">Loading</div></div>
            </div>
            <br>
            <div class="row">
                <a v-cloak :class="'ui button '+(page_cnt == 0?'disabled':'')" @click="page_cnt != 0 && page(-page_cnt,$event)">Top</a>
                <div class="ui buttons">
                    <button v-cloak :class="'ui left labeled icon button '+(page_cnt == 0?'disabled':'')"
                            @click="page_cnt!=0&&page(-1,$event)">
                        <i class="left arrow icon"></i>
                        Prev
                    </button>
                    <div class="or" v-cloak></div>
                    <button v-cloak :class="'ui right labeled icon button '+(problem_list.length == 0?'disabled':'')"
                            @click="problem_list.length != 0 && page(1,$event)">
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
            <div id="contest_code_length" class="amcharts">加载中</div>
        </div>
        <div class="ui attached bottom segment" v-show="current_tag == 'statistics'">
            <Statistics :statistics="statistics" :cid="cid" :finish="finish" :language_name="language_name"></Statistics>
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
<script>
import mixins from "../../mixin/init";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import Statistics from "../../components/status/contest/Statistics";
import StatusTable from "../../components/status/contest/StatusTable";

const Chart = require("chart.js");
const $ = window.$ = window.jQuery = require("jquery");
const _ = require("lodash");
const Cookies = require("js-cookie");
require("../../static/js/semantic.min");

function draw (_result) {
    let result = _result.result;
    let _label = _result.label;
    let _labels = [];
    let _submits = [];
    let _accepteds = [];
    let _persent = [];
    let total_submit = 0; let total_accepted = 0;
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
    let config = {
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
    let ctx = document.getElementById("canvas").getContext("2d");
    window.myLine = new Chart(ctx, config);
}

let hasDrawLineChart = {};
function drawLineChart (data, target = "default") {
// Themes begin

    // Themes end
    let data_array = [];

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
    let series = chart.series.push(new am4charts.LineSeries());
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

export default {
    name: "contest",
    mixins: [mixins],
    components: {
        StatusTable,
        Statistics
    },
    data: function () {
        return {
            problem_list: [],
            icon_list: [],
            judge_color: [],
            target: {},
            language_name: {},
            language_icon: [],
            judge_icon: [],
            auto_refresh: true,
            result: [],
            self: "",
            isadmin: false,
            problem_id: null,
            user_id: null,
            language: -1,
            problem_result: -1,
            sim_checkbox: false,
            privilege: 0,
            page_cnt: 0,
            current_tag: "status",
            dim: false,
            end: false,
            finish: false,
            total: 0,
            stat: [],
            cid: parseInt(this.$route.params.contest_id),
            res: ["WT", "WR", "CPL", "RN", "AC", "PE", "WA", "TLE", "MLE", "OLE", "RE", "CE", "CF", "TR",
                "SP", "SR", "SE"]
        };
    },
    watch: {
        sim_checkbox: function () {
            this.search();
        },
        privilege: function () {
            let that = this;
            this.search().then(function () { that.search(); });
        },
        auto_refresh: function (newVal) {
            let that = this;
            if (newVal) {
                this.search().then(function () { that.search(); });
            }
        },
        current_tag: function (newVal) {
            if (newVal === "graph") {
                $.get("/api/status/problem/code_length/contest/" + this.cid, function (data) {
                    if (data.status == "OK") {
                        _.delay(drawLineChart, 0, data.data);
                    }
                });
            }
        }
    },
    computed: {
        statistics: {
            get: function () {
                let lang = {};
                let status = {};
                let maxResult = 0;
                let minResult = 19;
                let maxNum = 0;
                let used_lang = {};
                _.forEach(this.stat, function (val) {
                    if (!status[val.num]) {
                        status[val.num] = {};
                    }
                    if (!lang[val.num]) {
                        lang[val.num] = {};
                    }
                    maxResult = Math.max(maxResult, val.result);
                    minResult = Math.min(minResult, val.result);
                    maxNum = Math.max(maxNum, val.num);
                    if (!status[val.num][val.result]) { status[val.num][val.result] = 0; }
                    lang[val.num][val.language] = 0;
                    used_lang[val.language] = val.language;
                });
                used_lang = _.values(used_lang);
                used_lang.sort(function (a, b) { return a - b; });
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
                    _.forEach(used_lang, function (val) {
                        lang[i][val] = 0;
                    });
                }
                _.forEach(this.stat, function (val) {
                    ++status[val.num][val.result];
                    ++lang[val.num][val.language];
                });
                _.forEach(lang, function (val, index) {
                    _.forEach(used_lang, function (val) {
                        if (!lang[index][val]) {
                            lang[index][val] = 0;
                        }
                    });
                });
                let totalSumProblem = {};
                _.forEach(status, function (val, index) {
                    if (!totalSumProblem[index]) {
                        totalSumProblem[index] = 0;
                    }
                    _.forEach(status[index], function (val2) {
                        totalSumProblem[index] += val2;
                    });
                });
                let totalSumResult = {};
                _.forEach(lang, function (val, index) {
                    if (!totalSumResult[index]) {
                        totalSumResult[index] = 0;
                    }
                    _.forEach(lang[index], function (val2) {
                        totalSumResult[index] += val2;
                    });
                });
                let langsum = {};
                _.forEach(lang, function (val) {
                    _.forEach(val, function (v, idx) {
                        if (!langsum[idx]) {
                            langsum[idx] = v;
                        }
                        else {
                            langsum[idx] += v;
                        }
                    });
                });
                let statsum = {};
                _.forEach(status, function (val) {
                    _.forEach(val, function (v, idx) {
                        if (!statsum[idx]) {
                            statsum[idx] = v;
                        }
                        else {
                            statsum[idx] += v;
                        }
                    });
                });
                let d = _.reduce(totalSumProblem, function (a, b) { return a + b; }, 0);
                if (maxResult === 0) {
                    maxNum = -1;
                }
                let tot_res = [];
                for (let i = minResult; i <= maxResult; ++i)tot_res.push(i);
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
            },
            set: function (val) {
                if (val.status == "OK") {
                    this.total = val.total;
                    this.stat = JSON.parse(JSON.stringify(val.data));
                }
            }
        }
    },
    methods: {
        getUserId: function () {
            return this.$route.query.user_id;
        },
        getResult: function () {
            return this.$route.query.jresult;
        },
        getProblemID: function () {
            return this.$route.query.problem_id;
        },
        getLanguage: function () {
            return this.$route.query.language;
        },
        setQuery: function () {
            let queryobject = {};
            queryobject["cid"] = this.cid;
            if (this.user_id && this.user_id.length > 0) { queryobject["user_id"] = this.user_id; }
            if (this.problem_result && this.problem_result !== -1) { queryobject["jresult"] = this.problem_result; }
            if (this.problem_id && this.problem_id !== 0) { queryobject["problem_id"] = this.problem_id; }
            if (this.language && this.language !== -1) { queryobject["language"] = this.language; }
            this.$router.push({ path: this.$route.path, query: queryobject });
        },
        search_func: function (data) {
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
        },
        search: function () {
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
            let that = this;
            $.get("/api/status/" + problem_id + "/" + user_id + "/" + language + "/" + result + "/" + page_cnt + "/" + cid + "/" + sim + "/" + pri, function (data) {
                that.dim = false;
                that.search_func(data);
            });
        },
        list_self_only: function () {
            let self_user_id = Cookies.get("user_id");
            if (this.user_id == null || this.user_id != self_user_id) {
                this.user_id = self_user_id;
            }
            else {
                this.user_id = null;
            }
            this.search();
        },
        page: function (num) {
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
            let that = this;
            $.get("/api/status/" + problem_id + "/" + user_id + "/" + language + "/" + result + "/" + page_cnt + "/" + cid + "/" + sim_checkbox + "/" + pri, function (data) {
                that.dim = false;
                that.search_func(data);
                $.get("/api/status/" + problem_id + "/" + user_id + "/" + language + "/" + result + "/" + page_cnt + "/" + cid + "/" + sim_checkbox + "/" + pri, function (data) {
                    that.dim = false;
                    that.search_func(data);
                });
            });
        },
        Submit: function (data) {
            if (!this.auto_refresh) {
                return;
            }
            let obj = {};
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
        },
        Update: function (data) {
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
        },
        tag: function (tag_name) {
            this.current_tag = tag_name;
        }
    },
    updated: function () {
        $("tr").popup({
            on: "hover",
            positon: "top center"
        });
        this.$nextTick(function () {
            $("#cur_problem").dropdown("set selected", this.problem_id);
        });
    },
    created: function () {
        let that = this;
        let problem_id = (this.problem_id = this.getProblemID() || null) || "null";
        let user_id = (this.user_id = this.getUserId() || null) || "null";
        let language = (this.language = this.getLanguage() || -1) == -1 ? "null" : this.getLanguage();
        let result = (this.problem_result = this.getResult() || -1) == -1 ? "null" : this.problem_result;
        let cid = this.cid || "";
        $.get("/api/status/" + problem_id + "/" + user_id + "/" + language + "/" + result + "/0/" + cid, function (data) {
            that.dim = false;
            that.finish = true;
            that.search_func(data);
        });
        $.get("/api/status/" + problem_id + "/" + user_id + "/" + language + "/" + result + "/0/" + cid, function (data) {
            that.dim = false;
            that.search_func(data);
        });
    },
    mounted: function () {
        document.title = `Contest ${this.cid} Status -- ${document.title}`;
        let that = this;
        $.get("/api/status/graph?cid=" + this.cid, function (data) {
            draw(data);
        });
        $.get("/api/contest/statistics/" + this.cid, function (data) {
            that.statistics = data;
        });
    },
    sockets: {
        submit: function (data) {
            if (!isNaN(data.val.cid) && Math.abs(parseInt(data.val.cid)) === this.cid) {
                this.Submit(data);
            }
        },
        result: function (data) {
            if (!isNaN(data.contest_id) && Math.abs(parseInt(data.contest_id)) === this.cid) {
                this.Update(data);
            }
        }
    }
};
</script>

<style scoped>
    .ui.form .fields .field .ui.checkbox {
        margin-top: inherit!important;
    }
</style>
