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

<script lang="ts">
import mixins from "../../mixin/init";
import jquery from "jquery";
import { Mixins, Component } from "vue-property-decorator";
const $: any = jquery;

@Component
export default class DiscussEdit extends Mixins(mixins) {
    content = "";
    title = "";
    captcha = "";
    reply = false;
    article_id = "";
    comment_id = "";
    created () {
        this.reply = !!this.$route.params.comment_id;
        this.article_id = this.$route.params.article_id;
        this.comment_id = this.$route.params.comment_id;
    }
    mounted () {
        document.title = `Edit Thread -- ${document.title}`;
        const isMainContent = !this.reply;
        const that = this;
        if (isMainContent) {
            this.axios.get(`/api/discuss/update/main/${this.article_id}`)
                .then(({ data }) => {
                    this.content = data.data.content;
                    this.title = data.data.title;
                });
        }
        else {
            this.axios.get(`/api/discuss/update/reply/${this.article_id}/${this.comment_id}`)
                .then(({ data }) => {
                    this.content = data.data.content;
                });
        }
    }

    editPostCallback (data: any) {
        if (data.status === "OK") {
            alert("更改成功");
            this.$router.push({
                path: `/discuss/thread/${this.article_id}`
            });
        }
        else {
            alert("Error!\n" + data.statement);
        }
    }

    get editUrl () {
        const isMainContent = !this.reply;
        if (isMainContent) {
            return `/api/discuss/update/main/${this.article_id}`;
        }
        else {
            return `/api/discuss/update/reply/${this.article_id}/${this.comment_id}`;
        }
    }

    edit_post () {
        this.axios.post(this.editUrl, {
            title: this.title,
            content: this.content,
            captcha: this.captcha
        }).then(({ data }) => {
            this.editPostCallback(data);
        });
    }
}
</script>

<style scoped>

</style>
