<template>
    <div class="ui container padding">
        <Pagination :current_page="current_page" :page_cnt="page_cnt" :total="total_number" :on-page-changed="page"></Pagination>
        <table class="ui celled structured table">
            <thead>
            <tr>
                <th>{{$t("problem_id")}}</th>
                <th>{{$t("title")}}</th>
                <th>{{$t("from")}}</th>
                <th>{{$t("available")}}</th>
                <th>{{$t("upload time")}}</th>
                <th>{{$t("remove")}}</th>
            </tr>
            </thead>
            <tbody>
            <tr :key="row.problem_id" v-for="(row) in list">
                <td>
                    {{row.problem_id}}
                </td>
                <td>
                    <a :href="`/problem/edit/${row.problem_id}`" target="_blank">{{row.title}}</a>
                </td>
                <td>
                    <a :href="`/problemset?tag=${row.source}`" target="_blank" v-html="row.source">
                    </a>
                </td>
                <td>
                    <button @click="defunct(row.problem_id)" :class="'ui inverted labeled icon button ' + (defunctToBoolean(row.defunct) ? 'green': 'red')">
                        <i :class="(defunctToBoolean(row.defunct) ? 'checkmark':'remove') + ' icon'"></i>
                        {{defunctToBoolean(row.defunct) ? $t("available") : $t("unavailable")}}
                    </button>
                </td>
                <td>
                    {{row.in_date !== null ? dayjs(row.in_date).format("YYYY-MM-DD HH:mm:ss") : $t("unknown")}}
                </td>
                <td>
                    <button @click="remove(row.problem_id)" class="ui labeled icon black button">
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
export default class ProblemList extends Mixins(mixins) {
    current_page = 0;
    list: any[] = [];
    dayjs = dayjs;
    total_number = 0;
    page_cnt = 50;
    created () {
        const query = this.$route.query;
        let currentPage: number = 0;
        if (Object.prototype.hasOwnProperty.call(query, "page")) {
            currentPage = parseInt(query.page as string);
        }
        if (!isNaN(currentPage!)) {
            this.current_page = currentPage;
        }
    }

    @Watch("current_page")
    onCurrentPageChanged (val: string) {
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
        this.axios.get(`/api/admin/problem/list/${page}`)
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

    defunct (problemID: any) {
        this.axios.post("/api/admin/problem/defunct", { id: problemID })
            .then(({ data }) => {
                gravatar.w3tt.com === "OK") {
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
        color: inherit!important;
    }
    .remove {
        color: inherit!important;
    }
</style>
