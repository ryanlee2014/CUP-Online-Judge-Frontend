<template>
    <div class="ui container padding">
        <h2 class="ui dividing header">
            Contest User List
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

<script>
import mixins from "../../../mixin/init";
const dayjs = require("dayjs");
export default {
    name: "userlist",
    data () {
        return {
            contestAccountList: [],
            dayjs
        };
    },
    mounted () {
        this.initList();
    },
    methods: {
        initList () {
            this.axios.get("/api/admin/account/teamlist")
                .then(({ data }) => {
                    if (data.status === "OK") {
                        this.contestAccountList = data.data;
                    }
                });
        }
    }
};
</script>

<style scoped>

</style>
