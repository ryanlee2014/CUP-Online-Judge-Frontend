<template>
    <div class="ui container padding" v-if="contestMode">
        <ContestMode/>
    </div>
    <div class="padding ui container" v-else>
        <h2 class="ui dividing header">
            Status
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
        <div class="ui bottom attached segment" v-show="current_tag == 'status'">
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
            <div class="amcharts" id="browser_statistics">{{$t("loading")}}</div>
            <h2 class="ui dividing header">{{$t("os")}}</h2>
            <div class="amcharts" id="os_statistics">{{$t("loading")}}</div>
            <h2 class="ui dividing header">Chord graph</h2>
            <div class="amcharts" id="chord_graph">{{$t("loading")}}</div>
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
import { Lock } from "@/module/Decorator/method";
import { mapGetters } from "vuex";

const $: any = jquery;
const am4themes_animated = require("@amcharts/amcharts4/themes/animated").default;

function draw (_result: any) {
    let result: any = _result.result;
    let _label: any = _result.label;
    let row: any = {};
    _.forEach(result, function (i: any) {
        row[i[_label[0]]] = row[i[_label[0]]] || {};
        row[i[_label[0]]][i[_label[1]]] = {
            submit: i.submit,
            accepted: i.accepted || 0
        };
    });

    let _labels: any = [];
    let _submits: any = [];
    let _accepteds: any = [];
    let _persent: any = [];
    _.forEach(row, function (val: any, i: any) {
        _.forEach(row[i], function (val2: any, j: any) {
            _labels.push(i.toString() + "-" + j.toString());
            _submits.push(row[i][j].submit);
            _accepteds.push(row[i][j].accepted);
            _persent.push((row[i][j].accepted / row[i][j].submit * 100).toString().substring(0, 5));
        });
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
    let ctx = (document!.getElementById!("canvas")! as any).getContext("2d");
    window.myLine = new Chart(ctx, config);
}

function drawResult (data: any, labelName: any) {
    data.sort(function (a: any, b: any) {
        return b.cnt - a.cnt;
    });
    let color = window.chartColors;
    let colorTocolor: any = {
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
    let dataSet: any = [];
    let labName: any = [];
    dataSet.push({
        label: "提交数",
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        data: []
    });
    // eslint-disable-next-line no-unused-vars
    _.forEach(data, function (val: any, idx: any) {
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
    let ctx = (document!.getElementById("bar")! as any).getContext("2d");
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

function drawBar (data: any) {
    let login = data.login;
    data = data.submit;
    let color = Chart.helpers.color;
    let config: any = {
        type: "radar",
        data: {
            labels: [] as any[],
            datasets: [{
                label: "提交分布",
                backgroundColor: color(window.chartColors.red).alpha(0.2).rgbString(),
                borderColor: window.chartColors.red,
                pointBackgroundColor: window.chartColors.red,
                data: [] as any[]
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
    _.forEach(data, function (val: any) {
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
    _.forEach(login, function (val: any) {
        copyconfig.data.datasets[0].data.push(val.cnt);
    });
    copyconfig.options.title.text = "登录时间分布";
    new Chart(document!.getElementById("subtime")! as any, config);
    new Chart(document!.getElementById("logtime")! as any, copyconfig);
    // console.log(data);
    // console.log(config);
}

let hasRendered: any = {};

function drawDynamicInteractiveLineChart (dataSets?: any, prefix?: any, target?: any) {
    let adapter_object: any = {};
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
        _.forEach(dataSets, function (d: any) {
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

        _.forEach(adapter_object, function (val: any, idx: any) {
            if (!adapter_object[idx].children) {
                adapter_object[idx].children = [];
            }
            _.forEach(val.version, function (v: any, id: any) {
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
    let level1SeriesTemplate: any = chart.seriesTemplates.create("1");
    let level1ColumnTemplate: any = level1SeriesTemplate.columns.template;

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

function drawChordGraph (data: any, prefix = "chord_graph") {
    if (hasRendered[prefix]) {
        return;
    }
    hasRendered[prefix] = true;
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    let chart = am4core.create("chord_graph", am4charts.ChordDiagram);

    _.forEach(data, function (el: any) {
        if (el.from > el.to) {
            let tmp = el.from;
            el.from = el.to;
            el.to = tmp;
        }
    });

    data.sort(function (a: any, b: any) {
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
            let link: any = chart.links.getIndex(i);
            let bullet = link.bullets.getIndex(0);

            animateBullet(bullet);
        }
    });

    function animateBullet (bullet: any) {
        let duration = 3000 * Math.random() + 2000;
        let animation = bullet.animate([{ property: "locationX", from: 0, to: 1 }], duration);
        animation.events.on("animationended", function (event: any) {
            animateBullet(event.target.object);
        });
    }
}

function drawRegisterTimeline (data: any) {
    if (hasRendered["timeline"]) {
        return;
    }
    hasRendered["timeline"] = true;
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    let chart: any = am4core.create("register_timeline", am4charts.XYChart);
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
    let series: any = chart.series.push(new am4charts.LineSeries());
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
    @Component({
        components: {
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

        @Watch("current_tag")
        onCurrentTagChanged (newVal: string) {
            if (newVal === "user") {
                this.axios.get("/api/status/device/browser")
                    .then(({ data }) => {
                        _.delay(drawDynamicInteractiveLineChart, 0, data.data, "browser", "browser_statistics");
                        this.axios.get("/api/status/device/os")
                            .then(({ data }) => {
                                _.delay(drawDynamicInteractiveLineChart, 0, data.data, "os", "os_statistics");
                            });
                        this.axios.get("/api/status/problem/solve_map")
                            .then(({ data }) => {
                                _.delay(drawChordGraph, 0, data.data);
                            });
                    });
            }
            else if (newVal === "graph") {
                this.drawGraph();
                this.axios.get("/api/user/register_timeline")
                    .then(({ data }) => {
                        _.delay(drawRegisterTimeline, 0, data.data);
                    });
            }
        }

        search_func (data: any) {
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
        }

        search () {
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
        }

        page (num: number) {
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
                });
        }

        @Lock(new AwaitLock())
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
                let obj: any = {};
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
            _.forEach(this.problem_list, function (val: any, key: any) {
                let i = that.problem_list[key];
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

        created () {
            this.fetchData()
                .then((data) => {
                    this.axios.get("/api/status/result")
                        .then(response => {
                            const dat: any = response.data;
                            drawResult(dat.data, data.const_list.result.cn);
                        });
                    this.axios.get("/api/status/submit_hour")
                        .then(response => {
                            const dat: any = response.data;
                            const sortFunc = (a: any, b: any) => a.hour - b.hour;
                            dat.data.submit.sort(sortFunc);
                            dat.data.login.sort(sortFunc);
                            drawBar(dat.data);
                        });
                });
        }

        fetchData () {
            let problem_id = (this.problem_id = this.getProblemID() || null) || "null";
            let user_id = (this.user_id = this.getUserId() || null) || "null";
            let language = (this.language = this.getLanguage() || -1) == -1 ? "null" : this.getLanguage();
            let result = (this.problem_result = this.getResult() || -1) == -1 ? "null" : this.problem_result;
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

        drawGraph () {
            if (this.hasDrawedGraph) {
                return;
            }
            this.hasDrawedGraph = true;
            this.axios.get("/api/status/graph")
                .then(({ data }) => {
                    draw(data);
                    drawDynamicInteractiveLineChart();
                });
        }

        mounted () {
            document.title = `Status -- ${document.title}`;
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
