<template>
    <div class="ui container padding" v-cloak>
        <contest-mode v-if="contest_mode"></contest-mode>
        <h2 class="ui dividing header" v-if="!contest_mode">
            <router-link :to="`/contest/problem/${row}`" :key="key" v-for="(row,key) in header">{{row}} </router-link>
        </h2>
        <div class="ui grid">

            <div class="fourteen wide column">
                <div class="ui fluid multiple search selection dropdown">
                    <input type="hidden" name="country" @change="select2 = $event.target.value" :value="contest_id_raw">
                    <i class="dropdown icon"></i>
                    <div class="default text">Select Contest Or Input Contest ID</div>
                    <div class="menu">
                        <div :key="key" class="item" :data-value="row.contest_id" v-for="(row,key) in contest_list" :title="row.title">{{"Contest" + row.contest_id + " " + row.title}}</div>
                    </div>
                </div>
            </div>
            <div class="two wide column">
                <a class="primary button ui" @click="run(2)">Go</a>
            </div>
        </div>
        <div class="ui segment" v-show="loading">
            <h2 class="ui header">加载中</h2>
        </div>
        <div class="ui segment">
            <div class="ui container" style="padding: 1em">
                <div class="ui labeled input">
                    <div class="ui label">
                        柱状数
                    </div>
                    <input type="text" placeholder="10" @change="row_count=parseInt($event.target.value)">
                </div>
                <div class="ui labeled input">
                    <div class="ui label">
                        大于等于
                    </div>
                    <input type="text" placeholder="" @change="greater=$event.target.value">
                </div>
                <div class="ui labeled input">
                    <div class="ui label">
                        小于等于
                    </div>
                    <input type="text" placeholder="" @change="lower=$event.target.value">
                </div>
                <a class="ui primary button">应用</a>
            </div>
            <div id="chartdiv" style="height: 500px">
            </div>
        </div>
        <div class="ui grid">
            <div class="row">
                <table class="ui table">
                    <thead>
                    <tr>
                        <th @click="sort(1)"><a><i v-show="type == 1"
                                                   :class="'sort numeric icon '+(order > 0 ?'down':'up')"></i>User ID</a></th>
                        <th @click="sort(2)"><a><i v-show="type == 2"
                                                   :class="'sort numeric icon '+(order > 0 ?'down':'up')"></i>Nick</a></th>
                        <th><a @click="sort(3)"><i v-show="type == 3"
                                                   :class="'sort numeric icon '+(order > 0 ?'down':'up')"></i>通过</a></th>
                        <th><a @click="sort(4)"><i v-show="type == 4"
                                                   :class="'sort numeric icon '+(order > 0 ?'down':'up')"></i>总提交</a></th>
                        <th><a @click="sort(5)"><i v-show="type == 5"
                                                   :class="'sort numeric icon '+(order > 0 ?'down':'up')"></i>平均代码行数</a></th>
                        <th><a @click="sort(6)"><i v-show="type == 6"
                                                   :class="'sort numeric icon '+(order > 0 ?'down':'up')"></i>平均代码长度</a></th>
                        <th><a @click="sort(7)">
                            <i v-show="type == 7"
                               :class="'sort numeric icon '+(order > 0 ?'down':'up')"></i>总代码长度
                        </a></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr :key="key" v-for="(row,key) in status_data">
                        <td>
                            <router-link v-html="row.user_id" :to="`/user/${row.user_id}`"></router-link>
                        </td>
                        <td>
                            <router-link v-html="row.nick" :to="`/user/${row.user_id}`"></router-link>
                        </td>
                        <td v-html="row.ac.size"></td>
                        <td v-html="row.submit.size"></td>
                        <td v-html="row.average_line"></td>
                        <td v-html="row.average_length + 'B'"></td>
                        <td v-html="row.total_line"></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import mixins from "../../mixin/init";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import _ from "lodash";
import jquery from "jquery";
import { Component, Mixins, Watch } from "vue-property-decorator";

const $: any = jquery;

