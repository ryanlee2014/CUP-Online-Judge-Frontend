<template>
    <div class="ui container padding">
        <h2 class="ui dividing header">{{$t("invite code manager")}}</h2>
        <div class="ui form">
            <div class="field">
                <div class="two fields">
                    <div class="field">
                        <label>{{$t("expire date")}}</label>
                        <div class="ui calendar" id="expireDate" ref="expireDate">
                            <div class="ui input left icon">
                                <i class="calendar icon"></i>
                                <input id="startTime" placeholder="expire date" type="text" autocomplete="off"
                                       v-model="expireDate">
                            </div>
                        </div>
                        <div ref="hideStartDate" style="display: none">
                            <div>
                                <i></i>
                                <input type="text">
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <label>{{$t("valid time")}}</label>
                        <input type="text" placeholder="number only" v-model="validUserNumber">
                    </div>
                </div>
                <div class="field">
                    <div class="two fields">
                        <div class="field"></div>
                        <div class="field">
                            <a @click.prevent="addInviteCode" class="ui primary button">{{$t("add")}}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <table class="ui celled structured table">
            <thead>
                <tr>
                    <th>{{$t("invite code")}}</th>
                    <th>{{$t("inviter")}}</th>
                    <th>{{$t("rest valid time")}}</th>
                    <th>{{$t("valid date")}}</th>
                    <th>{{$t("expire")}}</th>
                </tr>
            </thead>
            <tbody>
                <tr :key="row.invite_code" v-for="row in inviteInfoList">
                    <td>
                        {{row.invite_code}}
                    </td>
                    <td>
                        <router-link :to="`/user/${row.user_id}`">{{row.user_id}}</router-link>
                    </td>
                    <td>
                        {{row.valid_time}}
                    </td>
                    <td>
                        {{dayjs(row.valid_date).format("YYYY-MM-DD HH:mm:ss")}}
                    </td>
                    <td>
                        <button @click="remove(row.invite_code)" class="ui labeled icon black button">
                            <i class="trash icon"></i>
                            {{$t("expire")}}
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<i18n>
{
    "zh-cn": {
        "invite code manager": "邀请码管理"
    },
    "en": {
        "invite code manager": "Invite Code Manager"
    },
    "ja": {
        "invite code manager": "招待コード管理"
    }
}
</i18n>
<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import InitMixin from "../../../mixin/init";
import jquery from "jquery";
import dayjs from "dayjs";
const $: any = jquery;

interface IInviteInfo {
    invite_id: number,
    user_id: string,
    invite_code: string,
    valid_date: number | string,
    valid_time: number
}

@Component
export default class InviteCode extends Mixins(InitMixin) {
    expireDate = new Date();
    validUserNumber: number = 0;
    inviteInfoList: IInviteInfo[] = [];
    dayjs = dayjs;
    mounted () {
        this.initData();
        this.initJQuery();
    }

    initData () {
        this.axios.get("/api/admin/account/invite/all")
            .then(({ data }) => {
                this.inviteInfoList = data.data;
            })
            .catch(({ data }) => {
                alert(JSON.stringify(data));
            });
    }

    initJQuery () {
        const that = this;
        const $expireDate = $(this.$refs.expireDate);
        const $hideStartDate = $(this.$refs.hideStartDate);
        $hideStartDate.calendar({
            initialDate: new Date(),
            endCalendar: $expireDate
        });
        $expireDate.calendar({
            startCalendar: $hideStartDate,
            onChange (value: any) {
                that.expireDate = new Date(value);
            }
        });
    }

    addInviteCode () {
        const payload = {
            validUserNumber: parseInt(this.validUserNumber + ""),
            expireDate: this.expireDate
        };
        this.axios.post("/api/admin/account/invite/add", payload)
            .then(({ data }) => {
                alert("创建成功");
                this.initData();
            })
            .catch(({ data }) => {
                alert(JSON.stringify(data));
            });
    }

    remove (inviteCode: string) {
        const payload = {
            inviteCode
        };
        this.axios.post("/api/admin/account/invite/expire", payload)
            .then(({ data }) => {
                alert(`邀请码:${inviteCode}已设置过期`);
            })
            .catch(({ data }) => {
                alert(`请求出错: ${JSON.stringify(data)}`);
            });
    }
}
</script>

<style scoped>

</style>
