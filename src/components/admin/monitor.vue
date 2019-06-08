<template>
    <div class="content">
        <div class="header">
            <div class="ui grid">
                <div class="eight wide column">
                    <h3 class="ui header">{{$t("system status")}}</h3>
                </div>
                <div class="eight wide right aligned column">
                    <div class="span-controls ui buttons" id="span-controls"></div>
                </div>
            </div>
        </div>

        <div class="ui grid">
            <div class="row">
                <div class="ui basic center segment">
                    <div class="container cpu">
                        <div class="stats-column">
                            <h5>CPU Usage</h5>
                            <h1 id="cpuStat">- %</h1>
                        </div>
                        <div class="chart-container">
                            <canvas height="200" id="cpuChart" width="400"></canvas>
                        </div>
                    </div>
                    <div class="container mem">
                        <div class="stats-column">
                            <h5>Memory Usage</h5>
                            <h1 id="memStat">- %</h1>
                        </div>
                        <div class="chart-container">
                            <canvas height="200" id="memChart" width="200"></canvas>
                        </div>
                    </div>
                    <div class="container load">
                        <div class="stats-column">
                            <h5>One Minute Load Avg</h5>
                            <h1 id="loadStat">-</h1>
                        </div>
                        <div class="chart-container">
                            <canvas height="200" id="loadChart" width="200"></canvas>
                        </div>
                    </div>
                    <div class="container responseTime">
                        <div class="stats-column">
                            <h5>Response Time</h5>
                            <h1 id="responseTimeStat">-</h1>
                        </div>
                        <div class="chart-container">
                            <canvas height="200" id="responseTimeChart" width="200"></canvas>
                        </div>
                    </div>
                    <div class="container rps">
                        <div class="stats-column">
                            <h5>Requests per Second</h5>
                            <h1 id="rpsStat">-</h1>
                        </div>
                        <div class="chart-container">
                            <canvas height="200" id="rpsChart" width="200"></canvas>
                        </div>
                    </div>
                    <div class="container statusCodes">
                        <div class="stats-column">
                            <h5>Status Codes</h5>
                            <h6 class="status-code status-code-2xx">2xx</h6>
                            <h6 class="status-code status-code-3xx">3xx</h6>
                            <h6 class="status-code status-code-4xx">4xx</h6>
                            <h6 class="status-code status-code-5xx">5xx</h6>
                        </div>
                        <div class="chart-container">
                            <canvas height="200" id="statusCodesChart" width="200"></canvas>
                        </div>
                    </div>
                    <div class="container healthChecks">
                    </div>
                    <div class="footer">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

const Chart = require("chart.js");
let defaultSpan = 0;
let spans = [];
let statusCodesColors = ["#75D701", "#47b8e0", "#ffc952", "#E53A40"];

let defaultOptions = {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }],
        xAxes: [{
            type: "time",
            time: {
                unitStepSize: 30
            },
            gridLines: {
                display: false
            }
        }]
    },
    tooltips: {
        enabled: false
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: false
};

let createChart = function (ctx, dataset) {
    return new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: dataset
        },
        options: defaultOptions
    });
};
let defaultDataset = {
    label: "",
    data: [],
    lineTension: 0.2,
    pointRadius: 0
};

let addTimestamp = function (point) {
    return point.timestamp;
};

