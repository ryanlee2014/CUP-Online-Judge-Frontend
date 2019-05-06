<template>
    <div class="ui left aligned container">
        <div class="padding">
            <h2 class="ui dividing header">
                Problem Set
                <div class="sub header" v-cloak>
                    共开放{{total||0}}题
                    {{recent_one_month !== -1 && (!label) && (!search_tag) ? "最近一个月添加" + recent_one_month + "题" : "" }}
                </div>
            </h2>
            <div class="ui grid">
                <div class="row">
                    <div class="thirteen wide column">
                        <div class="ui grid">
                            <div class="five wide column">
                                <div class="ui search">
                                    <div class="ui icon input">
                                        <input class="prompt" type="text" name="search" id="psearch"
                                               placeholder="Problem,ID or Keyword" @keypress.enter="enter($event)">
                                        <i class="search icon"></i>
                                    </div>
                                    <div class="results"></div>
                                </div>
                            </div>
                            <div class="ten wide right aligned aligned column">
                                <selected-tag v-if="search_tag || label" :color="table.color" :data="search_tag"
                                              :label="label"></selected-tag>
                                <a class="ui mini labeled icon button" href="upload_problem.php" target="_blank" v-else>
                                    <i class="plus icon"></i>添加题目
                                </a>
                            </div>
                        </div>
                        <div class="ui grid">
                            <div class="sixteen wide column half_padding">
                                <pagination
                                        :total="total"
                                        :page_cnt="page_cnt"
                                        :current_page="current_page"></pagination>
                            </div>
                        </div>
                    </div>
                    <div class="three wide column">
                        <div class="row half_padding">
                            <div class="sixteen wide column">
                                <div class="ui toggle checkbox" id="show_tag" @click="check">
                                    <input type="checkbox">
                                    <label>显示标签</label>
                                </div>
                            </div>
                        </div>
                        <div class="row half_padding">
                            <div class="sixteen wide column">
                                <div class="ui toggle checkbox" id="hide_currect" @click="hide">
                                    <input type="checkbox">
                                    <label>隐藏通过题目</label>
                                </div>
                            </div>
                        </div>
                        <div class="row half_padding">
                            <div class="sixteen wide column">
                                <div class="ui toggle checkbox" id="show_cloud" @click="cloud">
                                    <input type="checkbox">
                                    <label>显示标签云</label>
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
                                :show_tag="show_tag"
                                :order="order"
                                :order_target="order_target"
                                :hide_currect="hide_currect"
                        >
                        </main-content>
                    </div>
                </div>
                <div class="four wide column" v-show="show_label_cloud">
                    <div class="ui sticky element">

                        <div class="ui fluid card">
                            <div class="content">
                                <div class="header">Label Cloud</div>
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
                                    :total="total"
                                    :page_cnt="page_cnt"
                                    :current_page="current_page"></pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    // eslint-disable-next-line no-unused-vars
    import Pagination from '@/components/problemset/pagination.vue'
    import selectedTag from '@/components/problemset/selected-tag.vue'
    import mainContent from '@/components/problemset/MainContent.vue'
    import util from "../lib/util"
    // eslint-disable-next-line no-unused-vars
    const $ = require("jquery"), jQuery = $;
    window.jQuery = $;
    import G2 from '@antv/g2';
    import DataSet from '@antv/data-set';
    const _ = require("lodash");
    require("../static/js/semantic.min");
    util.init();
    $('#show_tag')
        .checkbox()
        .first().checkbox({
        onChecked: function () {
        },
        onUnchecked: function () {
        }
    });
    var HEIGHT = 320;
    var MAX_SIZE = 25, MIN_SIZE = 20;

    function getTextAttrs(cfg) {
        return _.assign({}, cfg.style, {
            fillOpacity: cfg.opacity,
            fontSize: cfg.origin._origin.size,
            rotate: cfg.origin._origin.rotate,
            text: cfg.origin._origin.text,
            textAlign: 'center',
            fontFamily: cfg.origin._origin.font,
            fill: cfg.color,
            textBaseline: 'Alphabetic'
        });
    }

    var _parameterCache = {};

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        if (_parameterCache[name + url]) {
            return _parameterCache[name + url];
        }
        // eslint-disable-next-line no-useless-escape
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return (_parameterCache[name + url] = decodeURIComponent(results[2].replace(/\+/g, " ")));
    }

    function parseQueryString(query) {
        var parsed = {};
        query.replace(
            new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
            function ($0, $1, $2, $3) {
                parsed[decodeURIComponent($1)] = decodeURIComponent($3);
            }
        );
        return parsed;
    }

    var query_string = parseQueryString(window.location.hash.substring(1));
    export default {
        name: "problemset",
        components: {
            mainContent,
            Pagination,
            selectedTag
        },
        data: function () {
            return {
                table: {},
                dim: false,
                current_page: query_string.page || 1,
                search_tag: query_string.search || getParameterByName("tag") || "",
                label: query_string.label || getParameterByName("label") || "",
                order: query_string.order || 0,
                order_target: query_string.target || "problem_id",
                show_tag: localStorage.getItem("show_tag") === 'true',
                page_cnt: query_string.page_cnt || 50,
                total: 0,
                recent_one_month: -1,
                hide_currect: localStorage.getItem("hide_currect") === 'true',
                show_label_cloud: localStorage.getItem("show_label_cloud") === 'true',
                chart: undefined,
                has_draw: false,
                contest_mode: false
            }
        },
        computed: {
            tables: {
                get: function () {
                    this.setQuery();
                    if (this.table.length == 0) {
                        if ($("tbody")[0].innerText.length) {
                            return $("tbody").html();
                        }
                        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                        this.dim = false;
                        return "<br><br><br>";
                    }
                    var color = this.table.color;
                    color["标签待整理"] = "black";
                    var problem = this.table.problem;
                    var len = problem.length;
                    var tot_html = "";
                    for (var i = 0; i < len; ++i) {
                        var html = "<tr style='vertical-align:middle'><td>";
                        if (problem[i].ac == true) {
                            html += "<i class='checkmark icon'></i>";
                        } else if (problem[i].ac == false) {
                            html += "<i class='remove icon'></i>";
                        }
                        html += "</td>";
                        html += "<td><div class='center'>" + problem[i].problem_id + "</div></td><td><div class='left aligned'><a href='newsubmitpage.php?id=" + problem[i].problem_id + "&js' target='_blank'>" + problem[i].title;
                        html += "</a>";
                        var label = problem[i].label ? problem[i].label.split(" ") : ["标签待整理"];
                        label.sort();
                        // eslint-disable-next-line no-console
                        console.log(label);
                        html += "<div class='show_tag_controled' style='float: right; '><span class='ui header'>";
                        for (var j = 0; j < label.length; ++j) {
                            html += "<a @click='tag(\"" + label[j] + "\",$event)' class='ui " + color[label[j]] + " label' target='_blank'>" + label[j] + "</a>";
                        }
                        html += "</span>";
                        html += "</div></div></td><td  class='hidden-xs'>	</td><td><div class='center'>" + problem[i].accepted + " / " + problem[i].submit + "<br>" + (parseInt(problem[i].accepted) / Math.max(parseInt(problem[i].submit), 1) * 100).toString().substring(0, 4) + " %</div></td></tr>";
                        tot_html += html;
                    }
                    return tot_html;
                },
                set: function (_t) {
                    this.page_cnt = _t.step;
                    this.total = _t.total;
                    this.table = _t;
                    if (_t.recent_one_month) {
                        this.recent_one_month = _t.recent_one_month;
                    }
                }
            }
        },
        methods: {
            setQuery: function () {
                var queryObject = {};
                if (this.page !== 0)
                    queryObject["page"] = this.current_page + 1;
                if (this.search_tag && this.search_tag !== "" && this.search_tag.length > 0)
                    queryObject["tag"] = this.search_tag;
                if (this.label && this.label !== "" && this.label.length > 0)
                    queryObject["label"] = this.label;
                this.$router.push({path: this.$route.path, query: queryObject});
            },
            page: function (num, arrow) {
                this.dim = true;
                var page = this.current_page = arrow ? this.current_page + arrow : num;
                var search_tag = this.search_tag || "none";
                var order = this.order;
                var order_target = this.order_target;
                //handler.activate.call(obj.target);
                var that = this;
                this.setQuery();
                $.get("/api/problemset/" + page + "/" + search_tag + "/" + order_target + "/" + order + "/?label=" + this.label, function (data) {
                    that.dim = false;
                    that.tables = data;
                })
            },
            sort: function (target, event, default_order = 0) {
                this.dim = true;
                var prev_target_equal_to_current = this.order_target == target;
                this.order_target = target;
                var page = this.current_page = 0;
                var search_tag = this.search_tag || "none";
                var order = this.order = prev_target_equal_to_current ? (-this.order + 1) : default_order;
                var that = this;
                $.get("/api/problemset/" + page + "/" + search_tag + "/" + target + "/" + order + "/?label=" + this.label, function (data) {
                    that.dim = false;
                    that.tables = data;
                })
            },
            tag: function (label) {
                if (label == "标签待整理") {
                    return;
                }
                this.label = label;
                var search_tag = this.search_tag || "none";
                this.dim = true;
                var order_target = this.order_target;
                var page = this.current_page = 0;
                var order = this.order;
                var that = this;
                this.setQuery();
                $.get("/api/problemset/" + page + "/" + search_tag + "/" + order_target + "/" + order + "/?label=" + this.label, function (data) {
                    that.dim = false;
                    that.tables = data;
                })
            },
            searching: function (label) {
                if (label == "标签待整理") {
                    return;
                }
                this.search_tag = label == "none" ? "" : label;
                this.dim = true;
                var order_target = this.order_target;
                var page = this.current_page = 0;
                var order = this.order;
                var that = this;
                this.setQuery();
                $.get("/api/problemset/" + page + "/" + label + "/" + order_target + "/" + order + "/?label=" + this.label, function (data) {
                    that.dim = false;
                    that.tables = data;
                })
            },
            remove: function (type) {
                if (type == 'search')
                    this.search_tag = "";
                else
                    this.label = "";
                this.dim = true;
                var order_target = this.order_target;
                var page = this.current_page;
                var order = this.order;
                var that = this;
                this.setQuery();
                $.get("/api/problemset/" + page + "/" + (this.search_tag || "none") + "/" + order_target + "/" + order + "/?label=" + this.label, function (data) {
                    that.dim = false;
                    that.tables = data;
                })
            },
            check: function () {
                this.show_tag = Boolean(-this.show_tag + 1);
                localStorage.setItem("show_tag", Boolean(this.show_tag));
            },
            hide: function () {
                this.hide_currect = Boolean(!this.hide_currect);
                localStorage.setItem("hide_currect", Boolean(this.hide_currect))
            },
            cloud: function () {
                if (!this.has_draw) {
                    this.drawLabelCloud();
                }
                this.show_label_cloud = Boolean(!this.show_label_cloud);
                localStorage.setItem("show_label_cloud", Boolean(this.show_label_cloud));
            },
            enter: function (obj) {
                var val = obj.target.value || "none";
                this.searching(val);
            },
            drawLabelCloud: function () {
                this.has_draw = true;
                var that = this;
                new Promise(function () {
                    $.get("/api/problem/local/?label=true", function (d) {
                        G2.Shape.registerShape('point', 'cloud', {
                            drawShape: function drawShape(cfg, container) {
                                var attrs = getTextAttrs(cfg);
                                return container.addShape('text', {
                                    attrs: _.assign(attrs, {
                                        x: cfg.x,
                                        y: cfg.y
                                    })
                                });
                            }
                        });
                        var data = [];
                        for (var i = 0; i < d.data.length; ++i) {
                            data.push({
                                tag: d.data[i],
                                count: Math.random() * i
                            })
                        }
                        var dv = new DataSet.View().source(data);
                        var range = dv.range('count');
                        var min = range[0];
                        var max = range[1];
                        dv.transform({
                            type: 'tag-cloud',
                            fields: ['tag', 'count'],
                            font: "Lato,Roboto,'Helvetica Neue',Arial,Helvetica,sans-serif",
                            forceFit: true,
                            size: [$("#word-cloud").width(), HEIGHT],
                            padding: 1.5,
                            timeInterval: 5000, // max execute time
                            rotate() {
                                return 0;
                            },
                            fontSize(d) {
                                return ((d.count - min) / (max - min)) * (MAX_SIZE - MIN_SIZE) + MIN_SIZE;
                            }
                        });
                        var chart = that.chart = new G2.Chart({
                            container: 'word-cloud',
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
                            .position('x*y')
                            .color('tag', ['#21BA45', '#009c95', '#2185D0', '#6435C9', '#E61A8D'])
                            .shape('cloud')
                            .tooltip(true)
                            .style({
                                cursor: 'pointer', // 设置鼠标手势
                            }); // 'tag*count'

                        chart.render();
                        chart.on('point:click', function (ev) {
                            that.tag(ev.data._origin['text']);
                            //location.href = "?tag=" + encodeURI();
                        });
                    });
                });

            }
        },
        created: function () {
            var that = this;
            var page = parseInt(getParameterByName("page") || query_string.page || "1") - 1;
            $(document).ready(function () {
                $("#show_tag").checkbox((that.show_tag ? "" : "un") + "check");
                $("#hide_currect").checkbox((that.hide_currect ? "" : "un") + "check");
                $("#show_cloud").checkbox((that.show_label_cloud ? "" : "un") + "check");
            })
            $("#show_tag").checkbox((this.show_tag ? "" : "un") + "check");
            $("#hide_currect").checkbox((that.hide_currect ? "" : "un") + "check");
            $("#show_cloud").checkbox((that.show_label_cloud ? "" : "un") + "check");

            this.current_page = page;
            $.get("/api/problemset/" + page + "/" + (this.search_tag || "none") + "/" + this.order_target + "/" + this.order + "/?label=" + this.label, function (data) {
                if (data.total) {
                    that.tables = data;
                } else {
                    that.contest_mode = data.contest_mode;
                }
            });

        },
        updated: function() {
            // eslint-disable-next-line no-console
            console.log(this.$route);
        },
        mounted: function () {
            $('.ui.search')
                .search({
                    apiSettings: {
                        url: '/api/problem/module/search/{query}'
                    },
                    fields: {
                        results: 'items',
                        title: 'title',
                        url: 'url',
                        description: 'source'
                    },
                    searchFields: [
                        'title', 'description', 'source', 'problem_id', 'label'
                    ],
                    minCharacters: 2
                });
            if (this.show_label_cloud) {
                setTimeout(this.drawLabelCloud, 300)
            }
        }
    }

</script>

<style scoped>

</style>
