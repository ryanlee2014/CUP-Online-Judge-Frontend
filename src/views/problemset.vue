<template>
    <div class="ui left aligned container" id="problemsetContainer">
        <ContestMode v-if="contest_mode || contestMode"></ContestMode>
        <div class="padding" v-else>
            <h2 class="ui dividing header">
                {{$t("problemset")}}
                <div class="sub header" v-cloak>
                    {{$tc("totalProblem", (total || 0), {n: total || 0})}}
                    {{recent_one_month !== -1 && (!label) && (!search_tag) ? $tc("addProblem", recent_one_month, {n:
                    recent_one_month}) : "" }}
                    <div class="ui active mini inline loader list-state-reloading" v-if="listReloading"></div>
                </div>
            </h2>
            <div class="ui grid">
                <div class="row">
                    <div class="thirteen wide column">
                        <div class="ui grid">
                            <div class="five wide column">
                                <div class="ui search">
                                    <div class="ui icon input">
                                        <input @keypress.enter="enter($event)" class="prompt" id="psearch" name="search"
                                               placeholder="Problem,ID or Keyword" type="text">
                                        <i class="search icon"></i>
                                    </div>
                                    <div class="results"></div>
                                </div>
                            </div>
                            <div class="ten wide right aligned aligned column">
                                <selected-tag :color="table.color" :data="search_tag" :label="label"
                                              v-if="search_tag || label"></selected-tag>
                                <router-link class="ui mini labeled icon button" to="/problem/upload">
                                    <i class="plus icon"></i>{{$t("addproblem")}}
                                </router-link>
                            </div>
                        </div>
                        <div class="ui grid">
                            <div class="sixteen wide column half_padding">
                                <pagination
                                    :current_page="current_page"
                                    :page_cnt="page_cnt"
                                    :total="total"
                                    @pageUpdated="preloadContent"
                                    :on-page-changed="page"
                                ></pagination>
                            </div>
                        </div>
                    </div>
                    <div class="three wide column">
                        <div class="row half_padding">
                            <div class="sixteen wide column">
                                <div class="ui toggle checkbox" id="show_tag">
                                    <input @change="check" type="checkbox" v-model="show_tag">
                                    <label>{{$t("labelvisible")}}</label>
                                </div>
                            </div>
                        </div>
                        <div class="row half_padding">
                            <div class="sixteen wide column">
                                <div class="ui toggle checkbox" id="hide_currect">
                                    <input @change="hide" type="checkbox" v-model="hide_currect">
                                    <label>{{$t("hidepassedproblem")}}</label>
                                </div>
                            </div>
                        </div>
                        <div class="row half_padding">
                            <div class="sixteen wide column">
                                <div class="ui toggle checkbox" id="show_cloud">
                                    <input @change="cloud" type="checkbox" v-model="show_label_cloud">
                                    <label>{{$t("showlabelcloud")}}</label>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div class="ui grid">
                <div :class="(show_label_cloud?'twelve':'sixteen')+' wide column'">
                    <div class="row">

                        <list-state :empty-text="$t('noMatchingProblem')" :state="listState"
                                    @retry="retryList"></list-state>
                        <main-content
                            :class="{'list-reloading': listReloading}"
                            v-show="hasRows"
                            :data="table"
                            :dim="dim"
                            :hide_currect="hide_currect"
                            :order="order"
                            :order_target="order_target"
                            :show_tag="show_tag"
                        >
                        </main-content>
                    </div>
                </div>
                <div class="four wide column" v-show="show_label_cloud">
                    <div class="ui sticky element">
                        <div class="ui fluid card">
                            <div class="content">
                                <div class="header">{{$t("labelcloud")}}</div>
                            </div>
                            <div class="content">
                                <div id="word-cloud">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="ui grid">
                        <div class="sixteen wide column half_padding">
                            <pagination
                                :current_page="current_page"
                                :page_cnt="page_cnt"
                                :total="total"
                                @pageUpdated="preloadContent"
                                :on-page-changed="page"
                            ></pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Pagination from "../components/problemset/pagination.vue";
