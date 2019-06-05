<template>
    <div class="ui container padding">
        <Pagination :current_page="current_page" :page_cnt="page_cnt" :total="total_number"></Pagination>
        <table class="ui celled structured table">
            <thead>
            <tr>
                <th>{{$t("contest_id")}}</th>
                <th>{{$t("title")}}</th>
                <th>{{$t("start time")}}</th>
                <th>{{$t("end time")}}</th>
                <th>{{$t("available")}}</th>
                <th>{{$t("remove")}}</th>
            </tr>
            </thead>
            <tbody>
            <tr :key="row.contest_id" v-for="(row) in list">
                <td>
                    {{row.contest_id}}
                </td>
                <td>
                    <a :href="`/contest/edit/${row.contest_id}`" target="_blank">{{row.title}}</a>
                </td>
                <td>
                    {{dayjs(row.start_time).format("YYYY-MM-DD HH:mm")}}
                </td>
                <td>
                    {{dayjs(row.end_time).format("YYYY-MM-DD HH:mm")}}
                </td>
                <td>
                    <button @click="defunct(row.contest_id)" :class="'ui inverted labeled icon button ' + (defunctToBoolean(row.defunct) ? 'green': 'red')">
                        <i :class="(defunctToBoolean(row.defunct) ? 'checkmark':'remove') + ' icon'"></i>
                        {{defunctToBoolean(row.defunct) ? $t("available") : $t("unavailable")}}
                    </button>
                </td>
                <td>
                    <button @click="remove(row.contest_id)" class="ui labeled icon black button">
                        <i class="trash icon"></i>
                        {{$t("remove")}}
                    </button>
                </td>
            </tr>
            </tbody>
        </table>
        <Pagination :current_page="current_page" :page_cnt="page_cnt" :total="total_number"></Pagination>
    </div>
</template>

<script>
import mixins from "../../../mixin/init";
import Pagination from "../../../components/problemset/pagination";

const dayjs = require("dayjs");
export default {
    name: "list",
    mixins: [mixins],
    components: {
        Pagination
    },
    data () {
        let _data = {
            current_page: 0,
            list: [],
            dayjs,
            total_number: 0,
            page_cnt: 50
        };
        const query = this.$route.query;
        let currentPage;
        if (query.hasOwnProperty("page")) {
            currentPage = parseInt(query.page);
        }
        if (!isNaN(currentPage)) {
            _data.current_page = currentPage;
        }
        return _data;
    },
    watch: {
        current_page (val) {
            this.setQuery();
            this.flushData(val);
        }
    },
    mounted () {
        this.flushData(this.current_page);
    },
    methods: {
        defunctToBoolean (defunct) {
            return defunct === "N";
        },
        flushData (page) {
            this.axios.get(`/api/admin/contest/list/${page}`)
                .then(({ data }) => {
                    this.list = data.data.data;
                    this.total_number = data.data.count;
                });
        },
        setQuery () {
            let queryString = {};
            queryString.page = this.current_page;
            this.$router.push({ path: this.$route.path, query: queryString });
        },
        remove (problemID) {
            // TODO
        },
        page (num, arrow) {
            this.current_page = arrow ? this.current_page + arrow : num;
        },
        defunct (contestID) {
            this.axios.post("/api/admin/contest/defunct", { id: contestID })
                .then(({ data }) => {
                    if (data.status === "OK") {
                        this.flushData(this.current_page);
                    }
                    else {
                        alert(data.statement);
                    }
                });
        }
    }
};
</script>

<style scoped>
    .checkmark {
        color: inherit;
    }
    .remove {
        color: inherit;
    }
</style>
