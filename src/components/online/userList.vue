<template>
    <div class="five wide column">
        <table class="ui padded celled selectable table" id="name_list">
            <thead>
            <tr align=center class="toprow">
                <th>user_id</th>
                <th>name</th>
                <th width=10%>Position</th>
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

<script>
import util from "../../lib/util";
const $ = require("jquery");
const _ = require("lodash");
const doc = document.createElement("div");
export default {
    name: "userList",
    watch: {
        onlineList: function (newVal) {
            this.temp_userList = newVal;
        }
    },
    data () {
        return {
            need_popup: false,
            temp_userList: this.$store.getters.onlineUser,
            userlist: []
        };
    },
    computed: {
        user: {
            get: function () {
                const that = this;
                if (!this.userlist) return [];
                for (var i = 0; i < this.userlist.length; ++i) {
                    var tmp = this.userlist[i];
                    doc.innerHTML = tmp.nick;
                    tmp.nick = doc.innerText;
                    util.detectIP(tmp);
                }
                if (localStorage.getItem("sort") == "true") {
                    that.userlist.sort(function (a, b) {
                        var a1 = a["user_id"];
                        var b1 = b["user_id"];
                        return a1 < b1 ? -1 : a1 === b1 ? 0 : 1;
                    });
                }
                return this.userlist;
            },
            set: function (newval) {
                if (!this.userlist) {
                    this.userlist = newval;
                    this.need_popup = true;
                }
                else {
                    this.tmp_userlist = newval;
                    var oldUser = []; var newUser = [];
                    _.forEach(this.userlist, function (v) {
                        oldUser.push(v.user_id);
                    });
                    _.forEach(this.tmp_userlist, function (v) {
                        newUser.push(v.user_id);
                    });
                    oldUser.sort();
                    newUser.sort();
                    if (JSON.stringify(oldUser) !== JSON.stringify(newUser)) {
                        this.need_popup = true;
                    }
                }
            }
        }
    },
    updated () {
        if (this.need_popup) {
            $("#user_list_table td").popup({
                on: "hover",
                positon: "top center",
                hoverable: true
            });
        }
        this.need_popup = false;
    },
    mounted () {
        const fn = () => {
            const original = JSON.stringify(this.onlineList);
            const newVal = JSON.stringify(this.$store.getters.onlineUser);
            if (original !== newVal) {
                this.need_popup = true;
                this.userlist = JSON.parse(newVal);
            }
        };
        fn();
        setInterval(fn, 1000);
    }
};
</script>

<style scoped>

</style>
