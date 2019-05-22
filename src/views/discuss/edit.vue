<template>
    <div class="ui container padding">
        <div class="ui grid">
            <div class="row" v-if="!reply">
                <h2 class="ui header">
                    Title
                </h2>
            </div>
            <div class="row" v-if="!reply">
                <div class="ui input">
                    <input size="50" type="text" v-model="title">
                </div>
            </div>
            <div class="row">
                <h2 class="ui header">
                    Content
                </h2>
            </div>
            <div class="row">
                <mavon-editor v-model="content"></mavon-editor>
            </div>
            <div class="row">
                <div class="two field">
                    <div class="ui left input" style="width:auto">
                        <input placeholder="验证码" type="text" v-model="captcha"><img alt="click to change"
                                                                                    height="40px"
                                                                                    onclick="this.src='/api/captcha?from=edit&random='+Math.random()"
                                                                                    src="/api/captcha?from=edit">
                    </div>
                </div>
            </div>
            <div class="row">
                <div @click="edit_post" class="ui blue labeled submit icon button">
                    <i class="icon edit"></i> Modify
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import mixins from '../../mixin/init'

    const $ = require("jquery");
    export default {
        name: "edit",
        mixins: [mixins],
        data: function () {
            return {
                content: "",
                title: "",
                captcha: "",
                reply: !!this.$route.params.comment_id,
                article_id: this.$route.params.article_id,
                comment_id: this.$route.params.comment_id
            }
        },
        mounted: function () {
            document.title = `Edit Thread -- ${document.title}`;
            const isMainContent = !this.reply;
            const that = this;
            if (isMainContent) {
                $.get("/api/discuss/update/main/" + this.article_id, function (data) {
                    that.content = data.data.content;
                    that.title = data.data.title;
                })
            } else {
                $.get("/api/discuss/update/reply/" + this.article_id + "/" + this.comment_id, function (data) {
                    that.content = data.data.content;
                })
            }
        },
        methods: {
            edit_post: function () {
                const send = {
                    title: this.title,
                    content: this.content,
                    captcha: this.captcha
                };
                const isMainContent = !this.reply;
                const that = this;
                if (isMainContent) {
                    $.post("/api/discuss/update/main/" + this.article_id, send, function (data) {
                        if (data.status === "OK") {
                            alert("更改成功");
                            that.$router.push({
                                path: `/discuss/thread/${that.article_id}`
                            })
                        } else {
                            alert("Error!\n" + data.statement);
                        }
                    })
                } else {
                    $.post("/api/discuss/update/reply/" + this.article_id + "/" + this.comment_id, send, function (data) {
                        if (data.status === "OK") {
                            alert("更改成功");
                            that.$router.push({
                                path: `/discuss/thread/${that.article_id}`
                            })
                        } else {
                            alert("Error!\n" + data.statement);
                        }
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>
