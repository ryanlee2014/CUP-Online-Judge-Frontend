<template>
    <div class="ui padding container contest">
        <h2 class="ui dividing header">
            Contest Set
        </h2>
        <div class="ui top attached tabular menu">
            <a :class="(current_column === 'contest' ? 'active':'') + ' item'"
               @click="current_column = 'contest'">{{$t("test")}}</a>
            <a :class="(current_column === 'rank' ? 'active':'') + ' item'" @click="current_column = 'rank'">{{$t("ranklist statistic")}}</a>
        </div>

        <div class="ui bottom attached segment" v-show="current_column === 'contest'">
            <div class="ui icon message">
                <i class="notched circle loading icon"></i>
                <div class="content">
                    <div class="header">
                        {{$t("current server time")}}
                    </div>
                    <p class="server_time"></p>
                </div>
            </div>
            <table class='ui padded celled unstackable selectable table' width=90%>
                <thead>
                <tr align=center class=toprow>
                    <th width=55%>Name</th>
                    <th width=25%>Status</th>
                    <th width=7%>Privilege</th>
                    <th width="13%">Creator</th>
                </tr>
                </thead>
                <tbody>
                <tr :class="`${(key % 2 === 0 ? 'evenrow' : 'oddrow')} ${row.defunct === 'Y' ? 'active' : ''}`"
                    :key="key"
                    v-for="(row,key) in contest_list">
                    <td>
                        <router-link :to="`/contest/${row.contest_id}`">
                            {{`Contest ${row.contest_id}: ${row.title}`}}
                        </router-link>
                    </td>
                    <td>
                        <p style="margin-bottom: 0.25em" v-html="contestTimeFormat(row)"></p>
                        <progress-bar :active="contestIsRunning(row)" :color="progressBarColor(row)" :percentage="percentageRunning(row)"
                                      :size="'tiny'"></progress-bar>
                    </td>
                    <td>
                        {{row.private ? $t("private") : $t("public")}}
                    </td>
                    <td>
                        <router-link :to="`/user/${row.user_id}`">
                            {{row.user_id}}
                        </router-link>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="ui bottom attached segment" v-show="current_column === 'rank'">
            <h3 class="ui dividing header">{{$t("ranklist statistic")}}</h3>
            <div class="ui grid">
                <div class="fourteen wide column">
                    <div class="ui fluid multiple search selection dropdown">
                        <input @change="select1 = $event.target.value" name="country" type="hidden">
                        <i class="dropdown icon"></i>
                        <div class="default text">Select Contest Or Input Contest ID</div>
                        <div class="menu">
                            <div :data-value="row.contest_id" :key="key" class="item" v-for="(row,key) in contest_list">
                                {{"Contest" +
                                row.contest_id + " " + row.title}}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="two wide column">
                    <router-link :to="`/contest/rank/${select1}`" class="primary button ui">Go</router-link>
                </div>
            </div>
            <h3 class="ui dividing header">{{$t("user submit statistics")}}</h3>
            <div class="ui grid">

                <div class="fourteen wide column">
                    <div class="ui fluid multiple search selection dropdown">
                        <input @change="select2 = $event.target.value" name="country" type="hidden">
                        <i class="dropdown icon"></i>
                        <div class="default text">Select Contest Or Input Contest ID</div>
                        <div class="menu">
                            <div :data-value="row.contest_id" :key="key" :title="row.title" class="item"
                                 v-for="(row,key) in contest_list">{{"Contest" + row.contest_id + " " + row.title}}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="two wide column">
                    <router-link :to="`/status/user/contest/${select2}`" class="primary button ui">Go</router-link>
                </div>
            </div>
        </div>
    </div> <!-- /container -->
</template>
<i18n>
    {
        "zh-cn": {
            "user submit statistics": "用户提交信息统计",
            "current server time": "当前服务器时间",
            "ranklist statistic": "排名统计",
            "start": "开始",
            "end": "结束"
        },
        "en": {
            "user submit statistics": "User Submit Statistics",
            "current server time": "Server Time",
            "ranklist statistic": "Ranklist Statistics",
            "start": "Start",
            "end": "End"
        },
        "ja": {
            "user submit statistics": "ユーザー提出統計",
            "current server time": "サーバー時間",
            "ranklist statistic": "ランキング統計",
            "start": "始め",
            "end": "終わり"
        }
    }
</i18n>

<script>
import mixins from "../../mixin/init";
import progressBar from "../../components/progress/progressBar";

