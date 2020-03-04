<template>
    <div class="ui container padding">
        <div class="ui grid">
            <div class="row">
                <div class="thirteen wide column">
                    <Pagination :current_page="current_page" :page_cnt="page_cnt" :total="total_number" :on-page-changed="page"></Pagination>
                </div>
                <div class="three wide right aligned column">
                    <router-link to="/admin/contest/add" class="ui primary button">
                        {{$t("add contest")}}
                    </router-link>
                </div>
            </div>
        </div>
        <table class="ui celled structured table">
            <thead>
            <tr>
                <th>{{$t("contest_id")}}</th>
                <th>{{$t("title")}}</th>
                <th>{{$t("start time")}}</th>
                <th>{{$t("end time")}}</th>
                <th>{{$t("copy contest")}}</th>
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
                    <router-link :to="`/admin/contest/copy/${row.contest_id}`" class="ui inverted blue tiny labeled icon button">
                        <i class="copy icon"></i>
                        {{$t("copy")}}
                    </router-link>
                </td>
                <td>
                    <button @click="defunct(row.contest_id)" :class="'ui inverted tiny labeled icon button ' + (defunctToBoolean(row.defunct) ? 'green': 'red')">
                        <i :class="(defunctToBoolean(row.defunct) ? 'checkmark':'remove') + ' icon'"></i>
                        {{defunctToBoolean(row.defunct) ? $t("available") : $t("unavailable")}}
                    </button>
                </td>
                <td>
                    <button @click="remove(row.contest_id)" class="ui labeled tiny icon black button">
                        <i class="trash icon"></i>
                        {{$t("remove")}}
                    </button>
                </td>
            </tr>
            </tbody>
        </table>
        <Pagination :current_page="current_page" :page_cnt="page_cnt" :total="total_number" :on-page-changed="page"></Pagination>
    </div>
</template>

<script lang="ts">
import mixins from "../../../mixin/init";
import Pagination from "../../../components/problemset/pagination.vue";
import dayjs from "dayjs";
import { Mixins, Component, Watch } from "vue-property-decorator";

@Component({
    components: {
        Pagination
    }
})
export default class ContestList extends Mixins(mixins) {
    current_page = 0;
    list = [];
    dayjs = dayjs;
    total_number = 0;
    page_cnt = 50;
    created () {
        const query: any = this.$route.query;
        let currentPage: any;
        // eslint-disable-next-line no-prototype-builtins
        if (query.hasOwnProperty("page")) {
            currentPage = parseInt(query.page);
        }
        if (!isNaN(currentPage)) {
            this.current_page = currentPage;
        }
    }

    @Watch("current_page")
    onCurrentPageChanged (val: any) {
        this.setQuery();
        this.flushData(val);
    }

    mounted () {
        this.flushData(this.current_page);
    }

    defunctToBoolean (defunct: string) {
        return defunct === "N";
    }

    flushData (page: any) {
        this.axios.get(`/api/admin/contest/list/${page}`)
            .then(({ data }) => {
                this.list = data.data.data;
                this.total_number = data.data.count;
            });
    }

    setQuery () {
        const queryString: any = {};
        queryString.page = this.current_page;
        this.$router.push({ path: this.$route.path, query: queryString });
    }

    remove (problemID: any) {
        // TODO
    }

    page (num: any, arrow: any) {
        this.current_page = arrow ? this.current_page + arrow : num;
    }

    defunct (contestID: any) {
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
</script>

<style scoped>
    .checkmark {
        color: inherit;
    }
    .remove {
        color: inherit;
    }
</style>
