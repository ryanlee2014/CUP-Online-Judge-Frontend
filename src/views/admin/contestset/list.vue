<template>
    <div class="ui container padding">
        <div class="ui grid">
            <div class="row">
                <div class="thirteen wide column">
                    <Pagination :current_page="currentPage" :page_cnt="pageCount" :total="totalNumber" :on-page-changed="page"></Pagination>
                </div>
                <div class="three wide right aligned column">
                    <router-link to="/admin/contestset/add" class="ui primary button">
                        {{$t("add contest set")}}
                    </router-link>
                </div>
            </div>
        </div>
        <table class="ui celled structured table">
            <thead>
            <tr>
                <th>{{$t("contest set id")}}</th>
                <th>{{$t("title")}}</th>
                <th>{{$t("create time")}}</th>
                <th>{{$t("copy contest set")}}</th>
                <th>{{$t("available")}}</th>
                <th>{{$t("remove")}}</th>
            </tr>
            </thead>
            <tbody>
            <tr :key="row.contestset_id" v-for="row in contestSetList">
                <td>
                    {{row.contestset_id}}
                </td>
                <td>
                    <a :href="`/admin/contestset/edit/${row.contestset_id}`" targe="_blank">
                        {{row.title}}
                    </a>
                </td>
                <td>
                    {{dayjs(row.create_time).format("YYYY-MM-DD HH:mm:ss")}}
                </td>
                <td class="button_size">
                    <router-link :to="`/admin/contestset/copy/${row.contestset_id}`" class="ui inverted blue tiny labeled icon button">
                        <i class="copy icon">
                        </i>
                        {{$t("copy")}}
                    </router-link>
                </td>
                <td class="button_size">
                    <button @click="defunct(row.contestset_id)" :class="'ui inverted tiny labeled icon button ' + (defunctToBoolean(row.defunct) ? 'green' : 'red')">
                        <i :class="(defunctToBoolean(row.defunct) ? 'checkmark' : 'remove') + ' icon'"></i>
                        {{defunctToBoolean(row.defunct) ? $t("available") : $t("unavailable")}}
                    </button>
                </td>
                <td class="button_size">
                    <button @click="remove(row.contestset_id)" class="ui labeled tiny icon black button">
                        <i class="trash icon">
                        </i>
                        {{$t("remove")}}
                    </button>
                </td>
            </tr>
            </tbody>
        </table>
        <Pagination :current_page="currentPage" :page_cnt="pageCount" :total="totalNumber" :on-page-changed="page"></Pagination>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import InitMixin from "../../../mixin/init";
import Pagination from "@/components/problemset/pagination.vue";
import dayjs from "dayjs";

    @Component({
        components: {
            Pagination
        }
    })
export default class ContestSetList extends Mixins(InitMixin) {
        currentPage = 0;
        contestSetList: any[] = [];
        dayjs = dayjs;
        pageCount = 50;
        totalNumber: number = 0;

        created () {
            const query: any = this.$route.query;
            if (Object.prototype.hasOwnProperty.call(query, "page")) {
                const page = parseInt(query.page);
                if (!isNaN(page)) {
                    this.currentPage = page;
                }
            }
        }

        @Watch("currentPage")
        onCurrentPageChanged (val: any) {
            this.setQuery();
            this.flushData(val);
        }

        mounted () {
            this.flushData(this.currentPage);
        }

        defunctToBoolean (defunct: string) {
            return defunct === "N";
        }

        flushData (page: any) {
            this.axios.get(`/api/admin/contestset/set/${page}`)
                .then(({ data }) => {
                    this.contestSetList = data.data.data;
                    this.totalNumber = data.data.count;
                });
        }

        setQuery () {
            let queryString: any = {};
            queryString.page = this.currentPage;
            this.$router.push({ path: this.$route.path, query: queryString });
        }

        defunct (contestSetId: any) {
            this.axios.post("/api/admin/contestset/defunct", {
                id: contestSetId
            })
                .then(({ data }) => {
                    this.flushData(this.currentPage);
                });
        }

        page (num: any, arrow: any) {
            this.currentPage = arrow ? this.currentPage + arrow : num;
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
    .button_size {
        width: 140px;
    }
</style>
