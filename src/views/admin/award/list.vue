<template>
    <div class="ui container padding">
        <div class="ui grid">
            <div class="row">
                <div class="thirteen wide column">
                    <Pagination :current_page="current_page" :page_cnt="page_cnt" :total="total_number"
                                :on-page-changed="page"></Pagination>
                </div>
                <div class="three wide right aligned column">
                    <router-link to="/admin/user/award/add" class="ui primary button">
                        {{ $t("add award") }}
                    </router-link>
                </div>
            </div>
        </div>
        <table class="ui celled structured table">
            <thead>
            <tr>
                <th>{{ $t("award_id") }}</th>
                <th>{{ $t("user_id") }}</th>
                <th>{{ $t("award") }}</th>
                <th>{{ $t("year") }}</th>
                <th>{{ $t("operate") }}</th>
            </tr>
            </thead>
            <tbody>
            <tr :key="row.award_id" v-for="(row) in list">
                <td>
                    {{ row.award_id }}
                </td>
                <td>
                    <router-link :to="`/user/${row.user_id}`">
                        {{ row.user_id }}
                    </router-link>
                </td>
                <td>
                    {{ row.award }}
                </td>
                <td>
                    {{ row.year }}
                </td>
                <td>
                    <router-link :to="`/admin/user/award/edit/${row.award_id}`" class="ui primary button">
                        {{ $t("edit") }}
                    </router-link>
                    <a class="ui button" @click.prevent="removeAward(row.award_id)">
                        {{ $t("remove") }}
                    </a>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import mixins from "../../../mixin/init";
import { Mixins, Component, Watch } from "vue-property-decorator";
import dayjs from "dayjs";
import Pagination from "@/components/problemset/pagination.vue";

interface IAward {
    award_id: number,
    user_id: string,
    award: string,
    year: number
}

@Component({
    components: {
        Pagination
    }
})
export default class AwardList extends Mixins(mixins) {
    list: IAward[] = [];
    dayjs = dayjs;
    page_cnt = 50;
    total_number = 0;
    current_page = 0;

    created () {
        const query: any = this.$route.query;
        let currentPage: any;
        if (Object.hasOwnProperty.call(query, "page")) {
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

    setQuery () {
        const queryString: any = {};
        queryString.page = this.current_page;
        this.$router.push({
            path: this.$route.path,
            query: queryString
        });
    }

    page (num: any, arrow: any) {
        this.current_page = arrow ? this.current_page + arrow : num;
    }

    flushData (page: any) {
        this.axios.get(`/api/admin/award/list/${page}`)
            .then(({ data }) => {
                this.list = data.data.data;
                this.total_number = data.data.count;
            });
        return true;
    }

    removeAward (awardId: number) {
        window.confirm(`是否删除记录${awardId}?`) && this.axios.post(`/api/admin/award/remove/${awardId}`)
            .then(({ data }) => {
                alert(this.$t("success"));
                this.flushData(this.current_page);
            });
    }
}
</script>

<style scoped>

</style>
