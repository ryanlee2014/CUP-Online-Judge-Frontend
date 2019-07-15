<template>
    <div class="ui container padding">
        <table class="ui celled structured table">
            <thead>
            <tr>
                <th>{{$t("user_id")}}</th>
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

<script>
import mixins from "../../../mixin/init";

const dayjs = require("dayjs");
export default {
    name: "ban",
    mixins: [mixins],
    data () {
        return {
            banList: [],
            dayjs
        };
    },
    mounted () {
        this.initData();
    },
    methods: {
        initData () {
            this.axios.get("/api/admin/account/ban")
                .then(({ data }) => {
                    if (data.status === "OK") {
                        this.banList = data.data;
                    }
                });
        },
        remove (userId) {
            this.axios.post("/api/admin/account/ban/delete", {
                user_id: userId
            })
                .then(({ data }) => {
                    if (data.status === "OK") {
                        alert(this.$t("success"));
                        this.initData();
                    }
                    else {
                        alert(this.$t("fail"));
                    }
                });
        },
        edit (userId) {
            $(this.$refs[userId]).calendar();
        }
    }
};
</script>

<style scoped>

</style>
