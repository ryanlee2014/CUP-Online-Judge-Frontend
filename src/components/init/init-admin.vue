<template>
    <div class="html ui top attached segment">
            <div class="ui large form">
                <div class="ui form">
                    <div class="two fields">
                        <div class="field">
                            <label>{{$t("user_id")}}</label>
                            <input type="text" v-model="userId" placeholder="" name="user_id" id="user_id">
                        </div>
                        <div class="field">
                            <label>{{$t("nick")}}</label>
                            <input type="text" v-model="nick" name="nick" placeholder="">
                        </div>
                    </div>
                    <div class="two fields">
                        <div class="field">
                            <label>{{$t("password")}}</label>
                            <input name="password" v-model="password" id="password" type="password" placeholder="必填">
                        </div>
                        <div class="field">
                            <label>{{$t("repeat password")}}</label>
                            <input name="rptpassword" v-model="repeatPassword" id="rptpassword" type="password"
                                   placeholder="必填">
                        </div>
                    </div>
                    <div class="two fields">
                        <div class="field">
                            <label>{{$t("retrieve password question")}}</label>
                            <input name="confirmquestion" v-model="confirmQuestion" id="confirmquestion"
                                   placeholder="必填">
                        </div>
                        <div class="field">
                            <label>{{$t("retrieve password answer")}}</label>
                            <input name="confirmanswer" v-model="confirmAnswer" id="confirmanswer" placeholder="必填">
                        </div>
                    </div>
                    <div class="two fields">
                        <div class="field">
                            <label>{{$t("captcha")}}</label>
                            <input name="vcode" v-model="captcha" size=4 type=text>
                        </div>
                        <div class="field">
                            <label style="opacity: 0">Captcha image</label>
                            <img alt="click to change" src="/api/captcha?from=init"
                                 onclick="this.src='/api/captcha?from=init&random='+Math.random()" width="20%">
                        </div>
                    </div>
                </div>
                <button class="ui primary button" type="submit" @click.prevent="submit" id="submit">Submit</button>
                <button class="ui button" type="reset" @click.prevent="reset" name="reset">Reset</button>
                <div class="ui error message"></div>
                <br><br>
            </div>
        </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "vue";
import { ErrorAlert } from "@/module/Decorator/method";
import { IRegisterDTO, IRegisterPagePayload } from "@/types/user/register";

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
export default class InitAdmin extends Vue {
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
            this.axios.post("/api/init/firstrun/admin", payload)
                .then(({ data }) => {
                    if (data.status === "OK") {
                        alert("注册成功");
                        this.$store.dispatch("NavStatus");
                        this.$router.push({
                            path: "/login"
                        });
                    }
                })
                .catch(reason => {
                    alert(reason.data.statement);
                });
        }

        reset () {
            Object.assign(this, emptyRegisterPagePayload);
        }
}
</script>

<style scoped>

</style>
