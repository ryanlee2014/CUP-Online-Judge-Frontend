<template>
    <div>
    <div class="ui top attached tabular menu">
        <a :class="(mode === 1?'active':'')+' item'" @click="mode=1">{{$t("all user")}}</a>
        <a :class="(mode === 2?'active':'')+' item'" @click="mode=2">{{$t("current member")}}</a>
        <a :class="(mode === 3?'active':'')+' item'" @click="mode=3">{{$t("retired member")}}</a>
        <a :class="(mode === 4?'active':'')+' item'" @click="mode=4">{{$t("new user")}}</a>
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
                            <label>{{$t("user_id")}}: </label>
                            <div class="ui input">
                                <input @keyup="search_user($event)" name="user">
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
        <table class="ui padded borderless selectable table" style="width:100%">
            <thead>
            <tr>
                <th class="center head" width="7%">{{$t("rank")}}</th>
                <th class="center head" width="10%"><b>{{$t("user_id")}}</b></th>
                <th width="5%"></th>
                <th width="15%"><b>{{$t("nick")}}</b></th>
                <th class="center head" width="53%">{{$t("biography")}}</th>
                <th class="center head" style="text-align: center" width="10%"><b>{{$t("accept")}}</b></th>
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
                    <v-gravatar :hostname="$store.getters.gravatarCDN" :original-src="getAvatarURL(row)" class="ui avatar image" :email="row.email" style="object-fit: cover;"></v-gravatar>

                </td>
                <td>
                    {{convertHTML(row.nick)}}
                </td>
                <td class="center head" v-html="row.biography"></td>
                <td class="center head" style="text-align: center">
                    <router-link :to="`/status?user_id=${row.user_id}&jresult=4`">{{row.solved || 0}}</router-link>
                </td>
            </tr>
            </tbody>
        </table>
        <a :class="'ui button '+(page === 0?'disabled':'')" @click="page !== 0 && _page(-page,$event)" class="ui button"
           v-cloak>
            Top
        </a>

        <a :class="'ui left labeled icon button '+(page > 0?'':'disabled')" @click="page&&_page(-1,$event)"
           class="ui left labeled icon button">
            <i class="left arrow icon"></i>
            Prev
        </a>
        <a :class="'ui right labeled icon button '+((page+1)*50+1 > registed_user?'disabled':'')"
           @click="page*50<registed_user&&_page(1,$event)"
           class="ui right labeled icon button">
            <i class="right arrow icon"></i>
            Next
        </a>
    </div>
    <table-card :content="acmmem" :page="page" @click="mode = 2" v-show="mode === 2"></table-card>
    <table-card :content="retiremem" :page="page" @click="mode = 3" v-show="mode === 3"></table-card>
    <table-card :content="recent_register" :page="page" @click="mode = 4" v-show="mode === 4"></table-card>
    </div>
</template>

<i18n>
    {
    "zh-cn": {
    "all user": "所有用户",
    "current member": "现役队员",
    "retired member": "退役队员",
    "new user": "新用户"
    },
    "en": {
    "all user": "All Users",
    "current member": "ACM Member",
    "retired member": "Retired Member",
    "new user": "New Users"
    },
    "ja": {
    "all user": "ユーザーリスト",
    "current member": "チームメンバー",
    "retired member": "リタイヤメンバー",
    "new user": "新規ユーザー"
    }
    }
</i18n>

<script lang="ts">
import { Component, Prop, Watch } from "vue-property-decorator";
import { mixins as Mixins } from "vue-class-component";
import tableCard from "./components/tableCard.vue";
import avatarMixin from "../../mixin/avatarMixin";
import SemanticEnvMixin from "@/mixin/SemanticEnvMixin";
import InitMixin from "@/mixin/init";
import MarkdownWorkerMixin from "@/mixin/MarkdownWorkerMixin";

interface IRanklistData {
    ranklist: any
}

interface IMember {
    ranklist: any
}

const emailSet: any = {};

@Component({
    components: {
        tableCard
    }
})
export default class RanklistMainContent extends Mixins(MarkdownWorkerMixin, SemanticEnvMixin, avatarMixin, InitMixin) {
    [x: string]: any;
    $route: any;
    @Prop({ default: null }) rank!: any;
    registed_user = 0;
    acm_user = 0;
    mode: number = 1;
    page = 0;
    search = "";
    time_stamp = "";
    acmmember: IMember = { ranklist: [] };
    retiremember: IMember = { ranklist: [] };
    recent_register = [];
    ranklistData: IRanklistData | null = null;

    created () {
        this.page = parseInt(this.$route.query.page) || this.page;
        this.mode = this.$route.query.acm ? 2 : 1;
        this.search = this.$route.query.search || "";
    }

    @Watch("rank")
    onRankChange (val: any, oldVal: any) {
        this.ranklistData = val;
    }

    get ranklist () {
        let payload: any[];
        if (this.ranklistData && this.ranklistData.ranklist) {
            payload = this.ranklistData!.ranklist;
        }
        else if (this.rank && this.rank.ranklist) {
            payload = this.rank.ranklist;
        }
        else {
            payload = [];
        }
        payload.forEach(async (e: any) => {
            if (typeof e.biography === "string") {
                e.biography = await this.renderRawAsync(e.biography);
            }
            else {
                e.biography = "";
            }
        });
        return payload;
    }

    get acmmem () {
        return this.acmmember.ranklist;
    }

    set acmmem (val: IRanklistData) {
        this.acmmember = val;
    }

    get retiremem () {
        return this.retiremember.ranklist;
    }

    set retiremem (val) {
        this.retiremember = val;
    }

    convertHTML (str: string) {
        const doc = document.createElement("div");
        doc.innerHTML = str;
        return doc.innerText;
    }

    search_user ($event: any) {
        this.search = $event.target.value;
        this.axios.get(`/api/ranklist?page=${this.page}&search=${this.search}&time_stamp=${this.time_stamp}`)
            .then(({ data }) => {
                this.ranklistData = data;
            });
    }

    timestamp (time: any, $event: any) {
        this.time_stamp = time;
        this.axios.get(`/api/ranklist?page=${this.page}&search=${this.search}&time_stamp=${this.time_stamp}`)
            .then(({ data }) => {
                this.ranklistData = data;
            });
    }

    _page (diff: any, $event: any) {
        this.page += diff;
        const that = this;
        this.axios.get(`/api/ranklist?page=${this.page}&search=${this.search}&time_stamp=${this.time_stamp}`)
            .then(({ data }) => {
                this.ranklistData = data;
            });
    }

    mounted () {
        this.axios.get("/api/ranklist/user")
            .then(({ data }) => {
                this.registed_user = data[0].tot_user;
                this.acm_user = data[0].acm_user;
            });
        this.axios.get("/api/ranklist/acmmember")
            .then(({ data }) => {
                this.acmmem = data;
            });
        this.axios.get("/api/ranklist/oldmember")
            .then(({ data }) => {
                this.retiremem = data;
            });
        this.axios.get("/api/user/recent_register")
            .then(({ data }) => {
                this.recent_register = data.data;
            });
    }
}
</script>

<style scoped>

</style>
