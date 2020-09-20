<template>
    <div class="ui container padding">
        <h2 class="ui dividing header">{{$t("user privilege")}}</h2>
        <div class="ui form">
            <div class="field">
                <div class="two fields">
                    <div class="field">
                        <label>{{$t("user_id")}}</label>
                        <input type="text" v-model="user_id" >
                    </div>
                    <div class="field">
                        <label>{{$t("privilege")}}</label>
                        <div class="ui fluid search dropdown selection" id="privilege">
                            <input @change="rightstr = $event.target.value" type="hidden"
                                   v-model="rightstr">
                            <i class="dropdown icon"></i>
                            <div class="default text"></div>
                            <div class="menu">
                                <div :key="key" class="item" :data-value="row" v-for="(row,key) in privilegeList">
                                    {{row}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="field">
                <div class="two fields">
                    <div class="field"></div>
                    <div class="field">
                        <a @click="addPrivilege" class="ui primary button">{{$t("add")}}</a>
                    </div>
                </div>
            </div>
        </div>
        <table class="ui celled structured table">
            <thead>
            <tr>
                <th>{{$t("user_id")}}</th>
                <th>{{$t("nick")}}</th>
                <th>{{$t("privilege")}}</th>
                <th>{{$t("remove")}}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row,key) in userList" :key="key">
                <td>
                    <router-link :to="`/user/${row.user_id}`">{{row.user_id}}</router-link>
                </td>
                <td>
                    <router-link :to="`/user/${row.user_id}/`">{{row.nick}}</router-link>
                </td>
                <td>{{row.rightstr}}</td>
                <td>
                    <a @click="removePrivilege(row.user_id, row.rightstr)" class="ui labeled icon black button">
                        <i class="trash icon"></i>
                        {{$t("remove")}}
                    </a>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<i18n>
    {
        "zh-cn": {
            "user privilege": "用户权限"
        },
        "en": {
            "user privilege": "User Privilege"
        },
        "ja": {
            "user privilege": "ユーザー権限"
        }
    }
</i18n>
<script lang="ts">
import mixins from "../../../mixin/init";
import { Component, Mixins } from "vue-property-decorator";
import jquery from "jquery";
const $: any = jquery;
@Component
export default class Privilege extends Mixins(mixins) {
    userList = [];
    privilegeList = [];
    user_id = "";
    rightstr = "";
    mounted () {
        this.initData();
        this.initjQuery();
    }

    basePrivilege (url: string, userId: string, rightstr: string) {
        this.axios.post(url, { user_id: userId, rightstr })
            .then(({ data }) => {
                alert(this.$t("success"));
                this.initData();
            })
            .catch(({ data }) => {
                alert(data.statement);
            });
    }

    addPrivilege () {
        this.basePrivilege("/api/admin/account/privilege/add", this.user_id, this.rightstr);
    }

    removePrivilege (userId: string, rightstr: string) {
        this.basePrivilege("/api/admin/account/privilege/remove", userId, rightstr);
    }

    initData () {
        this.axios.get("/api/admin/account/privilege")
            .then(({ data }) => {
                this.userList = data.data.userList;
                this.privilegeList = data.data.privilegeList;
            })
            .catch(({ data }) => {
                alert(data.statement);
            });
    }

    initjQuery () {
        $(".ui.dropdown").dropdown();
    }
}
</script>

<style scoped>

</style>
