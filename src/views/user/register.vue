<template>
    <div class="ui container padding">
        <div class="html ui top attached segment">
            <h4>根据要求，请实名注册账号，非法账号将定期删除，严重者封禁IP</h4>
            <p><b>下列内容均为必填项</b></p>
            <div class="ui form">
                <div class="field">
                    <div class="two fields">
                        <div class="field">
                            <label>{{$t("user_id")}}</label>
                            <input name="user_id" type="text" placeholder="请填写真实学号" v-model="userId">
                        </div>
                        <div class="field">
                            <label>{{$t("nick")}}</label>
                            <input name="nick" type="text" placeholder="请填写真实姓名" v-model="nick">
                        </div>
                    </div>
                </div>
                <div class="field">
                    <div class="two fields">
                        <div class="field">
                            <label>{{$t("password")}}</label>
                            <input name="password" type="password" v-model="password">
                        </div>
                        <div class="field">
                            <label>{{$t("repeat password")}}</label>
                            <input name="rptpassword" type="password" v-model="repeatPassword">
                        </div>
                    </div>
                </div>
                <div class="field">
                    <div class="two field">
                        <div class="field">
                            <label>{{$t("lost password problem")}}</label>
                            <input name="confirmquestion" type="text" v-model="confirmquestion">
                        </div>
                        <div class="field">
                            <label>{{$t("lost password answer")}}</label>
                            <input name="confirmanswer" type="text" v-model="confirmanswer">
                        </div>
                    </div>
                </div>
                <div class="field">
                    <div class="two field">
                        <div class="field">
                            <label>{{$t("captcha")}}</label>
                            <input name="vcode" type="text" v-model="vcode">
                        </div>
                    </div>
                    <div class="field">
                        <label></label>
                        <img alt="click to change" onclick="this.src='/api/captcha?from=register&ramdom='+Math.random()"
                             src="/api/captcha?from=register" />
                    </div>
                </div>
            </div>
            <button class="ui primary button" @click="register">
                {{$t("submit")}}
            </button>
            <button class="ui button">
                {{$t("reset")}}
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import mixins from "../../mixin/init";
import Middleware from "../../module/Middleware/core";
import jquery from "jquery";
import { Mixins, Component } from "vue-property-decorator";
const $: any = jquery;
@Component
export default class Register extends Mixins(mixins) {
    userId= "";
    nick= "";
    password= "";
    repeatPassword= "";
    confirmquestion= "";
    confirmanswer= "";
    vcode= ""
    mounted () {
        this.initForm();
    }

    initForm () {
        $(".ui.form")
            .form({
                on: "blur",
                fields: {
                    name: {
                        identifier: "user_id",
                        rules: [
                            {
                                type: "empty",
                                prompt: "Please enter your user id"
                            },
                            {
                                type: "regExp[/^201[0-9]{7}$/]",
                                prompt: "Please enter your legal user_id!"
                            }
                        ]
                    },
                    password: {
                        identifier: "rptpassword",
                        rules: [
                            {
                                type: "match[password]",
                                prompt: "Please repeat your password correctly!"
                            }
                        ]
                    },
                    confirmquestion: {
                        identifier: "confirmquestion",
                        rules: [
                            {
                                type: "empty",
                                prompt: "Please enter your confirm question"
                            }
                        ]
                    },
                    confirmanswer: {
                        identifier: "confirmanswer",
                        rules: [
                            {
                                type: "empty",
                                prompt: "Please enter your confirm answer"
                            }
                        ]
                    },
                    vcode: {
                        identifier: "vcode",
                        rules: [
                            {
                                type: "empty",
                                prompt: "please enter vcode"
                            }
                        ]
                    }
                }
            });
    }
    checkUserId (options: any, next: (...args: any[]) => any) {
        if (isNaN(parseInt(this.userId))) {
            alert("user_id should be your school id");
        }
        else {
            next();
        }
    }
    checkPassword (options: any, next: (...args: any[]) => any) {
        if (this.password.trim() !== this.repeatPassword.trim()) {
            alert("password you input not the same as repeat password");
        }
        else {
            next();
        }
    }
    checkConfirm (options: any, next: (...args: any[]) => any) {
        if (this.confirmanswer.trim().length === 0 || this.confirmquestion.trim().length === 0) {
            alert("You must input your confirm question and confirm answer");
        }
        else {
            next();
        }
    }
    postData (options: any, next: (...args: any[]) => any) {
        this.axios.post("/api/user/register", this.$data)
            .then(({ data }) => {
                if (data.status === "OK") {
                    alert(this.$t("success"));
                    if (typeof next === "function") {
                        next();
                    }
                }
                else {
                    alert(data.statement);
                }
            });
    }
    register () {
        const middleware = new Middleware();
        middleware.use(this.checkUserId).use(this.checkPassword).use(this.checkConfirm).use(this.postData).commit();
    }
}
</script>

<style scoped>

</style>
