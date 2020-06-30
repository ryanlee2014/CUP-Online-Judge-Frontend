<template>
    <ErrorView :errormsg="errormsg" v-if="!state"></ErrorView>
    <div class="contestrank scoreboard padding" v-else>
        <h2 class="ui dividing header">
            {{total === -1 || !finished ?"计算中,请稍后":$t("contest ranklist")}} {{!finished || hasPrivilege ? "" : $t("lite mode")}}
            <div class="sub header">
                {{title}} 总人数: {{this.totalNumber}}
            </div>
        </h2>

        <div class="ui grid">
            <div class="row">
                <div class="left aligned eight wide column">
                    <TimeView
                        :start_time="start_time"
                    ></TimeView>
                </div>
                <div class="right aligned eight wide column">
                    <button @click="playRanklist" class="ui primary button item" v-if="!playing">播放排名变化</button>
                    <span v-if="playing">
                        {{playingTime}}
                    </span>
                    <button @click="pausePlayRanklist" class="ui primary button" v-if="playing">{{playing ? "暂停" : "继续"}}</button>
                    <button @click="stopPlayRanklist" class="ui primary button" v-if="playing">停止</button>
                    <div class="ui toggle checkbox"><input @click="auto_update = !auto_update" type="checkbox">
                        <label>暂停自动更新排名</label></div>
                    <div class="ui toggle checkbox"><input @click="add_name=!add_name" type="checkbox">
                        <label>加入学号</label></div>
                    <a @click="exportXLS" class="ui primary mini button">保存表格到本地</a>
                </div>
            </div>
            <div class="row">
                <div class="ranking dragscroll" style="width:100%;overflow:auto">
                    <table class="ui small celled table" id='rank'>
                        <thead>
                        <tr align=center class=toprow>
                            <th class="{sorter:'false'}" width=5%>{{$t("rank")}}</th>
                            <th width=5%>{{ $t("user_id") }}</th>
                            <th style="min-width:90px">{{ $t("nick") }}</th>
                            <th v-if="add_name" width=5%>Id</th>
                            <th v-if="hasPrivilege" width="5%">通过/测试比</th>
                            <th v-if="hasPrivilege" width="5%">通过/提交比</th>
                            <th width=5%>{{$t("accept")}}</th>
                            <th width=5%>{{$t("penalty")}}</th>
                            <th :key="i" style="min-width: 85.71px;"
                                v-for="i in Array.from(Array(Math.max(0,total)).keys())">{{1001 + i}}
                            </th>
                        </tr>
                        </thead>
                        <transition-group name="list-complete" tag="tbody">
                            <tr :key="row.user_id" class="list-complete-item" style="cursor: grab!important;"
                                v-for="(row,key) in submitter" v-show="row.rank <= Math.trunc(totalNumber * 0.3) || row.user_id === user_id || hasPrivilege">
                                <td :class="rankClass(key)"
                                    style="text-align:center;font-weight:bold;position: sticky; left: 0">{{row.rank}}
                                </td>
                                <td class="ui white">
                                    <router-link :to="`/user/${row.user_id}`">{{row.user_id}}</router-link>
                                </td>
                                <td class="ui white">
                                    <router-link :to="`/user/${row.user_id}`">{{convertHTML(row.nick)}}</router-link>
                                </td>
                                <td style="text-align:center" v-if="add_name">{{convertHTML(row.real_name)}}</td>
                                <td style="text-align: center" v-if="hasPrivilege">{{row.totalTestRun === 0 ? "无测试运行" : `${Math.trunc(row.ac * 10000 / row.totalTestRun) / 100}%`}}</td>
                                <td style="text-align: center" v-if="hasPrivilege">{{Math.trunc(row.ac * 10000 / row.totalSubmitTime) / 100}}%</td>
                                <td style="text-align:center">
                                    <router-link :to="`/contest/status/${cid}?user_id=${row.user_id}`">{{row.ac}}
                                    </router-link>
                                </td>
                                <td style="text-align:center">{{format_date(row.penalty_time)}}</td>
                                <ResultGrid :gridBackground="p.accept.length > 0?p.first_blood ? 1:-1:0"
                                            :problem="p"
                                            :key="key + 0"
                                            :lock="popupLock"
                                            :format_date="format_date"
                                            v-for="(p,key) in row.problem.toArray()"
                                ></ResultGrid>
                            </tr>
                        </transition-group>
                    </table>
                    <table :style="'display:none;vnd.ms-excel.numberformat:@'" id="save">
                        <tbody>
                        <tr align=center class=toprow>
                            <td width=5%>{{$t("rank")}}</td>
                            <td width=5%>{{$t("user_id")}}</td>
                            <td>{{$t("nick")}}</td>
                            <td v-if="add_name" width=5%>学号</td>
                            <td v-if="hasPrivilege" width="5%">通过/测试比</td>
                            <td v-if="hasPrivilege" width="5%">通过/提交比</td>
                            <td width=5%>{{$t("accept")}}</td>
                            <td width=5%>{{$t("penalty")}}</td>
                            <td>环境指纹数</td>
                            <td>硬件指纹数</td>
                            <td>IP总数</td>
                            <td>地点</td>
                            <td :key="i" v-for="i in Array.from(Array(Math.max(0,total)).keys())">{{1001 + i}}</td>
                        </tr>
                        <tr :key="key" v-for="(row,key) in submitter">
                            <td align="center">{{row.rank}}</td>
                            <td align="center">{{row.user_id}}</td>
                            <td align="center">{{convertHTML(row.nick)}}</td>
                            <td align="center" v-if="add_name">{{convertHTML(row.real_name)}}</td>
                            <td align="center" v-if="hasPrivilege">{{row.totalTestRun === 0 ? "无测试运行" : `${Math.trunc(row.ac * 10000 / row.totalTestRun) / 100}%`}}</td>
                            <td align="center" v-if="hasPrivilege">{{Math.trunc(row.ac * 10000 / row.totalSubmitTime) / 100}}%</td>
                            <td align="center">{{row.ac}}</td>
                            <td>{{format_date(row.penalty_time)}}</td>
                            <td>{{row.fingerprintSet.size}}</td>
                            <td>{{row.hardwareFingerprintSet.size}}</td>
                            <td>{{row.ipSet.size}}</td>
                            <td>{{row.ipSet.size === 1 ? detectPlace(Array.from(row.ipSet)[0]) : row.ipSet.size ===
                                0?"无":"略"}}
                            </td>
                            <td :bgcolor="'#FF' + (formatColor(Math.max(Math.floor((1 << 8) - (256 * Math.max(p.highestSim - 69,0) / 31.0)) - 1, 0)))"
                                :key="key"
                                align="left" v-for="(p,key) in row.problem.toArray()">
                                {{ (p.submit.length > 0)?"(-":""}}{{p.try_time > 0 ? p.try_time + ")" : p.submit.length
                                > 0?p.submit.length + ")" : ""}}{{p.accept.length > 0 ?
                                format_date(p.accept[0].diff(p.start_time,"second")):""}}{{p.highestSim > 0?"("+p.highestSim +
                                "%)":""}}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import mixins from "../../mixin/init";
