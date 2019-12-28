<template>
    <div class="ui left aligned container" id="problemsetContainer">
        <ContestMode v-if="contest_mode"></ContestMode>
        <div class="padding" v-else>
            <h2 class="ui dividing header">
                Problem Set
                <div class="sub header" v-cloak>
                    {{$tc("totalProblem", (total || 0), {n: total || 0})}}
                    {{recent_one_month !== -1 && (!label) && (!search_tag) ? $tc("addProblem", recent_one_month, {n:
                    recent_one_month}) : "" }}
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
                                <div @click="check" class="ui toggle checkbox" id="show_tag">
                                    <input type="checkbox">
                                    <label>{{$t("labelvisible")}}</label>
                                </div>
                            </div>
                        </div>
                        <div class="row half_padding">
                            <div class="sixteen wide column">
                                <div @click="hide" class="ui toggle checkbox" id="hide_currect">
                                    <input type="checkbox">
                                    <label>{{$t("hidepassedproblem")}}</label>
                                </div>
                            </div>
                        </div>
                        <div class="row half_padding">
                            <div class="sixteen wide column">
                                <div @click="cloud" class="ui toggle checkbox" id="show_cloud">
                                    <input type="checkbox">
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

                        <main-content
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
                                @pageUpdated="preloadContent"></pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import Pagination from "../components/problemset/pagination.vue";
import selectedTag from "../components/problemset/selected-tag.vue";
import mainContent from "../components/problemset/MainContent.vue";
import ContestMode from "../components/contestMode/block.vue";
import { Component, Mixins } from "vue-property-decorator";
import mixins from "../mixin/init";
import jquery from "jquery";
import _ from "lodash";

const DataSet = require("@antv/data-set");
const $: any = jquery;
const G2 = require("@antv/g2");
// eslint-disable-next-line no-unused-vars
$("#show_tag")
    .checkbox()
    .first().checkbox({
        onChecked () {
        },
        onUnchecked () {
        }
    });
let HEIGHT = 320;
let MAX_SIZE = 25;
let MIN_SIZE = 20;

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
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    let results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return (_parameterCache[name + url] = decodeURIComponent(results[2].replace(/\+/g, " ")));
}

function parseQueryString (query: any) {
    let parsed: any = {};
    query.replace(
        new RegExp("([^?=&]+)(=([^&]*))?", "g"),
        function ($0: any, $1: any, $2: any, $3: any) {
            parsed[decodeURIComponent($1)] = decodeURIComponent($3);
        }
    );
    return parsed;
}

const queryString = parseQueryString(window.location.hash.substring(1));

@Component({
    components: {
        mainContent,
        Pagination,
        selectedTag,
        ContestMode
    }
})
export default class ProblemSet extends Mixins(mixins) {
        table = {};
        dim = false;
        current_page = queryString.page || 1;
        search_tag = queryString.search || getParameterByName("tag") || "";
        label = queryString.label || getParameterByName("label") || "";
        order = queryString.order || 0;
        order_target = queryString.target || "problem_id";
        show_tag = localStorage.getItem("show_tag") === "true";
        page_cnt = queryString.page_cnt || 50;
        total = 0;
        recent_one_month = -1;
        hide_currect = localStorage.getItem("hide_currect") === "true";
        show_label_cloud = localStorage.getItem("show_label_cloud") === "true";
        chart = undefined;
        has_draw = false;
        contest_mode = false;

        get tables () {
            return {
                page_cnt: this.page_cnt,
                total: this.total,
                table: undefined,
                recent_one_month: this.recent_one_month
            };
        }

        set tables (_t: any) {
            this.page_cnt = _t.step;
            this.total = _t.total;
            this.table = _t;
            if (_t.recent_one_month) {
                this.recent_one_month = _t.recent_one_month;
            }
        }

        setQuery () {
            let queryObject: any = {};
            if (this.current_page !== 0) {
                queryObject["page"] = this.current_page + 1;
            }
            if (this.search_tag && this.search_tag !== "" && this.search_tag.length > 0) {
                queryObject["tag"] = this.search_tag;
            }
            if (this.label && this.label !== "" && this.label.length > 0) {
                queryObject["label"] = this.label;
            }
            this.$router.push({ path: this.$route.path, query: queryObject });
        }

        page (num: any, arrow: any) {
            // this.dim = true;
            let page = this.current_page = arrow ? this.current_page + arrow : num;
            let searchTag = this.search_tag || "none";
            let order = this.order;
            let orderTarget = this.order_target;
            let that = this;
            this.setQuery();
            this.axios.get("/api/problemset/" + page + "/" + searchTag + "/" + orderTarget + "/" + order + "/?label=" + this.label)
                .then(({ data }) => {
                    that.tables = data;
                });
        }

        sort (target: any, event: any, defaultOrder = 0) {
            // this.dim = true;
            let prevTargetEquivToCurrent = this.order_target === target;
            this.order_target = target;
            let page = this.current_page = 0;
            let searchTag = this.search_tag || "none";
            let order = this.order = prevTargetEquivToCurrent ? (-this.order + 1) : defaultOrder;
            let that = this;
            this.axios.get("/api/problemset/" + page + "/" + searchTag + "/" + target + "/" + order + "/?label=" + this.label)
                .then(({ data }) => {
                    that.dim = false;
                    that.tables = data;
                });
        }

        tag (label: any) {
            if (label === "标签待整理") {
                return;
            }
            this.label = label;
            let searchTag = this.search_tag || "none";
            // this.dim = true;
            let orderTarget = this.order_target;
            let page = this.current_page = 0;
            let order = this.order;
            let that = this;
            this.setQuery();
            this.axios.get("/api/problemset/" + page + "/" + searchTag + "/" + orderTarget + "/" + order + "/?label=" + this.label)
                .then(({ data }) => {
                    that.dim = false;
                    that.tables = data;
                });
        }

