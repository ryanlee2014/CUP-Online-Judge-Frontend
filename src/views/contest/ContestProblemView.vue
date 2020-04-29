<template>
    <div class="ui container" id="contest_table" v-cloak>
        <ContestNotStart v-if="mode === 2"></ContestNotStart>
        <LoginForm v-if="mode === 1"></LoginForm>
        <contest-mode v-if="mode === 3"></contest-mode>
        <LimitHostname :content="limit_content" v-if="mode === 4"></LimitHostname>
        <div class="padding" v-if="mode === 0">
            <h2 class="ui dividing header">
                {{$t("contest problem set")}} {{cid}} -- {{title}}
            </h2>
            <div class="ui grid">
                <div class="row">
                    <div class="sixteen wide column">
                    </div>
                </div>
                <div class="row">
                    <div class="eleven wide column">
                        <table class='ui basic unstackable table' id='problemset' width='95%'>
                            <thead>
                            <tr class='toprow'>
                                <th style="text-align: center;" width="18%">
                                    <a style="cursor:pointer" @click="orderBy(0)">
                                    <i :class="'sort numeric icon ' + (order > 0?'up':'down')" v-if="type === 0"></i>
                                    <i class="checkmark icon" style="opacity: 0" v-else></i>
                                    {{$t("id")}}
                                </a></th>
                                <th width='44%'>
                                    <a style="cursor:pointer" @click="orderBy(1)">
                                    <i :class="'sort numeric icon ' + (order > 0?'up':'down')" v-if="type === 1"></i>
                                    <i class="checkmark icon" style="opacity: 0" v-else></i>
                                    {{$t("title")}}</a></th>
                                <th v-if="now.isAfter(end_time)" width="10%">
                                </th>
                                <th style="text-align: center;" width='16%'>
                                    <a style="cursor:pointer"><span @click="orderBy(2)">
                            <i :class="'sort numeric icon ' + (order > 0?'up':'down')" v-if="type === 2"></i>
                            {{$t("accept")}}</span></a>/<a style="cursor:pointer"><span @click="orderBy(3)">
                                <i :class="'sort numeric icon ' + (order > 0?'up':'down')"
                                   v-if="type === 3"></i>{{$t("submit")}}</span></a></th>
                                <th style="text-align: center;" width='12%'>
                                    <a style="cursor:pointer" @click="orderBy(4)">
                                        <i :class="'sort numeric icon ' + (order > 0?'up':'down')"
                                                                 v-if="type === 4"></i>
                                        {{$t("accept percentage")}}
                                    </a></th>
                            </tr>
                            </thead>
                            <transition-group mode="out-in" name="list-complete" tag="tbody" >
                            <tr :id="'popup' + key" @mouseenter="triggerPopup(key, row.pid)" :key="row.pnum" :class="(row.ac === 1?'positive':row.ac === -1?'negative':'') + ' list-complete-item'"
                                v-for="(row,key) in problem_table">
                                <td class="center aligned">{{row.oj_name?row.oj_name:row.pid?"LOCAL ":""}}{{row.pid}}<br
                                        v-if="row.pid">Problem {{row.pnum + 1001}}
                                </td>
                                <td><i class='checkmark icon' v-if="row.ac === 1"></i>
                                    <i class="remove icon" v-else-if="row.ac === -1"></i>
                                    <i class="checkmark icon" style="opacity: 0" v-else></i>
                                    <router-link v-if="dayjs().isBefore(end_time) && dayjs().isAfter(start_time)" :to="`/contest/problem/${cid}/${row.pnum}`" v-html="contest(row.title, row.pnum)">
                                    </router-link>
                                    <router-link :to="`/problem/submit/${row.pid}`" v-else v-html="contest(row.title, row.pnum)">
                                    </router-link>
                                    <br v-if="admin && getLabel(row.pid).length > 0">
                                    <div style="margin-left: 20px" v-if="admin">
                                    <router-link style="margin-top: 4px" :to="`/problemset?label=${lb}`" :class="`ui ${getLabelColor(lb)} label`" :key="lb" v-for="lb in getLabel(row.pid)" v-show="admin">
                                        {{lb}}
                                    </router-link>
                                    </div>
                                </td>
                                <td v-if="now.isAfter(end_time)">
                                    <router-link :to="`/tutorial/${row.pid}`">{{$t("solution")}}</router-link>
                                </td>
                                <td style="text-align:center">{{row.accepted}}/{{row.submit}}</td>
                                <td style="text-align: center;">{{(row.accepted * 100 /
                                    Math.max(row.submit,1)).toString().substring(0,4)}} %
                                </td>
                            </tr>
                            </transition-group>
                        </table>
                    </div>
                    <div class="five wide column">
                        <div>
                            <ContestInfo :admin="admin"
                                         :cid="cid"
                                         :description="description"
                                         :end_time="end_time"
                                         :private_contest="private_contest"
                                         :start_time="start_time"
                                         :title="title"></ContestInfo>
                            <br>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script lang="ts">
