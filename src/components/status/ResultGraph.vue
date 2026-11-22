<template>
    <div class="ui attached bottom segment">
        <div style="width:90%;margin:auto">
            <canvas id="bar"></canvas>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import _ from "lodash";
import Chart from "chart.js";

export default defineComponent({
    props: {
        // intentionally untyped (same as the former class @Prop): receives the result name array
        labelName: { default: () => ({}) as any }
    },
    mounted () {
        this.axios.get("/api/status/result")
            .then(response => {
                const dat: any = response.data;
                this.drawResult(dat.data, this.labelName);
            });
    },
    methods: {
        drawResult (data: any, labelName: any): void {
            data.sort(function (a: any, b: any) {
                return b.cnt - a.cnt;
            });
            const color = window.chartColors;
            const colorTocolor: any = {
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
            const dataSet: any = [];
            const labName: any = [];
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
            const ctx = (document!.getElementById("bar")! as any).getContext("2d");
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
    }
});
</script>

<style scoped>

</style>
