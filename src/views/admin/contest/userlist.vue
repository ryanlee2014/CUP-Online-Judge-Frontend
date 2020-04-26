<template>
    <div class="ui container padding">
        <h2 class="ui dividing header">
            {{$t("contest user list")}}
        </h2>
        <table class="ui celled structured table">
            <thead>
            <tr>
                <th>{{$t("user_id")}}</th>
                <th>{{$t("reg_time")}}</th>
                <th>{{$t("access_time")}}</th>
                <th>{{$t("defunct")}}</th>
            </tr>
            </thead>
            <tbody>
            <tr :key="key" v-for="(row,key) in contestAccountList">
                <td>
                    {{row.user_id}}
                </td>
                <td>
                    {{dayjs(row.reg_time).format("YYYY-MM-DD HH:mm:ss")}}
                </td>
                <td>
                    {{dayjs(row.access_time).format("YYYY-MM-DD HH:mm:ss")}}
                </td>
                <td>
                    {{row.defunct}}
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<i18n>
    {
        "zh-cn": {
            "contest user list": "竞赛用户列表"
        },
        "en": {
            "contest user list": "Contest User List"
        },
        "ja": {
            "contest user list": "コンテストユーザーリスト"
        }
    }
</i18n>
<script lang="ts">
import mixins from "../../../mixin/init";
import dayjs from "dayjs";
import { Component, Mixins } from "vue-property-decorator";

@Component
export default class ContestUserList extends Mixins(mixins) {
    contestAccountList = [];
    dayjs = dayjs;
    mounted () {
        this.initList();
    }

    initList () {
        this.axios.get("/api/admin/account/teamlist")
            .then(({ data }) => {
                if (data.status === "OK") {
                    this.contestAccountList = data.data;
                }
            });
    }
}
</script>

<style scoped>

</style>