import ContestNotStart from "../../components/contest/ContestProblemView/ContestNotStart.vue";
import LoginForm from "../../components/contest/ContestProblemView/LoginForm.vue";
import ContestInfo from "../../components/contest/ContestProblemView/ContestInfo.vue";
import ContestMode from "../../components/contestMode/block.vue";
import LimitHostname from "../../components/contest/ContestProblemView/LimitHostname.vue";
import mixins from "../../mixin/init";
import { mapGetters } from "vuex";
import _ from "lodash";
import jquery from "jquery";
import dayjs from "dayjs";
import { Component, Mixins } from "vue-property-decorator";
import MarkdownWorkerMixin from "@/mixin/MarkdownWorkerMixin";
import ContestProblemProgressBar from "@/components/contest/ContestProblemView/ContestProblemProgressBar.vue";

const labelCache: any = {};

const $: any = jquery;
@Component({
    components: {
        ContestProblemProgressBar,
        ContestNotStart,
        LoginForm,
        ContestInfo,
        ContestMode,
        LimitHostname
    },
    computed: {
        ...mapGetters(["admin", "contest_manager"])
    }
})
export default class ContestProblemView extends Mixins(mixins, MarkdownWorkerMixin) {
    admin!: boolean;
    contest_manager!: boolean;
    colorSet = ["red", "orange", "yellow", "olive", "green", "teal", "blue", "violet", "purple", "pink", "brown", "grey"];
    colorMap: any = {};
    cid = 0;
    problem_table: any[] = [];
    start_time = dayjs();
    end_time = dayjs();
    description = "";
    title = "";
    now = dayjs();
    problemInfo: any = {};
    current_mode = 0;
    order = 1;
    type = 0;
    contest_mode = false;
    limit_content = "";
    private_contest = false;
    dayjs = dayjs;
    created () {
        this.cid = parseInt(this.$route.params.contest_id);
    }

    get mode () {
        return this.current_mode;
    }

    set mode (val: any) {
        const diff = val !== this.current_mode;
        this.current_mode = val;
        if (diff) {
            this.run(this.run);
        }
    }

    async mounted () {
        const contestID = this.$route.params.contest_id;
        document.title = `Contest ${contestID} -- ${document.title}`;
        await this.getInfo();
        this.run(this.run);
    }

    async getInfo () {
        if (!(this.admin || this.contest_manager)) {
            return;
        }
        await this.axios.get(`/api/contest/problem_info/${this.cid}`)
            .then(({ data }) => {
                if (data.status === "OK") {
                    const problemList = data.data;
                    problemList.forEach((e: any) => { this.problemInfo[e.problem_id] = e; });
                }
            });
    }

    getLabelColor (labelName: string) {
        if (Object.prototype.hasOwnProperty.call(this.colorMap, labelName)) {
            return this.colorMap[labelName];
        }
        else {
            this.colorMap[labelName] = this.colorSet[Math.floor(Math.random() * this.colorSet.length)];
            return this.colorMap[labelName];
        }
    }

    triggerPopup (key: string, problemId: any) {
        const html = this.problemDetail(problemId);
        $("#popup" + key).popup({
            hoverable: true,
            html
        }).popup("show");
    }

    problemDetail (problemId: any) {
        const problemInfo = this.problemInfo[problemId];
        if (problemInfo) {
            const accepted = problemInfo.accepted;
            const submit = problemInfo.submit;
            const passRate = Math.floor(accepted * 100 / Math.max(submit, 1));
            return `<div class="content">
本题历史统计<br>提交: ${submit} 通过:${accepted} 通过率:${passRate}%
</div>`;
        }
        return "";
    }

