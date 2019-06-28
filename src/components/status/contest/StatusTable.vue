<template>
    <table class="ui padded selectable unstackable table" align="center" width="90%" v-if="finish">
        <thead v-cloak>
        <tr class='toprow'>
            <th width="7%">{{$t("solution_id")}}</th>
            <th width="18%"><div class="ui grid">
            <div class="four wide column"></div><div class="twelve wide column">{{$t("user")}}</div></div></th>
            <th width="10%">{{$t("problem_id")}}</th>
            <th width="15%">{{$t("result")}}</th>
            <th width="10%">{{$t("memory")+"/"+$t("time")}}</th>
            <th width="13%">{{$t("language")+"/"+$t("length")}}</th>
            <th width="18%">{{$t("submit_time")}}</th>
            <th width="9%">{{$t("judger")}}</th>
        </tr>
        </thead>
        <transition-group name="list-complete" tag="tbody">
        <tr :key="row.solution_id" v-for="row in problem_lists" :class="(row.sim?'warning need_popup':'need_popup') + ' list-complete-item'" :data-html="'<b>IP:'+row.ip+'</b><br><p>类型:'+detect_place(row.ip)+'</p><p>用户指纹:<br>'+row.fingerprint+'<br>硬件指纹:<br>'+row.fingerprintRaw+'</p>'">
            <td>{{row.solution_id}}</td>
            <td><div class="ui grid">
            <div class="four wide column" style="margin:auto">
            <img class="ui avatar image" :src="getAvatarURL(row)" style="object-fit: cover;">
            </div>
            <div class="twelve wide column">
                <router-link :to="`/user/${row.user_id}`">{{row.user_id}}<br>{{row.nick}}</router-link>
            </div>
            </div>
            </td>
            <td>
                <div class=center>
                    <router-link :to="`/contest/problem/${Math.abs(row.contest_id)}/${row.num}`">{{end?((row.oj_name === "local"?"":row.oj_name.toUpperCase())+row.problem_id):(row.num + 1001)}}</router-link>
                </div>
            </td>
            <td>
                <router-link :to="`/status/info/${infoRoute(row.result)}/${row.solution_id}`" :class="answer_class[row.result]">
                    <i v-cloak :class="answer_icon[row.result]+' icon'"></i>
                    {{result[row.result]}}
                </router-link>
                    <router-link v-if="row.sim" :to="`/compare/${row.solution_id}/${row.sim_id}`" :class="answer_class[row.result]">
                        <br>
                        <i :class="answer_icon[row.result]+' icon'" style="opacity:0" v-if="!!row.sim"></i>{{(Boolean(row.sim) === false?'':row.sim_id+' ('+row.sim+'%)')}}
                    </router-link>
                   <br>
                   <a :class="answer_class[row.result]" v-if="row.result !== 4 && row.pass_rate > 0.05"><i :class="answer_icon[row.result]+' icon'" style="opacity:0"></i>Passed:{{(row.pass_rate*100).toString().substring(0,4)}}%</a>

            </td>
            <td>
                <div id=center>
                <span class="boldstatus">{{memory_parse(row.memory)}}</span>
                <br>
                <span class="boldstatus">{{time_parse(row.time)}}</span></div>
            </td>
            <td>
                <router-link class="boldstatus" v-if="self === row.user_id || isadmin" :to="`/usercode/local/${row.solution_id}`">查看</router-link>
                <span class="boldstatus" v-else>{{language_name[(!row.oj_name?'local':row.oj_name.toLowerCase())][row.language]}}</span>
                <span v-if="(self === row.user_id || isadmin) && row.problem_id"> / </span>
                <router-link class="boldstatus" v-if="(self === row.user_id || isadmin) && row.problem_id" :to="`/contest/problem/${Math.abs(row.contest_id)}/${row.num}/${row.solution_id}`"
                >编辑</router-link>
                <br>
                <span class="boldstatus" v-if="self === row.user_id || isadmin">{{language_name[(!row.oj_name?'local':row.oj_name.toLowerCase())][row.language]}}  / </span>
                <span class="boldstatus">{{row.length}}B</span>
            </td>
            <td>{{new Date(row.in_date).toLocaleString()}}<br><p>类型:{{detect_place(row.ip)}}</p></td>
            <td>{{row.judger}}</td>
        </tr>
        </transition-group>
    </table>
</template>

<script>
import utils from "../../../lib/util";
import avatarMixin from "../../../mixin/avatarMixin";
const _ = require("lodash");
export default {
    name: "StatusTable",
    mixins: [avatarMixin],
    props: {
        problem_list: Array,
        answer_icon: Array,
        answer_class: Array,
        target: Object,
        language_name: Object,
        result: Array,
        self: String,
        isadmin: Boolean,
        end: Boolean,
        finish: Boolean
    },
    data: function () {
        return {
            problem_alpha: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
            user: {}
        };
    },
    methods: {
        memory_parse: function (_memory) {
            var unit = ["KB", "MB", "GB"];
            var cnt = 0;
            var memory = parseInt(_memory);
            if (isNaN(memory)) {
                return _memory;
            }
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
            if (isNaN(time)) {
                return _time;
            }
            while (time > 1000) {
                ++cnt;
                time /= 1000;
            }
            return time.toString().substring(0, 5) + unit[cnt];
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
        infoRoute: function (result) {
            if (parseInt(result) === 11) {
                return "compile";
            }
            return "runtime";
        }
    },
    computed: {
        problem_lists: function () {
            var that = this;
            _.forEach(this.problem_list, function (i) {
                that.user[i.user_id] = that.user[i.user_id] || i;
            });
            var doc = document.createElement("div");
            let temp;
            for (let i in this.problem_list) {
                doc.innerHTML = this.problem_list[i].nick;
                temp = this.problem_list[i];
                temp.nick = doc.innerText;
            }
            return this.problem_list;
        }
    }
};
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
        position: absolute;
        transform: translateX(-31px);
    }
</style>
