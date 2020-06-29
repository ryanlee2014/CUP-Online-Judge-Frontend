<template>
    <table class="ui padded selectable unstackable table" align="center" width="90%" v-if="finish">
        <thead v-cloak>
        <tr class='toprow'>
            <th width="7%">{{$t("solution_id")}}</th>
            <th width="18%"><div class="ui grid">
            <div class="four wide column"></div>
                <div class="twelve wide column">{{$t("user_id")}}</div>
            </div>
            </th>
            <th width="10%">{{$t("problem_id")}}</th>
            <th width="15%">{{$t("result")}}</th>
            <th width="10%">{{$t("memory")+"/"+$t("time")}}</th>
            <th width="13%">{{$t("language")+"/"+$t("length")}}</th>
            <th width="18%">{{$t("submit_time")}}</th>
            <th width="9%">{{$t("judger")}}</th>
        </tr>
        </thead>
        <transition-group name="list-complete" tag="tbody">
        <tr :key="row.solution_id" v-for="row in problem_lists" :class="((row.sim  && ((isadmin) || showSim))?'warning need_popup':'need_popup') + ' list-complete-item'" :data-html="'<b>IP:'+row.ip+'</b><br><p>类型:'+detect_place(row.ip)+'</p><p>用户指纹:<br>'+row.fingerprint+'<br>硬件指纹:<br>'+row.fingerprintRaw+'</p>'">
            <td>{{row.solution_id}}</td>
            <td><div class="ui grid">
            <div class="four wide column" style="margin:auto">
            <v-gravatar hostname="gravatar.w3tt.com" :original-src="getAvatarURL(row)" class="ui avatar image" :email="row.email" style="object-fit: cover;"></v-gravatar>
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
                    <i v-cloak :class="answer_icon[row.result]+' important icon'"></i>
                    {{$t(result[row.result])}}
                </router-link>
                    <router-link v-if="row.sim && ((isadmin) || showSim)" :to="`/compare/${row.solution_id}/${row.sim_id}`" :class="answer_class[row.result]">
                        <br>
                        <i :class="answer_icon[row.result]+' important icon'" style="opacity:0" v-if="!!row.sim && ((isadmin) || showSim)"></i>{{(Boolean(row.sim) === false?'':row.sim_id+' ('+row.sim+'%)')}}
                    </router-link>
                   <br>
                   <a :class="answer_class[row.result]" v-if="row.result !== 4 && row.pass_rate > 0.05"><i :class="answer_icon[row.result]+' important icon'" style="opacity:0"></i>Passed:{{(row.pass_rate*100).toString().substring(0,4)}}%</a>

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
            <td>{{dayjs(row.in_date).format("YYYY-MM-DD HH:mm:ss")}}<br><p>类型:{{detect_place(row.ip)}}</p></td>
            <td>{{row.judger}}</td>
        </tr>
        </transition-group>
    </table>
</template>

<script lang="ts">
import avatarMixin from "../../../mixin/avatarMixin";
import { Mixins, Component } from "vue-property-decorator";
import { StatusTableMixin } from "@/mixin/status-table-mixin.component";
import { ContestShowSimMixin } from "@/mixin/contest/ContestShowSimMixin";
import { isContestAssistant } from "@/util/util";
@Component
export default class StatusTable extends Mixins(avatarMixin, StatusTableMixin, ContestShowSimMixin) {
    mounted () {
        if (this.contestId !== 0) {
            this.initContestConfig(this.contestId);
            this.contestAssistantPrivilegeGrant();
        }
    }

    contestAssistantPrivilegeGrant () {
        isContestAssistant(this.contestId).then(resp => { this.showSim = this.showSim || resp; });
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
        position: absolute;
        transform: translateX(-31px);
    }
</style>