import { saveAs } from "file-saver";
import utils from "../../lib/util";
import TimeView from "../../components/contest/ContestRank/timeView.vue";
import ErrorView from "../../components/contest/ContestRank/errorView.vue";
import ResultGrid from "../../components/contest/ContestRank/ResultGrid.vue";
import AwaitLock from "await-lock";
import _ from "lodash";
import dayjs from "dayjs";
import { Component, Mixins, Watch } from "vue-property-decorator";
import {
    firstBloodListFactory, IContestRankSubmissionDTO, Submitter,
    SubmitterComparator,
    SubmitterFactory
} from "@/module/ContestRank/ContestRankFactories";
import { mapGetters } from "vuex";
import axios from "axios";
import { isContestAssistant } from "@/util/util";

const { reset: bindDragEvent } = require("dragscroll");
let submissionCollection: any[] = [];
// @ts-ignore
window.submissionCollection = submissionCollection;
let convertFlag = false;

@Component({
    components: {
        ErrorView,
        TimeView,
        ResultGrid
    },
    i18n: {
        messages: {
            "zh-cn": {
                "lite mode": "简洁模式"
            },
            en: {
                "lite mode": "Lite Mode"
            },
            ja: {
                "lite mode": "簡略モード"
            }
        }
    },
    computed: {
        ...mapGetters(["admin", "contest_manager", "user_id"])
    }
})
export default class ContestRank extends Mixins(mixins) {
    cid: any = "";
    sockets: any;
    created () {
        this.cid = this.$route.params.contest_id;
        this.sockets.subscribe("submit", (data: any) => {
            this.handleNewSubmit(data);
        });
        this.sockets.subscribe("result", (data: any) => {
            this.handleNewSubmit(data);
        });
    }

