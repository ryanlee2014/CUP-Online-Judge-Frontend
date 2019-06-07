<template>
    <ErrorView :errormsg="errormsg" v-if="!state"></ErrorView>
    <div class="contestrank scoreboard padding" v-else>
        <h2 class="ui dividing header">
            {{total === -1?"计算中,请稍后":"Contest Rank"}}
            <div class="sub header">
                {{title}}
            </div>
        </h2>

        <div class="ui grid">
            <div class="row">
                <div class="left aligned eleven wide column">
                    <TimeView
                        :start_time="start_time"
                    ></TimeView>
                </div>
                <div class="right aligned five wide column">
                    <button @click="playRanklist" class="ui primary button" v-if="!playing">播放排名变化</button>
                    <div class="ui buttons" v-else>
                        <button @click="pausePlayRanklist" class="ui primary button">{{playing ? "暂停" : "继续"}}</button>
                        <button @click="stopPlayRanklist" class="ui primary button">停止</button>
                    </div>
                    <div class="ui toggle checkbox"><input @click="auto_update = !auto_update" type="checkbox">
                        <label>暂停自动更新排名</label></div>
                    <div class="ui toggle checkbox"><input @click="add_name=!add_name" type="checkbox">
                        <label>加入学号</label></div>
                    <a @click="exportXLS" class="ui primary mini button">Save to XLS</a>
                </div>
            </div>
            <div class="row">
                <div class="ranking dragscroll" style="width:100%;height:700px;overflow:auto">
                    <table class="ui small celled table" id='rank'>
                        <thead>
                        <tr align=center class=toprow>
                            <th class="{sorter:'false'}" width=5%>Rank
                            <th width=5%>User</th>
                            <th style="min-width:90px">Nick</th>
                            <th v-if="add_name" width=5%>Id</th>
                            <th width=5%>Solved</th>
                            <th width=5%>Penalty</th>
                            <th :key="i" style="min-width: 85.71px;"
                                v-for="i in Array.from(Array(Math.max(0,total)).keys())">{{1001 + i}}
                            </th>
                        </tr>
                        </thead>
                        <transition-group name="list-complete" tag="tbody">
                            <tr :key="key" class="list-complete-item" v-for="(row,key) in submitter">
                                <td :class="rankClass(row.rank, submitter.length)"
                                    style="text-align:center;font-weight:bold;position: sticky; left: 0">{{row.rank}}
                                </td>
                                <td class="ui white">
                                    <router-link :to="`/user/${row.user_id}`">{{row.user_id}}</router-link>
                                </td>
                                <td class="ui white">
                                    <router-link :to="`/user/${row.user_id}`">{{convertHTML(row.nick)}}</router-link>
                                </td>
                                <td style="text-align:center" v-if="add_name">{{convertHTML(row.real_name)}}</td>
                                <td style="text-align:center">
                                    <router-link :to="`/contest/status/${cid}?user_id=${row.user_id}`">{{row.ac}}
                                    </router-link>
                                </td>
                                <td style="text-align:center">{{format_date(row.penalty_time)}}</td>
                                <td :class="p.accept.length > 0?p.first_blood ? 'first accept':'accept':''" :key="key"
                                    style="text-align:center"
                                    v-for="(p,key) in row.problem.toArray()">
                                    <b :class="'text '+ (p.accept.length > 0 ? p.first_blood?'first accept':'accept':'red')">
                                        {{ (p.accept.length > 0 || p.submit.length > 0)?"+":""}}
                                        {{p.try_time > 0 ? p.try_time : p.accept.length == 0 && p.submit.length >
                                        0?p.submit.length : ""}}</b>
                                    <br v-if="p.accept.length > 0">
                                    <span :class="p.first_blood?'first accept text':''"
                                          v-if="p.accept.length > 0 && typeof p.accept[0].diff === 'function'">
                {{format_date(p.accept[0].diff(p.start_time,"second"))}}
            </span>
                                </td>
                            </tr>
                        </transition-group>
                    </table>
                    <table :style="'display:none;vnd.ms-excel.numberformat:@'" id="save">
                        <tbody>
                        <tr align=center class=toprow>
                            <td width=5%>Rank
                            <td width=5%>User</td>
                            <td>Nick</td>
                            <td v-if="add_name" width=5%>学号</td>
                            <td width=5%>Solved</td>
                            <td width=5%>Penalty</td>
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
                            <td align="center">{{row.ac}}</td>
                            <td>{{format_date(row.penalty_time)}}</td>
                            <td>{{row.fingerprintSet.size}}</td>
                            <td>{{row.hardwareFingerprintSet.size}}</td>
                            <td>{{row.ipSet.size}}</td>
                            <td>{{row.ipSet.size === 1 ? detect_place(Array.from(row.ipSet)[0]) : row.ipSet.size ===
                                0?"无":"略"}}
                            </td>
                            <td :bgcolor="'#FF' + (format_color(Math.max(Math.floor((1 << 8) - (256 * Math.max(p.sim - 69,0) / 31.0)) - 1, 0)))"
                                :key="key"
                                align="left" v-for="(p,key) in row.problem.toArray()">
                                {{ (p.submit.length > 0)?"(-":""}}{{p.try_time > 0 ? p.try_time + ")" : p.submit.length
                                > 0?p.submit.length + ")" : ""}}{{p.accept.length > 0 ?
                                format_date(p.accept[0].diff(p.start_time,"second")):""}}{{p.sim > 0?"("+p.sim +
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

<script>
// @flow weak
import mixins from "../../mixin/init";
import { saveAs } from "file-saver";
import utils from "../../lib/util";
import TimeView from "../../components/contest/ContestRank/timeView";
import ErrorView from "../../components/contest/ContestRank/errorView";
import {
    SubmitterFactory,
    firstBloodListFactory,
    SubmitterComparator,
    Submitter,
    FirstBloodList
} from "../../module/ContestRank/ContestRankFactories";

const _ = require("lodash");
const dayjs = require("dayjs");
const XLSX = require("xlsx");
const $ = window.$ = window.jQuery = require("jquery");
const { reset: bindDragEvent } = require("dragscroll");
require("../../static/js/semantic.min");
let submissionCollection = [];
window.submissionCollection = submissionCollection;
let convertFlag = false;

export default {
    name: "ContestRank",
    mixins: [mixins],
    components: {
        ErrorView,
        TimeView
    },
    data: function () {
        return {
            cid: this.$route.params.contest_id,
            submitter: {},
            total: -1,
            start_time: dayjs(),
            title: "",
            users: [],
            add_name: false,
            auto_update: true,
            waiting_queue: [],
            state: true,
            errormsg: "",
            dayjs,
            select: $,
            console,
            playing: false,
            playInterval: 0,
            backup_data: [],
            firstRender: true,
            userStructure: {},
            firstBloodList: undefined
        };
    },
    computed: {
        scoreboard: {
            get: () => undefined,
            set: function (val) {
                const that = this;
                try {
                    if (!Array.isArray(val)) {
                        val = [val];
                    }
                    val = submissionCollection = submissionCollection.concat(val);
                    if (this.firstRender) {
                        this.firstRender = false;
                        this.firstBloodList = firstBloodListFactory(that.total);
                        let submitter = {};
                        this.initUserTable(submitter);
                        this.fillSubmitterList(submitter, val);
                        this.userStructure = submitter;
                        this.submitter = submitter = Object.values(submitter);
                        submitter.forEach(this.updateSubmitter);
                        this.calculateRank();
                    }
                    else {
                        let submitter = this.userStructure;
                        let lazyUpdateSet = new Set();
                        this.fillSubmitterList(submitter, val);
                        val.forEach(el => typeof submitter[el.user_id.toLowerCase()] !== "undefined" ? lazyUpdateSet.add(submitter[el.user_id.toLowerCase()]) : "");
                        lazyUpdateSet.forEach(this.updateSubmitter);
                        this.calculateRank();
                    }
                    window.temp_data = submissionCollection;
                    window.datas = this.submitter;
                }
                catch (e) {
                    that.state = false;
                    that.submitter = {};
                    console.log(e);
                    let str = e.stack;
                    str = str.replace(/\n/g, "<br>");
                    that.errormsg = str;
                }
            }
        }
    },
    methods: {
        updateSubmitter (el: Submitter) {
            el.calculatePenaltyTime();
            el.calculateAC();
            el.calculateFirstBlood(this.firstBloodList);
        },
        fillSubmitterList (submitter, val) {
            const len = val.length;
            for (let i = 0; i < len; ++i) {
                const privateContest = this.users.length > 0;
                if (!submitter[val[i].user_id.toLowerCase()]) {
                    if (privateContest) {
                        continue;
                    }
                    submitter[val[i].user_id.toLowerCase()] = SubmitterFactory(val[i].nick, this.total, val[i].user_id);
                }
                submitter[val[i].user_id.toLowerCase()].addData(val[i]);
            }
        },
        initUserTable (submitter) {
            _.forEach(this.users, (val) => {
                if (!submitter[val.user_id.toLowerCase()]) {
                    submitter[val.user_id.toLowerCase()] = SubmitterFactory(val.nick, this.total, val.user_id);
                }
            });
        },
        calculateRank () {
            this.submitter.sort(SubmitterComparator("greater"));
            let rnk = 1;
            window.submitter = this.submitter;
            _.forEach(this.submitter, val => (val.rank = (val.ac > 0 ? rnk++ : rnk)));
        },
        rankClass (rank, total) {
            if (parseInt(rank) === 1) {
                return "ui yellow";
            }
            else if (rank <= total * 0.1 + 1) {
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
        },
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
            this.submitter = {};
            this.firstRender = true;
            this.startInterval();
        },
        startInterval () {
            const backupTempData = this.backup_data;
            this.playInterval = setInterval(() => {
                if (backupTempData.length > 0) {
                    let data = backupTempData.shift();
                    while (backupTempData.length > 0 && data.result < 4 && data.result >= 11) {
                        data = backupTempData.shift();
                    }
                    this.scoreboard = data;
                    if (backupTempData.length === 0) {
                        this.endInterval();
                    }
                }
                else {
                    this.endInterval();
                }
            }, 30);
        },
        endInterval () {
            clearInterval(this.playInterval);
            this.playing = false;
            this.auto_update = true;
        },
        pausePlayRanklist () {
            if (this.playing) {
                clearInterval(this.playInterval);
            }
            else {
                this.playing = true;
                this.startInterval();
            }
        },
        stopPlayRanklist () {
            this.playing = false;
            clearInterval(this.playInterval);
            this.scoreboard = this.backup_data.filter(el => typeof el !== "undefined");
            this.backup_data = [];
            this.auto_update = true;
        },
        format_date: function (second, mode = 0) {
            const fill_zero = function (str) {
                if (str.length < 2) {
                    return "0" + str;
                }
                else {
                    return str;
                }
            };
            let hour = String(parseInt(second / 3600));
            hour = fill_zero(hour);

            let minute = String(parseInt((second - hour * 3600) / 60));
            minute = fill_zero(minute);
            let sec = String(second % 60);
            sec = fill_zero(sec);
            if (mode) {
                return hour + "：" + minute + "：" + sec;
            }
            else {
                return hour + ":" + minute + ":" + sec;
            }
        },
        format_color: function (num) {
            let str = num.toString(16);
            if (num < 16) {
                return "0" + str + "0" + str;
            }
            else {
                return "" + str + "" + str;
            }
        },
        detect_place: function (ip) {
            if (!ip) {
                return "未知";
            }
            return utils.detectIP({
                intranet_ip: ip,
                place: ""
            });
        },
        convertHTML: function (str) {
            let d = document.createElement("div");
            d.innerHTML = str;
            return d.innerText;
        },
        decodeHTML: function (str) {
            if (typeof str !== "string") {
                str = "";
            }
            return str.replace("·", "&middot;");
        },
        exportXLS: function () {
            let doc = document.getElementById("save");
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
            // const wopts = { bookType: 'csv', bookSST: false, type: 'binary' };//ods格式
            // const wopts = { bookType: 'ods', bookSST: false, type: 'binary' };//ods格式
            // const wopts = { bookType: 'xlsb', bookSST: false, type: 'binary' };//xlsb格式
            // const wopts = { bookType: 'fods', bookSST: false, type: 'binary' };//fods格式
            // const wopts = { bookType: 'biff2', bookSST: false, type: 'binary' };//xls格式

            function downloadExl (data, type) {
                const wb = { SheetNames: ["Sheet1"], Sheets: {}, Props: {} };
                wb.Sheets["Sheet1"] = XLSX.utils.table_to_sheet(data);// 通过json_to_sheet转成单页(Sheet)数据
                saveAs(new Blob([s2ab(XLSX.write(wb, wopts))], { type: "application/octet-stream" }), "这里是下载的文件名" + "." + (wopts.bookType === "biff2" ? "xls" : wopts.bookType));
            }

            function s2ab (s) {
                if (typeof ArrayBuffer !== "undefined") {
                    let buf = new ArrayBuffer(s.length);
                    let view = new Uint8Array(buf);
                    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                    return buf;
                }
                else {
                    let buf = new Array(s.length);
                    for (let i = 0; i !== s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
                    return buf;
                }
            }

            // downloadExl(doc);
            let blob;
            blob = new Blob([XLSContentHTML], { type: "application/vnd.ms-excel;charset=UTF-8;" });
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
        },
        handleNewSubmit: function (data) {
            if (parseInt(data.contest_id) === parseInt(this.cid)) {
                if (data.finish === 1) {
                    let ndata = {
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
    },
    watch: {
        auto_update: function () {
            while (this.waiting_queue.length > 0) {
                this.scoreboard = this.waiting_queue.shift();
            }
        },
        add_name: function (newVal) {
            let that = this;
            if (!newVal) return;
            for (let i = 0; i < this.submitter.length; ++i) {
                $.get("/api/user/nick/" + this.decodeHTML(this.submitter[i].nick), function (data) {
                    if (data && data.data && data.data.length > 0) {
                        let nick = data.nick;
                        let nickArray = data.data;
                        let user_id = "";
                        for (let j = 0; j < nickArray.length; ++j) {
                            if (!isNaN(nickArray[j].user_id)) {
                                user_id = nickArray[j].user_id;
                                break;
                            }
                        }
                        for (let j = 0; j < that.submitter.length; ++j) {
                            if (that.decodeHTML(that.submitter[j].nick) === nick) {
                                that.submitter[j].real_name = user_id;
                                break;
                            }
                        }
                    }
                });
            }
        }
    },
    updated: function () {
        const newTitle = "ContestRank: " + this.title;
        if (document.title !== newTitle) {
            document.title = newTitle;
        }
        $("#rank").find("tr").each(function () {
            $(this).find("td").eq(2).css({
                position: "sticky",
                left: $(this).find("td").eq(2).prev().outerWidth() + $(this).find("td").eq(1).prev().outerWidth(),
                borderRight: "1px solid rgba(34,36,38,.1)"
            });
            $(this).find("td").eq(1).css({
                position: "sticky",
                left: $(this).find("td").eq(1).prev().outerWidth()
            });
        });
    },
    mounted: function () {
        window.datas = [];
        submissionCollection = [];
        document.title = `Contest Rank ${this.cid} -- ${document.title}`;
        const that = this;
        bindDragEvent();
        (() => {
            let cid = this.$route.params.contest_id;
            let cidArr = [];
            if (cid.indexOf(",") !== -1) {
                cidArr = cid.split(",");
            }
            else {
                cidArr = [cid];
            }
            let cnt = 0;
            let data = [];
            let users = new Set();
            let finished = false;

            function work () {
                cid = cidArr.shift();
                $.get("/api/scoreboard/" + cid, () => {
                    $.get("/api/scoreboard/" + cid, function (d) {
                        if (d.status !== "OK") {
                            that.state = false;
                            that.submitter = {};
                            let str;
                            if (d.contest_mode === true) {
                                str = "根据设置，内容非公开";
                            }
                            else {
                                str = "Contest " + cid + ":\n" + d.statement;
                            }
                            str = str.replace(/\n/g, "<br>");
                            that.errormsg = str;
                            return;
                        }
                        _.forEach(d.data, function (val) {
                            val.num += cnt;
                            val.start_time = dayjs(d.start_time);
                        });
                        _.forEach(d.data, function (val) {
                            data.push(val);
                        });
                        _.forEach(d.users, function (val) {
                            users.add(val);
                        });

                        cnt += d.total;

                        if (cidArr.length > 0) {
                            convertFlag = true;
                            work();
                        }
                        else {
                            finished = true;
                            that.total = cnt;
                            that.users = Array.from(users);
                            that.scoreboard = data;
                        }
                    });
                });
            }

            if (cidArr.length > 1) {
                that.title = cidArr.join(",");
                work();
            }
            else {
                cid = cidArr.shift();
                $.get("/api/scoreboard/" + cid, () => {
                    $.get("/api/scoreboard/" + cid, function (d) {
                        if (d.status !== "OK" && !d.statement) {
                            that.state = false;
                            that.submitter = {};
                            let str = "根据设置，内容非公开";
                            str = str.replace(/\n/g, "<br>");
                            that.errormsg = str;
                            return;
                        }
                        finished = true;
                        that.total = d.total;
                        that.users = d.users;
                        that.start_time = window.start_time = dayjs(d.start_time);
                        _.forEach(d.data, function (val) {
                            val.start_time = dayjs(d.start_time);
                        });

                        that.scoreboard = d.data;
                        submissionCollection = d.data;
                        data = d.data;
                        if (typeof d.title === "string" && d.title.length === 0) {
                            d.title = "未设置标题";
                        }
                        that.title = d.title;
                    });
                });
            }
        })();
    },
    sockets: {
        submit: function (data) {
            this.handleNewSubmit(data);
        },
        result: function (data) {
            this.handleNewSubmit(data);
        }
    }
};
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
        background: #FFD700;
        color: #000 !important;
    }

    .ui.orange {
        background-color: #FE9A76;
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
