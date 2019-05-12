<template>
    <div class="ui padding container contest">
        <h2 class="ui dividing header">
            Contest Set
        </h2>
        <div class="ui top attached tabular menu">
            <a :class="(current_column === 'contest' ? 'active':'') + ' item'"
               @click="current_column = 'contest'">测验</a>
            <a :class="(current_column === 'rank' ? 'active':'') + ' item'" @click="current_column = 'rank'">排名统计</a>
        </div>

        <div class="ui bottom attached segment" v-show="current_column === 'contest'">
            <div class="ui icon message">
                <i class="notched circle loading icon"></i>
                <div class="content">
                    <div class="header">
                        当前服务器时间
                    </div>
                    <p class="server_time"></p>
                </div>
            </div>
            <table class='ui padded celled unstackable selectable table' width=90%>
                <thead>
                <tr align=center class=toprow>
                    <th width=10%>ID</th>
                    <th width=45%>Name</th>
                    <th width=25%>Status</th>
                    <th v-if="admin" width=10%>Available</th>
                    <th width=10%>Private</th>
                    <th>Creator</th>
                </tr>
                </thead>
                <tbody>
                <tr :class="`${(key % 2 === 0 ? 'evenrow' : 'oddrow')} ${row.defunct === 'Y' ? 'active' : ''} ${contestIsRunning(row)}`"
                    :key="key"
                    v-for="(row,key) in contest_list">
                    <td>
                        {{row.contest_id}}{{row.cmod_visible === 1 ? "(EXAM)" : ""}}
                    </td>
                    <td>
                        <router-link :to="`/contest/${row.contest_id}`">
                            {{row.title}}
                        </router-link>
                    </td>
                    <td v-html="contestTimeFormat(row)">
                    </td>
                    <td v-if="admin">
                        {{row.defunct === 'Y' ? "隐藏" : "显示"}}
                    </td>
                    <td>
                        {{row.private ? "私有" : "公开"}}
                    </td>
                    <td>
                        <router-link :to="`/user/${row.user_id}`">
                            {{row.user_id}}
                        </router-link>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="ui bottom attached segment" v-show="current_column === 'rank'">
            <h3 class="ui dividing header">排名统计</h3>
            <div class="ui grid">
                <div class="fourteen wide column">
                    <div class="ui fluid multiple search selection dropdown">
                        <input @change="select1 = $event.target.value" name="country" type="hidden">
                        <i class="dropdown icon"></i>
                        <div class="default text">Select Contest Or Input Contest ID</div>
                        <div class="menu">
                            <div :data-value="row.contest_id" :key="key" class="item" v-for="(row,key) in contest_list">
                                {{"Contest" +
                                row.contest_id + " " + row.title}}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="two wide column">
                    <router-link class="primary button ui" :to="`/contest/rank/${select1}`">Go</router-link>
                </div>
            </div>
            <h3 class="ui dividing header">用户提交信息统计</h3>
            <div class="ui grid">

                <div class="fourteen wide column">
                    <div class="ui fluid multiple search selection dropdown">
                        <input @change="select2 = $event.target.value" name="country" type="hidden">
                        <i class="dropdown icon"></i>
                        <div class="default text">Select Contest Or Input Contest ID</div>
                        <div class="menu">
                            <div :data-value="row.contest_id" :key="key" :title="row.title" class="item"
                                 v-for="(row,key) in contest_list">{{"Contest" + row.contest_id + " " + row.title}}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="two wide column">
                    <a @click="run(2)" class="primary button ui">Go</a>
                </div>
            </div>
        </div>
    </div> <!-- /container -->
</template>

<script>
    import mixins from '../../mixin/init'

    const $ = require("jquery");
    window.$ = window.jQuery;
    require("../../static/js/semantic.min");
    const dayjs = require("dayjs");
    export default {
        name: "ContestSetView",
        mixins: [mixins],
        data() {
            return {
                admin: this.$store.getters.admin,
                contest_list: [],
                select1: "",
                select2: "",
                current_column: "contest"
            }
        },
        mounted() {
            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
            this.axios.get("/api/contest/list", this.$route.query)
                .then(({data}) => {
                    this.contest_list = data.data;
                });
            this.init();
        },
        methods: {
            init: function () {
                const diff = new Date().getTime() - new Date().getTime();
                function clock() {
                    let x, h, m, s, n, y, mon, d;
                    x = new Date(new Date().getTime() + diff);
                    y = x.getYear() + 1900;
                    if (y > 3000) y -= 1900;
                    mon = x.getMonth() + 1;
                    d = x.getDate();
                    h = x.getHours();
                    m = x.getMinutes();
                    s = x.getSeconds();
                    n = y + "-" + mon + "-" + d + " " + (h >= 10 ? h : "0" + h) + ":" + (m >= 10 ? m : "0" + m) + ":" + (s >= 10 ? s : "0" + s);
                    $(".server_time").text(n)
                }
                clock();
                setInterval(clock, 1000);
            },
            bindPopup: function () {
                if (this.admin) {
                    $(".ui.padded.table").popup({
                        title: "管理员视图",
                        content: "白色背景竞赛属于普通用户可见竞赛，灰色背景竞赛为不可见竞赛,绿色背景竞赛为正在进行中的竞赛",
                        position: "top center",
                        boundary: 'body'
                    });
                }
                $(".visible.tag").popup({
                    content: "点击可切换显示隐藏"
                });
                $(".private.tag").popup({
                    content: "点击可切换私有公有属性，公有属性不限制用户访问，私有属性需输入密码或列入列表才允许访问"
                });
                $('.multiple.search')
                    .dropdown({
                        fullTextSearch: true
                    })
            },
            contestIsRunning: function (row) {
                const start_time = dayjs(row.start_time), end_time = dayjs(row.end_time), current_time = dayjs();
                return current_time.isBefore(end_time) && current_time.isAfter(start_time) ? "positive" : "";
            },
            formatDate: function (second) {
                let fill_zero = function (str) {
                    if (str.length < 2) {
                        return "0" + str;
                    } else {
                        return str;
                    }
                };
                second = Math.abs(second);
                let day = String(parseInt(second / 3600 / 24));
                let hour = String(parseInt(second / 3600));
                hour = fill_zero(hour);
                let minute = String(parseInt((second - hour * 3600) / 60));
                minute = fill_zero(minute);
                let sec = String(second % 60);
                sec = fill_zero(sec);
                return `${day}天${hour}小时${minute}分${sec}秒`;
            },
            contestTimeFormat: function (row) {
                const start_time = dayjs(row.start_time), end_time = dayjs(row.end_time), current_time = dayjs();
                if (current_time.isAfter(end_time)) {
                    return `已于${end_time.format("YYYY-MM-DD HH:mm:ss")}结束`;
                } else if (current_time.isBefore(start_time)) {
                    return `将于${start_time.format("YYYY-MM-DD HH:mm:ss")}开始`;
                } else {
                    return `于${start_time.format("YYYY-MM-DD HH:mm:ss")}开始<br>已进行${this.formatDate(current_time.diff(start_time, 'second'))}`;
                }
            },
            run: function () {
            }
        }
    }
</script>

<style scoped>
    td {
        text-align: center !important;
    }
</style>