const am4themes_animated = require("@amcharts/amcharts4/themes/animated").default;
function drawgraph (_data: any, div = 10) {
    div = Math.max(div, 1);
    am4core.useTheme(am4themes_animated);
    const chart: any = am4core.create("chartdiv", am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    const mx = _data[0];
    const mn = _data[_data.length - 1];
    const diff = Math.trunc((mx - mn) / div);
    let gap = mx - diff;
    let target: any = [];
    for (let i = 0; i < div - 1; ++i) {
        target.push({
            part: gap + "-" + (gap + diff),
            count: 0
        });
        gap -= diff;
    }

    target.push({
        part: mn + "-" + (gap + diff),
        count: 0
    });

    gap = mx - diff;
    let cnt = 0;
    let mxcnt = 0;
    _.forEach(_data, function (val) {
        if (val >= gap) {
            ++target[cnt].count;
        }
        else {
            try {
                if (target.length - 1 > cnt) {
                    ++target[++cnt].count;
                    gap -= diff;
                }
                else {
                    ++target[cnt].count;
                }
            }
            catch (e) {
                console.log("cnt", cnt);
                console.log("val", val);
            }
        }
        mxcnt = Math.max(mxcnt, target[cnt].count);
    });
    target = target.reverse();
    chart.data = target;
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "part";
    categoryAxis.renderer.minGridDistance = 40;
    categoryAxis.fontSize = 11;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = mxcnt;
    valueAxis.strictMinMax = true;
    valueAxis.renderer.minGridDistance = 30;
    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = "part";
    series.dataFields.valueY = "count";
    series.columns.template.tooltipText = "{valueY.value}";
    series.columns.template.tooltipY = 0;
    series.columns.template.strokeOpacity = 0;

    series.columns.template.adapter.add("fill", function (fill: any, target: any) {
        return chart.colors.getIndex(target.dataItem.index);
    });
}
@Component
export default class UserStatus extends Mixins(mixins) {
    cidArray: any = [];
    contest_mode= false;
    raw_data= [];
    header: any = [];
    contest_id_raw = "";
    status_data= [];
    data_set= [];
    order= 1;
    contest_list= [];
    select1= "";
    select2= "";
    type= 1;
    row_count= 10;
    lower: any = "";
    greater: any = "";
    ranged= false;
    loading= false;

    created () {
        let cidArray: any = this.$route.params.contest_id;
        this.contest_id_raw = this.$route.params.contest_id;
        if (cidArray && cidArray.length) {
            cidArray = cidArray.split(",");
        }
        this.header = cidArray;
        this.cidArray = cidArray;
    }

    @Watch("row_count")
    onRowCountChanged (newVal: any, oldVal: any) {
        if (newVal === oldVal) {
            return;
        }
        if (!!newVal === false) {
            newVal = 10;
        }
        drawgraph(this.data_set, newVal);
    }

    @Watch("lower")
    onLowerChanged (newVal: any, oldVal: any) {
        const that = this;
        this.$nextTick(function () {
            that.rangeChange();
        });
    }

    @Watch("greater")
    onGreaterChanged (newVal: any, oldVal: any) {
        const that = this;
        this.$nextTick(function () {
            that.rangeChange();
        });
    }

    @Watch("range")
    onRangeChanged (newVal: any, oldVal: any) {
        if (!newVal) {
            const that = this;
            this.$nextTick(function () {
                that.generate(that.raw_data);
            });
        }
    }

    mounted () {
        const that = this;
        this.loading = true;
        this.axios.get("/api/contest/list")
            .then(response => {
                const d: any = response.data;
                d.data.sort(function (a: any, b: any) {
                    return parseInt(b.contest_id) - parseInt(a.contest_id);
                });
                that.contest_list = d.data;
                setTimeout(function () {
                    $(".multiple.search")
                        .dropdown({
                            fullTextSearch: true
                        });
                }, 1000);
            });
        this.getData();
    }

    updatecidArrayFromSelect () {
        let cidArray: any = this.select2;
        this.loading = true;
        if (cidArray && cidArray.length) {
            cidArray = cidArray.split(",");
        }
        this.cidArray = cidArray;
        this.header = cidArray;
    }

    getData () {
        const that = this;
        const promiseArray: any = [];
        _.forEach(this.cidArray, (val) => {
            promiseArray.push(new Promise((resolve, reject) => {
                this.axios.get(`/api/scoreboard/${val}/line`)
                    .then(({ data }) => {
                        if (data.status == "OK") {
                            resolve(data.data);
                        }
                        else {
                            reject(val);
                        }
                    });
            }));
        });
        Promise.all(promiseArray)
            .then((val: any) => {
                that.raw_data = val;
                that.generate(val);
            });
    }

    sortOrder (type: any) {
        const target = this.status_data;
        const order = this.order;
        switch (type) {
        case 1:
            target.sort(function (a: any, b: any) {
                return order * (b.user_id > a.user_id ? 1 : b.user_id == a.user_id ? 0 : -1);
            });
            break;
        case 2:
            target.sort(function (a: any, b: any) {
                return order * (b.nick > a.nick ? 1 : b.nick == a.nick ? 0 : -1);
            });
            break;
        case 3:
            target.sort(function (a: any, b: any) {
                return order * (b.ac.size - a.ac.size);
            });
            break;
        case 4:
            target.sort(function (a: any, b: any) {
                return order * (b.submit.size - a.submit.size);
            });
            break;
        case 6:
            target.sort(function (a: any, b: any) {
                return order * (b.average_length - a.average_length);
            });
            break;
        case 5:
            target.sort(function (a: any, b: any) {
                return order * (b.average_line - a.average_line);
            });
            break;
        case 7:
            target.sort(function (a: any, b: any) {
                return order * (b.total_line - a.total_line);
            });
            break;
        }
    }

    sort (type: any) {
        const current_type = this.type;
        if (current_type != type) {
            this.order = 1;
        }
        else {
            this.order = -this.order;
        }
        this.type = type;
        this.sortOrder(type);
    }

    rangeChange () {
        if (!isNaN(this.lower) || !isNaN(this.greater)) {
            this.lower = parseInt(this.lower);
            if (this.lower === 0) {
                this.lower = Infinity;
            }
            this.greater = parseInt(this.greater);
            if (this.greater === 0) {
                this.greater = -Infinity;
            }
            if (this.lower < this.greater) {
                return;
            }
            this.ranged = true;
        }
        else {
            this.ranged = false;
        }
        if (this.ranged) { this.generate(this.raw_data); }
    }

    generate (data: any) {
        const that = this;
        new Promise(function (resolve, reject) {
            resolve(data);
        }).then(function (val: any) {
            const greater = that.greater;
            const lower = that.lower;
            let newArray: any = [];
            _.forEach(val, function (v: any) {
                let concatArray = _.values(v.map);
                const user = v.user.map(function (el: any) { return el.user_id; });
                if (user.length > 0) {
                    const tempArray: any = [];
                    _.forEach(concatArray, function (value) {
                        if (user.includes(value.user_id)) {
                            if (that.ranged) {
                                if (isNaN(value.user_id)) {
                                    return;
                                }
                                const user_id_num = parseInt(value.user_id);
                                if (user_id_num < greater || user_id_num > lower) {
                                    return;
                                }
                            }
                            tempArray.push(value);
                        }
                    });
                    concatArray = tempArray;
                }
                newArray = newArray.concat(concatArray);
            });
            return newArray;
        })
            .then(function (val) {
                const map: any = {};
                _.forEach(val, function (v) {
                    if (typeof map[v.user_id] === "undefined") {
                        map[v.user_id] = {
                            ac: new Set(),
                            submit: new Set(),
                            line: [],
                            len: [],
                            user_id: v.user_id,
                            nick: v.nick,
                            average_line: 0,
                            average_length: 0,
                            total_line: 0
                        };
                    }
                    if (v.result === 4) {
                        map[v.user_id].ac.add(v.problem_id);
                        map[v.user_id].line.push(v.line);
                        map[v.user_id].len.push(v.code_length);
                    }
                    map[v.user_id].submit.add(v.solution_id);
                });
                return _.values(map);
            })
            .then(function (val: any) {
                val.sort(function (a: any, b: any) {
                    return 1 * (b.user_id > a.user_id ? 1 : b.user_id == a.user_id ? 0 : -1);
                });
                that.order = 1;
                that.type = 1;
                return val;
            })
            .then(function (val: any) {
                _.forEach(val, function (v: any) {
                    if (v.line.length === 0) {
                        v.line = [0];
                    }
                    if (v.len.length === 0) {
                        v.len = [0];
                    }
                    v.average_line = Math.trunc(Math.round(v.line.reduce(function (sum: any, cur: any) { return sum + cur; }) / Math.max(1, v.line.length)));
                    v.average_length = Math.trunc(Math.round(v.len.reduce(function (sum: any, cur: any) { return sum + cur; }) / Math.max(1, v.len.length)));
                    v.total_line = v.line.reduce(function (sum: any, cur: any) { return sum + cur; });
                });
                return val;
            })
            .then(function (val: any) {
                const tot: any = [];
                _.forEach(val, function (v: any) {
                    tot.push(v.total_line);
                });
                tot.sort(function (a: any, b: any) {
                    return b - a;
                });
                drawgraph(tot, 10);
                that.data_set = tot;
                return val;
            })
            .then(function (val: any) {
                that.status_data = val;
                that.loading = false;
            });
    }

    run (type: any) {
        this.updatecidArrayFromSelect();
        this.getData();
    }
}
</script>

<style scoped>

</style>
