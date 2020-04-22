<template>
    <div class="ui container padding">
        <div class="html ui top attached segment">
            <div class="ui large form">
                <h4>根据要求，请实名注册账号，非法账号将定期删除，严重者封禁IP</h4>
                <div class="ui form">
                    <div class="two fields">
                        <div class="field">
                            <label>{{$t("user_id")}}</label>
                            <input type="text" v-model="userId" placeholder="请填写真实学号"  name="user_id" id="user_id" >
                        </div>
                        <div class="field">
                            <label>{{$t("nick")}}</label>
                            <input type="text" v-model="nick" name="nick" placeholder="请填写真实姓名">
                        </div>
                    </div>
                    <div class="two fields">
                    <div class="field">
                        <label>{{$t("password")}}</label>
                        <input name="password" v-model="password" id="password" type="password" placeholder="必填">
                    </div>
                    <div class="field">
                        <label>{{$t("repeat password")}}</label>
                        <input name="rptpassword" v-model="repeatPassword" id="rptpassword" type="password" placeholder="必填">
                    </div>
                    </div>
                    <div class="two fields">
                        <div class="field">
                            <label>{{$t("retrieve password question")}}</label>
                            <input name="confirmquestion" v-model="confirmQuestion" id="confirmquestion" placeholder="必填">
                        </div>
                        <div class="field">
                            <label>{{$t("retrieve password answer")}}</label>
                            <input name="confirmanswer" v-model="confirmAnswer" id="confirmanswer" placeholder="必填">
                        </div>
                    </div>
                    <div class="field">
                        <label>{{$t("invite code")}}</label>
                        <input name="invite_code" v-model="inviteCode" placeholder="必填">
                    </div>
                    <div class="two fields">
                        <div class="field">
                            <label>{{$t("captcha")}}</label>
                            <input name="vcode" v-model="captcha" size=4 type=text>
                        </div>
                        <div class="field">
                            <label style="opacity: 0">Captcha image</label>
                            <img  alt="click to change" :src="`/api/captcha?from=register&random=${captchaHash}`"
                                  onclick="this.src='/api/captcha?from=register&random='+Math.random()" width="20%">
                        </div>
                    </div>
                </div>
                <button class="ui primary button" type="submit" @click.prevent="submit" id="submit">Submit</button>
                <button class="ui button" type="reset" @click.prevent="reset" name="reset">Reset</button>
                <div class="ui error message"></div>
                <br><br>
            </div></div>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import InitMixin from "../mixin/init";
import { ErrorAlert } from "@/module/Decorator/method";
import { IRegisterPagePayload, IRegisterDTO } from "@/types/user/register";
import CaptchaMixin from "@/mixin/CaptchaMixin";

const emptyRegisterPagePayload: IRegisterPagePayload = {
    confirmQuestion: "",
    inviteCode: "",
    nick: "",
    password: "",
    userId: "",
    captcha: "",
    repeatPassword: "",
    confirmAnswer: ""
};

@Component
export default class RegisterPage extends Mixins(InitMixin, CaptchaMixin) implements IRegisterPagePayload {
    captcha: string = "";
    repeatPassword: string = "";
    confirmAnswer: string = "";
    confirmQuestion: string = "";
    inviteCode: string = "";
    nick: string = "";
    password: string = "";
    userId: string = "";
    mounted () {

    }

    validatePassword () {
        if (this.password !== this.repeatPassword) {
            throw new Error("两次输入的密码不一致");
        }
    }

    @ErrorAlert
    submit () {
        this.validatePassword();
        const payload: IRegisterDTO = {
            confirmAnswer: this.confirmAnswer,
            confirmQuestion: this.confirmQuestion,
            inviteCode: this.inviteCode,
            nick: this.nick,
            password: this.password,
            userId: this.userId,
            captcha: this.captcha
        };
        this.axios.post("/api/register", payload)
            .then(({ data }) => {
                if (data.status === "OK") {
                    alert("注册成功");
                    this.$router.push({
                        path: "/login"
                    });
                }
            })
            .catch(reason => {
                alert(JSON.stringify(reason.data));
            });
    }

    reset () {
        Object.assign(this, emptyRegisterPagePayload);
    }
}
</script>

<style scoped>

</style>
