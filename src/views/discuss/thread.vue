<template>
    <div class="ui container padding">
        <h2 class="ui dividing header">{{$t("discuss")}}</h2>
        <div class="ui breadcrumb">
            <router-link class="section" to="/discuss">讨论主页</router-link>
            <i class="right angle icon divider"></i>
            <div class="active section">Discuss ID:{{id}}</div>
        </div>
        <h1>{{thread_head ? thread_head.title : ""}}</h1>
        <MainContent :id="id" :owner="owner"
                     :thread_head="thread_head || {}"></MainContent>
        <h3 class="ui dividing header">{{$t("comments")}}</h3>
        <div class="ui comments">
            <div :key="key" class="comment" v-for="(row,key) in reply">
                <div class="avatar">
                    <router-link :src="getAvatarURL(row)" :to="`/user/${row.user_id}`" class="avatar"
                                 tag="img" v-if="hasAvatarURL(row)"></router-link>
                    <router-link src="@/static/image/white-image.png" :to="`/user/${row.user_id}`"
                                 tag="img" v-else></router-link>
                </div>
                <div class="content">
                    <router-link :to="`/user/${row.user_id}`" class="author">{{row.nick}}</router-link>
                    <div class="metadata">
                        <span class="date">{{new Date(row.create_time).toLocaleString()}}</span>
                    </div>
                    <div class="text" v-html="row.content">
                    </div>
                    <div class="actions">
                        <router-link :to="`/discuss/edit/${id}/${row.comment_id}`" class="reply"
                                     v-if="row.user_id + '' === owner">
                            {{$t("edit")}}
                        </router-link>
                        <a @click="block_reply(row.comment_id)" class="reply" v-if="isadmin">屏蔽</a>
                        <!--<a class="reply">Reply</a>-->
                    </div>
                </div>

            </div>
        </div>
        <h3 class="ui dividing header">{{$t("reply")}}</h3>
        <form class="ui reply form">
            <div class="field">
                <mavon-editor v-model="replyText"></mavon-editor>
            </div>
            <div class="two field">
                <div class="ui left input" style="width:auto">
                    <input id="vcode" name="vcode" placeholder="验证码" type="text" v-model="captcha"><img
                    alt="click to change" height="40px" id="vcode_graph"
                    onclick="this.src='/api/captcha?from=discuss&random='+Math.random()"
                    src="/api/captcha?from=discuss">
                </div>
            </div>
            <div @click="replyComment" class="ui blue labeled submit icon button">
                <i class="icon edit"></i> {{$t("add")}}
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import MainContent from "../../components/discuss/MainContent.vue";
import mixins from "../../mixin/init";
import avatarMixin from "../../mixin/avatarMixin";
import mermaidMixin from "../../mixin/mermaidMixin";
import jquery from "jquery";
import _ from "lodash";
import Clipboard from "clipboard";
import { Mixins, Component } from "vue-property-decorator";
import MarkdownWorkerMixin from "@/mixin/MarkdownWorkerMixin";

const $: any = jquery;
const uslug = require("uslug");
@Component({
    components: {
        MainContent
    }
})
export default class Thread extends Mixins(mixins, avatarMixin, MarkdownWorkerMixin) {
    page = 0;
    table_val: any = {};
    total = 0;
    id = 0;
    replyText = "";
    captcha = "";
    owner = "";
    isadmin = false;
    created () {
        this.id = parseInt(this.$route.params.id) || 0;
    }

    get table () {
        return this.table_val;
    }

    set table (val: any) {
        _.forEach(val, (v) => {
            if (v && v.length) {
                _.forEach(v, async (v) => {
                    if (v.content) {
                        v.content = await this.renderAsync(v.content);
                    }
                });
            }
        });

        this.table_val = val;
        this.owner = val.owner;
        this.isadmin = val.admin;
    }

    get thread_head () {
        const context: any = {
            title: ""
        };
        _.assign(context, this.table_val.discuss_header_content);
        return context;
    }

    get reply () {
        return this.table_val.discuss;
    }

    mounted () {
        document.title = `Thread ${this.id} -- ${document.title}`;
        const page = this.page * 20;
        const that = this;
        this.axios.get(`/api/discuss/${this.id}?page=${page}`)
            .then(({ data }) => {
                that.table = data;
            });

        this.$nextTick(function () {
            const copyContent = new Clipboard(".copy.context", {
                text: function (trigger) {
                    return $(trigger).parent().next().text();
                }
            });
            copyContent.on("success", (e) => {
                $(e.trigger)
                    .popup({
                        title: this.$t("finish") as string,
                        content: this.$t("Context is in your clipboard") as string,
                        on: "click"
                    })
                    .popup("show");
            });
        });
    }

    replyComment () {
        const send = {
            comment: this.replyText,
            captcha: this.captcha
        };
        this.axios.post(`/api/discuss/reply/${this.id}`, send)
            .then(({ data }) => {
                if (data.status === "OK") {
                    alert("回复成功");
                    location.reload();
                }
                else {
                    alert("回复失败！服务器发生未知错误");
                }
            });
    }

    block_reply (commentId: string) {
        this.axios.get(`/api/discuss/update/reply/block/${this.id}/${commentId}`)
            .then(({ data }) => {
                if (data.status === "OK") {
                    alert("操作成功");
                }
                else {
                    alert("操作失败");
                }
            });
    }

    readTime (content: string) {
        const doc = document.createElement("div");
        doc.innerHTML = content;
        return Math.trunc(Math.ceil(doc.innerText.length / 300) ** 1.41428579532);
    }
}
</script>

<style scoped>
    .full.segment {
        height: 100%;
    }

    .black {
        color: black;
    }
</style>
