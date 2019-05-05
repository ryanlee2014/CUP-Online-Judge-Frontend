<template>
    <table class="ui padded selectable unstackable table" align="center" width="90%" v-cloak>
        <thead>
        <tr class='toprow'>
            <th width="8%">{{target.solution_id}}</th>
            <th>
                <div class="ui grid">
                    <div class="four wide column"></div>
                    <div class="twelve wide column">{{target.user}}</div>
                </div>
            </th>
            <th>{{target.problem_id}}</th>
            <th width="14%">{{target.result}}</th>
            <th v-if="isadmin">{{target.contest_id}}</th>
            <th>{{target.memory}}/{{target.time}}</th>
            <th>{{target.language}}/{{target.length}}</th>
            <th>{{target.submit_time}}/{{target.judger}}</th>
        </tr>
        </thead>
        <tbody>
        <tr :key="row.solution_id" v-for="row in problem_lists" :class="row.sim?'warning':''"
            :data-html="'<b>IP:'+row.ip+'</b><br><p>类型:'+detect_place(row.ip)+'</p><p>用户指纹:<br>'+row.fingerprint+'<br>硬件指纹:<br>'+row.fingerprintRaw+'</p>'">
            <td>{{row.solution_id}}</td>
            <td>
                <div class="ui grid">
                    <div class="three wide column" style="margin:auto">
                        <img class="ui avatar image" :src="'../avatar/'+row.user_id+'.jpg'"
                             v-if="row.avatar||user[row.user_id].avatar" style="object-fit: cover;">
                        <img class="ui avatar image" src="../../static/image/default-user.png" v-else style="object-fit: cover;">
                    </div>
                    <div class="twelve wide column">
                        <a :href="'userinfo.php?user='+row.user_id">{{row.user_id}}<br>{{row.nick}}</a>
                    </div>
                </div>
            </td>
            <td>
                <div class=center><a :href="'newsubmitpage.php?id='+Math.abs(row.problem_id)">{{Math.abs(row.problem_id)}}</a>
                </div>
            </td>
            <td><a :href="(row.result == 11?'ce':'re')+'info.php?sid='+row.solution_id"
                   v-cloak :class="answer_class[row.result]" title='点击看详细'><i v-cloak
                                                                              :class="answer_icon[row.result]+' icon'"></i>{{result[row.result]}}</a>
                <br v-if="row.sim||row.pass_rate>0.05 || row.result == 3">
                <a v-if="row.result == 3 && !!row.pass_point && !!row.total_point" :class="answer_class[row.result]"
                   v-cloak><i :class="answer_icon[row.result]+' icon'" style="opacity:0"></i>({{row.pass_point ||
                    0}}/{{row.total_point || 0}})</a>
                <a v-if="row.sim" :href="'comparesource.php?left='+row.solution_id+'&right='+row.sim_id" v-cloak
                   :class="answer_class[row.result]">
                    <br v-if="row.result == 3">
                    {{(Boolean(row.sim) === false?'':row.sim_id+' ('+row.sim+'%)')}}
                </a>
                <a :class="answer_class[row.result]" v-if="row.result !== 4 && row.pass_rate > 0.05"><i
                        :class="answer_icon[row.result]+' icon'" style="opacity:0"></i>Passed:{{(row.pass_rate*100).toFixed(1)}}%</a>

            </td>
            <td v-if="isadmin"><a v-if="row.contest_id" :href="'contest.php?cid='+row.contest_id">{{row.contest_id}}</a><span
                    v-else>无</span></td>
            <td>
                <div><span class="boldstatus">{{memory_parse(row.memory)}}</span><br><span class="boldstatus">{{time_parse(row.time)}}</span>
                </div>
            </td>
            <td><a class="boldstatus" v-if="self === row.user_id || isadmin || row.share == 1" target=_blank
                   :href="'showsource.php?id='+row.solution_id">查看</a>
                <span class="boldstatus" v-else>{{language_name[row.language]}}</span>
                <span v-if="(self === row.user_id || isadmin || row.share == 1) && row.problem_id"> / </span>
                <a class="boldstatus" v-if="(self === row.user_id || isadmin || row.share == 1) && row.problem_id"
                   target="_blank"
                   :href="'newsubmitpage.php?id='+Math.abs(row.problem_id)+'&sid='+Math.abs(row.solution_id)">编辑</a>
                <br>
                <span class="boldstatus" v-if="(self === row.user_id || isadmin || row.share == 1)">{{language_name[row.language]}} / </span>
                <span class="boldstatus">{{row.length}}B</span>
            </td>
            <td>{{dayjs(row.in_date).format("YYYY-MM-DD HH:mm:ss")}}<br>{{row.judger}}</td>
        </tr>
        </tbody>
    </table>
</template>

<script>
    import util from "../../lib/util"
    const _ = require("lodash");
    const dayjs = require("dayjs");
    export default {
        name: "status-table",
        props: {
            problem_list: Array,
            answer_icon: Array,
            answer_class: Array,
            target: Object,
            language_name: Array,
            result: Array,
            self: String,
            isadmin: Boolean
        },
        data: function () {
            return {
                user:{},
                dayjs
            };
        },
        methods: {
            memory_parse: function (_memory) {
                var unit = ["KB", "MB", "GB"];
                var cnt = 0;
                var memory = parseInt(_memory);
                while (memory > 1024) {
                    memory /= 1024;
                    ++cnt;
                }
                return memory.toString().substring(0, 5) + unit[cnt];
            },
            time_parse: function (_time) {
                var unit = ["ms", "s"];
                var cnt = 0;
                var time = parseInt(_time);
                while (time > 1000) {
                    ++cnt;
                    time /= 1000;
                }
                return time.toString().substring(0, 5) + unit[cnt];
            },
            detect_place: function(ip) {
                if(!ip) {
                    return "未知";
                }
                var tmp = {
                    intranet_ip:ip,
                    place:""
                };
                util.detectIP(tmp);
                return tmp.place;
            }
        },
        computed: {
            problem_lists: function () {
                var that = this;
                _.forEach(this.problem_list,function(i){
                    that.user[i.user_id] = that.user[i.user_id] || i;
                })
                var doc = document.createElement("div");
                _.forEach(this.problem_list,function(val,i){
                    doc.innerHTML = that.problem_list[i].nick;
                    that.problem_list[i].nick = doc.innerText;
                })
                return this.problem_list;
            }
        }
    }
</script>

<style scoped>

</style>
