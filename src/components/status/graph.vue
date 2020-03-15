<template>
    <div class="ui attached bottom segment">
        <div style="width:90%;margin:auto">
            <canvas id="canvas" ref="canvas"></canvas>
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
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import _ from "lodash";
import Chart from "chart.js";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

interface IResultPayload {
    year: number,
    month: number,
    submit: number,
    accepted: number,
    [id: string]: number
}

interface IResultInfo {
    result: IResultPayload[],
    label: string[]
}

interface IRegisterTimeInfo {
    value: number,
    date: string
}

const hasRendered: any = {};

@Component
export default class Graph extends Vue {
    mounted () {
        this.axios.get("/api/status/submit_hour")
            .then(response => {
                const dat: any = response.data;
                const sortFunc = (a: any, b: any) => a.hour - b.hour;
                dat.data.submit.sort(sortFunc);
                dat.data.login.sort(sortFunc);
                this.drawBar(dat.data);
                return this.axios.get("/api/status/graph");
            })
            .then(({ data }) => {
                this.draw(data);
                return this.axios.get("/api/user/register_timeline");
            })
            .then(({ data }) => {
                this.drawRegisterTimeline(data.data);
            });
    }

    lineChart!: Chart;
    draw (_result: IResultInfo) {
        const result = _result.result;
        const _label = _result.label;
        const row: any = {};
        _.forEach(result, (i: IResultPayload) => {
            row[i[_label[0]]] = row[i[_label[0]]] || {};
            row[i[_label[0]]][i[_label[1]]] = {
                submit: i.submit,
                accepted: i.accepted || 0
            };
        });

        const _labels: any = [];
        const _submits: any = [];
        const _accepteds: any = [];
        const _persent: any = [];
        _.forEach(row, function (val: any, i: any) {
            _.forEach(row[i], function (val2: any, j: any) {
                _labels.push(i.toString() + "-" + j.toString());
                _submits.push(row[i][j].submit);
                _accepteds.push(row[i][j].accepted);
                _persent.push((row[i][j].accepted / row[i][j].submit * 100).toString().substring(0, 5));
            });
        });
        const config: any = {
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
        const ctx = (this.$refs.canvas as any).getContext("2d");
        this.lineChart = new Chart(ctx, config);
    }

    drawRegisterTimeline (data: any) {
        if (hasRendered.timeline) {
            return;
        }
        hasRendered.timeline = true;
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        const chart: any = am4core.create("register_timeline", am4charts.XYChart);
        chart.paddingRight = 20;
        const title = chart.titles.create();
        title.text = "注册人数变化";
        title.fontSize = 15;
        title.marginBottom = 30;
        // Add data
        chart.data = data;

        // Create axes
        const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

        // Create series
        const series: any = chart.series.push(new am4charts.LineSeries());
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
        const bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.strokeWidth = 2;
        bullet.circle.radius = 4;
        bullet.circle.fill = am4core.color("#fff");

        const bullethover = bullet.states.create("hover");
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
    }

    drawBar (data: any) {
        const login = data.login;
        data = data.submit;
        const color = Chart.helpers.color;
        const config: any = {
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
        const copyconfig = JSON.parse(JSON.stringify(config));
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
}
</script>

<style scoped>

</style>
