<template>
    <table align="center" class="ui padded selectable unstackable table" v-cloak width="90%">
        <thead>
        <tr class='toprow'>
            <th width="8%">{{$t("solution_id")}}</th>
            <th>
                <div class="ui grid">
                    <div class="four wide column"></div>
                    <div class="twelve wide column">{{$t("user_id")}}</div>
                </div>
            </th>
            <th>{{$t("problem_id")}}</th>
            <th width="14%">{{$t("result")}}</th>
            <th v-if="isadmin">{{$t("contest_id")}}</th>
            <th>{{$t("memory")}}/{{$t("time")}}</th>
            <th>{{$t("language")}}/{{$t("length")}}</th>
            <th>{{$t("submit_time")}}/{{$t("judger")}}</th>
        </tr>
        </thead>
        <transition-group name="list-complete" tag="tbody">
        <tr :class="(row.sim?'warning':'') + ' list-complete-item'" :data-html="'<b>IP:'+row.ip+'</b><br><p>类型:'+detect_place(row.ip)+'</p><p>用户指纹:<br>'+row.fingerprint+'<br>硬件指纹:<br>'+row.fingerprintRaw+'</p>'" :key="row.solution_id"
            v-for="row in problem_lists">
            <td>{{row.solution_id}}</td>
            <td>
                <div class="ui grid">
                    <div class="four wide column" style="margin:auto">
                        <img :src="getAvatarURL(row)" class="ui avatar image"
                             style="object-fit: cover;">
                    </div>
                    <div class="twelve wide column">
                        <router-link :to="`/user/${row.user_id}`">
                            {{row.user_id}}<br>{{row.nick}}
                        </router-link>
                    </div>
                </div>
            </td>
            <td>
                <div class=center>
                    <router-link :to="`/problem/submit/${Math.abs(row.problem_id)}`">{{Math.abs(row.problem_id)}}
                    </router-link>
                </div>
            </td>
            <td>
                <router-link :class="answer_class[row.result]" :to="`/status/info/${infoRoute(row.result)}/${row.solution_id}`">
                    <i :class="answer_icon[row.result]+' icon'"></i>
                    {{result[row.result]}}
                </router-link>
                <br v-if="row.sim||row.pass_rate>0.05 || row.result == 3">
                <a :class="answer_class[row.result]" v-cloak
                   v-if="row.result == 3 && !!row.pass_point && !!row.total_point"><i :class="answer_icon[row.result]+' icon'" style="opacity:0"></i>({{row.pass_point ||
                    0}}/{{row.total_point || 0}})</a>
                <router-link :class="answer_class[row.result]" :to="`/compare/${row.solution_id}/${row.sim_id}`"
                             v-if="row.sim">
                    <br v-if="row.result == 3">
                    {{(Boolean(row.sim) === false?'':row.sim_id+' ('+row.sim+'%)')}}
                </router-link>
                <a :class="answer_class[row.result]" v-if="row.result !== 4 && row.pass_rate > 0.05"><i
                        :class="answer_icon[row.result]+' icon'" style="opacity:0"></i>Passed:{{(row.pass_rate*100).toFixed(1)}}%</a>

            </td>
            <td v-if="isadmin">
                <router-link :to="`/contest/${row.contest_id}`" v-if="row.contest_id">{{row.contest_id}}</router-link>
                <span v-else>无</span></td>
            <td>
                <div><span class="boldstatus">{{memory_parse(row.memory)}}</span><br><span class="boldstatus">{{time_parse(row.time)}}</span>
                </div>
            </td>
            <td>
                <router-link :to="`/usercode/local/${row.solution_id}`" class="boldstatus"
                             v-if="self === row.user_id || isadmin || row.share == 1">
                    {{$t("view")}}
                </router-link>
                <span class="boldstatus" v-else>{{language_name[row.language]}}</span>
                <span v-if="(self === row.user_id || isadmin || row.share == 1) && row.problem_id"> / </span>
                <router-link :to="`/problem/submit/${Math.abs(row.problem_id)}/${Math.abs(row.solution_id)}`"
                             class="boldstatus"
                             v-if="(self === row.user_id || isadmin || row.share == 1) && row.problem_id">{{$t("edit")}}
                </router-link>
                <br>
                <span class="boldstatus" v-if="(self === row.user_id || isadmin || row.share == 1)">{{language_name[row.language]}} / </span>
                <span class="boldstatus">{{row.length}}B</span>
            </td>
            <td>{{dayjs(row.in_date).format("YYYY-MM-DD HH:mm:ss")}}<br>{{row.judger}}</td>
        </tr>
        </transition-group>
    </table>
</template>

<script>
import util from "../../lib/util";
import avatarMixin from "../../mixin/avatarMixin";
const _ = require("lodash");
const dayjs = require("dayjs");
export default {
    name: "status-table",
    mixins: [avatarMixin],
    props: {
        problem_list: Array,
        answer_icon: Array,
        answer_class: Array,
        target: Object,
        language_name: Array,
        result: Array,
        self: String,
        isadmin: {
            type: Boolean,
            default: false
        }
    },
    data: function () {
        return {
            user: {},
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
        detect_place: function (ip) {
            if (!ip) {
                return "未知";
            }
            var tmp = {
                intranet_ip: ip,
                place: ""
            };
            util.detectIP(tmp);
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
            _.forEach(this.problem_list, function (val, i) {
                doc.innerHTML = that.problem_list[i].nick;
                that.problem_list[i].nick = doc.innerText;
            });
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
