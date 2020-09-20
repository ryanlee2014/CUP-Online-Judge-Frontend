<template>
    <div class="ui container padding">
        <div class="ui form">
            <div class="field">
                <div class="two fields">
                    <div class="field">
                        <label>{{$t("user_id")}}</label>
                        <input type="text" v-model="userId">
                    </div>
                    <div class="field">
                        <label>{{$t("ban end time")}}</label>
                        <div class="ui calendar" id="ban_end_time" ref="ban_end_time">
                            <div class="ui input left icon">
                                <i class="calendar icon"></i>
                                <input id="banTime" placeholder="Ban end time" type="text" autocomplete="off"
                                       v-model="banTime">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="field">
                <div class="two fields">
                    <div class="field"></div>
                    <div class="field">
                        <a @click="addBanTime" class="ui primary button">{{$t("add")}}</a>
                    </div>
                </div>
            </div>
        </div>
        <table class="ui celled structured table">
            <thead>
            <tr>
                <th>{{$t("user_id")}}</th>
                <th>{{$t("nick")}}</th>
                <th>{{$t("ban end time")}}</th>
                <th>{{$t("edit")}}</th>
                <th>{{$t("remove")}}</th>
            </tr>
            </thead>
            <tbody>
            <tr :key="row.user_id" v-for="row in banList">
                <td>
                    <router-link :to="`/user/${row.user_id}`">{{row.user_id}}</router-link>
                </td>
                <td>
                    <router-link :to="`/user/${row.user_id}/`">{{row.nick}}</router-link>
                </td>
                <td>
                    {{dayjs(row.bantime).format("YYYY-MM-DD HH:mm:ss")}}
                </td>
                <td :ref="row.user_id" class="ui calendar">
                    <div>
                        <div @click="edit(row.user_id)" class="ui tiny button">
                            {{$t("edit")}}
                        </div>
                    </div>
                </td>
                <td>
                    <button @click="remove(row.user_id)" class="ui labeled tiny icon black button">
                        <i class="trash icon"></i>
                        {{$t("remove")}}
                    </button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import mixins from "../../../mixin/init";
import dayjs from "dayjs";
import { Component, Mixins } from "vue-property-decorator";
import jquery from "jquery";
const $: any = jquery;
@Component
export default class AdminBanUser extends Mixins(mixins) {
    banList = [];
    dayjs = dayjs;
    userId = "";
    banTime: any = "";

    mounted () {
        this.initData();
        this.initJQuery();
    }

    initData () {
        this.axios.get("/api/admin/account/ban")
            .then(({ data }) => {
                data.data.sort((a: {user_id: string, bantime: string}, b: {user_id: string, bantime: string}) => {
                    return dayjs(a.bantime).isAfter(b.bantime) ? -1 : dayjs(a.bantime).isBefore(b.bantime) ? 1 : 0;
                });
                this.banList = data.data;
            });
    }

    initJQuery () {
        const that = this;
        const $banTime = $(this.$refs.ban_end_time);
        $banTime.calendar({
            initialDate: null,
            onChange (value: any) {
                that.banTime = new Date(value);
            }
        });
    }

    addBanTime () {
        if (!this.userId || this.userId.length === 0 || this.userId.trim().length === 0) {
            alert("请输入用户ID");
            return;
        }
        if (!this.banTime) {
            alert("请输入封禁结束时间");
            return;
        }
        this.userId = this.userId.trim();
        this.axios.post("/api/admin/account/ban", {
            user_id: this.userId,
            datetime: this.banTime
        })
            .then(({ data }) => {
                alert(this.$t("success"));
                this.initData();
            })
            .catch(({ data }) => {
                alert(this.$t("error"));
            });
    }

    remove (userId: string) {
        this.axios.post("/api/admin/account/ban/delete", {
            user_id: userId
        })
            .then(({ data }) => {
                alert(this.$t("success"));
                this.initData();
            })
            .catch(({ data }) => {
                alert(this.$t("fail"));
            });
    }

    edit (userId: string) {
        const that = this;
        const $user = $(this.$refs[userId]);
        $user.calendar({
            initialDate: null,
            onChange (value: any) {
                that.axios.post("/api/admin/account/ban", {
                    user_id: userId,
                    datetime: value
                })
                    .then(({ data }) => {
                        alert(that.$t("success"));
                        that.initData();
                    })
                    .catch(({ data }) => {
                        alert(that.$t("error"));
                    });
            }
        });
    }
}
</script>

<style scoped>

</style>
