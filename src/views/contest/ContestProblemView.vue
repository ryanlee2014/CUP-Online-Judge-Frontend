<template>
    <div class="ui container" id="contest_table" v-cloak>
        <ContestNotStart v-if="mode === 2"></ContestNotStart>
        <LoginForm v-if="mode === 1"></LoginForm>
        <contest-mode v-if="mode === 3"></contest-mode>
        <LimitHostname :content="limit_content" v-if="mode === 4"></LimitHostname>
        <div class="padding" v-if="mode === 0">
            <h2 class="ui dividing header">
                Contest Problem Set
            </h2>
            <div class="ui grid">
                <div class="row">
                    <div class="eleven wide column">
                        <table class='ui basic unstackable table' id='problemset' width='95%'>
                            <thead>
                            <tr class='toprow'>
                                <th @click="orderBy(0)" style="text-align: center;" width="18%"><a
                                        style="cursor:pointer">
                                    <i :class="'sort numeric icon ' + (order > 0?'up':'down')" v-if="type === 0"></i>
                                    <i class="checkmark icon" style="opacity: 0" v-else></i>
                                    {{$t("id")}}
                                </a></th>
                                <th @click="orderBy(1)" width='44%'><a style="cursor:pointer">
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
                                <th @click="orderBy(4)" style="text-align: center;" width='12%'>
                                    <a style="cursor:pointer"><i :class="'sort numeric icon ' + (order > 0?'up':'down')"
                                                                 v-if="type === 4"></i>
                                        {{$t("accept percentage")}}</a></th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr :id="'popup' + key" @mouseenter="triggerPopup(key, row.pid)" :key="key" :class="row.ac === 1?'positive':row.ac === -1?'negative':''"
                                v-for="(row,key) in problem_table">
                                <td class="center aligned">{{row.oj_name?row.oj_name:row.pid?"LOCAL ":""}}{{row.pid}}<br
                                        v-if="row.pid">Problem {{row.pnum + 1001}}
                                </td>
                                <td><i class='checkmark icon' v-if="row.ac === 1"></i>
                                    <i class="remove icon" v-else-if="row.ac === -1"></i>
                                    <i class="checkmark icon" style="opacity: 0" v-else></i>
                                    <router-link v-if="dayjs().isBefore(end_time) && dayjs().isAfter(start_time)" :to="`/contest/problem/${cid}/${row.pnum}`" v-html="contest(markdownIt.renderRaw(row.title), row.pnum)">
                                    </router-link>
                                    <router-link :to="`/problem/submit/${row.pid}`" v-else v-html="contest(markdownIt.renderRaw(row.title), row.pnum)">
                                    </router-link>
                                </td>
                                <td v-if="now.isAfter(end_time)">
                                    <router-link :to="`/tutorial/${row.pid}`">{{$t("solution")}}</router-link>
                                </td>
                                <td style="text-align:center">{{row.accepted}}/{{row.submit}}</td>
                                <td style="text-align: center;">{{(row.accepted * 100 /
                                    Math.max(row.submit,1)).toString().substring(0,4)}} %
                                </td>
                            </tr>
                            </tbody>
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

