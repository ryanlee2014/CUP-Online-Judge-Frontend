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
                    <button class="ui primary button" @click="playRanklist" v-if="!playing">播放排名变化</button>
                    <button class="ui primary button" @click="stopPlayRanklist" v-else>停止</button>
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
                            <tr class="list-complete-item" :key="key" v-for="(row,key) in submitter">
                            <td :class="rankClass(row.rank, submitter.length)" style="text-align:center;font-weight:bold;position: sticky; left: 0">{{row.rank}}</td>
                            <td class="ui white">
                                <router-link :to="`/user/${row.user_id}`">{{row.user_id}}</router-link>
                            </td>
                            <td class="ui white">
                                <router-link :to="`/user/${row.user_id}`">{{convertHTML(row.nick)}}</router-link>
                            </td>
                            <td style="text-align:center" v-if="add_name">{{convertHTML(row.real_name)}}</td>
                            <td style="text-align:center">
                                <router-link :to="`/contest/status/${cid}?user_id=${row.user_id}`">{{row.ac}}</router-link>
                            </td>
                            <td style="text-align:center">{{format_date(row.penalty_time)}}</td>
                            <td :key="key" :class="p.accept.length > 0?p.first_blood ? 'first accept':'accept':''"
                                style="text-align:center"
                                v-for="(p,key) in row.problem">
                                <b :class="'text '+ (p.accept.length > 0 ? p.first_blood?'first accept':'accept':'red')">
                                    {{ (p.accept.length > 0 || p.submit.length > 0)?'+':''}}
                                    {{p.try_time > 0 ? p.try_time : p.accept.length == 0 && p.submit.length >
                                    0?p.submit.length : ""}}</b>
                                <br v-if="p.accept.length > 0">
                                <span :class="p.first_blood?'first accept text':''"
                                      v-if="p.accept.length > 0 && typeof p.accept[0].diff === 'function'">
                {{format_date(p.accept[0].diff(p.start_time,'second'))}}
            </span>
                            </td>
                        </tr>
                        </transition-group>
                    </table>
                    <table id="save" :style="'display:none;vnd.ms-excel.numberformat:@'">
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
                            <td>{{row.handwareFingerprintSet.size}}</td>
                            <td>{{row.ipSet.size}}</td>
                            <td>{{row.ipSet.size === 1 ? detect_place(Array.from(row.ipSet)[0]) : row.ipSet.size ===
                                0?"无":"略"}}
                            </td>
                            <td :bgcolor="'#FF' + (format_color(Math.max(Math.floor((1 << 8) - (256 * Math.max(p.sim - 69,0) / 31.0)) - 1, 0)))"
                                :key="key"
                                align="left" v-for="(p,key) in row.problem">
                                {{ (p.submit.length > 0)?'(-':''}}{{p.try_time > 0 ? p.try_time + ")" : p.submit.length
                                > 0?p.submit.length + ")" : ""}}{{p.accept.length > 0 ?
                                format_date(p.accept[0].diff(p.start_time,'second')):""}}{{p.sim > 0?"("+p.sim +
                                "%)":''}}
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
    import mixins from '../../mixin/init'
    import { saveAs } from 'file-saver';
    import utils from '../../lib/util'
    import TimeView from '../../components/contest/ContestRank/timeView'
    import ErrorView from '../../components/contest/ContestRank/errorView'
    const _ = require("lodash");
    const dayjs = require("dayjs");
    const XLSX = require("xlsx");
    const $ = window.$ = window.jQuery = require("jquery");
    const {reset: bindDragEvent} = require("dragscroll");
    require("../../static/js/semantic.min");
    let temp_data = [];
    let convert_flag = false;

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
                backup_data: []
            }
        },
        computed: {
            scoreboard: {
                get: () => undefined,
                set: function (val) {
                    var that = this;
                    var total = this.total;
                    console.warn(val);
                    console.time = console.time || function () {
                    };
                    console.timeEnd = console.timeEnd || function () {
                    };
                    try {
                        console.time("count scoreboard use time");
                        if (val && val.length) {
                            temp_data = temp_data.concat(val);
                        } else {
                            temp_data.push(val);
                        }
                        val = temp_data;
                        console.time("part");
                        console.time("init submitter");
                        var first_blood = [];
                        var first_blood_person = {};
                        for (var i = 0; i < that.total; ++i) {
                            first_blood.push(parseInt(1e11));
                            first_blood_person[i] = -1;
                        }
                        var submitter = this.submitter = {};
                        _.forEach(this.users, function (val) {
                            if (!submitter[val.user_id]) {
                                submitter[val.user_id] = {
                                    ac: 0,
                                    nick: val.nick ? val.nick.trim() : "未注册",
                                    problem: {},
                                    penalty_time: 0,
                                    fingerprintSet: new Set(),
                                    handwareFingerprintSet: new Set(),
                                    ipSet: new Set(),
                                    real_name: ""
                                }
                                for (var j = 0; j < total; ++j) {
                                    submitter[val.user_id].problem[j] = {
                                        submit: [],
                                        accept: [],
                                        sim: 0
                                    }
                                }
                            }
                        });
                        console.timeEnd("init submitter");
                        var len = val.length;
                        var private_contest = this.users.length > 0;
                        console.time("generate submitter");
                        for (let i = 0; i < len; ++i) {

                            if (!val[i].nick) continue;
                            val[i].nick = val[i].nick.trim();
                            if (val[i].user_id.charAt(0) == 'g') {
                                val[i].user_id = "G" + val[i].user_id.substring(1);
                            }
                            if (!submitter[val[i].user_id]) {
                                if (private_contest) {
                                    continue;
                                }
                                submitter[val[i].user_id] = {
                                    ac: 0,
                                    nick: val[i].nick,
                                    problem: {},
                                    penalty_time: 0,
                                    fingerprintSet: new Set(),
                                    handwareFingerprintSet: new Set(),
                                    ipSet: new Set(),
                                    real_name: ""
                                }
                                for (var j = 0; j < total; ++j) {
                                    submitter[val[i].user_id].problem[j] = {
                                        submit: [],
                                        accept: [],
                                        sim: 0
                                    }
                                }
                            }

                            if (typeof submitter[val[i].user_id].problem[val[i].num] === "undefined") {
                                continue;
                            }
                            if (val[i].fingerprint) {
                                submitter[val[i].user_id].fingerprintSet.add(val[i].fingerprint);
                            }
                            if (val[i].fingerprintRaw) {
                                submitter[val[i].user_id].handwareFingerprintSet.add(val[i].fingerprintRaw);
                            }
                            if (val[i].ip) {
                                submitter[val[i].user_id].ipSet.add(val[i].ip);
                            }
                            if (val[i].sim !== null) {
                                submitter[val[i].user_id].problem[val[i].num].sim = parseInt(val[i].sim);
                            }
                            if (submitter[val[i].user_id].problem[val[i].num] === undefined) {
                                continue;
                            }
                            if (val[i].result == 4) {
                                //console.log(val[i]);
                                submitter[val[i].user_id].problem[val[i].num].accept.push(
                                    val[i].in_date
                                );
                                submitter[val[i].user_id].problem[val[i].num].start_time = val[i].start_time;
                            } else if (val[i].result >= 5 && val[i].result <= 10) {
                                submitter[val[i].user_id].problem[val[i].num].submit.push(
                                    val[i].in_date
                                );
                                submitter[val[i].user_id].problem[val[i].num].start_time = val[i].start_time;
                            }
                        }
                        console.timeEnd("generate submitter");
                        var _submitter = [];
                        console.time("copy submitter");
                        _.forEach(submitter, function (val, index) {
                            if (!index) {
                                console.log(val);
                                console.log(index);
                            } else {
                                val.user_id = index;
                                _submitter.push(val);
                            }
                        });
                        console.timeEnd("copy submitter");

                        that.submitter = _submitter;
                        console.time("count penalty");
                        _.forEach(submitter, function (value, key) {
                            var problems = submitter[key].problem;
                            _.forEach(problems, function (value) {
                                _.forEach(value.submit, function (val, key) {
                                    value.submit[key] = dayjs(val);
                                })
                                if (value.accept.length > 0) {
                                    _.forEach(value.accept, function (val, key) {
                                        value.accept[key] = dayjs(val);
                                    })
                                    var accept_submit = value.accept[0];
                                    var penalty_time = 0;
                                    _.forEach(value.submit, function (val, key) {
                                        if (val.isBefore(accept_submit)) {
                                            ++penalty_time;
                                        }
                                    })
                                    value.try_time = penalty_time;
                                    penalty_time *= 1200;
                                    ++submitter[key].ac;
                                    submitter[key].penalty_time += penalty_time;
                                }
                            })
                            // console.log(submitter[key]);
                        })
                        console.timeEnd("count penalty");
                        // console.log(submitter);
                        console.time("first blood time");
                        _.forEach(_submitter, function (val) {
                            _.forEach(val.problem, function (v, idx) {
                                if (v.accept.length > 0) {
                                    var difftime = v.accept[0].diff(v.start_time, 'second');
                                    val.penalty_time += difftime;
                                    var prev = first_blood[idx];
                                    if (difftime < prev) {
                                        first_blood[idx] = difftime;
                                        if (first_blood_person[idx] === -1) {
                                            first_blood_person[idx] = v;
                                            v.first_blood = true;
                                        } else {
                                            first_blood_person[idx].first_blood = false;
                                            first_blood_person[idx] = v;
                                            v.first_blood = true;
                                        }
                                    }
                                }
                            })
                        })
                        console.timeEnd("first blood time");

                        console.time("sort");
                        _submitter.sort(function (a, b) {
                            if (a.ac != b.ac) {
                                return b.ac - a.ac;
                            } else {
                                return a.penalty_time - b.penalty_time;
                            }
                        });
                        console.timeEnd("sort");
                        var rnk = 1;
                        console.time("rank");
                        _.forEach(_submitter, function (val) {
                            if (val.ac > 0)
                                val.rank = rnk++;
                            else
                                val.rank = rnk;
                        });
                        console.timeEnd("rank");
                        console.timeEnd("part");
                        window.datas = _submitter;
                        console.timeEnd("count scoreboard use time");
                    } catch (e) {
                        that.state = false;
                        that.submitter = {};
                        console.log(e);
                        var str = e.stack;
                        str = str.replace(/\n/g, "<br>");
                        that.errormsg = str;
                    }
                }
            }
        },
        methods: {
            rankClass(rank, total) {
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
            playRanklist() {
                this.auto_update = false;
                this.playing = true;
                const backup_temp_data = this.backup_data = temp_data;
                backup_temp_data.sort((a, b) => {
                    const atime = dayjs(a.in_date);
                    const btime = dayjs(b.in_date);
                    return atime.isAfter(btime) ? 1 : -1;
                });
                temp_data = [];
                this.submitter = {};
                this.playInterval = setInterval(() => {
                    this.scoreboard = backup_temp_data.shift();
                },30);
                console.log(this.playInterval);
            },
            stopPlayRanklist() {
                this.playing = false;
                clearInterval(this.playInterval);
                this.scoreboard = this.backup_data;
                this.backup_data = [];
                this.auto_update = true;
            },
            format_date: function (second, mode = 0) {
                const fill_zero = function (str) {
                    if (str.length < 2) {
                        return "0" + str;
                    } else {
                        return str;
                    }
                };
                let hour = String(parseInt(second / 3600));
                hour = fill_zero(hour);

                var minute = String(parseInt((second - hour * 3600) / 60));
                minute = fill_zero(minute);
                var sec = String(second % 60);
                sec = fill_zero(sec);
                if (mode) {
                    return hour + "：" + minute + "：" + sec;
                } else
                    return hour + ":" + minute + ":" + sec;
            },
            format_color: function (num) {
                let str = num.toString(16);
                if (num < 16) {
                    return "0" + str + "0" + str;
                } else {
                    return "" + str + "" + str;
                }
            },
            detect_place: function (ip) {
                if (!ip) {
                    return "未知";
                }
                var tmp = {
                    intranet_ip: ip,
                    place: ""
                };
                utils.detectIP(tmp);
                return tmp.place;
            },
            convertHTML: function (str) {
                var d = document.createElement("div");
                d.innerHTML = str;
                return d.innerText;
            },
            decodeHTML: function (str) {
                return str.replace("·", "&middot;");
            },
            exportXLS: function () {
                var doc = document.getElementById("save");
                var plain_text = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">' + "<head><meta http-equiv='Content-Type' content='application/vnd.ms-excel; charset=utf-8' /></head>";
                plain_text += "<center><h3>Contest " + this.cid + " " + this.title + "</h3></center>";
                plain_text += "<table border=1>" + doc.innerHTML.replace("<tbody>", "").replace("</tbody>", "");
                plain_text += "<tr><td colspan='8'>环境指纹指根据用户的硬件环境及IP地址不同而产生的不同的指纹</td></tr>";
                plain_text += "<tr><td colspan='8'>硬件指纹指的是不受IP影响的指纹</td></tr>";
                plain_text += "<tr><td colspan='8'>若环境指纹与硬件指纹均唯一，代表用户使用相同设备在相同地点完成提交</td></tr>";
                plain_text += "<tr><td colspan='8'>若硬件指纹唯一而环境指纹不唯一，代表同型号机器在不同IP地址提交</td></tr>";
                plain_text += "<tr><td colspan='8'>若硬件指纹不唯一，代表使用了多台设备进行提交</td></tr>";
                plain_text += "</table></html>";
                const wopts = {bookType: 'xlsx', bookSST: false, type: 'binary'};//这里的数据是用来定义导出的格式类型
                // const wopts = { bookType: 'csv', bookSST: false, type: 'binary' };//ods格式
                // const wopts = { bookType: 'ods', bookSST: false, type: 'binary' };//ods格式
                // const wopts = { bookType: 'xlsb', bookSST: false, type: 'binary' };//xlsb格式
                // const wopts = { bookType: 'fods', bookSST: false, type: 'binary' };//fods格式
                // const wopts = { bookType: 'biff2', bookSST: false, type: 'binary' };//xls格式

                function downloadExl(data, type) {
                    const wb = {SheetNames: ['Sheet1'], Sheets: {}, Props: {}};
                    wb.Sheets['Sheet1'] = XLSX.utils.table_to_sheet(data);//通过json_to_sheet转成单页(Sheet)数据
                    saveAs(new Blob([s2ab(XLSX.write(wb, wopts))], {type: "application/octet-stream"}), "这里是下载的文件名" + '.' + (wopts.bookType == "biff2" ? "xls" : wopts.bookType));
                }

                function s2ab(s) {
                    if (typeof ArrayBuffer !== 'undefined') {
                        let buf = new ArrayBuffer(s.length);
                        let view = new Uint8Array(buf);
                        for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                        return buf;
                    } else {
                        let buf = new Array(s.length);
                        for (let i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
                        return buf;
                    }
                }

                //downloadExl(doc);
                console.log(plain_text);
                var blob;
                blob = new Blob([plain_text], {type: 'application/vnd.ms-excel;charset=UTF-8;'});
                if (convert_flag) {
                    saveAs(blob, "Contest " + this.cid + " 多个contest.xls");
                } else
                    saveAs(blob, "Contest " + this.cid + " " + this.title + ".xls");
                //var table = TableExport(document.getElementById("save"));
                //var d = table.getExportData().save.xlsx;
                //var filename = "Contest " + this.cid;
                //filename = filename.substring(0,31);
                //table.export2file(d.data,d.mimeType,filename,d.fileExtension,d.merges)
            },
            handleNewSubmit: function (data) {
                console.log("handled", data);
                if (parseInt(data.contest_id) === parseInt(this.cid)) {
                    console.log("in");
                    if (data.finish === 1) {
                        var ndata = {
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
                        } else {
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
                var that = this;
                if (!newVal) return;
                for (var i = 0; i < this.submitter.length; ++i) {
                    $.get("/api/user/nick/" + this.decodeHTML(this.submitter[i].nick), function (data) {
                        if (data && data.data && data.data.length > 0) {
                            var nick = data.nick;
                            var nickArray = data.data;
                            var user_id = "";
                            for (let j = 0; j < nickArray.length; ++j) {
                                if (!isNaN(nickArray[j].user_id)) {
                                    user_id = nickArray[j].user_id;
                                    break;
                                }
                            }
                            for (let j = 0; j < that.submitter.length; ++j) {
                                if (that.decodeHTML(that.submitter[j].nick) == nick) {
                                    that.submitter[j].real_name = user_id;
                                    break;
                                }
                            }
                            //that.submitter[i].real_name = "t";
                        }
                    })
                }

            }
        },
        updated: function () {
            const new_title = "ContestRank: " + this.title;
            if (document.title !== new_title) {
                document.title = new_title;
            }
            $("#rank").find("tr").each(function(i) {
                $(this).find("td").eq(2).css({
                    position: "sticky",
                    left: $(this).find("td").eq(2).prev().outerWidth() + $(this).find("td").eq(1).prev().outerWidth(),
                    borderRight: "1px solid rgba(34,36,38,.1)"
                });
                $(this).find("td").eq(1).css({
                    position: "sticky",
                    left: $(this).find("td").eq(1).prev().outerWidth()
                })
            })
        },
        mounted: function () {
            window.datas = [];
            temp_data = [];
            document.title = `Contest Rank ${this.cid} -- ${document.title}`;
            const that = this;
            bindDragEvent();
            (() => {
                var cid = this.$route.params.contest_id;
                var cidArr = [];
                if(cid.indexOf(",")!== -1) {
                    cidArr = cid.split(",");
                }
                else {
                    cidArr = [cid];
                }
                var cnt = 0;
                var data = [];
                var users = new Set();
                var finished = false;
                function work(){
                    cid = cidArr.shift();
                    $.get("/api/scoreboard/"+cid, () => {
                        $.get("/api/scoreboard/"+cid,function(d){
                            if(d.status !== "OK") {
                                that.state = false;
                                that.submitter = {};
                                let str;
                                if(d.contest_mode === true) {
                                    str ="根据设置，内容非公开";
                                }
                                else {
                                    str = "Contest " + cid +":\n" +  d.statement;
                                }
                                str = str.replace(/\n/g,"<br>");
                                that.errormsg = str;
                                return;
                            }
                            _.forEach(d.data,function(val,idx){
                                val.num += cnt;
                                val.start_time = dayjs(d.start_time);
                            });
                            _.forEach(d.data,function(val){
                                data.push(val);
                            });
                            _.forEach(d.users, function(val){
                                users.add(val);
                            });

                            cnt += d.total;

                            if(cidArr.length > 0) {
                                convert_flag = true;
                                work();
                            }
                            else {
                                finished = true;
                                that.total = cnt;
                                that.users = Array.from(users);
                                that.scoreboard = data;
                            }
                        });
                    })
                }
                if(cidArr.length > 1) {
                    that.title = cidArr.join(",");
                    work();
                }
                else {
                    cid = cidArr.shift();
                    $.get("/api/scoreboard/"+cid, () => {
                        $.get("/api/scoreboard/"+cid,function(d){
                            if(d.status != "OK" && !d.statement) {
                                that.state = false;
                                that.submitter = {};
                                var str ="根据设置，内容非公开";
                                str = str.replace(/\n/g,"<br>");
                                that.errormsg = str;
                                return;
                            }
                            finished = true;
                            that.total = d.total;
                            that.users = d.users;
                            that.start_time = window.start_time = dayjs(d.start_time);
                            _.forEach(d.data,function(val){
                                val.start_time = dayjs(d.start_time);
                            });

                            that.scoreboard = d.data;
                            temp_data = d.data;
                            data = d.data;
                            if(typeof d.title === "string" && d.title.length === 0) {
                                d.title = "未设置标题";
                            }
                            that.title = d.title;
                        });
                    })
                }
            })()
        },
        sockets: {
            submit: function (data) {
                this.handleNewSubmit(data);
            },
            result: function (data) {
                this.handleNewSubmit(data);
            }
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
        white-space: nowrap!important;
        text-align: center!important;
    }

    .ui.table thead tr:first-child > th {
        position: sticky !important;
        top: 0;
        z-index: 2;
    }

    .list-complete-item {
        transition: all 1s;
        display: table-row;
    }
    .list-complete-enter, .list-complete-leave-to
        /* .list-complete-leave-active for below version 2.1.8 */ {
        opacity: 0;
        transform: translateY(30px);
    }
    .list-complete-leave-active {
        position: absolute;
    }


</style>
