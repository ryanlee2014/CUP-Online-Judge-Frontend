<template>
    <div class="ui container padding">
        <div class="ui grid">
            <div class="row">
                <h2 class="ui header">
                    输入答案正确的Solution ID
                </h2>
            </div>
            <div class="row">

                <div class="ui input">
                    <input size="50" type="text" v-model="solution_id">
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
                        <input placeholder="验证码" type="text" v-model="captcha">
                        <img alt="click to change" height="40px" onclick="this.src='/api/captcha?from=tutorial&random='+Math.random()" src="/api/captcha?from=tutorial">
                    </div>
                </div>
            </div>
            <div class="row">
                <div @click="create_post" class="ui blue labeled submit icon button">
                    <i class="icon edit"></i> Modify Post
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import mixins from "../../mixin/init";
const $ = require("jquery");
export default {
    name: "edit",
    mixins: [mixins],
    data: function () {
        return {
            content: "",
            solution_id: 0,
            captcha: "",
            tutorial_id: this.$route.params.tutorial_id
        };
    },
    mounted () {
        document.title = `Edit Tutorial -- ${document.title}`;
        this.axios.get(`/api/tutorial/${this.tutorial_id}`)
            .then(({ data }) => {
                const d = data;
                Object.assign(this, {
                    content: d.data.content,
                    solution_id: d.data.solution_id
                });
            });
    },
    methods: {
        create_post: function () {
            this.axios.post(`/api/tutorial/edit/${this.tutorial_id}`, {
                solution_id: this.solution_id,
                content: this.content,
                captcha: this.captcha
            })
                .then(({ data }) => {
                    if (data.status === "OK") {
                        alert("修改成功!");
                        this.$router.push({
                            path: `/tutorial/${this.$route.query.problem_id}`
                        });
                    } else {
                        alert("服务器遇到错误\n" + data.statement);
                    }
                });
        }
    }
};
</script>

<style scoped>

</style>