    beforeDestroy () {
        this.sockets.unsubscribe("submit");
        this.sockets.unsubscribe("result");
    }

    submitter: Submitter[] = [];
    total = -1;
    start_time = dayjs();
    title = "";
    assistant = false;
    finished = false;
    users: any[] = [];
    add_name = false;
    auto_update = true;
    totalNumber = 0;
    playingTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
    popupLock = new AwaitLock();
    waiting_queue: any[] = [];
    state = true;
    errormsg = "";
    dayjs = dayjs;
    select = $;
    console = console;
    playing = false;
    playInterval: any = 0;
    backup_data: any[] = [];
    firstRender = true;
    userStructure: {[x: string]: Submitter} = {};
    firstBloodList: any = undefined;
    worker: any = null;
    get scoreboard () {
        return null;
    }

    set scoreboard (val: any) {
        const that = this;
        this.auto_update = false;
        try {
            val = submissionCollection = submissionCollection.concat(this.toArray(val));
            let submitter: any;
            if (this.firstRender) {
                this.firstRender = false;
                this.firstBloodList = firstBloodListFactory();
                submitter = {};
                this.initUserTable(submitter);
                this.fillSubmitterList(submitter, val);
                this.userStructure = submitter;
                this.submitter = submitter = Object.values(submitter) as Submitter[];
                submitter.forEach(this.updateSubmitter);
            }
            else {
                submitter = this.userStructure;
                const lazyUpdateSet = new Set<Submitter>();
                this.fillSubmitterList(submitter, val);
                val.forEach((el: any) => typeof submitter[el.user_id.toLowerCase()] !== "undefined" ? lazyUpdateSet.add(submitter[el.user_id.toLowerCase()]) : "");
                lazyUpdateSet.forEach(this.updateSubmitter);
                this.submitter = submitter = Object.values(submitter) as Submitter[];
                this.updateSubmitterTotalProblemNumber(submitter);
            }
            this.calculateRank();
            // @ts-ignore
            window.temp_data = submissionCollection;
            // @ts-ignore
            window.datas = this.submitter;
        }
        catch (e) {
            that.state = false;
            that.submitter = [];
            console.log(e);
            let str = e.stack;
            str = str.replace(/\n/g, "<br>");
            that.errormsg = str;
        }
        this.auto_update = true;
        window.userStructure = this.userStructure;
    }

    toArray (val: any) {
        if (!Array.isArray(val)) {
            val = [val];
        }
        return val;
    }

    updateSubmitter (el: Submitter) {
        el.calculatePenaltyTime();
        el.calculateAC();
        el.calculateFirstBlood(this.firstBloodList);
    }

    fillSubmitterList (submitter: {[x: string]: Submitter | undefined }, val: IContestRankSubmissionDTO[]) {
        const len = val.length;
        for (let i = 0; i < len; ++i) {
            const privateContest = this.users.length > 0;
            if (!submitter[val[i].user_id.toLowerCase()]) {
                if (privateContest) {
                    continue;
                }
                submitter[val[i].user_id.toLowerCase()] = SubmitterFactory(val[i].nick, this.total, val[i].user_id);
            }
            if (val[i].num < this.total) {
                submitter[val[i].user_id.toLowerCase()]!.addData(val[i]);
            }
        }
    }

    initUserTable (submitter: {[x: string]: Submitter | undefined }) {
        _.forEach(this.users, (val: any) => {
            if (!submitter[val.user_id.toLowerCase()]) {
                submitter[val.user_id.toLowerCase()] = SubmitterFactory(val.nick, this.total, val.user_id);
            }
        });
    }

    calculateRank () {
        this.submitter.sort(SubmitterComparator("greater"));
        let rnk = 1;
        // @ts-ignore
        window.submitter = this.submitter;
        this.totalNumber = 0;
        _.forEach(this.submitter, val => (val.rank = val.ac > 0 ? (++this.totalNumber, rnk++) : rnk));
    }

