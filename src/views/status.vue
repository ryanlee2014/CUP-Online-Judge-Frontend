<template>
    <div class="padding ui container">
        <h2 class="ui dividing header">
            Status
        </h2>
        <div class="ui top attached tabular menu">
            <a v-cloak :class="(current_tag == 'status'?'active':'')+' item'" @click="tag('status',$event)"
               id="submitstatus">{{$t("submit status")}}</a>
            <a v-cloak :class="(current_tag == 'graph'?'active':'')+' item'" @click="tag('graph',$event)" id="graph">{{$t("submit graph")}}</a>
            <a :class="(current_tag == 'result'?'active':'') + ' item'" @click="tag('result',$event)">
                {{$t("result statistic")}}
            </a>
            <a :class="(current_tag == 'user'?'active':'') + ' item'" @click="tag('user',$event)">
                {{$t("user statistic")}}
            </a>
        </div>
        <div class="ui bottom attached segment" v-show="current_tag == 'status'">
            <div align=center class="input-append">
                <form id=simform class="ui form segment" method="get">
                    <div class="four fields">
                        <div class="field">
                            <label>{{$t("problem_id")}}</label>
                            <input v-model="problem_id" class="form-control" type=text size=4 name=problem_id>
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
                                    <div :key="i" class="item" :data-value="i"
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
                                <input v-model="problem_result" @change="problem_result=$event.target.value"
                                       type="hidden" name="jresult">
                                <i class="dropdown icon"></i>
                                <div class="default text">All</div>
                                <div class="menu">
                                    <div class='item' data-value='-1'>All<i class="dropdown icon"
                                                                            style="visibility: hidden; "></i></div>
                                    <div :key="i" class="item" :data-value="i"
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
                        <div class="field" style="margin:auto">
                            <button class="ui labeled icon mini button" @click.prevent="search($event)">
                                <i class="search icon"></i>{{$t("search")}}</button>
                        </div>

                    </div>
                </form>
            </div>
            <br>
            <div class="row">
                <status-table :target="target" :problem_list="problem_list"
                              :answer_class="judge_color" :answer_icon="icon_list" :language_name="language_name"
                              :self="self"
                              :result="result"
                              :isadmin="isadmin"></status-table>
                <div class="ui active inverted dimmer" v-if="dim">
                    <div class="ui large text loader">Loading</div>
                </div>
            </div>
            <br>
            <div class="row">
                <a v-cloak :class="'ui button '+(page_cnt == 0?'disabled':'')"
                   @click="page_cnt != 0 && page(-page_cnt,$event)">Top</a>
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
            <div style="width:90%;margin:auto">
                <canvas id="canvas"></canvas>
            </div>
            <div class="ui grid">
                <div class="row">
                    <div class="eight wide column">
                        <div style="width:550px;">
                            <canvas id="subtime"></canvas>
                        </div>
                    </div>
                    <div class="eigth wide column">
                        <div style="width:550px;">
                            <canvas id="logtime"></canvas>
                        </div>
                    </div>
                </div>
                <div class="row" style="width: 100%">
                    <div id="register_timeline" style="width: 100%;height:600px"></div>
                </div>
            </div>

        </div>
        <div class="ui attached bottom segment" v-show="current_tag == 'result'">
            <div style="width:90%;margin:auto">
                <canvas id="bar"></canvas>
            </div>
        </div>
        <div class="ui attached bottom segment" v-show="current_tag == 'user'">
            <h2 class="ui dividing header">{{$t("browser")}}</h2>
            <div id="browser_statistics" class="amcharts">{{$t("loading")}}</div>
            <h2 class="ui dividing header">{{$t("os")}}</h2>
            <div id="os_statistics" class="amcharts">{{$t("loading")}}</div>
            <h2 class="ui dividing header">Chord graph</h2>
            <div id="chord_graph" class="amcharts">{{$t("loading")}}</div>
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
<script>
import statusTable from "../components/status/status-table";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import mixins from "../mixin/init";
const $ = require("jquery"); const jQuery = $;
const _ = require("lodash");
const Chart = require("chart.js");
const Cookies = require("js-cookie");
window.$ = window.jQuery = $;
function draw (_result) {
    let result = _result.result;
    let _label = _result.label;
    let row = {};
    _.forEach(result, function (i) {
        row[i[_label[0]]] = row[i[_label[0]]] || {};
        row[i[_label[0]]][i[_label[1]]] = {
            submit: i.submit,
            accepted: i.accepted || 0
        };
    });

    let _labels = [];
    let _submits = [];
    let _accepteds = [];
    let _persent = [];
    _.forEach(row, function (val, i) {
        _.forEach(row[i], function (val2, j) {
            _labels.push(i.toString() + "-" + j.toString());
            _submits.push(row[i][j].submit);
            _accepteds.push(row[i][j].accepted);
            _persent.push((row[i][j].accepted / row[i][j].submit * 100).toString().substring(0, 5));
        });
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
                        labelString: "月份"
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
function drawResult (data, labelName) {
    data.sort(function (a, b) {
        return b.cnt - a.cnt;
    });
    let color = window.chartColors;
    let colorTocolor = {
        0: color.blue,
        1: color.blue,
        2: color.blue,
        3: color.blue,
        4: color.green,
        5: color.red,
        6: color.red,
        7: color.yellow,
        8: color.yellow,
        9: color.yellow,
        10: color.yellow,
        11: color.grey,
        12: color.blue,
        13: color.blue,
        14: color.red,
        15: color.red
    };
    let dataSet = [];
    let labName = [];
    dataSet.push({
        label: "提交数",
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        data: []
    });
    // eslint-disable-next-line no-unused-vars
    _.forEach(data, function (val, idx) {
        labName.push(labelName[val.result]);
        dataSet[0].backgroundColor.push(colorTocolor[val.result]);
        dataSet[0].borderColor.push("white");
        dataSet[0].data.push(val.cnt);
    });
    let barChartData = {
        labels: labName,
        datasets: dataSet
    };
    barChartData = JSON.parse(JSON.stringify(barChartData));
    let ctx = document.getElementById("bar").getContext("2d");
    window.myBar = new Chart(ctx, {
        type: "bar",
        data: barChartData,
        options: {
            responsive: true,
            legend: {
                display: false,
                position: "top"
            },
            title: {
                display: false,
                text: "提交统计"
            }
        }
    });
}
function drawBar (data) {
    let login = data.login;
    data = data.submit;
    let color = Chart.helpers.color;
    let config = {
        type: "radar",
        data: {
            labels: [],
            datasets: [{
                label: "提交分布",
                backgroundColor: color(window.chartColors.red).alpha(0.2).rgbString(),
                borderColor: window.chartColors.red,
                pointBackgroundColor: window.chartColors.red,
                data: []
            }]
        },
        options: {
            legend: {
                position: "top"
            },
            title: {
                display: true,
                text: "提交时间分布"
            },
            scale: {
                ticks: {
                    beginAtZero: true
                }
            }
        }
    };
    _.forEach(data, function (val) {
        config.data.labels.push(val.hour + ":00");
        config.data.datasets[0].data.push(val.cnt);
    });
    let copyconfig = JSON.parse(JSON.stringify(config));
    copyconfig.data.datasets = [{
        label: "登录分布",
        backgroundColor: color(window.chartColors.blue).alpha(0.2).rgbString(),
        borderColor: window.chartColors.blue,
        pointBackgroundColor: window.chartColors.blue,
        data: []
    }];
    _.forEach(login, function (val) {
        copyconfig.data.datasets[0].data.push(val.cnt);
    });
    copyconfig.options.title.text = "登录时间分布";
    new Chart(document.getElementById("subtime"), config);
    new Chart(document.getElementById("logtime"), copyconfig);
    // console.log(data);
    // console.log(config);
}
let hasRendered = {};
function drawDynamicInteractiveLineChart (dataSets, prefix, target) {
    let adapter_object = {};
    let full_name = prefix + "_name";
    let full_version = prefix + "_version";
    if (hasRendered[target]) {
        return;
    }
    if (window.temp_data_object && window.temp_data_object[target]) {
        adapter_object = window.temp_data_object[target];
    }
    else if (dataSets === undefined) {
        return;
    }
    else {
        hasRendered[target] = true;
        _.forEach(dataSets, function (d) {
            if (!adapter_object[d[full_name]]) {
                adapter_object[d[full_name]] = {
                    name: d[full_name],
                    version: {}
                };
            }
            if (!adapter_object[d[full_name]].version[d[full_version]]) {
                adapter_object[d[full_name]].version[d[full_version]] = 1;
            }
            else {
                ++adapter_object[d[full_name]].version[d[full_version]];
            }
        });
        adapter_object = _.values(adapter_object);

        _.forEach(adapter_object, function (val, idx) {
            if (!adapter_object[idx].children) {
                adapter_object[idx].children = [];
            }
            _.forEach(val.version, function (v, id) {
                adapter_object[idx].children.push({
                    name: id,
                    value: v
                });
            });
        });
        if (!window.temp_data_object) {
            window.temp_data_object = {};
        }
        window.temp_data_object[target] = adapter_object;
    }

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // create chart
    let chart = am4core.create(target, am4charts.TreeMap);
    chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect
    window.chart_graph = chart;
    chart.data = adapter_object;

    chart.colors.step = 2;

    // define data fields
    chart.dataFields.value = "value";
    chart.dataFields.name = "name";
    chart.dataFields.children = "children";

    chart.zoomable = true;
    let bgColor = new am4core.InterfaceColorSet().getFor("background");

    // level 0 series template
    let level0SeriesTemplate = chart.seriesTemplates.create("0");
    let level0ColumnTemplate = level0SeriesTemplate.columns.template;

    level0ColumnTemplate.column.cornerRadius(10, 10, 10, 10);
    level0ColumnTemplate.fillOpacity = 0;
    level0ColumnTemplate.strokeWidth = 4;
    level0ColumnTemplate.strokeOpacity = 0;

    // level 1 series template
    let level1SeriesTemplate = chart.seriesTemplates.create("1");
    let level1ColumnTemplate = level1SeriesTemplate.columns.template;

    level1SeriesTemplate.tooltip.animationDuration = 0;
    level1SeriesTemplate.strokeOpacity = 1;

    level1ColumnTemplate.column.cornerRadius(10, 10, 10, 10);
    level1ColumnTemplate.fillOpacity = 1;
    level1ColumnTemplate.strokeWidth = 4;
    level1ColumnTemplate.stroke = bgColor;

    let bullet1 = level1SeriesTemplate.bullets.push(new am4charts.LabelBullet());
    bullet1.locationY = 0.5;
    bullet1.locationX = 0.5;
    bullet1.label.text = "{name}";
    bullet1.label.fill = am4core.color("#ffffff");

    chart.maxLevels = 2;
}
function drawChordGraph (data, prefix = "chord_graph") {
    if (hasRendered[prefix]) {
        return;
    }
    hasRendered[prefix] = true;
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    let chart = am4core.create("chord_graph", am4charts.ChordDiagram);

    _.forEach(data, function (el) {
        if (el.from > el.to) {
            let tmp = el.from;
            el.from = el.to;
            el.to = tmp;
        }
    });

    data.sort(function (a, b) {
        return b.value - a.value;
    });

    while (data.length > 30) {
        data.pop();
    }

    chart.data = data;

    chart.dataFields.fromName = "from";
    chart.dataFields.toName = "to";
    chart.dataFields.value = "value";

    // make nodes draggable
    let nodeTemplate = chart.nodes.template;
    nodeTemplate.readerTitle = "Click to show/hide or drag to rearrange";
    nodeTemplate.showSystemTooltip = true;

    let nodeLink = chart.links.template;
    let bullet = nodeLink.bullets.push(new am4charts.CircleBullet());
    bullet.fillOpacity = 1;
    bullet.circle.radius = 5;
    bullet.locationX = 0.5;

    // create animations
    chart.events.on("ready", function () {
        for (let i = 0; i < chart.links.length; i++) {
            let link = chart.links.getIndex(i);
            let bullet = link.bullets.getIndex(0);

            animateBullet(bullet);
        }
    });

    function animateBullet (bullet) {
        let duration = 3000 * Math.random() + 2000;
        let animation = bullet.animate([{ property: "locationX", from: 0, to: 1 }], duration);
        animation.events.on("animationended", function (event) {
            animateBullet(event.target.object);
        });
    }
}
function drawRegisterTimeline (data) {
    if (hasRendered["timeline"]) {
        return;
    }
    hasRendered["timeline"] = true;
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    let chart = am4core.create("register_timeline", am4charts.XYChart);
    chart.paddingRight = 20;
    let title = chart.titles.create();
    title.text = "注册人数变化";
    title.fontSize = 15;
    title.marginBottom = 30;
    // Add data
    chart.data = data;

    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value";
    series.dataFields.dateX = "date";
    series.tooltipText = "{value}";
    series.strokeWidth = 2;
    series.minBulletDistance = 15;

    // Drop-shaped tooltips
    series.tooltip.background.cornerRadius = 20;
    series.tooltip.background.strokeOpacity = 0;
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.label.minWidth = 40;
    series.tooltip.label.minHeight = 40;
    series.tooltip.label.textAlign = "middle";
    series.tooltip.label.textValign = "middle";

    // Make bullets grow on hover
    let bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.strokeWidth = 2;
    bullet.circle.radius = 4;
    bullet.circle.fill = am4core.color("#fff");

    let bullethover = bullet.states.create("hover");
    bullethover.properties.scale = 1.3;

    // Make a panning cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "panXY";
    chart.cursor.xAxis = dateAxis;
    chart.cursor.snapToSeries = series;

    // Create vertical scrollbar and place it before the value axis
    chart.scrollbarY = new am4core.Scrollbar();
    chart.scrollbarY.parent = chart.leftAxesContainer;
    chart.scrollbarY.toBack();

    // Create a horizontal scrollbar with previe and place it underneath the date axis
    chart.scrollbarX = new am4charts.XYChartScrollbar();
    chart.scrollbarX.series.push(series);
    chart.scrollbarX.parent = chart.bottomAxesContainer;
} // end am4core.ready()
export default {
    name: "status",
    components: {
        statusTable
    },
    mixins: [mixins],
    data: function () {
        return {
            problem_list: [],
            icon_list: [],
            judge_color: [],
            judge_icon: [],
            target: {},
            language_name: [],
            result: [],
            language_icon: [],
            self: "",
            isadmin: false,
            problem_id: null,
            user_id: null,
            language: -1,
            sim_checkbox: 0,
            privilege: 0,
            problem_result: -1,
            auto_refresh: true,
            page_cnt: 0,
            current_tag: "status",
            dim: false
        };
    },
    watch: {
    // eslint-disable-next-line no-unused-vars
        sim_checkbox: function (newVal, oldVal) {
            let that = this;
            this.search().then(function () {
                that.search();
            });
        },
        privilege: function (newVal, oldVal) {
            let that = this;
            this.search().then(function () {
                that.search();
            });
        },
        auto_refresh: function (newVal, oldVal) {
            let that = this;
            if (newVal) {
                this.search().then(function () {
                    that.search();
                });
            }
        },
        current_tag: function (newVal, oldVal) {
            if (newVal === "user") {
                $.get("/api/status/device/browser", function (data) {
                    if (data.status === "OK") {
                        _.delay(drawDynamicInteractiveLineChart, 0, data.data, "browser", "browser_statistics");
                    }
                    $.get("/api/status/device/os", function (data) {
                        if (data.status === "OK") {
                            _.delay(drawDynamicInteractiveLineChart, 0, data.data, "os", "os_statistics");
                        }
                    });
                    $.get("/api/status/problem/solve_map/", function (data) {
                        if (data.status === "OK") {
                            _.delay(drawChordGraph, 0, data.data);
                        }
                    });
                });
            }
            else if (newVal === "graph") {
                $.get("/api/user/register_timeline", function (data) {
                    if (data.status == "OK") {
                        _.delay(drawRegisterTimeline, 0, data.data);
                    }
                });
            }
        }
    },
    computed: {},
    methods: {
        getUserId: function () {
            if (this.$route.query) {
                return this.$route.query.user_id;
            }
            return null;
        },
        getResult: function () {
            if (this.$route.query) {
                return this.$route.query.jresult;
            }
            return null;
        },
        getProblemID: function () {
            if (this.$route.query) {
                return this.$route.query.problem_id;
            }
            return null;
        },
        getLanguage: function () {
            if (this.$route.query) {
                return this.$route.query.language;
            }
            return null;
        },
        setQuery: function () {
            let queryobject = {};
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
            that.target = data.const_list.language.cn.status;
            that.judge_icon = data.const_list.judge_icon;
            that.language_icon = data.const_list.language_icon;
            that.language_name = data.const_list.language_name.local;
            that.result = data.const_list.result.cn;
            that.self = data.self;
            that.isadmin = data.isadmin || data.browse_code;
        },
        search: function ($event) {
            let that = this;
            this.dim = true;
            this.page_cnt = 0;
            let problemId = this.problem_id || "null";
            let userId = this.user_id || "null";
            let language = this.language == -1 ? "null" : this.language;
            let result = this.problem_result == -1 ? "null" : this.problem_result;
            let pageCount = this.page_cnt * 20;
            let sim = Number(this.sim_checkbox);
            let pri = Number(this.privilege);
            return this.axios.get(`/api/status/${problemId}/${userId}/${language}/${result}/${pageCount}/${sim}/${pri}`)
                .then(({ data }) => {
                    this.dim = false;
                    this.search_func(data);
                });
        },
        list_self_only: function () {
            let that = this;
            let selfUserId = this.$store.getters.user_id;
            if (this.user_id == null || this.user_id !== selfUserId) {
                this.user_id = selfUserId;
            }
            else {
                this.user_id = null;
            }
            this.search();
        },
        page: function (num, $event) {
            this.dim = true;
            this.page_cnt += num;
            let problemId = this.problem_id || "null";
            let userId = this.user_id || "null";
            let language = this.language == -1 ? "null" : this.language;
            let result = this.problem_result == -1 ? "null" : this.problem_result;
            let pageCount = this.page_cnt * 20;
            let simCheckbox = Number(this.sim_checkbox);
            let pri = Number(this.privilege);
            this.axios.get(`/api/status/${problemId}/${userId}/${language}/${result}/${pageCount}/${simCheckbox}/${pri}`)
                .then(({ data }) => {
                    this.dim = false;
                    this.search_func(data);
                    this.axios.get(`/api/status/${problemId}/${userId}/${language}/${result}/${pageCount}/${simCheckbox}/${pri}`)
                        .then(({ data }) => {
                            this.dim = false;
                            this.search_func(data);
                        });
                });
        },
        Submit: function (data) {
            if (!this.auto_refresh) {
                return;
            }
            if (this.privilege && (data.val.id <= 0 || (data.val.cid && data.val.cid <= 0))) {
                return;
            }
            if (this.sim_checkbox || this.privilege) {
                return;
            }
            if ((!this.user_id || this.user_id === data.user_id) && (this.problem_result === -1) && (this.language === -1 || this.language === data.val.language) && !this.page_cnt && (!this.problem_id || parseInt(this.problem_id) === Math.abs(data.val.id))) {
                let obj = {};
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
        },
        Update: function (data) {
            if (!this.auto_refresh) {
                return;
            }
            let solution_id = data.solution_id;
            let status = data.state;
            let time = data.time;
            let memory = data.memory;
            let pass_rate = data.pass_rate;
            let sim = data.sim;
            let ip = data.ip;
            let total_point = parseInt(data.total_point) || 0;
            let fingerprint = data.fingerprint;
            let fingerprintRaw = data.fingerprintRaw;
            let pass_point = data.pass_point;
            let that = this;
            _.forEach(this.problem_list, function (val, key) {
                let i = that.problem_list[key];
                if (i.solution_id == solution_id) {
                    i.result = status;
                    i.time = time;
                    i.memory = memory;
                    i.sim = data.sim;
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
        },
        tag: function (tag_name, $event) {
            this.current_tag = tag_name;
        }
    },
    created: function () {
        let that = this;
        let problem_id = (this.problem_id = this.getProblemID() || null) || "null";
        let user_id = (this.user_id = this.getUserId() || null) || "null";
        let language = (this.language = this.getLanguage() || -1) == -1 ? "null" : this.getLanguage();
        let result = (this.problem_result = this.getResult() || -1) == -1 ? "null" : this.problem_result;
        $.get("/api/status/" + problem_id + "/" + user_id + "/" + language + "/" + result + "/0/", function (data) {
            that.dim = false;
            that.search_func(data);
            $.get("/api/status/result", function (dat) {
                drawResult(dat.data, data.const_list.result.cn);
            });
            $.get("/api/status/submit_hour", function (dat) {
                let func = function (a, b) {
                    return a.hour - b.hour;
                };
                dat.data.submit.sort(func);
                dat.data.login.sort(func);
                drawBar(dat.data);
            });
            $.get("/api/status/" + problem_id + "/" + user_id + "/" + language + "/" + result + "/0/", function (data) {
                that.dim = false;
                that.search_func(data);
            });
        });
    },
    updated: function () {
        $("tr").popup({
            on: "hover",
            hoverable: true,
            positon: "top center"
        });
    },
    mounted: function () {
        document.title = `Status -- ${document.title}`;
        $.get("/api/status/graph", function (data) {
            draw(data);
            drawDynamicInteractiveLineChart();
        });
    },
    sockets: {
        submit: function (data) {
            this.Submit(data);
        },
        result: function (data) {
            this.Update(data);
        }
    }
};
</script>

<style scoped>
    .ui.form .fields .field .ui.checkbox {
        margin-top: inherit!important;
    }
</style>
