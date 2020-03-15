<template>
    <div class="ui attached bottom segment">
        <h2 class="ui dividing header">{{$t("browser")}}</h2>
        <div class="amcharts" id="browser_statistics">{{$t("loading")}}</div>
        <h2 class="ui dividing header">{{$t("os")}}</h2>
        <div class="amcharts" id="os_statistics">{{$t("loading")}}</div>
        <h2 class="ui dividing header">Chord graph</h2>
        <div class="amcharts" id="chord_graph">{{$t("loading")}}</div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import _ from "lodash";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

const hasRendered: any = {};

@Component
export default class UserGraph extends Vue {
    mounted () {
        this.axios.get("/api/status/device/browser")
            .then(({ data }) => {
                this.drawDynamicInteractiveLineChart(data.data, "browser", "browser_statistics");
                return this.axios.get("/api/status/device/os");
            })
            .then(({ data }) => {
                this.drawDynamicInteractiveLineChart(data.data, "os", "os_statistics");
                return this.axios.get("/api/status/problem/solve_map");
            }).then(({ data }) => {
                this.drawChordGraph(data.data);
            });
    }

    drawChordGraph (data: any, prefix = "chord_graph") {
        if (hasRendered[prefix]) {
            return;
        }
        hasRendered[prefix] = true;
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        const chart = am4core.create("chord_graph", am4charts.ChordDiagram);

        _.forEach(data, function (el: any) {
            if (el.from > el.to) {
                const tmp = el.from;
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
        const nodeTemplate = chart.nodes.template;
        nodeTemplate.readerTitle = "Click to show/hide or drag to rearrange";
        nodeTemplate.showSystemTooltip = true;

        const nodeLink = chart.links.template;
        const bullet = nodeLink.bullets.push(new am4charts.CircleBullet());
        bullet.fillOpacity = 1;
        bullet.circle.radius = 5;
        bullet.locationX = 0.5;

        // create animations
        chart.events.on("ready", function () {
            for (let i = 0; i < chart.links.length; i++) {
                const link: any = chart.links.getIndex(i);
                const bullet = link.bullets.getIndex(0);

                animateBullet(bullet);
            }
        });

        function animateBullet (bullet: any) {
            const duration = 3000 * Math.random() + 2000;
            const animation = bullet.animate([{ property: "locationX", from: 0, to: 1 }], duration);
            animation.events.on("animationended", function (event: any) {
                animateBullet(event.target.object);
            });
        }
    }

    drawDynamicInteractiveLineChart (dataSets?: any, prefix?: any, target?: any) {
        let adapter_object: any = {};
        const full_name = prefix + "_name";
        const full_version = prefix + "_version";
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
        const chart = am4core.create(target, am4charts.TreeMap);
        chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect
        window.chart_graph = chart;
        chart.data = adapter_object;

        chart.colors.step = 2;

        // define data fields
        chart.dataFields.value = "value";
        chart.dataFields.name = "name";
        chart.dataFields.children = "children";

        chart.zoomable = true;
        const bgColor = new am4core.InterfaceColorSet().getFor("background");

        // level 0 series template
        const level0SeriesTemplate = chart.seriesTemplates.create("0");
        const level0ColumnTemplate = level0SeriesTemplate.columns.template;

        level0ColumnTemplate.column.cornerRadius(10, 10, 10, 10);
        level0ColumnTemplate.fillOpacity = 0;
        level0ColumnTemplate.strokeWidth = 4;
        level0ColumnTemplate.strokeOpacity = 0;

        // level 1 series template
        const level1SeriesTemplate: any = chart.seriesTemplates.create("1");
        const level1ColumnTemplate: any = level1SeriesTemplate.columns.template;

        level1SeriesTemplate.tooltip.animationDuration = 0;
        level1SeriesTemplate.strokeOpacity = 1;

        level1ColumnTemplate.column.cornerRadius(10, 10, 10, 10);
        level1ColumnTemplate.fillOpacity = 1;
        level1ColumnTemplate.strokeWidth = 4;
        level1ColumnTemplate.stroke = bgColor;

        const bullet1 = level1SeriesTemplate.bullets.push(new am4charts.LabelBullet());
        bullet1.locationY = 0.5;
        bullet1.locationX = 0.5;
        bullet1.label.text = "{name}";
        bullet1.label.fill = am4core.color("#ffffff");

        chart.maxLevels = 2;
    }
}
</script>

<style scoped>

</style>