    updateSubmitterTotalProblemNumber (submitter: Submitter[]) {
        submitter.forEach(e => e.updateTotal(this.total));
    }

    rankClass (rank: any) {
        const total = this.totalNumber;
        rank = parseInt(rank);
        if (rank <= total * 0.1 + 1) {
            return "ui yellow";
        }
        else if (rank <= total * 0.3 + 1) {
            return "ui grey";
        }
        else if (rank <= total * 0.6 + 1) {
            return "ui orange";
        }
        else {
            return "ui white";
        }
    }

    playRanklist () {
        this.auto_update = false;
        this.playing = true;
        const backupTempData = this.backup_data = submissionCollection;
        backupTempData.sort((a, b) => {
            const atime = dayjs(a.in_date);
            const btime = dayjs(b.in_date);
            return atime.isAfter(btime) ? 1 : -1;
        });
        submissionCollection = [];
        this.submitter = [];
        this.firstRender = true;
        this.startInterval();
    }

    startInterval () {
        const backupTempData = this.backup_data;
        this.playInterval = setInterval(() => {
            if (backupTempData.length > 0) {
                let data = backupTempData.shift();
                while (backupTempData.length > 0 && data.result < 4 && data.result >= 11) {
                    data = backupTempData.shift();
                }
                this.playingTime = dayjs(data.in_date).format("YYYY-MM-DD HH:mm:ss");
                this.scoreboard = data;
                if (backupTempData.length === 0) {
                    this.endInterval();
                }
            }
            else {
                this.endInterval();
            }
        }, 30);
    }

    endInterval () {
        clearInterval(this.playInterval);
        this.playing = false;
        this.auto_update = true;
    }

    pausePlayRanklist () {
        if (this.playing) {
            this.playing = false;
            clearInterval(this.playInterval);
        }
        else {
            this.playing = true;
            this.startInterval();
        }
    }

    stopPlayRanklist () {
        this.playing = false;
        clearInterval(this.playInterval);
        this.scoreboard = this.backup_data.filter(el => typeof el !== "undefined");
        this.backup_data = [];
        this.auto_update = true;
    }

    fillZero (str: string) {
        if (str.length < 2) {
            return "0" + str;
        }
        else {
            return str;
        }
    }

    format_date (second: any, mode = 0) {
        const fillZero = this.fillZero;
        second = parseInt(second);
        const hour = fillZero(Math.trunc(second / 3600).toString());
        const minute = fillZero(Math.trunc((second - parseInt(hour) * 3600) / 60).toString());
        const sec = fillZero((second % 60).toString());
        if (mode) {
            return hour + "：" + minute + "：" + sec;
        }
        else {
            return hour + ":" + minute + ":" + sec;
        }
    }

    formatColor (num: any) {
        const str = num.toString(16);
        if (num < 16) {
            return "0" + str + "0" + str;
        }
        else {
            return "" + str + "" + str;
        }
    }

    detectPlace (ip: any) {
        if (!ip) {
            return "未知";
        }
        return utils.detectIP({
            intranet_ip: ip,
            place: "",
            $this: this,
            toString () {
                return this.intranet_ip + "";
            }
        });
    }

    convertHTML (str: string) {
        const d = document.createElement("div");
        d.innerHTML = str;
        return d.innerText;
    }

    decodeHTML (str: string) {
        if (typeof str !== "string") {
            str = "";
        }
        return str.replace("·", "&middot;");
    }

