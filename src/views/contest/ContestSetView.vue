<template>
    <div class="ui padding container contest">
        <h2 class="ui dividing header">
            Contest Set
        </h2>
        <div class="ui top attached tabular menu">
            <a :class="(current_column === 'contest' ? 'active':'') + ' item'"
               @click="current_column = 'contest'">{{$t("test")}}</a>
            <a :class="(current_column === 'rank' ? 'active':'') + ' item'" @click="current_column = 'rank'">{{$t("ranklist statistic")}}</a>
        </div>

        <div class="ui bottom attached segment" v-show="current_column === 'contest'">
            <div class="ui icon message">
                <i class="notched circle loading icon"></i>
                <div class="content">
                    <div class="header">
                        {{$t("current server time")}}
                    </div>
                    <p class="server_time"></p>
                </div>
            </div>
            <div class="ui grid">
                <div class="row">
                    <div class="thirteen wide column">
                        <Pagination :current_page="current_page" :page_cnt="page_cnt" :total="total_number" :on-page-changed="page"></Pagination>
                    </div>
                </div>
            </div>
            <ContestView :contest_list="contest_list"></ContestView>
            <div class="ui grid">
                <div class="row">
                    <div class="thirteen wide column">
                        <Pagination :current_page="current_page" :page_cnt="page_cnt" :total="total_number" :on-page-changed="page"></Pagination>
                    </div>
                </div>
            </div>
        </div>
        <div class="ui bottom attached segment" v-show="current_column === 'rank'">
            <h3 class="ui dividing header">{{$t("ranklist statistic")}}</h3>
            <div class="ui grid">
                <div class="fourteen wide column">
                    <div class="ui fluid multiple search selection dropdown">
                        <input @change="select1 = $event.target.value" name="country" type="hidden">
                        <i class="dropdown icon"></i>
                        <div class="default text">Select Contest Or Input Contest ID</div>
                        <div class="menu">
                            <div :data-value="row.contest_id" :key="key" class="item" v-for="(row,key) in total_contest_list">
                                {{"Contest" +
                                row.contest_id + " " + row.title}}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="two wide column">
                    <router-link :to="`/contest/rank/${select1}`" class="primary button ui">Go</router-link>
                </div>
            </div>
            <h3 class="ui dividing header">{{$t("user submit statistics")}}</h3>
            <div class="ui grid">

                <div class="fourteen wide column">
                    <div class="ui fluid multiple search selection dropdown">
                        <input @change="select2 = $event.target.value" name="country" type="hidden">
                        <i class="dropdown icon"></i>
                        <div class="default text">Select Contest Or Input Contest ID</div>
                        <div class="menu">
                            <div :data-value="row.contest_id" :key="key" :title="row.title" class="item"
                                 v-for="(row,key) in total_contest_list">{{"Contest" + row.contest_id + " " + row.title}}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="two wide column">
                    <router-link :to="`/status/user/contest/${select2}`" class="primary button ui">Go</router-link>
                </div>
            </div>
        </div>
    </div> <!-- /container -->
</template>
<i18n>
    {
    "zh-cn": {
    "user submit statistics": "用户提交信息统计",
    "current server time": "当前服务器时间",
    "ranklist statistic": "排名统计",
    "start": "开始",
    "end": "结束"
    },
    "en": {
    "user submit statistics": "User Submit Statistics",
    "current server time": "Server Time",
    "ranklist statistic": "Ranklist Statistics",
    "start": "Start",
    "end": "End"
    },
    "ja": {
    "user submit statistics": "ユーザー提出統計",
    "current server time": "サーバー時間",
    "ranklist statistic": "ランキング統計",
    "start": "始め",
    "end": "終わり"
    }
    }
</i18n>