    hasLabel (problemId: number) {
        if (this.getLabel(problemId).length > 0) {
            return true;
        }
        return false;
    }

    getLabel (problemId: number) {
        if (Object.prototype.hasOwnProperty.call(labelCache, problemId)) {
            return labelCache[problemId];
        }
        const problemInfo = this.problemInfo[problemId];
        if (problemInfo) {
            const label = problemInfo.label;
            const lbArray = typeof label === "string" ? label.split(" ").map(e => e.trim()).filter(e => e.length > 0) : [];
            lbArray.sort((a: string, b: string) => {
                if (a === "简单" || a === "普通" || a === "中等" || a === "困难") {
                    return -1;
                }
                else if (b === "简单" || b === "普通" || b === "中等" || b === "困难") {
                    return 1;
                }
                if (a < b) return -1;
                else if (a === b) return 0;
                else return 1;
            });
            labelCache[problemId] = lbArray;
            return lbArray;
        }
    }

    run (resolve?: (...args: any[]) => any) {
        const contestID = this.$route.params.contest_id;
        const that = this;
        this.cid = parseInt(contestID);
        this.axios.get("/api/contest/problem/" + contestID)
            .then(response => {
                console.log(response);
                const _d = response.data;
                if (_d.status !== "OK") {
                    console.log(_d);
                    if (_d.statement === "Permission denied") {
                        that.mode = 1;
                        return;
                    }
                    else if (_d.error_code === 101) {
                        that.mode = 2;
                        return;
                    }
                    else if (_d.contest_mode) {
                        that.mode = 3;
                        return;
                    }
                }
                _.forEach(_d.data, (val) => {
                    if (!val.accepted) val.accepted = 0;
                    if (!val.submit) val.submit = 0;
                });
                let addr = _d.limit;
                let contestMode = _d.contest_mode;
                if (_d.admin) {
                    addr = null;
                    contestMode = false;
                }
                if (addr && location.href.indexOf(addr) === -1) {
                    that.mode = 4;
                    that.limit_content = "根据管理员设置的策略，本次contest请使用" + addr + "访问";
                    return;
                }
                that.problem_table = _d.data;
                this.problem_table.forEach(async (e: any) => {
                    if (e.title) {
                        e.title = await this.renderRawAsync(e.title);
                    }
                });
                const info = _d.info;
                that.start_time = dayjs(info.start_time);
                that.end_time = dayjs(info.end_time);
                that.title = info.title;
                that.contest_mode = contestMode;
                that.description = info.description;
                // that.contest_mode = info.contest_mode;
                that.private_contest = Boolean(info.private);
                if (typeof resolve === "function") {
                    resolve();
                }
            });
    }

    detect_source (row: any) {
        if (!row.oj_name || row.oj_name.toLowerCase() === "local") {
            return "new";
        }
        else {
            return row.oj_name.toLowerCase();
        }
    }

    contest (html: any, num: any) {
        if (this.contest_mode) {
            return "Problem " + String.fromCharCode("A".charCodeAt(0) + parseInt(num));
        }
        else {
            return html;
        }
    }

    orderBy (type: any) {
        const that = this;
        if (that.type === type) {
            that.order = -that.order;
        }
        const problemIdComparator = function (a: any, b: any) {
            return that.order * (a.pnum - b.pnum);
        };
        const titleComparator = function (a: any, b: any) {
            return that.order * (a.title > b.title ? 1 : (a.title < b.title ? -1 : 0));
        };
        const submitComparator = function (a: any, b: any) {
            return that.order * (a.submit - b.submit);
        };
        const acceptedComparator = function (a: any, b: any) {
            return that.order * (a.accepted - b.accepted);
        };
        const correctPercentageComparator = function (a: any, b: any) {
            const currentA = a.accepted / Math.max(a.submit, 1);
            const currentB = b.accepted / Math.max(b.submit, 1);
            return that.order * (currentA - currentB);
        };
        const comparatorSet = [problemIdComparator, titleComparator, acceptedComparator, submitComparator, correctPercentageComparator];
        that.problem_table.sort(comparatorSet[type]);
        that.type = type;
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