    exportXLS () {
        const doc: any = document.getElementById("save");
        let XLSContentHTML = "<html xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:x=\"urn:schemas-microsoft-com:office:excel\" xmlns=\"http://www.w3.org/TR/REC-html40\">" + "<head><meta http-equiv='Content-Type' content='application/vnd.ms-excel; charset=utf-8' /></head>";
        XLSContentHTML += "<center><h3>Contest " + this.cid + " " + this.title + "</h3></center>";
        XLSContentHTML += "<table border=1>" + doc.innerHTML.replace("<tbody>", "").replace("</tbody>", "");
        XLSContentHTML += "<tr><td colspan='8'>环境指纹指根据用户的硬件环境及IP地址不同而产生的不同的指纹</td></tr>";
        XLSContentHTML += "<tr><td colspan='8'>硬件指纹指的是不受IP影响的指纹</td></tr>";
        XLSContentHTML += "<tr><td colspan='8'>若环境指纹与硬件指纹均唯一，代表用户使用相同设备在相同地点完成提交</td></tr>";
        XLSContentHTML += "<tr><td colspan='8'>若硬件指纹唯一而环境指纹不唯一，代表同型号机器在不同IP地址提交</td></tr>";
        XLSContentHTML += "<tr><td colspan='8'>若硬件指纹不唯一，代表使用了多台设备进行提交</td></tr>";
        XLSContentHTML += "</table></html>";
        const wopts = { bookType: "xlsx", bookSST: false, type: "binary" };// 这里的数据是用来定义导出的格式类型

        // downloadExl(doc);
        const blob = new Blob([XLSContentHTML], { type: "application/vnd.ms-excel;charset=UTF-8;" });
        if (convertFlag) {
            saveAs(blob, "Contest " + this.cid + " 多个contest.xls");
        }
        else {
            saveAs(blob, "Contest " + this.cid + " " + this.title + ".xls");
        }
        // var table = TableExport(document.getElementById("save"));
        // var d = table.getExportData().save.xlsx;
        // var filename = "Contest " + this.cid;
        // filename = filename.substring(0,31);
        // table.export2file(d.data,d.mimeType,filename,d.fileExtension,d.merges)
    }

    handleNewSubmit (data: any) {
        if (parseInt(data.contest_id) === parseInt(this.cid)) {
            if (data.finish === 1) {
                const ndata = {
                    nick: data.nick,
                    user_id: data.user_id,
                    start_time: this.start_time,
                    avatar: 0,
                    in_date: data.in_date,
                    num: parseInt(data.num),
                    result: data.state
                };
                if (!this.auto_update) {
                    this.waiting_queue.push(ndata);
                }
                else {
                    this.scoreboard = ndata;
                }
            }
        }
    }

    @Watch("auto_update")
    onAutoUpdateChanged () {
        while (this.waiting_queue.length > 0) {
            this.scoreboard = this.waiting_queue.shift();
        }
    }

    @Watch("add_name")
    onAddNameChanged (newVal: any) {
        const that = this;
        if (!newVal) return;
        for (let i = 0; i < this.submitter.length; ++i) {
            this.axios.get(`/api/user/nick/${this.decodeHTML(this.submitter[i].nick)}`)
                .then(({ data }) => {
                    if (data && data.data && data.data.length > 0) {
                        const nick = data.nick;
                        const nickArray = data.data;
                        let userId = "";
                        for (let j = 0; j < nickArray.length; ++j) {
                            if (!isNaN(nickArray[j].user_id)) {
                                userId = nickArray[j].user_id;
                                break;
                            }
                        }
                        for (let j = 0; j < that.submitter.length; ++j) {
                            if (that.decodeHTML(that.submitter[j].nick) === nick) {
                                that.submitter[j].real_name = userId;
                                break;
                            }
                        }
                    }
                });
        }
    }

    updated () {
        document.title = "ContestRank: " + this.title;
        $("#rank").find("tr").each(function () {
            $(this).find("td").eq(2).css({
                position: "sticky",
                left: $(this)!.find("td")!.eq(2)!.prev()!.outerWidth()! + $(this)!.find("td")!.eq(1)!.prev()!.outerWidth()!,
                borderRight: "1px solid rgba(34,36,38,.1)"
            });
            $(this)!.find("td")!.eq(1)!.css({
                position: "sticky",
                left: $(this)!.find("td")!.eq(1)!.prev()!.outerWidth()!
            });
        });
    }

    checkContestAssistant () {
        isContestAssistant(this.cid).then(e => { this.assistant = e; });
    }

    get hasPrivilege () {
        return this.$store.getters.admin || this.$store.getters.contest_maker[this.cid] || this.$store.getters.contest_manager || this.assistant;
    }

