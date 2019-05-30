<template>
    <div>
        <div class="ui top attached tabular menu">
            <a @click="mode=1" :class="(mode === 1?'active':'')+' item'">所有用户</a>
            <a @click="mode=2" :class="(mode === 2?'active':'')+' item'">现役队员</a>
            <a @click="mode=3" :class="(mode === 3?'active':'')+' item'">退役队员</a>
            <a @click="mode=4" :class="(mode === 4?'active':'')+' item'">新用户</a>
        </div>
        <div class="ui bottom attached segment" v-show="mode === 1">
            <div class="ui stack segment">
                <div class="ui grid">
                    <div class="row">
                        <div class="four wide column">
                            <div class="ui mini statistic" style="margin:0">
                                <div class="value">
                                    <i class="user icon"></i>{{registed_user}}
                                </div>
                                <div class="label">
                                    Registered
                                </div>
                            </div>
                            <div class="ui mini statistic">
                                <div class="value">
                                    <i class="user circle outline icon"></i>{{acm_user}}
                                </div>
                                <div class="label">
                                    ACMER
                                </div>
                            </div>
                        </div>
                        <div class="five wide column">
                            <div class="ui search">
                                <label>{{_name.user}}</label>
                                <div class="ui input">
                                    <input name="user" @keyup="search_user($event)">
                                </div>
                            </div>
                        </div>
                        <div class="seven wide column  center aligned">
                            <a :class="'ui blue mini button '+(time_stamp === 'D'?'disabled':'')"
                               @click="timestamp('D',$event)">Day</a>
                            <a :class="'ui blue mini button '+(time_stamp === 'W'?'disabled':'')"
                               @click="timestamp('W',$event)">Week</a>
                            <a :class="'ui blue mini button '+(time_stamp === 'M'?'disabled':'')"
                               @click="timestamp('M',$event)">Month</a>
                            <a :class="'ui blue mini button '+(time_stamp === 'Y'?'disabled':'')"
                               @click="timestamp('Y',$event)">Year</a>
                            <a :class="'ui blue mini button '+(time_stamp === ''?'disabled':'')"
                               @click="timestamp('',$event)">Total</a>
                        </div>
                    </div>
                </div>
            </div>
            <table style="width:100%" class="ui padded borderless selectable table">
                <thead>
                <tr>
                    <th width="7%" class="center head">{{_name.rank}}</th>
                    <th width="10%" class="center head"><b>{{_name.user}}</b></th>
                    <th width="3%"></th>
                    <th width="15%"><b>{{_name.nick}}</b></th>
                    <th width="55%" class="center head">个人介绍</th>
                    <th width="10%" class="center head" style="text-align: center"><b>{{_name.accept}}</b></th>
                </tr>
                </thead>
                <tbody>
                <tr :key="key" v-for="(row,key,index) in ranklist">
                    <td class="center head">{{page*50+key+1}}</td>
                    <td class="center head">
                        <router-link :to="`/user/${row.user_id}`">
                            {{row.user_id}}
                        </router-link>
                    </td>
                    <td>
                        <img class="ui avatar image" :src="'/avatar/'+row.user_id+'.jpg'" v-if="row.avatar"
                             style="object-fit: cover;">
                        <img class="ui avatar image" src="/image/default-user.png" style="object-fit: cover;" v-else>
                    </td>
                    <td>
                        {{convertHTML(row.nick)}}
                    </td>
                    <td class="center head" v-html="markdownIt.renderRaw(row.biography||'')"></td>
                    <td class="center head" style="text-align: center">
                        <router-link :to="`/status?user_id=${row.user_id}&jresult=4`">{{row.solved || 0}}</router-link>
                    </td>
                </tr>
                </tbody>
            </table>
            <a v-cloak :class="'ui button '+(page == 0?'disabled':'')" @click="page != 0 && _page(-page,$event)"
               class="ui button">
                Top
            </a>

            <a @click="page&&_page(-1,$event)" class="ui left labeled icon button"
               :class="'ui left labeled icon button '+(page > 0?'':'disabled')">
                <i class="left arrow icon"></i>
                Prev
            </a>
            <a @click="page*50<registed_user&&_page(1,$event)" class="ui right labeled icon button"
               :class="'ui right labeled icon button '+((page+1)*50>=registed_user?'disabled':'')">
                <i class="right arrow icon"></i>
                Next
            </a>
        </div>
        <table-card :content="acmmem" :page="page" :_name="_name" v-show="mode === 2" @click="mode = 2"></table-card>
        <table-card :content="retiremem" :page="page" :_name="_name" v-show="mode === 3" @click="mode = 3"></table-card>
        <table-card :content="recent_register" :page="page" :_name="_name" v-show="mode === 4" @click="mode = 4"></table-card>
    </div>
</template>

<script>
import markdownIt from "../../lib/markdownIt/markdownIt";
import tableCard from "./components/tableCard";
const $ = require("jquery");
window.$ = window.jQuery = $;
require("../../static/js/semantic.min");
export default {
    name: "MainContent",
    props: {
        rank: Object
    },
    components: {
        tableCard
    },
    data: function () {
        return {
            registed_user: 0,
            acm_user: 0,
            mode: this.$route.query.acm ? 2 : 1,
            page: parseInt(this.$route.query.page) || 0,
            search: this.$route.query.search || "",
            time_stamp: "",
            acmmember: { ranklist: [] },
            retiremember: { ranklist: [] },
            recent_register: [],
            markdownIt,
            ranklistData: {}
        };
    },
    watch: {
        rank: function (val, oldVal) {
            this.ranklistData = val;
        }
    },
    computed: {
        _name: function () {
            if (this.ranklistData._name) {
                return this.ranklistData._name;
            }
            return {};
        },
        ranklist: function () {
            return this.ranklistData.ranklist;
        },
        acmmem: {
            get: function () {
                return this.acmmember.ranklist;
            },
            set: function (val) {
                this.acmmember = val;
            }
        },
        retiremem: {
            get: function () {
                return this.retiremember.ranklist;
            },
            set: function (val) {
                this.retiremember = val;
            }
        }
    },
    methods: {
        convertHTML: function (str) {
            var doc = document.createElement("div");
            doc.innerHTML = str;
            return doc.innerText;
        },
        search_user: function ($event) {
            var that = this;
            this.search = $event.target.value;
            $.get("/api/ranklist?page=" + this.page + "&search=" + this.search + "&time_stamp=" + this.time_stamp, function (data) {
                that.ranklistData = data;
            });
        },
        timestamp: function (time, $event) {
            var that = this;
            this.time_stamp = time;
            $.get("/api/ranklist?page=" + this.page + "&search=" + this.search + "&time_stamp=" + this.time_stamp, function (data) {
                that.ranklistData = data;
            });
        },
        _page: function (diff, $event) {
            this.page += diff;
            var that = this;
            $.get("/api/ranklist?page=" + this.page + "&search=" + this.search + "&time_stamp=" + this.time_stamp, function (data) {
                that.ranklistData = data;
            });
        }
    },
    mounted: function () {
        var that = this;
        $.get("/api/ranklist/user", function (data) {
            that.registed_user = data[0].tot_user;
            that.acm_user = data[0].acm_user;
        });
        $.get("/api/ranklist/acmmember", function (data) {
            that.acmmem = data;
        });
        $.get("/api/ranklist/oldmember", function (data) {
            that.retiremem = data;
        });
        this.axios.get("/api/user/recent_register")
            .then(({ data }) => {
                this.recent_register = data.data;
            });
    }
};
</script>

<style scoped>

</style>
