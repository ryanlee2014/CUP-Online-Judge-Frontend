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
                    <th width=55%>{{$t("title")}}</th>
                    <th width=25%>{{$t("status")}}</th>
                    <th width=7%>{{$t("privilege")}}</th>
                    <th width="13%">{{$t("creator")}}</th>
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

<script lang="ts">
import mixins from "../../mixin/init";
import progressBar from "../../components/progress/progressBar.vue";
import jquery from "jquery";
import dayjs, { Dayjs } from "dayjs";
import { Mixins, Component } from "vue-property-decorator";
import { Interval } from "../../module/Decorator/method";
import TimerMixin from "@/mixin/TimerMixin";

const $: any = jquery;
@Component({
    components: {
        progressBar
    }
})
export default class ContestSetView extends Mixins(mixins, TimerMixin) {
    admin = false;
    contest_list: any[] = [];
    select1 = "";
    select2 = "";
    current_column = "contest";
    current_time:Dayjs = dayjs();
    intervalID?: number;
    created () {
        this.admin = this.$store.getters.admin;
    }
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
                }, 3000);
            });
        this.init();
    }

    @Interval(1000)
    clock () {
        $(".server_time").text(dayjs().format("YYYY-MM-DD HH:mm:ss"));
    }

    init () {
        this.clock();
    }
    bindPopup () {
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
    }
    progressBarColor (row: any) {
        return this.contestIsRunning(row) ? "green" : "grey";
    }
    contestIsRunning (row: any) {
        let startTime: Dayjs;
        if (!dayjs.isDayjs(row.start_time)) {
            startTime = dayjs(row.start_time);
        }
        let endTime: Dayjs;
        if (!dayjs.isDayjs(row.end_time)) {
            endTime = dayjs(row.end_time);
        }
        const currentTime: Dayjs = this.current_time;
        return currentTime.isBefore(endTime!) && currentTime.isAfter(startTime!);
    }
    fillZero (str: string) {
        if (str.length < 2) {
            return "0" + str;
        }
        else {
            return str;
        }
    }
    formatDate (second: number) {
        let fillZero = this.fillZero;
        second = Math.abs(second);
        let day = Math.trunc(second / 3600 / 24);
        let hour = Math.trunc((second - day * 3600 * 24) / 3600);
        let minute = Math.trunc((second - day * 3600 * 24 - hour * 3600) / 60);
        let sec = second % 60;
        let strHour = fillZero(hour + "");
        let strMinute = fillZero(minute + "");
        let strSec = fillZero(sec + "");
        return `${day}天${strHour}小时${strMinute}分${strSec}秒`;
    }
    contestTimeFormat (row: any) {
        if (Object.prototype.hasOwnProperty.call(row, "_format_") && typeof row._format_ === "string") {
            return row._format_;
        }
        let startTime: Dayjs;
        if (!dayjs.isDayjs(row.start_time)) {
            startTime = dayjs(row.start_time);
        }
        let endTime: Dayjs;
        if (!dayjs.isDayjs(row.end_time)) {
            endTime = dayjs(row.end_time);
        }
        const currentTime: Dayjs = this.current_time;
        if (row.isEnd || currentTime.isAfter(endTime!)) {
            row.isEnd = true;
            // eslint-disable-next-line no-return-assign
            return row._format_ = `${endTime!.format("YYYY-MM-DD HH:mm")}${this.$t("end")}`;
        }
        else if (currentTime.isBefore(startTime!)) {
            return `${startTime!.format("YYYY-MM-DD HH:mm")}${this.$t("start")}`;
        }
        else {
            return `${startTime!.format("YYYY-MM-DD HH:mm")} ${this.$t("start")}<br>${endTime!.format("YYYY-MM-DD HH:mm")} ${this.$t("end")}`;
        }
    }
    percentageRunning (row: any) {
        let startTime: Dayjs;
        if (row.isEnd === true) {
            return 100;
        }
        if (!dayjs.isDayjs(row.start_time)) {
            startTime = dayjs(row.start_time);
        }
        let endTime: Dayjs;
        if (!dayjs.isDayjs(row.end_time)) {
            endTime = dayjs(row.end_time);
        }
        const currentTime: Dayjs = this.current_time;
        if (currentTime.isBefore(startTime!)) {
            return 0;
        }
        else if (currentTime.isAfter(endTime!)) {
            row.isEnd = true;
            return 100;
        }
        else {
            let diffTime = currentTime.diff(startTime!, "second");
            let totalDiff = endTime!.diff(startTime!, "second");
            return (Math.floor(diffTime * 100 / totalDiff));
        }
    }
}
</script>

<style scoped>
    td {
        text-align: center !important;
    }
</style>