    mounted () {
        // @ts-ignore
        window.datas = [];
        submissionCollection = [];
        document.title = `Contest Rank ${this.cid} -- ${document.title}`;
        this.checkContestAssistant();
        const that = this;
        bindDragEvent();
        (async () => {
            let cid = this.$route.params.contest_id;
            let cidArr: any = [];
            if (cid.indexOf(",") !== -1) {
                cidArr = cid.split(",");
            }
            else {
                cidArr = [cid];
            }
            let cnt = 0;
            let dataSet: any = [];
            const users = new Set();

            const work = async () => {
                cid = cidArr.shift();
                await this.axios.get(`/api/scoreboard/${cid}`);
                this.axios.get(`/api/scoreboard/${cid}`)
                    .then(({ data }) => {
                        _.forEach(data.data, function (val) {
                            val.num += cnt;
                            val.start_time = dayjs(data.start_time);
                            dataSet.push(val);
                        });
                        _.forEach(data.users, function (val) {
                            users.add(val);
                        });

                        cnt += data.total;

                        if (cidArr.length > 0) {
                            convertFlag = true;
                            work();
                        }
                        else {
                            this.finished = true;
                        }
                        that.total = cnt;
                        that.users = Array.from(users);
                        that.scoreboard = dataSet;
                    })
                    .catch(({ data }) => {
                        that.state = false;
                        that.submitter = [];
                        let str;
                        if (data.contest_mode === true) {
                            str = "根据设置，内容非公开";
                        }
                        else if (data.statement && data.statement.includes && data.statement.includes("denied")) {
                            str = "根据设置，您无权访问";
                        }
                        else {
                            str = "Contest " + cid + ":\n" + data.statement;
                        }
                        str = str.replace(/\n/g, "<br>");
                        that.errormsg = str;
                    });
            };

            if (cidArr.length > 1) {
                that.title = cidArr.join(",");
                await work();
            }
            else {
                cid = cidArr.shift();
                await this.axios.get(`/api/scoreboard/${cid}`);

                this.axios.get(`/api/scoreboard/${cid}`)
                    .then(({ data }) => {
                        this.finished = true;
                        that.total = data.total;
                        that.users = data.users;
                        // @ts-ignore
                        that.start_time = window.start_time = dayjs(data.start_time);
                        _.forEach(data.data, function (val) {
                            val.start_time = dayjs(data.start_time);
                        });

                        that.scoreboard = data.data;
                        submissionCollection = data.data;
                        dataSet = data.data;
                        if (typeof data.title === "string" && data.title.length === 0) {
                            data.title = "未设置标题";
                        }
                        that.title = data.title;
                    })
                    .catch(({ data }) => {
                        that.state = false;
                        that.submitter = [];
                        if (!data.statement) {
                            that.errormsg = "根据设置，内容非公开".replace(/\n/g, "<br>");
                        }
                        if (data.statement.includes && data.statement.includes("denied")) {
                            that.errormsg = "根据设置，您无权访问".replace(/\n/g, "<br>");
                        }
                        else {
                            that.errormsg = ("Contest " + cid + ":\n" + data.statement).replace(/\n/g, "<br>");
                        }
                    });
            }
        })();
    }
}
</script>

<style scoped>
    .ui.grey {
        background-color: #A0A0A0;
    }

    .ui.yellow {
        background-color: #FFD700;
    }

    .ui.orange {
        background-color: #FE9A76;
    }

    .ui.white {
        background-color: #FFFFFF;
    }

    .accept {
        background-color: #e0ffe4 !important;
    }

    .accept.first {
        background-color: #16ab39 !important;
    }

    .text.accept {
        color: #21BA45 !important;
    }

    .text.accept.first {
        color: #FFFFFF !important;
    }

    .text.red {
        color: #DB2828 !important;
    }

    .well {
        background-image: none;
        padding: 1px;
    }

    td {
        white-space: nowrap !important;
        text-align: center !important;
    }

    .ui.table thead tr:first-child > th {
        position: sticky !important;
        top: 0;
        z-index: 2;
    }

    .ui.yellow {
        background: #FFD700 !important;
        color: #000 !important;
    }

    .ui.orange {
        background-color: #FE9A76 !important;
        color: #000 !important;
    }

    .ui.grey {
        color: #000 !important;
    }

    .list-complete-item {
        transition: all 1s;
        display: table-row;
    }

    .list-complete-enter, .list-complete-leave-to
        /* .list-complete-leave-active for below version 2.1.8 */
    {
        opacity: 0;
        transform: translateY(30px);
    }

    .list-complete-leave-active {
        position: absolute;
    }

</style>
