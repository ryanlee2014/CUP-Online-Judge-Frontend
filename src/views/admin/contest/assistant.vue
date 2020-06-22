<template>
    <div class="ui container padding">
        <h2 class="ui dividing header">{{$t("contest assistant manage")}}</h2>
        <div class="ui form">
            <div class="field">
                <div class="two fields">
                    <div class="field">
                        <label>{{$t("user_id")}}</label>
                        <input type="text" v-model="userId" >
                    </div>
                    <div class="field">
                        <label>{{$t("contest")}}</label>
                        <div class="ui fluid search dropdown selection" id="privilege">
                            <input @change="contestId = $event.target.value" type="hidden"
                                   v-model="contestId">
                            <i class="dropdown icon"></i>
                            <div class="default text"></div>
                            <div class="menu">
                                <div :key="key" class="item" :data-value="row.contest_id" v-for="(row,key) in contestList">
                                    {{"Contest" +
                                    row.contest_id + " " + row.title}}
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
                <th>{{$t("contest_id")}}</th>
                <th>{{$t("remove")}}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row,key) in assistantList" :key="key">
                <td>{{row.user_id}}</td>
                <td>{{row.contest_id}}</td>
                <td>
                    <a @click="removePrivilege(row.user_id, row.contest_id)" class="ui labeled icon black button">
                        <i class="trash icon"></i>
                        {{$t("remove")}}
                    </a>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import InitMixin from "../../../mixin/init";

@Component
export default class ContestAssistant extends Mixins(InitMixin) {
    userId = "";
    contestId = "";
    contestList: any[] = [];
    assistantList: any[] = [];

    mounted () {
        this.refreshAssistantList();
        this.axios.get("/api/contest/list/all")
            .then(({ data }) => {
                this.contestList = data.data;
            });
    }

    buildPayload () {
        return {
            contestId: this.contestId,
            userId: this.userId
        };
    }

    refreshAssistantList () {
        return this.axios.get("/api/admin/contest/assistant/all")
            .then(({ data }) => {
                this.assistantList = data.data;
            });
    }

    checkData () {
        if (this.userId.length === 0) {
            alert("请填写用户");
            return false;
        }
        if (this.contestId.length === 0) {
            alert("请选择竞赛");
            return false;
        }
        return true;
    }

    addPrivilege () {
        if (this.checkData()) {
            this.axios.post("/api/admin/contest/assistant", this.buildPayload())
                .then(({ data }) => {
                    alert("添加完成");
                    return this.refreshAssistantList();
                });
        }
    }

    removePrivilege (userId: string, contestId: string) {
        this.axios.post("/api/admin/contest/assistant/remove", { contestId, userId })
            .then(({ data }) => {
                alert("删除完成");
                return this.refreshAssistantList();
            });
    }
}
</script>

<style scoped>

</style>
