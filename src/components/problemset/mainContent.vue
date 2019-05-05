<template>
    <table v-if="!dim" v-tableUpdated id='problemset' width='90%'
           class='ui unstackable very basic center aligned large table'>
        <thead>
        <tr class='toprow'>
            <!--<th width='2%'></th>-->
            <th width='10%' @click="sort('problem_id',$event)">
                <a><i v-show="order_target == 'problem_id'"
                      :class="'sort numeric icon '+(order?'down':'up')"></i>
                    <i v-show="order_target != 'problem_id'"
                       :class="'sort numeric icon '+(order?'down':'up')" style="opacity: 0"></i>
                    编号
                </a></th>
            <th width='56%' class="left aligned">标题</th>
            <th width='15%'>
                <a @click="sort('accepted',$event,1)"><i v-show="order_target == 'accepted'"
                                                         :class="'sort numeric icon '+(order?'down':'up')"></i>正确
                </a> / <a @click="sort('submit',$event,1)"><i v-show="order_target == 'submit'"
                                                              :class="'sort numeric icon '+(order?'down':'up')"></i>提交
            </a></th>
            <th style="cursor:hand" width='10%'><a @click="sort('present',$event,1)"><i
                    v-show="order_target == 'present'" :class="'sort numeric icon '+(order?'down':'up')"></i>正确率</a>
            </th>
        </tr>
        </thead>
        <tbody>
        <!--
        <transition-group tag="tbody"
                          name="grip-table"
                          enter-active-class="animated fadeIn"
                          leave-active-class="animated fadeOut"
                          mode="out-in"
        >-->
        <tr :key="row.problem_id" style="vertical-align:middle" v-for="row in filterTableRow">
            <!--<td>
            </td>-->
            <td>
                <i class="checkmark icon" v-if="row.ac === 1"></i>
                <i class="remove icon" v-else-if="row.ac === 0"></i>
                <i class="checkmark icon" style="opacity: 0" v-else></i>
                {{row.problem_id}}
            </td>
            <td>
                <div class="left aligned">
                    <a :href="'newsubmitpage.php?id='+row.problem_id+'&js'" target="_blank"
                       v-html="markdownIt.renderRaw(row.title)" :style="show_tag ? 'vertical-align:sub':''">
                    </a>
                    <sub v-if="row.new">New</sub>
                    <div class="show_tag_controled" style="float:right;">
                    <span :key="_tag" class="ui header" v-for="_tag in row.label">
                        <a @click="tag(_tag,$event)" v-show="show_tag"
                           :class="(typeof result.color[_tag] !== 'undefined'?result.color[_tag]:(result.color[_tag] = lodash.values(result.color)[Math.floor(Math.random() * lodash.values(result.color).length)],result.color[_tag]))+' ui label'">
                            {{_tag}}
                        </a>
                    </span>
                    </div>
                </div>
            </td>
            <td>
                <div class="center">
                    {{row.accepted}} / {{row.submit}}
                </div>
            </td>
            <td>
                <div class="center">
                    {{(parseInt(row.accepted)/Math.max(parseInt(row.submit),1)*100).toString().substring(0,4)}} %
                </div>
            </td>
        </tr>
        </tbody>
        <!--</transition-group>-->
        <!--<div class="ui active inverted dimmer" v-if="dim">
            <div class="ui large text loader">Loading</div>
        </div>-->
    </table>
</template>

<script>
    // eslint-disable-next-line no-unused-vars
    const markdownIt = require("../../lib/markdownIt").default;
    const lodash = require("lodash");
    export default {
        name: "mainContent",
        props: {
            data: Object,
            dim: {
                type: Boolean,
                default: function () {
                    return false
                }
            },
            show_tag: Boolean,
            order: Number,
            order_target: String,
            hide_currect: Boolean
        },
        data: function () {
            return {
                markdownIt,
                lodash
            }
        },
        computed: {
            result: function () {
                const data = this.data;
                const _color = data.color;
                const color = {};
                let i;
                for (i in _color) {
                    color[i] = _color[i];
                }
                color["标签待整理"] = "black";
                for (i in data.problem) {
                    var label = data.problem[i].label;
                    var labels = [];
                    for (var j of label ? label.split(" ") : ["标签待整理"]) {
                        labels.push(j);
                    }
                    labels.sort(function (a, b) {
                        if (a == "简单" || a == "普通" || a == "困难") {
                            return 1;
                        } else if (b == "简单" || b == "普通" || b == "困难") {
                            return -1;
                        } else {
                            if (a < b) return -1;
                            else if (a == b) return 0;
                            else return 1;
                        }
                    });
                    data.problem[i].label = labels;
                }
                const problemArray = typeof data.problem === "undefined" ? [] : data.problem;
                return {
                    color: color,
                    problem: problemArray
                };
            },
            filterTableRow: function () {
                const dim = this.dim;
                const hide_currect = this.hide_currect;
                return this.result.problem.filter(row => !dim && (row.ac == 0 || row.ac == -1 || (row.ac == 1 && !hide_currect)));
            }
        },
        methods: {
            sort: function (target, event, default_order = 0) {
                this.$parent.sort(target, event, default_order)
            },
            tag: function (label, event) {
                this.$parent.tag(label, event);
            }
        }
    }
</script>

<style scoped>

</style>