<script lang="ts">
import mixins from "../../mixin/init";
import jquery from "jquery";
import dayjs, { Dayjs } from "dayjs";
import { Mixins, Component, Watch } from "vue-property-decorator";
import { Interval } from "../../module/Decorator/method";
import TimerMixin from "@/mixin/TimerMixin";
import Pagination from "@/components/problemset/pagination.vue";
import ContestView from "@/components/contest/contest-view.vue";

const $: any = jquery;
@Component({
    components: {
        ContestView,
        Pagination
    }
})
export default class ContestSetView extends Mixins(mixins, TimerMixin) {
    admin = false;
    contest_list: any[] = [];
    total_contest_list: any[] = [];
    select1 = "";
    select2 = "";
    current_column = "contest";
    page_cnt = 50;
    current_page = 0;
    total_number = 0;
    prevGetPageCancelToken: any = null;
    created () {
        this.admin = this.$store.getters.admin;
        let page: any = this.$route.query.page;
        if (page === null || typeof page === "undefined" || isNaN(parseInt(page as string))) {
            page = 0;
        }
        else {
            page = parseInt(page);
        }
        this.current_page = page;
    }
    mounted () {
        document.title = `Contest Set -- ${document.title}`;
        this.axios.get("/api/contest/total")
            .then(({ data }) => {
                this.total_number = data.data;
            });
        this.getPage();
        this.init();
    }

    setQuery (mergeOptions?: any) {
        let queryString: any = Object.assign({}, this.$route.query);
        Object.assign(queryString, mergeOptions);
        this.$router.push({ path: this.$route.path, query: queryString });
    }

    @Watch("current_page", { immediate: true })
    onCurrentPageChanged (newVal: any) {
        this.setQuery({ page: newVal });
    }

    @Watch("$route.query")
    onRouteQueryChanged (newVal: any) {
        this.getPage(newVal);
    }

    @Watch("current_column")
    onCurrentColumnChanged () {
        if (this.total_contest_list.length === 0) {
            this.axios.get("/api/contest/list/all")
                .then(({ data }) => {
                    this.total_contest_list = data.data;
                });
        }
    }

    page (num: number, arrow: any) {
        this.current_page = arrow ? this.current_page + arrow : num;
    }

    cancelPrevGetPage () {
        if (this.prevGetPageCancelToken !== null) {
            this.prevGetPageCancelToken.cancel();
        }
    }

    getPage (mergeOptions?: any) {
        this.cancelPrevGetPage();
        return this.axios.get("/api/contest/list", {
            params: Object.assign(this.getParams(), mergeOptions),
            cancelToken: (this.prevGetPageCancelToken = this.axios.CancelToken.source()).token
        })
            .then(({ data }) => {
                this.prevGetPageCancelToken = null;
                this.contest_list = data.data;
            });
    }

    getParams () {
        const params = this.$route.query;
        for (let key in params) {
            if (!Object.prototype.hasOwnProperty.call(params, key)) {
                continue;
            }
            if (params[key] === null || params[key] === undefined) {
                params[key] = "1";
            }
        }
        return params;
    }

    @Interval(1000)
    clock () {
        $(".server_time").text(dayjs().format("YYYY-MM-DD HH:mm:ss"));
    }

    init () {
        this.clock();
    }
    bindPopup () {
        if (this.admin) {
            $(".ui.padded.table").popup({
                title: "管理员视图",
                content: "白色背景竞赛属于普通用户可见竞赛，灰色背景竞赛为不可见竞赛,绿色背景竞赛为正在进行中的竞赛",
                position: "top center",
                boundary: "body"
            });
        }
        $(".visible.tag").popup({
            content: "点击可切换显示隐藏"
        });
        $(".private.tag").popup({
            content: "点击可切换私有公有属性，公有属性不限制用户访问，私有属性需输入密码或列入列表才允许访问"
        });
        $(".multiple.search")
            .dropdown({
                fullTextSearch: true
            });
    }
}
</script>

<style scoped>
    td {
        text-align: center !important;
    }
</style>
