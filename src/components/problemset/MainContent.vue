<template>
    <table class='ui unstackable very basic center aligned large table' id='problemset' v-if="!dim"
           width='90%'>
        <thead>
        <tr class='toprow'>
            <!--<th width='2%'></th>-->
            <th @click="sort('problem_id',$event)" width='12%'>
                <a><i :class="'sort numeric icon '+(order?'down':'up')"
                      v-show="order_target == 'problem_id'"></i>
                    <i :class="'sort numeric icon '+(order?'down':'up')"
                       style="opacity: 0" v-show="order_target != 'problem_id'"></i>
                    {{$t("id")}}
                </a></th>
            <th class="left aligned" width='62%'>{{$t("title")}}</th>
            <th width='15%'>
                <a @click="sort('accepted',$event,1)"><i :class="'sort numeric icon '+(order?'down':'up')"
                                                         v-show="order_target == 'accepted'"></i>{{$t("accept")}}
                </a> / <a @click="sort('submit',$event,1)"><i :class="'sort numeric icon '+(order?'down':'up')"
                                                              v-show="order_target == 'submit'"></i>{{$t("submit")}}
            </a></th>
            <th style="cursor:hand" width='11%'><a @click="sort('present',$event,1)"><i
                :class="'sort numeric icon '+(order?'down':'up')" v-show="order_target == 'present'"></i>{{$t("accept percentage")}}</a>
            </th>
        </tr>
        </thead>
        <transition-group mode="out-in" name="list-complete" tag="tbody" v-on:after-enter="bindSticky">
            <!--
            <transition-group tag="tbody"
                              name="grip-table"
                              enter-active-class="animated fadeIn"
                              leave-active-class="animated fadeOut"
                              mode="out-in"
            >-->
            <tr :key="row.problem_id" class="list-complete-item" style="vertical-align:middle; width: 100%;"
                v-for="row in filterTableRow">
                <!--<td>
                </td>-->
                <td style="width: 12%">
                    <i class="checkmark icon" v-if="row.ac === true"></i>
                    <i class="remove icon" v-else-if="row.ac === false"></i>
                    <i class="checkmark icon" style="opacity: 0" v-else></i>
                    {{row.problem_id}}
                </td>
                <td class="problemTitle">
                    <div class="left aligned">
                        <router-link :style="show_tag ? 'vertical-align:sub':''"
                                     :to="`/problem/submit/${row.problem_id}`"
                                     v-html="markdownIt.renderRaw(row.title)"></router-link>
                        <sub v-if="row.new">New</sub>
                        <div class="show_tag_controled" style="float:right;">
                    <span :key="_tag" class="ui header" v-for="_tag in row.label">
                        <a :class="(typeof result.color[_tag] !== 'undefined'?result.color[_tag]:(result.color[_tag] = lodash.values(result.color)[Math.floor(Math.random() * lodash.values(result.color).length)],result.color[_tag]))+' ui label'"
                           @click="tag(_tag,$event)"
                           v-show="show_tag">
                            {{_tag}}
                        </a>
                    </span>
                        </div>
                    </div>
                </td>
                <td style="width: 15%">
                    <div class="center">
                        {{row.accepted}} / {{row.submit}}
                    </div>
                </td>
                <td style="width: 11%">
                    <div class="center">
                        {{(parseInt(row.accepted)/Math.max(parseInt(row.submit),1)*100).toString().substring(0,4)}} %
                    </div>
                </td>
            </tr>
        </transition-group>
        <!--</transition-group>-->
        <!--<div class="ui active inverted dimmer" v-if="dim">
            <div class="ui large text loader">Loading</div>
        </div>-->
    </table>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import markdownIt from "../../lib/markdownIt/markdownIt";
import jquery from "jquery";
import lodash from "lodash";
import { Component, Prop } from "vue-property-decorator";
import Vue from "vue";
const $:any = jquery;
@Component
export default class ProblemSetMainContent extends Vue {
    @Prop({ default: () => { return {}; } }) data!: any;
    @Prop({ default: false }) dim!: boolean;
    @Prop({ default: false }) show_tag!: boolean;
    @Prop({ default: 0 }) order!: number;
    @Prop({ default: "" }) order_target!: string;
    @Prop({ default: false }) hide_currect!: boolean;
    $parent: any;
    markdownIt = markdownIt;
    lodash = lodash;
    get result () {
        const data = this.data;
        const color = Object.assign({}, data.color);
        color["标签待整理"] = "black";
        for (let i in data.problem) {
            if (Object.prototype.hasOwnProperty.call(data.problem, i)) {
                const label = data.problem[i].label;
                data.problem[i].label = (label ? label.split(" ") : ["标签待整理"]).sort(function (a: any, b: any) {
                    if (a === "简单" || a === "普通" || a === "困难") {
                        return 1;
                    }
                    else if (b === "简单" || b === "普通" || b === "困难") {
                        return -1;
                    }
                    else {
                        if (a < b) return -1;
                        else if (a === b) return 0;
                        else return 1;
                    }
                });
            }
        }
        const problemArray = typeof data.problem === "undefined" ? [] : data.problem;
        return {
            color: color,
            problem: problemArray
        };
    }
    get filterTableRow () {
        const dim = this.dim;
        const hideCurrent = this.hide_currect;
        return this.result.problem.filter((row: any) => !dim && (row.ac === false || row.ac === -1 || (row.ac === true && !hideCurrent)));
    }

    sort (target: any, event: any, default_order = 0) {
        this.$parent.sort(target, event, default_order);
    }
    tag (label: any, event: any) {
        this.$parent.tag(label, event);
    }
    bindSticky () {
        $(".ui.sticky.element")
            .sticky({
                context: "#problemset",
                offset: 40,
                observeChanges: false,
                refreshOnLoad: true,
                refreshOnResize: true
            });
    }
}
</script>

<style scoped>
    .list-complete-item {
        transition: all 0.5s;
        display: table-row;
    }

    .list-complete-enter, .list-complete-leave-to
        /* .list-complete-leave-active for below version 2.1.8 */
    {
        opacity: 0;
        transform: translateX(31px);
    }

    .list-complete-leave-active {
        opacity: 0;
        transform: translateX(-31px);
    }

    .list-complete-leave-active .problemTitle {
        opacity: 0;
    }

</style>
