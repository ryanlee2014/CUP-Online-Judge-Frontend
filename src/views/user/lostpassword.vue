<template>
    <div class="ui container padding">

        <!-- Main component for a primary marketing message or call to action -->
        <div class="ui top attached block header">找回密码</div>
        <div class="ui bottom attached segment">
            <div class="ui form">
                <div class="one fields">
                    <div class="field">
                        <label>User ID</label>
                        <div class="ui input">
                            <input size=50 type=text id="user_id" v-model="userId" @blur="getConfirmQuestion">
                        </div>
                    </div>
                </div>
                <div class="two fields">
                    <div class="field">
                        <label>找回密码问题</label>
                        <div class="ui disabled input">
                            <input name="question" id="question" size=20 type=text v-model="confirmQuestion">
                        </div>
                    </div>
                    <div class="field">
                        <label>找回密码答案</label>
                        <input name="answer" id="answer" size=20 type=text v-model="confirmAnswer">
                    </div>
                </div>
                <div class="three fields">
                    <div class="field">
                        <label>新密码</label>
                        <input name="password" id="password" size=20 type=password v-model="password">
                    </div>
                    <div class="field">
                        <label>再次输入</label>
                        <input name="repeat" id="repeat" size=20 type=password v-model="repeatPassword">
                    </div>
                    <div class="field">
                        <label>CAPTCHA</label>
                        <input name="vcode" id="vcode" size="10" style="width:60%" type=text v-model="captcha"><img alt="click to change" class="captcha"  onclick="changeCaptcha"
                                                                                                  :src="captchaSrc" height="40px">
                    </div>
                </div>
                <div class="fields">
                    <div class="field">
                        <label></label>
                        <input class="ui primary button" value="Submit" name="submit" id="submit" type="submit" @click.prevent="submit">
                    </div>
                    <div class="field">
                        <label></label>
                        <input class="ui secondary button" value="Reset" name="reset" type="reset" @click.prevent="reset">
                    </div>
                </div>
            </div>

        </div> <!-- /container -->
    </div>

</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import InitMixin from "../../mixin/init";

interface ILostPasswordDTO {
    userId: string,
    confirmAnswer: string,
    password: string,
    captcha: string
}

interface IUserIdInfo extends ILostPasswordDTO{
    confirmQuestion: string,
}

interface ILostPasswordPayload extends IUserIdInfo {
    repeatPassword: string
}

const emptyLostPasswordPayload: ILostPasswordPayload = {
    captcha: "", confirmAnswer: "", confirmQuestion: "", password: "", repeatPassword: "", userId: ""
};

@Component
export default class LostPassword extends Mixins(InitMixin) implements ILostPasswordPayload {
    userId: string = "";
    captcha: string = "";
    confirmAnswer: string = "";
    confirmQuestion: string = "";
    password: string = "";
    repeatPassword: string = "";
    captchaSrc = "/api/captcha?from=lost&ramdom=" + Math.random();

    changeCaptcha () {
        this.captchaSrc = "/api/captcha?from=lost&ramdom=" + Math.random();
    }

    getConfirmQuestion () {
        this.axios.get(`/api/lost/password/${this.userId}`)
            .then(({ data }) => {
                this.confirmQuestion = data.data;
            });
    }

    submit () {
        const payload: ILostPasswordDTO = {
            captcha: this.captcha, confirmAnswer: this.confirmAnswer, password: this.password, userId: this.userId
        };
        this.axios.post("/api/lost/password", payload)
            .then(({ data }) => {
                alert("修改成功");
                this.$router.push({
                    path: "/login"
                });
            })
            .catch(reason => {
                alert(reason.data.statement);
                this.changeCaptcha();
            });
    }

    reset () {
        Object.assign(this, emptyLostPasswordPayload);
    }
}
</script>

<style scoped>

</style>