<script>
import ContestNotStart from "../../components/contest/ContestProblemView/ContestNotStart";
import LoginForm from "../../components/contest/ContestProblemView/LoginForm";
import ContestInfo from "../../components/contest/ContestProblemView/ContestInfo";
import ContestMode from "../../components/contestMode/block";
import LimitHostname from "../../components/contest/ContestProblemView/LimitHostname";
import mixins from "../../mixin/init";
import markdownIt from "../../lib/markdownIt/markdownIt";
import { mapGetters } from "vuex";
const _ = require("lodash");
const $ = require("jquery");
const dayjs = require("dayjs");
export default {
    name: "ContestProblemView",
    components: {
        ContestNotStart,
        LoginForm,
        ContestInfo,
        ContestMode,
        LimitHostname
    },
    mixins: [mixins],
    data: function () {
        return {
            cid: parseInt(this.$route.params.contest_id),
            problem_table: [],
            start_time: dayjs(),
            end_time: dayjs(),
            description: "",
            title: "",
            now: dayjs(),
            problemInfo: {},
            current_mode: 0,
            order: 1,
            type: 0,
            contest_mode: false,
            limit_content: "",
            private_contest: false,
            dayjs,
            markdownIt
        };
    },
    computed: {
        mode: {
            get: function () {
                return this.current_mode;
            },
            set: function (val) {
                let diff = val !== this.current_mode;
                this.current_mode = val;
                if (diff) {
                    this.run(this.run);
                }
            }
        },
        ...mapGetters(["admin", "contest_manager"])
    },
    mounted: function () {
        const contestID = this.$route.params.contest_id;
        document.title = `Contest ${contestID} -- ${document.title}`;
        this.getInfo();
        this.run(this.run);
    },
    updated: function () {

    },
    methods: {
        getInfo () {
            if (!(this.admin || this.contest_manager)) {
                return;
            }
            this.axios.get(`/api/contest/problem_info/${this.cid}`)
                .then(({ data }) => {
                    if (data.status === "OK") {
                        const problemList = data.data;
                        problemList.forEach(e => this.problemInfo[e.problem_id] = e);
                    }
                });
        },
        triggerPopup (key, problem_id) {
            const html = this.problemDetail(problem_id);
            $("#popup" + key).popup({
                hoverable: true,
                html
            }).popup("show");
        },
        problemDetail (problem_id) {
            console.log("problem_id", problem_id);
            const problemInfo = this.problemInfo[problem_id];
            console.log("this.problemInfo", this.problemInfo);
            console.log("problemInfo", problemInfo);
            if (problemInfo) {
                const accepted = problemInfo.accepted;
                const submit = problemInfo.submit;
                const passRate = Math.floor(accepted * 100 / submit);
                const label = problemInfo.label;
                let html = `<div class="content">
提交: ${submit} 通过:${accepted} 通过率:${passRate}%
<br>
标签:${label}
</div>`;
                return html;
            }
            return "";
        },
        run: function (resolve) {
            const contestID = this.$route.params.contest_id;
            const that = this;
            this.cid = parseInt(contestID);
            this.axios.get("/api/contest/problem/" + contestID)
                .then(({ data }) => {
                    const _d = data;
                    if (_d.status !== "OK") {
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
                    _.forEach(_d.data, function (val) {
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

                    let info = _d.info;
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
        },
        detect_source: function (row) {
            if (!row.oj_name || row.oj_name.toLowerCase() === "local") {
                return "new";
            }
            else {
                return row.oj_name.toLowerCase();
            }
        },
        contest: function (html, num) {
            if (this.contest_mode) {
                return "Problem " + String.fromCharCode("A".charCodeAt(0) + parseInt(num));
            }
            else {
                return html;
            }
        },
        orderBy: function (type) {
            let that = this;
            if (that.type === type) {
                that.order = -that.order;
            }
            let problemIdComparator = function (a, b) {
                return that.order * (a.pnum - b.pnum);
            };
            let titleComparator = function (a, b) {
                return that.order * (a.title > b.title ? 1 : (a.title < b.title ? -1 : 0));
            };
            let submitComparator = function (a, b) {
                return that.order * (a.submit - b.submit);
            };
            let acceptedComparator = function (a, b) {
                return that.order * (a.accepted - b.accepted);
            };
            let correctPercentageComparator = function (a, b) {
                let currentA = a.accepted / Math.max(a.submit, 1);
                let currentB = b.accepted / Math.max(b.submit, 1);
                return that.order * (currentA - currentB);
            };
            let comparatorSet = [problemIdComparator, titleComparator, acceptedComparator, submitComparator, correctPercentageComparator];
            that.problem_table.sort(comparatorSet[type]);
            that.type = type;
        }
    }
};
</script>

<style scoped>

</style>