let cpuDataset = [Object.create(defaultDataset)];
let memDataset = [Object.create(defaultDataset)];
let loadDataset = [Object.create(defaultDataset)];
let responseTimeDataset = [Object.create(defaultDataset)];
let rpsDataset = [Object.create(defaultDataset)];
let cpuStat;
let memStat;
let loadStat;
let responseTimeStat;
let rpsStat;
let cpuChartCtx;
let memChartCtx;
let loadChartCtx;
let responseTimeChartCtx;
let rpsChartCtx;
let statusCodesChartCtx;
let cpuChart;
let memChart;
let loadChart;
let responseTimeChart;
let rpsChart;
let statusCodesChart;
let charts;
export default {
    name: "monitor",
    data () {
        return {
            getStartMessage: false,
            intervalId: 0
        };
    },
    mounted () {
        const that = this;
        this.prepare();
        this.$socket.emit("esm_change");
        let onSpanChange = function (e) {
            e.target.classList.add("active");
            defaultSpan = parseInt(e.target.id, 10);

            let otherSpans = document.getElementsByTagName("span");

            for (let i = 0; i < otherSpans.length; i++) {
                if (otherSpans[i] !== e.target) otherSpans[i].classList.remove("active");
            }

            that.$socket.emit("esm_change");
        };
        setInterval(() => {
            if (this.getStartMessage) {
                clearInterval(this.getStartMessage);
            }
            else {
                this.$socket.emit("esm_change");
            }
        }, 1000);
        this.sockets.subscribe("esm_start", (data) => {
            this.getStartMessage = true;
            data[defaultSpan].responses.pop();
            data[defaultSpan].os.pop();

            let lastOsMetric = data[defaultSpan].os[data[defaultSpan].os.length - 1];

            cpuStat.textContent = "0.0%";
            if (lastOsMetric) {
                cpuStat.textContent = lastOsMetric.cpu.toFixed(1) + "%";
            }

            cpuChart.data.datasets[0].data = data[defaultSpan].os.map(function (point) {
                return point.cpu;
            });
            cpuChart.data.labels = data[defaultSpan].os.map(addTimestamp);

            memStat.textContent = "0.0MB";
            if (lastOsMetric) {
                memStat.textContent = lastOsMetric.memory.toFixed(1) + "MB";
            }

            memChart.data.datasets[0].data = data[defaultSpan].os.map(function (point) {
                return point.memory;
            });
            memChart.data.labels = data[defaultSpan].os.map(addTimestamp);

            loadStat.textContent = "0.00";
            if (lastOsMetric) {
                loadStat.textContent = lastOsMetric.load[defaultSpan].toFixed(2);
            }

            loadChart.data.datasets[0].data = data[defaultSpan].os.map(function (point) {
                return point.load[0];
            });
            loadChart.data.labels = data[defaultSpan].os.map(addTimestamp);

            let lastResponseMetric = data[defaultSpan].responses[data[defaultSpan].responses.length - 1];

            responseTimeStat.textContent = "0.00ms";
            if (lastResponseMetric) {
                responseTimeStat.textContent = lastResponseMetric.mean.toFixed(2) + "ms";
            }

            responseTimeChart.data.datasets[0].data = data[defaultSpan].responses.map(function (point) {
                return point.mean;
            });
            responseTimeChart.data.labels = data[defaultSpan].responses.map(addTimestamp);

            for (let i = 0; i < 4; i++) {
                statusCodesChart.data.datasets[i].data = data[defaultSpan].responses.map(function (point) {
                    return point[i + 2];
                });
            }
            statusCodesChart.data.labels = data[defaultSpan].responses.map(addTimestamp);

            if (data[defaultSpan].responses.length >= 2) {
                let deltaTime = lastResponseMetric.timestamp -
                        data[defaultSpan].responses[data[defaultSpan].responses.length - 2].timestamp;

                if (deltaTime < 1) deltaTime = 1000;
                rpsStat.textContent = ((lastResponseMetric.count / deltaTime) * 1000).toFixed(2);
                rpsChart.data.datasets[0].data = data[defaultSpan].responses.map(function (point) {
                    return (point.count / deltaTime) * 1000;
                });
                rpsChart.data.labels = data[defaultSpan].responses.map(addTimestamp);
            }

            charts.forEach(function (chart) {
                chart.update();
            });

            let spanControls = document.getElementById("span-controls");

            if (data.length !== spans.length) {
                data.forEach(function (span, index) {
                    spans.push({
                        retention: span.retention,
                        interval: span.interval
                    });

                    let spanNode = document.createElement("span");
                    let textNode = document.createTextNode(((span.retention * span.interval) / 60) + " Minute");
                    spanNode.className = "ui tiny button";
                    spanNode.appendChild(textNode);
                    spanNode.setAttribute("id", index);
                    spanNode.onclick = onSpanChange;
                    spanControls.appendChild(spanNode);
                });
                document.getElementsByTagName("span")[0].classList.add("active");
            }
            this.sockets.subscribe("esm_stats", function (data) {
                if (data.retention === spans[defaultSpan].retention &&
                    data.interval === spans[defaultSpan].interval) {
                    let os = data.os;
                    let responses = data.responses;

                    cpuStat.textContent = "0.0%";
                    if (os) {
                        cpuStat.textContent = os.cpu.toFixed(1) + "%";
                        cpuChart.data.datasets[0].data.push(os.cpu);
                        cpuChart.data.labels.push(os.timestamp);
                    }

                    memStat.textContent = "0.0MB";
                    if (os) {
                        memStat.textContent = os.memory.toFixed(1) + "MB";
                        memChart.data.datasets[0].data.push(os.memory);
                        memChart.data.labels.push(os.timestamp);
                    }

                    loadStat.textContent = "0";
                    if (os) {
                        loadStat.textContent = os.load[0].toFixed(2);
                        loadChart.data.datasets[0].data.push(os.load[0]);
                        loadChart.data.labels.push(os.timestamp);
                    }

                    responseTimeStat.textContent = "0.00ms";
                    if (responses) {
                        responseTimeStat.textContent = responses.mean.toFixed(2) + "ms";
                        responseTimeChart.data.datasets[0].data.push(responses.mean);
                        responseTimeChart.data.labels.push(responses.timestamp);
                    }

                    if (responses) {
                        let deltaTime = responses.timestamp - rpsChart.data.labels[rpsChart.data.labels.length - 1];

                        if (deltaTime < 1) deltaTime = 1000;
                        rpsStat.textContent = ((responses.count / deltaTime) * 1000).toFixed(2);
                        rpsChart.data.datasets[0].data.push((responses.count / deltaTime) * 1000);
                        rpsChart.data.labels.push(responses.timestamp);
                    }

                    if (responses) {
                        for (let i = 0; i < 4; i++) {
                            statusCodesChart.data.datasets[i].data.push(data.responses[i + 2]);
                        }
                        statusCodesChart.data.labels.push(data.responses.timestamp);
                    }

                    charts.forEach(function (chart) {
                        if (spans[defaultSpan].retention < chart.data.labels.length) {
                            chart.data.datasets.forEach(function (dataset) {
                                dataset.data.shift();
                            });

                            chart.data.labels.shift();
                        }
                        chart.update();
                    });
                }
            });
        });
    },
    methods: {
        prepare () {
            Chart.defaults.global.defaultFontSize = 8;
            Chart.defaults.global.animation.duration = 500;
            Chart.defaults.global.legend.display = false;
            Chart.defaults.global.elements.line.backgroundColor = "rgba(0,0,0,0)";
            Chart.defaults.global.elements.line.borderColor = "rgba(0,0,0,0.9)";
            Chart.defaults.global.elements.line.borderWidth = 2;

            cpuStat = document.getElementById("cpuStat");
            memStat = document.getElementById("memStat");
            loadStat = document.getElementById("loadStat");
            responseTimeStat = document.getElementById("responseTimeStat");
            rpsStat = document.getElementById("rpsStat");

            cpuChartCtx = document.getElementById("cpuChart");
            memChartCtx = document.getElementById("memChart");
            loadChartCtx = document.getElementById("loadChart");
            responseTimeChartCtx = document.getElementById("responseTimeChart");
            rpsChartCtx = document.getElementById("rpsChart");
            statusCodesChartCtx = document.getElementById("statusCodesChart");

            cpuChart = createChart(cpuChartCtx, cpuDataset);
            memChart = createChart(memChartCtx, memDataset);
            loadChart = createChart(loadChartCtx, loadDataset);
            responseTimeChart = createChart(responseTimeChartCtx, responseTimeDataset);
            rpsChart = createChart(rpsChartCtx, rpsDataset);
            statusCodesChart = new Chart(statusCodesChartCtx, {
                type: "line",
                data: {
                    labels: [],
                    datasets: [
                        Object.create(defaultDataset),
                        Object.create(defaultDataset),
                        Object.create(defaultDataset),
                        Object.create(defaultDataset)
                    ]
                },
                options: defaultOptions
            });

            statusCodesChart.data.datasets.forEach(function (dataset, index) {
                dataset.borderColor = statusCodesColors[index];
            });
            statusCodesChart.data.datasets.forEach(function (dataset, index) {
                dataset.borderColor = statusCodesColors[index];
            });

            charts = [cpuChart, memChart, loadChart, responseTimeChart, rpsChart, statusCodesChart];
        }
    }
};
</script>