import selectedTag from "../components/problemset/selected-tag.vue";
import mainContent from "../components/problemset/MainContent.vue";
import ContestMode from "../components/contestMode/block.vue";
import ListState, { ListStateType } from "../components/common/ListState.vue";
import { mapGetters } from "vuex";
import { defineComponent } from "vue";
import { initMixin } from "../mixin/init";
import jquery from "jquery";
import * as _ from "lodash-es";
// @antv/g2 + data-set are only needed for the optional tag cloud: loaded on demand
const $: any = jquery;
const HEIGHT = 320;
const MAX_SIZE = 25;
const MIN_SIZE = 20;

function getTextAttrs (cfg: any) {
    return _.assign({}, cfg.style, {
        fillOpacity: cfg.opacity,
        fontSize: cfg.origin._origin.size,
        rotate: cfg.origin._origin.rotate,
        text: cfg.origin._origin.text,
        textAlign: "center",
        fontFamily: cfg.origin._origin.font,
        fill: cfg.color,
        textBaseline: "Alphabetic"
    });
}

const _parameterCache: any = {};

function getParameterByName (name: string, url?: string) {
    if (!url) url = window.location.href;
    if (_parameterCache[name + url]) {
        return _parameterCache[name + url];
    }
    // eslint-disable-next-line no-useless-escape
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return (_parameterCache[name + url] = decodeURIComponent(results[2].replace(/\+/g, " ")));
}

function parseQueryString (query: any) {
    const parsed: any = {};
    query.replace(
        new RegExp("([^?=&]+)(=([^&]*))?", "g"),
        function ($0: any, $1: any, $2: any, $3: any) {
            parsed[decodeURIComponent($1)] = decodeURIComponent($3);
        }
    );
    return parsed;
}

const queryString = parseQueryString(window.location.hash.substring(1));