        searching (label: any) {
            if (label === "标签待整理") {
                return;
            }
            this.search_tag = label === "none" ? "" : label;
            // this.dim = true;
            let orderTarget = this.order_target;
            let page = this.current_page = 0;
            let order = this.order;
            let that = this;
            this.setQuery();
            const problemId = parseInt(label);
            this.axios.get("/api/problemset/" + page + "/" + label + "/" + orderTarget + "/" + order + "/?label=" + this.label)
                .then(({ data }) => {
                    that.dim = false;
                    if (!isNaN(problemId)) {
                        (data.problem || []).sort((a: any, b: any) => a.problem_id === problemId ? -1 : b.problem_id === problemId ? 1 : 0);
                    }
                    that.tables = data;
                });
        }

        remove (type: any) {
            if (type === "search") {
                this.search_tag = "";
            }
            else {
                this.label = "";
            }
            // this.dim = true;
            let orderTarget = this.order_target;
            let page = this.current_page;
            let order = this.order;
            let that = this;
            this.setQuery();
            this.axios.get("/api/problemset/" + page + "/" + (this.search_tag || "none") + "/" + orderTarget + "/" + order + "/?label=" + this.label)
                .then(({ data }) => {
                    that.dim = false;
                    that.tables = data;
                });
        }

        check () {
            this.show_tag = Boolean(-this.show_tag + 1);
            localStorage.setItem("show_tag", "" + Boolean(this.show_tag));
        }

        hide () {
            this.hide_currect = Boolean(!this.hide_currect);
            localStorage.setItem("hide_currect", "" + Boolean(this.hide_currect));
        }

        cloud () {
            if (!this.has_draw) {
                this.drawLabelCloud();
            }
            this.show_label_cloud = Boolean(!this.show_label_cloud);
            localStorage.setItem("show_label_cloud", "" + Boolean(this.show_label_cloud));
        }

        enter (obj: any) {
            let val = obj.target.value || "none";
            this.searching(val);
        }

        drawLabelCloud () {
            this.has_draw = true;
            let that = this;
            this.axios.get("/api/problem/local/?label=true")
                .then(response => {
                    const d = response.data;
                    G2.Shape.registerShape("point", "cloud", {
                        drawShape (cfg: any, container: any) {
                            let attrs = getTextAttrs(cfg);
                            return container.addShape("text", {
                                attrs: _.assign(attrs, {
                                    x: cfg.x,
                                    y: cfg.y
                                })
                            });
                        }
                    });
                    let data = [];
                    for (let i = 0; i < d.data.length; ++i) {
                        data.push({
                            tag: d.data[i],
                            count: Math.random() * i
                        });
                    }
                    let dv = new DataSet.View().source(data);
                    let range = dv.range("count");
                    let min = range[0];
                    let max = range[1];
                    dv.transform({
                        type: "tag-cloud",
                        fields: ["tag", "count"],
                        font: "Lato,Roboto,'Helvetica Neue',Arial,Helvetica,sans-serif",
                        forceFit: true,
                        size: [$("#word-cloud").width(), HEIGHT],
                        padding: 1.5,
                        timeInterval: 5000, // max execute time
                        rotate () {
                            return 0;
                        },
                        fontSize (d: any) {
                            return ((d.count - min) / (max - min)) * (MAX_SIZE - MIN_SIZE) + MIN_SIZE;
                        }
                    });
                    let chart = that.chart = new G2.Chart({
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
                    chart.coord().reflect();
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
                        that.tag(ev.data._origin["text"]);
                        // location.href = "?tag=" + encodeURI();
                    });
                });
        }

        initjQueryMethods () {
            $(".ui.search")
                .popup({
                    on: "click",
                    content: this.$t("press enter to search")
                });
        }

        updated () {
            this.initjQueryMethods();
        }

        preloadContent () {

        }

        mounted () {
            document.title = `Problem Set -- ${document.title}`;
            let that = this;
            let page = parseInt(getParameterByName("page") || queryString.page || "1") - 1;
            $(document).ready(function () {
                $("#show_tag").checkbox((that.show_tag ? "" : "un") + "check");
                $("#hide_currect").checkbox((that.hide_currect ? "" : "un") + "check");
                $("#show_cloud").checkbox((that.show_label_cloud ? "" : "un") + "check");
            });
            $("#show_tag").checkbox((this.show_tag ? "" : "un") + "check");
            $("#hide_currect").checkbox((that.hide_currect ? "" : "un") + "check");
            $("#show_cloud").checkbox((that.show_label_cloud ? "" : "un") + "check");

            this.current_page = page;
            this.axios.get("/api/problemset/" + page + "/" + (this.search_tag || "none") + "/" + this.order_target + "/" + this.order + "/?label=" + this.label)
                .then(({ data }) => {
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
            /* $(".ui.search")
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
                }); */
        }
}

</script>

<style scoped>
    #problemsetContainer {
        min-height: 80%;
    }
</style>
<i18n>
    {
    "zh-cn": {
    "totalProblem": "共开放{n}题",
    "addProblem": "最近一个月新增{n}题"
    },
    "en": {
    "totalProblem": "Total {n} problem | Total {n} problems",
    "addProblem": "{n} new problem in this month | {n} new problems in this month"
    },
    "ja": {
    "totalProblem": "{n}の質問があります",
    "addProblem": "{n}つの新しい質問を追加"
    }
    }
</i18n>
