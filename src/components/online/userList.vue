<template>
    <div class="five wide column">
        <table class="ui padded celled selectable table" id="name_list">
            <thead>
            <tr align=center class="toprow">
                <th>{{$t("user_id")}}</th>
                <th>{{$t("nick")}}</th>
                <th width=10%>{{$t("position")}}</th>
            </tr>
            </thead>
            <tbody id="user_list_table" refresh="true">
            <tr :key="value.user_id" style='text-align:center' v-cloak v-for="value in user">
                <td>
                    <router-link :to="`/user/${value.user_id}`">{{value.user_id}}</router-link>
                </td>
                <td>
                    <router-link :to="`/user/${value.user_id}`">{{
                        value.nick||localStorage.getItem(value.user_id) }}</router-link>
                </td>
                <td :data-html="'<b>IP</b><p>内网IP:'+value.intranet_ip+'<br>外网IP:'+value.ip+'</p>'"
                    width=30%>{{
                    value.place }}
                </td>
            </tr>
            </tbody>
        </table>
    </div>

</template>

<script lang="ts">
import util from "../../lib/util";
import jquery from "jquery";
import TimerMixin from "@/mixin/TimerMixin";
import { Watch, Component, Mixins } from "vue-property-decorator";
import { Interval } from "@/module/Decorator/method";
const $: any = jquery;
const doc = document.createElement("div");
@Component
export default class UserList extends Mixins(TimerMixin) {
    @Watch("onlineList")
    onOnlineListChanged (newVal: any) {
        this.temp_userList = newVal;
    }

    need_popup = false;
    temp_userList: any = [];
    userlist: any = [];

    created () {
        this.temp_userList = this.$store.getters.onlineUser;
    }
    get user () {
        const that = this;
        if (!this.userlist) return [];
        for (var i = 0; i < this.userlist.length; ++i) {
            var tmp = this.userlist[i];
            doc.innerHTML = tmp.nick;
            tmp.nick = doc.innerText;
            util.detectIP(tmp);
        }
        if (localStorage.getItem("sort") === "true") {
            that.userlist.sort(function (a: any, b: any) {
                var a1 = a["user_id"];
                var b1 = b["user_id"];
                return a1 < b1 ? -1 : a1 === b1 ? 0 : 1;
            });
        }
        return this.userlist;
    }
    updated () {
        if (this.need_popup) {
            $("#user_list_table td").popup({
                on: "hover",
                positon: "top center",
                hoverable: true
            });
        }
        this.need_popup = false;
    }

    @Interval(1000)
    updateUserList () {
        const onlineUser = this.$store.getters.onlineUser;
        const original = JSON.stringify(this.userlist.map((el: any) => (el && el.user_id) || ""));
        const newVal = JSON.stringify(onlineUser.map((el: any) => el.user_id));
        if (original !== newVal) {
            this.need_popup = true;
            this.userlist = JSON.parse(JSON.stringify(onlineUser));
        }
    }

    mounted () {
        this.updateUserList();
    }
}
</script>

<style scoped>

</style>