const $ = require("jquery");
const dayjs = require("dayjs");
export default {
    name: "ContestSetView",
    mixins: [mixins],
    components: {
        progressBar
    },
    data () {
        return {
            admin: this.$store.getters.admin,
            contest_list: [],
            select1: "",
            select2: "",
            current_column: "contest",
            current_time: dayjs()
        };
    },
    mounted () {
        document.title = `Contest Set -- ${document.title}`;
        this.axios.get("/api/contest/list", {
            params: (params => {
                for (let key in params) {
                    if (params[key] === null || params[key] === undefined) {
                        params[key] = "1";
                    }
                }
                return params;
            })(this.$route.query)
        })
            .then(({ data }) => {
                this.contest_list = data.data;
                this.intervalID = setInterval(() => {
                    this.current_time = dayjs();
                }, 1000);
            });
        this.init();
    },
    methods: {
        init: function () {
            const diff = new Date().getTime() - new Date().getTime();

            function clock () {
                let x, h, m, s, n, y, mon, d;
                x = new Date(new Date().getTime() + diff);
                y = x.getYear() + 1900;
                if (y > 3000) y -= 1900;
                mon = x.getMonth() + 1;
                d = x.getDate();
                h = x.getHours();
                m = x.getMinutes();
                s = x.getSeconds();
                n = y + "-" + mon + "-" + d + " " + (h >= 10 ? h : "0" + h) + ":" + (m >= 10 ? m : "0" + m) + ":" + (s >= 10 ? s : "0" + s);
                $(".server_time").text(n);
            }

            clock();
            setInterval(clock, 1000);
        },
        bindPopup: function () {
            if (this.admin) {
                $(".ui.padded.table").popup({
                    title: "管理员视图",
                    content: "白色背景竞赛属于普通用户可见竞赛，灰色背景竞赛为不可见竞赛,绿色背景竞赛为正在进行中的竞赛",
                    position: "top center",
                    boundary: "body"
                });
            }
            $(".visible.tag").popup({
                content: "点击可切换显示隐藏"
            });
            $(".private.tag").popup({
                content: "点击可切换私有公有属性，公有属性不限制用户访问，私有属性需输入密码或列入列表才允许访问"
            });
            $(".multiple.search")
                .dropdown({
                    fullTextSearch: true
                });
        },
        progressBarColor (row) {
            return this.contestIsRunning(row) ? "green" : "grey";
        },
        contestIsRunning: function (row) {
            const startTime = dayjs(row.start_time);
            const endTime = dayjs(row.end_time);
            const currentTime = this.current_time;
            return currentTime.isBefore(endTime) && currentTime.isAfter(startTime);
        },
        formatDate: function (second) {
            let fill_zero = function (str) {
                if (str.length < 2) {
                    return "0" + str;
                }
                else {
                    return str;
                }
            };
            second = Math.abs(second);
            let day = parseInt(second / 3600 / 24);
            let hour = parseInt((second - day * 3600 * 24) / 3600);
            let minute = parseInt((second - day * 3600 * 24 - hour * 3600) / 60);
            let sec = second % 60;
            hour = fill_zero(hour + "");
            minute = fill_zero(minute + "");
            sec = fill_zero(sec + "");
            return `${day}天${hour}小时${minute}分${sec}秒`;
        },
        contestTimeFormat: function (row) {
            const startTime = dayjs(row.start_time);
            const endTime = dayjs(row.end_time);
            const currentTime = this.current_time;
            if (currentTime.isAfter(endTime)) {
                return `${endTime.format("YYYY-MM-DD HH:mm")}${this.$t("end")}`;
            }
            else if (currentTime.isBefore(startTime)) {
                return `${startTime.format("YYYY-MM-DD HH:mm")}${this.$t("start")}`;
            }
            else {
                return `${startTime.format("YYYY-MM-DD HH:mm")} ${this.$t("start")}<br>${endTime.format("YYYY-MM-DD HH:mm")} ${this.$t("end")}`;
            }
        },
        percentageRunning: function (row) {
            const startTime = dayjs(row.start_time);
            const endTime = dayjs(row.end_time);
            const currentTime = this.current_time;
            if (currentTime.isBefore(startTime)) {
                return 0;
            }
            else if (currentTime.isAfter(endTime)) {
                return 100;
            }
            else {
                let diffTime = currentTime.diff(startTime, "second");
                let totalDiff = endTime.diff(startTime, "second");
                return parseInt(Math.floor(diffTime * 100 / totalDiff));
            }
        },
        run: function () {

        }
    }
};
</script>

<style scoped>
    td {
        text-align: center !important;
    }
</style>
