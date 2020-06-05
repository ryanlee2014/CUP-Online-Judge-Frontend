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
            <th width="15%">{{$t("result")}}</th>
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
                        <v-gravatar hostname="cn.gravatar.com" :original-src="getAvatarURL(row)" class="ui avatar image" :email="row.email" style="object-fit: cover;"></v-gravatar>
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
                    <i :class="answer_icon[row.result]+' important icon'"></i>
                    {{$t(result[row.result])}}
                </router-link>
                <br v-if="row.sim||(row.result == 3 && !!row.pass_point && !!row.total_point)">
                <a :class="answer_class[row.result]" v-cloak
                   v-if="row.result == 3 && !!row.pass_point && !!row.total_point">
                    <i :class="answer_icon[row.result]+' important icon'" style="opacity:0"></i>({{row.pass_point ||
                    0}}/{{row.total_point || 0}})</a>
                <router-link :class="answer_class[row.result]" :to="`/compare/${row.solution_id}/${row.sim_id}`"
                             v-if="row.sim">
                    <br v-if="row.result == 3">
                    <span v-if="!!row.sim"><i :class="answer_icon[row.result]+' important icon'" style="opacity:0"></i>{{'('+row.sim+'%)'}}</span>
                </router-link>
                <br v-if="row.result !== 4 && row.pass_rate > 0.05">
                <a :class="answer_class[row.result]" v-if="row.result !== 4 && row.pass_rate > 0.05"><i
                        :class="answer_icon[row.result]+' important icon'" style="opacity:0"></i>Passed:{{(row.pass_rate*100).toFixed(1)}}%</a>

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

<script lang="ts">
import avatarMixin from "../../mixin/avatarMixin";
import { Mixins, Component } from "vue-property-decorator";
import { StatusTableMixin } from "@/mixin/status-table-mixin.component";

@Component
export default class StatusTable extends Mixins(avatarMixin, StatusTableMixin) {

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
