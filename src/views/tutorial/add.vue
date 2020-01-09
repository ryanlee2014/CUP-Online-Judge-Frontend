<template>
    <div class="ui container padding">
        <div class="ui grid">
            <div class="row">
                <h2 class="ui header">
                    输入答案正确的Solution ID
                </h2>
            </div>
            <div class="row">
                <div class="ui action input">
                    <input type="text"  v-model="solution_id" size="50">
                    <button class="ui teal right labeled icon button"  @click="fetch_solution">
                        <i class="history icon"></i>
                        自动获取
                    </button>
                </div>
            </div>
            <div class="row">
                <h2 class="ui header">
                    题解正文
                </h2>
            </div>
            <div class="row">
                <mavon-editor v-model="content"></mavon-editor>
            </div>
            <div class="row">
                <div class="two field">
                    <div class="ui left input" style="width:auto">
                        <input v-model="captcha" type="text" placeholder="验证码"><img alt="click to change" src="/api/captcha?from=tutorial" onclick="this.src='/api/captcha?from=tutorial&random='+Math.random()" height="40px">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="ui blue labeled submit icon button" @click="create_post">
                    <i class="icon edit"></i> Add New Post
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Mixins } from "vue-property-decorator";
import mixins from "../../mixin/init";
import Component from "vue-class-component";
@Component
export default class TutorialAdd extends Mixins(mixins) {
    content = "";
    solution_id = 0;
    captcha = "";
    from = "local";
    id!: any;
    created () {
        this.id = this.$route.params.problem_id;
    }
    mounted () {
        document.title = `Add Tutorial -- ${document.title}`;
    }
    fetch_solution () {
        const that = this;
        this.axios.get(`/api/status/${this.id}/my/null/4/0`)
            .then(({ data }) => {
                if (data.result.length === 0) {
                    alert("未找到相关提交！");
                }
                else {
                    that.solution_id = data.result[0].solution_id;
                }
            });
    }
    create_post () {
        const send = {
            solution_id: this.solution_id,
            content: this.content,
            captcha: this.captcha,
            source: "local",
            id: this.id
        };
        this.axios.post(`/api/tutorial/new/${this.from}/${this.id}`, send)
            .then(({ data }) => {
                if (data.status === "OK") {
                    alert("添加成功!");
                    this.$router.push({
                        path: `/tutorial/${this.id}`
                    });
                }
                else {
                    alert("服务器遇到错误\n" + data.statement);
                }
            });
    }
}
</script>

<style scoped>

</style>
