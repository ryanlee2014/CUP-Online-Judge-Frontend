<template>
    <div class="ui container padding">
        <h2 class="ui dividing header">Discuss</h2>
        <div class="ui breadcrumb">
            <router-link class="section" to="/discuss">讨论主页</router-link>
            <i class="right angle icon divider"></i>
            <div class="active section">Discuss ID:{{id}}</div>
        </div>
        <h1>{{thread_head.title}}</h1>
        <MainContent :content="content" :id="id" :owner="owner"
                     :thread_head="thread_head"></MainContent>
        <h3 class="ui dividing header">Comments</h3>
        <div class="ui comments">
            <div :key="key" class="comment" v-for="(row,key) in reply">
                <div class="avatar">
                    <router-link :src="'/avatar/'+row.user_id+'.jpg'" :to="`/user/${row.user_id}`" class="avatar"
                                 tag="img" v-if="row.avatar === 1"></router-link>
                    <router-link :src="'/assets/images/wireframe/white-image.png'" :to="`/user/${row.user_id}`"
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
                            Edit
                        </router-link>
                        <a @click="block_reply(row.comment_id)" class="reply" v-if="isadmin">屏蔽</a>
                        <!--<a class="reply">Reply</a>-->
                    </div>
                </div>

            </div>
        </div>
        <h3 class="ui dividing header">Reply</h3>
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
                <i class="icon edit"></i> Add Reply
            </div>
        </form>
    </div>
</template>

<script>
import MainContent from "../../components/discuss/MainContent";
import mixins from "../../mixin/init";
import markdownIt from "../../lib/markdownIt/markdownIt";
import mermaid from "mermaid";

const $ = require("jquery");
const _ = require("lodash");
const uslug = require("uslug");
const Clipboard = require("clipboard");
export default {
    name: "thread",
    components: {
        MainContent
    },
    mixins: [mixins],
    data: function () {
        return {
            page: 0,
            table_val: {},
            total: 0,
            id: this.$route.params.id || 0,
            replyText: "",
            captcha: "",
            owner: "",
            content: false,
            isadmin: false
        };
    },
    computed: {
        table: {
            get: function () {
                return this.table_val;
            },
            set: function (val) {
                _.forEach(val, function (v) {
                    if (v && v.length) {
                        _.forEach(v, function (v) {
                            if (v.content) {
                                v.content = markdownIt.render(v.content);
                            }
                        });
                    }
                });

                this.table_val = val;
                this.owner = val.owner;
                this.isadmin = val.admin;
            }
        },
        thread_head: function () {
            var context = {
                title: ""
            };
            _.assign(context, this.table_val.discuss_header_content);
            if (context.content) {
                context.content = markdownIt.render(context.content);
            }
            return context;
        },
        reply: function () {
            return this.table_val.discuss;
        }
    },
    created: function () {
        $(document).on("click", function () {
            $(".mermaid").each(function (el, v) {
                if ($(v).is(":visible")) {
                    mermaid.init(undefined, v);
                }
            });
        });
    },
    beforeUpdate: function () {
        // console.time("update use time");
    },
    updated: function () {
        console.log("updated");
        const tableOfContents = $(".table-of-contents");
        let $content = tableOfContents.html();
        let $container = $("#contentContainer");
        if (!$content) $content = "";
        tableOfContents.html("");
        if ($content) {
            $container.html("" + $content + "");
        }
        $("#sticky_content").sticky({
            context: "#main_context",
            offset: 50
        });
        $container.find("a").on("click", function () {
            $([document.documentElement, document.body]).animate({
                scrollTop: $(document.getElementById(uslug(this.innerText))).offset().top - 50
            }, 600);
            return false;
        });
        this.content = $content && $content.trim && $content.trim().length > 0 || ($container && $container.html() && $container.html().trim().length > 0);
    },
    mounted: function () {
        document.title = `Thread ${this.id} -- ${document.title}`;
        var page = this.page * 20;
        var that = this;
        $.get("/api/discuss/" + this.id + "?page=" + page, function (data) {
            that.table = data;
            $.get("/api/discuss/" + that.id + "?page=" + page, function (data) {
                that.table = data;
            });
        });

        this.$nextTick(function () {
            var copy_content = new Clipboard(".copy.context", {
                text: function (trigger) {
                    return $(trigger).parent().next().text();
                }
            });
            copy_content.on("success", function (e) {
                $(e.trigger)
                    .popup({
                        title: "Finished",
                        content: "Context is in your clipboard",
                        on: "click"
                    })
                    .popup("show");
            });
        });
    },
    methods: {
        replyComment: function () {
            var send = {
                comment: this.replyText,
                captcha: this.captcha
            };
            var that = this;
            $.post("/api/discuss/reply/" + this.id, send, function (data) {
                if (data.status == "OK") {
                    alert("回复成功");
                    location.reload();
                }
                else {
                    alert("回复失败！服务器发生未知错误");
                }
            });
        },
        block_reply: function (comment_id) {
            $.get("/api/discuss/update/reply/block/" + this.id + "/" + comment_id, function (data) {
                if (data.status == "OK") {
                    alert("操作成功");
                }
                else {
                    alert("操作失败");
                }
            });
        },
        readTime: function (content) {
            var doc = document.createElement("div");
            doc.innerHTML = content;
            return parseInt(Math.ceil(doc.innerText.length / 300) ** 1.41428579532);
        }
    }
};
</script>

<style scoped>
    .full.segment {
        height: 100%;
    }

    .black {
        color: black;
    }
</style>