<style scoped>
    * {
        font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
    }

    body.hide-cpu .container.cpu,
    body.hide-mem .container.mem,
    body.hide-load .container.load,
    body.hide-responseTime .container.responseTime,
    body.hide-rps .container.rps,
    body.hide-statusCodes .container.statusCodes {
        display: none;
    }

    h1 {
        font-size: 3em;
        color: #222;
        margin: 0;
    }

    h5 {
        margin: 0;
        color: #888;
    }

    h6 {
        margin: 0;
    }

    p {
        font-size: 0.7em;
        color: #888;
    }

    span {
        cursor: pointer;
        font-size: 10px;
        margin-left: 5px;
        border: 1px solid #DDD;
        padding: 3px 10px 4px 10px;
    }

    canvas {
        width: 800px;
        height: 200px;
    }

    .content {
        margin: auto;
    }

    .active {
        background: #eeeeee;
    }

    .stats-column {
        flex: 0 0 200px;
    }

    .container {
        display: flex;
        flex-direction: row;
        margin-top: 40px;
        height: 200px;
    }

    .chart-container {
        width: 800px;
        height: 200px;
    }

    .container.healthChecks {
        display: block;
        height: auto;
    }

    .health-check-row {
        align-items: center;
        border: 1px solid #eee;
        border-radius: 4px;
        display: flex;
        margin: 0 0 10px 0;
        width: 100%;
    }

    .health-check-title-column {
        flex: 0 0 400px;
        display: flex;
        align-items: center;
        padding: 0 10px;
    }

    .health-check-title-column h5 a {
        color: #888;
        cursor: pointer;
        text-decoration: none;
    }

    .health-check-title-column h5 a:hover {
        text-decoration: underline;
    }

    .health-check-status-container {
        align-items: center;
        border-radius: 0 4px 4px 0;
        display: flex;
        justify-content: center;
        height: 2em;
        text-align: center;
        width: 200px;
    }

    .health-check-status-container.ok {
        background: #75D701;
    }

    .health-check-status-container.failed {
        background: #E53A40;
    }

    .health-check-status-container h1 {
        line-height: 2em;
        font-size: 1.5em;
        color: #fff;
        text-align: center;
        text-transform: uppercase;
    }

    .footer {
        text-align: center;
    }

    .span-controls {
        float: right;
    }

    .status-code {
        margin-top: 3px;
    }

    .status-code:before {
        content: '';
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 8px;
        margin-right: 10px;
    }

    .status-code-2xx:before {
        background-color: #75D701;
    }

    .status-code-3xx:before {
        background-color: #47b8e0;
    }

    .status-code-4xx:before {
        background-color: #ffc952;
    }

    .status-code-5xx:before {
        background-color: #E53A40;
    }
</style>
