<template>
    <div class="eleven wide column">

        <table class='ui padded celled selectable table' id='cs' width=90%>
            <thead>
            <tr align=center class=toprow>
                <th onclick="sortTable('cs', 0, 'float');" width=20%>{{$t("user_id")}}</th>
                <th width=20%>{{$t("nick")}}</th>
                <th width=60%>{{$t("link")}}</th>
            </tr>
            </thead>
            <tbody id="online_user_table" refresh="true">
            <tr :key="idx" style="text-align:center" v-cloak v-for="(value,idx) in user">
                <td>{{ value.user_id }}<br>Ver: {{value.frontend_version}}</td>
                <td>
                    <router-link :to="`/user/${value.user_id}`">{{value.nick}}</router-link>
                </td>
                <td style="
    width: 100%;
    height: 100%;
   /* float: left; /* add this */
    white-space: nowrap;
    overflow: hidden;
">
                    <router-link :to="value.url" v-if="!value.url.includes('.php')">{{decodeURI(location.origin+value.url) }}</router-link>
                    <a v-else :href="decodeURI(location.origin+value.url)">{{decodeURI(location.origin+value.url) }}</a>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<script lang="ts">
import utils from "../../lib/util";
import { mapGetters } from "vuex";
import { Component, Watch } from "vue-property-decorator";
import Vue from "vue";
@Component({
    computed: {
        ...mapGetters({
            userlist: "onlineUser"
        })
    }
})
export default class AddressList extends Vue {
    temp_userlist = [];
    location = window.location;
    window = window;
    userlist: any;
    @Watch("onlineList")
    onOnlineListChanged (newVal: any) {
        this.temp_userlist = newVal;
    }

    get user () {
        const newlist = [];
        const doc = document.createElement("div");
        if (!this.userlist) return [];
        for (let i = 0; i < this.userlist.length; ++i) {
            const tat = this.userlist[i];
            for (let j = 0; j < this.userlist[i].url.length; ++j) {
                const tmp = JSON.parse(JSON.stringify(tat));
                tmp.url = tmp.url[j];
                doc.innerHTML = tmp.nick;
                tmp.nick = doc.innerText;
                tmp.$this = this;
                tmp.toString = function () {
                    return this.ip + " " + this.intranet_ip;
                };
                utils.detectIP(tmp);
                newlist.push(tmp);
            }
        }
        if (localStorage.getItem("sort") === "true") {
            newlist.sort(function (a, b) {
                const a1 = a.user_id;
                const b1 = b.user_id;
                // if (!isNaN(parseInt(a1)) && !isNaN(parseInt(b1))) {
                //   return parseInt(a1) - parseInt(b1);
                // }
                // else {
                //    return isNaN(parseInt(b1)) ? 1 : -1;
                // }
                return a1 < b1 ? -1 : a1 === b1 ? 0 : 1;
            });
        }
        return newlist;
    }
}
</script>

<style scoped>

</style>
