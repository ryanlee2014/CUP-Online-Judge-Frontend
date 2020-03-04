<template>
    <div class="ui container padding" v-if="contest_mode || contestMode">
        <ContestMode/>
    </div>
    <div class="ui container padding" v-else>
        <h2 class="ui dividing header">
            {{$t("discuss")}}
        </h2>
        <div class="ui grid">
            <div class="row">
                <div class="thirteen wide column">
                    <div class="ui search">
                        <div class="ui icon input">
                            <input class="prompt" type="text" :placeholder="$t('search')" v-model="search">
                            <i class="search icon"></i>
                        </div>
                        <div class="results"></div>
                    </div>
                </div>
                <div class="three wide right aligned column">
                    <router-link to="/discuss/add" class="ui labeled icon blue mini button">
                        <i class="write icon"></i>
                        {{$t("post")}}
                    </router-link>
                </div>
            </div>
            <div class="row">
                <div id="word-cloud">

                </div>
            </div>
        </div>
        <table class="ui very basic center aligned table" v-cloak>
            <thead>
            <th width="5%">{{$t("id")}}</th>
            <th width="40%">{{$t("title")}}</th>
            <th>{{$t("author")}}</th>
            <th>{{$t("create time")}}</th>
            <th>{{$t("modify time")}}</th>
            <th>{{$t("latest post")}}</th>
            </thead>
            <tbody>
            <tr :key="key" v-for="(row,key) in table">
                <td>{{row.article_id}}</td>
                <td>
                    <router-link :to="`/discuss/thread/${row.article_id}`">
                        {{row.title}}
                    </router-link>
                </td>
                <td>
                    <router-link :to="`/user/${row.user_id}`">{{row.user_id}}</router-link>
                </td>
                <td>{{dayjs(row.create_time).format("YYYY-MM-DD HH:mm:ss")}}</td>
                <td>{{dayjs(row.edit_time).format("YYYY-MM-DD HH:mm:ss")}}</td>
                <td>{{dayjs(row.last_post).format("YYYY-MM-DD HH:mm:ss")}}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import { Mixins, Component, Watch } from "vue-property-decorator";
import ContestMode from "../components/contestMode/block.vue";
import mixins from "../mixin/init";
import dayjs from "dayjs";
import { mapGetters } from "vuex";

@Component({
    components: {
        ContestMode
    },
    computed: mapGetters(["contestMode"])
})
export default class Discuss extends Mixins(mixins) {
    page = 0;
    table_val = [];
    total = 0;
    search = "";
    contest_mode = false;
    dayjs = dayjs;

    @Watch("search")
    onSearchChanged (newVal: string) {
        const that = this;
        const page = this.page * 20;
        let url = "/api/discuss/";
        if (newVal && newVal.length > 0) {
            url += "search/" + newVal;
        }
        url += "?page=" + page;
        this.axios.get(url)
            .then(({ data }) => {
                if (data.contest_mode) {
                    that.contest_mode = true;
                    return;
                }
                if (data.discuss) {
                    this.table = data;
                }
                else {
                    this.table = {
                        discuss: data.data
                    };
                }
            });
    }

    mounted () {
        document.title = `Discuss -- ${document.title}`;
        const $route: any = this.$route;
        this.page = isNaN($route.hash.page) ? 0 : $route.hash.page;
        const page = this.page * 20;
        const that = this;
        this.axios.get("/api/discuss?page=" + page).then(({ data }) => {
            if (data.contest_mode) {
                that.contest_mode = true;
                return;
            }
            that.table = data;
        });
        this.axios.get("/api/discuss?page=" + page).then(({ data }) => {
            if (data.contest_mode) {
                that.contest_mode = true;
                return;
            }
            that.table = data;
        });
    }

    get table () {
        return this.table_val;
    }

    set table (data: any) {
        this.total = parseInt(data.total);
        this.table_val = data.discuss;
    }
}
</script>

<style scoped>

</style>
