<template>
    <div class="ui container padding">
        <div class="ui grid">
            <div class="row">
                <h2 class="ui header">
                    Title
                </h2>
            </div>
            <div class="row">

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
                <mavon-editor v-model="content" :markInstance="markdownIt"></mavon-editor>
            </div>
            <div class="row">
                <div class="two field">
                    <div class="ui left input" style="width:auto">
                        <input placeholder="验证码" type="text" v-model="captcha"><img alt="click to change"
                                                                                    height="40px"
                                                                                    onclick="this.src='/api/captcha?from=newpost&random='+Math.random()"
                                                                                    src="/api/captcha?from=newpost">
                    </div>
                </div>
            </div>
            <div class="row">
                <div @click="create_post" class="ui blue labeled submit icon button">
                    <i class="icon edit"></i> Add New Post
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import mixins from "../../mixin/init";
import { Mixins, Component } from "vue-property-decorator";
import markdownIt from "@/lib/markdownIt/markdownIt";
import jquery from "jquery";
const $: any = jquery;
@Component
export default class DiscussAdd extends Mixins(mixins) {
    content = "";
    title = "";
    captcha = "";
    markdownIt = markdownIt;
    create_post () {
        const that = this;
        const send = {
            title: this.title,
            content: this.content,
            captcha: this.captcha
        };
        this.axios.post("/api/discuss/newpost", send)
            .then(({ data }) => {
                if (data.status === "OK") {
                    alert("添加成功!");
                    that.$router.push({
                        path: "/discuss"
                    });
                }
                else {
                    alert("服务器遇到错误\n" + data.statement);
                }
            });
    }

    mounted () {
        document.title = `Add Thread -- ${document.title}`;
    }
}
</script>

<style scoped>

</style>