export default defineComponent({
    components: {
        mainContent,
        Pagination,
        selectedTag,
        ContestMode,
        ListState
    },
    mixins: [initMixin],
    data () {
        return {
            table: {} as any,
            dim: false,
            current_page: (queryString.page || 1) as any,
            search_tag: (queryString.search || getParameterByName("tag") || "") as any,
            label: (queryString.label || getParameterByName("label") || "") as any,
            order: (queryString.order || 0) as any,
            order_target: (queryString.target || "problem_id") as any,
            show_tag: localStorage.getItem("show_tag") === "true",
            page_cnt: (queryString.page_cnt || 50) as any,
            total: 0 as any,
            recent_one_month: -1 as any,
            hide_currect: localStorage.getItem("hide_currect") === "true",
            show_label_cloud: localStorage.getItem("show_label_cloud") === "true",
            has_draw: false,
            contest_mode: false as any,
            // list request state (loading skeleton / empty / error + retry)
            listLoading: false,
            listLoaded: false,
            listError: false
        };
    },
    computed: {
        ...mapGetters(["contestMode"]),
        tables: {
            get (): any {
                return {
                    page_cnt: this.page_cnt,
                    total: this.total,
                    table: undefined,
                    recent_one_month: this.recent_one_month
                };
            },
            set (_t: any): void {
                this.page_cnt = _t.step;
                this.total = _t.total;
                this.table = _t;
                if (_t.recent_one_month) {
                    this.recent_one_month = _t.recent_one_month;
                }
            }
        },
        hasRows (): boolean {
            const problem = this.table && this.table.problem;
            return !!problem && problem.length > 0;
        },
        listReloading (): boolean {
            return this.listLoading && this.listLoaded;
        },
        listState (): ListStateType {
            if (this.listError) {
                return "error";
            }
            if (this.hasRows) {
                return null;
            }
            return this.listLoaded ? "empty" : "loading";
        }
    },
    watch: {
        show_tag: "check",
        // NOTE: watches a non-existent key (typo of hide_currect) exactly like the former @Watch("hide_current")
        hide_current: "hide",
        show_label_cloud: "cloud"
    },
    updated () {
        this.initjQueryMethods();
    },
    mounted () {
        document.title = `Problem Set -- ${document.title}`;
        const that = this;
        const page = parseInt(getParameterByName("page") || queryString.page || "1") - 1;
        this.current_page = page;
        this.requestProblemSet("/api/problemset/" + page + "/" + (this.search_tag || "none") + "/" + this.order_target + "/" + this.order + "/?label=" + this.label,
            (data: any) => {
                if (data.total) {
                    if (this.show_label_cloud) {
                        setTimeout(this.drawLabelCloud, 300);
                    }
                    that.tables = data;
                }
                else {
                    that.contest_mode = data.contest_mode;
                }
            });
        /*
         $(".ui.search")
            .search({
                apiSettings: {
                    url: "/api/problem/module/search/{query}"
                },
                fields: {
                    results: "items",
                    title: "title",
                    url: "url",
                    description: "source"
                },
                searchFields: [
                    "title", "description", "source", "problem_id", "label"
                ],
                minCharacters: 2
            });
            */
    },
    methods: {
        /**
         * Runs a problem list request and tracks loading / error state.
         * Only failures of the request itself are turned into the error state; the retry re-runs the same request.
         */
        requestProblemSet (url: string, onData: (data: any) => void): void {
            const self = this as any;
            const seq = self.listRequestSeq_ = (self.listRequestSeq_ || 0) + 1;
            self.retry_ = () => this.requestProblemSet(url, onData);
            this.listLoading = true;
            this.listError = false;
            this.axios.get(url)
                .then(({ data }) => {
                    if (seq === self.listRequestSeq_) {
                        this.listLoading = false;
                        this.listLoaded = true;
                    }
                    onData(data);
                }, () => {
                    if (seq === self.listRequestSeq_) {
                        this.listLoading = false;
                        this.listError = true;
                    }
                });
        },

        retryList (): void {
            const retry = (this as any).retry_;
            if (typeof retry === "function") {
                retry();
            }
        },

        setQuery (): void {
            const queryObject: any = {};
            if (this.current_page !== 0) {
                queryObject.page = this.current_page + 1;
            }
            if (this.search_tag && this.search_tag !== "" && this.search_tag.length > 0) {
                queryObject.tag = this.search_tag;
            }
            if (this.label && this.label !== "" && this.label.length > 0) {
                queryObject.label = this.label;
            }
            this.$router.push({ path: this.$route.path, query: queryObject });
        },

        page (num: any, arrow: any): void {
            // this.dim = true;
            const page = this.current_page = arrow ? this.current_page + arrow : num;
            const searchTag = this.search_tag || "none";
            const order = this.order;
            const orderTarget = this.order_target;
            const that = this;
            this.setQuery();
            this.requestProblemSet("/api/problemset/" + page + "/" + searchTag + "/" + orderTarget + "/" + order + "/?label=" + this.label,
                (data: any) => {
                    that.tables = data;
                });
        },

        sort (target: any, event: any, defaultOrder = 0): void {
            // this.dim = true;
            const prevTargetEquivToCurrent = this.order_target === target;
            this.order_target = target;
            const page = this.current_page = 0;
            const searchTag = this.search_tag || "none";
            const order = this.order = prevTargetEquivToCurrent ? (-this.order + 1) : defaultOrder;
            const that = this;
            this.requestProblemSet("/api/problemset/" + page + "/" + searchTag + "/" + target + "/" + order + "/?label=" + this.label,
                (data: any) => {
                    that.dim = false;
                    that.tables = data;
                });
        },

        tag (label: any): void {
            if (label === "标签待整理") {
                return;
            }
            this.label = label;
            const searchTag = this.search_tag || "none";
            // this.dim = true;
            const orderTarget = this.order_target;
            const page = this.current_page = 0;
            const order = this.order;
            const that = this;
            this.setQuery();
            this.requestProblemSet("/api/problemset/" + page + "/" + searchTag + "/" + orderTarget + "/" + order + "/?label=" + this.label,
                (data: any) => {
                    that.dim = false;
                    that.tables = data;
                });
        },

        searching (label: any): void {
            if (label === "标签待整理") {
                return;
            }
            this.search_tag = label === "none" ? "" : label;
            // this.dim = true;
            const orderTarget = this.order_target;
            const page = this.current_page = 0;
            const order = this.order;
            const that = this;
            this.setQuery();
            const problemId = parseInt(label);
            this.requestProblemSet("/api/problemset/" + page + "/" + label + "/" + orderTarget + "/" + order + "/?label=" + this.label,
                (data: any) => {
                    that.dim = false;
                    if (!isNaN(problemId)) {
                        (data.problem || []).sort((a: any, b: any) => a.problem_id === problemId ? -1 : b.problem_id === problemId ? 1 : 0);
                    }
                    that.tables = data;
                });
        },

        remove (type: any): void {
            if (type === "search") {
                this.search_tag = "";
            }
            else {
                this.label = "";
            }
            // this.dim = true;
            const orderTarget = this.order_target;
            const page = this.current_page;
            const order = this.order;
            const that = this;
            this.setQuery();
            this.requestProblemSet("/api/problemset/" + page + "/" + (this.search_tag || "none") + "/" + orderTarget + "/" + order + "/?label=" + this.label,
                (data: any) => {
                    that.dim = false;
                    that.tables = data;
                });
        },

        check (val: boolean): void {
            localStorage.setItem("show_tag", "" + val);
        },

        hide (val: boolean): void {
            localStorage.setItem("hide_currect", "" + val);
        },

        cloud (val: boolean): void {
            if (!this.has_draw) {
                this.drawLabelCloud();
            }
            localStorage.setItem("show_label_cloud", "" + val);
        },

        enter (obj: any): void {
            const val = obj.target.value || "none";
            this.searching(val);
        },

        drawLabelCloud (): void {
            this.has_draw = true;
            const that = this;
            Promise.all([
                this.axios.get("/api/problem/local/?label=true"),
                import(/* webpackChunkName: "antv-g2" */ "@antv/g2"),
                import(/* webpackChunkName: "antv-g2" */ "@antv/data-set")
            ])
                .then(([response, g2Module, dataSetModule]: any[]) => {
                    const G2: any = g2Module.default || g2Module;
                    const DataSet: any = dataSetModule.default || dataSetModule;
                    const d = response.data;
                    G2.Shape!.registerShape!("point", "cloud", {
                        drawShape (cfg: any, container: any) {
                            const attrs = getTextAttrs(cfg);
                            return container.addShape("text", {
                                attrs: _.assign(attrs, {
                                    x: cfg.x,
                                    y: cfg.y
                                })
                            });
                        }
                    });
                    const data = [];
                    for (let i = 0; i < d.data.length; ++i) {
                        data.push({
                            tag: d.data[i],
                            count: Math.random() * i
                        });
                    }
                    const dv = new DataSet.View().source(data);
                    const range = dv.range("count");
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const min = range[0];
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const max = range[1];
                    dv.transform({
                        type: "tag-cloud",
                        fields: ["tag", "count"],
                        font: () => "Lato,Roboto,'Helvetica Neue',Arial,Helvetica,sans-serif",
                        size: [$("#word-cloud").width(), HEIGHT],
                        padding: 1.5,
                        timeInterval: 5000, // max execute time
                        rotate: 0,
                        fontSize: 14
                    });
                    // chart instance is kept off reactive data
                    const chart = (that as any).chart_ = new G2.Chart({
                        container: "word-cloud",
                        forceFit: true,
                        height: HEIGHT,
                        padding: 0
                    });
                    chart.source(dv);
                    chart.legend(false);
                    chart.axis(false);
                    chart.tooltip({
                        showTitle: false
                    });
                    chart.coord("rect").reflect();
                    chart.point()
                        .position("x*y")
                        .color("tag", ["#21BA45", "#009c95", "#2185D0", "#6435C9", "#E61A8D"])
                        .shape("cloud")
                        .tooltip(true)
                        .style({
                            cursor: "pointer" // 设置鼠标手势
                        }); // 'tag*count'

                    chart.render();
                    chart.on("point:click", function (ev: any) {
                        that.tag(ev.data._origin.text);
                        // location.href = "?tag=" + encodeURI();
                    });
                });
        },

        initjQueryMethods (): void {
            $(".ui.search")
                .popup({
                    on: "click",
                    content: this.$t("press enter to search")
                });
        },

        preloadContent (): void {

        }
    }
});

</script>

<style scoped>
    #problemsetContainer {
        min-height: 80%;
    }

    .list-reloading {
        opacity: .55;
        transition: opacity .2s;
    }

    .list-state-reloading {
        margin-left: .5em;
    }
</style>
<i18n>
    {
    "zh-cn": {
    "totalProblem": "共开放{n}题",
    "addProblem": "最近一个月新增{n}题",
    "noMatchingProblem": "没有符合条件的题目"
    },
    "en": {
    "totalProblem": "Total {n} problem | Total {n} problems",
    "addProblem": "{n} new problem in this month | {n} new problems in this month",
    "noMatchingProblem": "No problems match the current filter"
    },
    "ja": {
    "totalProblem": "{n}の質問があります",
    "addProblem": "{n}つの新しい質問を追加",
    "noMatchingProblem": "条件に一致する問題はありません"
    }
    }
</i18n>
