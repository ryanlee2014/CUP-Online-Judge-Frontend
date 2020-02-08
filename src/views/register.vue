<template>
    <div class="ui container padding">
        <div class="html ui top attached segment">
            <div class="ui large form">
                <h4>根据要求，请实名注册账号，非法账号将定期删除，严重者封禁IP</h4>
                <div class="ui form">
                    <div class="two fields">
                        <div class="field">
                            <label>{{$t("user_id")}}</label>
                            <input type="text" placeholder="请填写真实学号"  name="user_id" id="user_id" >
                        </div>
                        <div class="field">
                            <label>{{$t("nick")}}</label>
                            <input type="text" name="nick" placeholder="请填写真实姓名">
                        </div>
                    </div>
                    <div class="two fields">
                    <div class="field">
                        <label>{{$t("password")}}</label>
                        <input name="password" id="password" type="password" placeholder="必填">
                    </div>
                    <div class="field">
                        <label>{{$t("repeat password")}}</label>
                        <input name="rptpassword" id="rptpassword" type="password" placeholder="必填">
                    </div>
                    </div>
                    <div class="two fields">
                        <div class="field">
                            <label>{{$t("retrieve password question")}}</label>
                            <input name="confirmquestion" id="confirmquestion" placeholder="必填">
                        </div>
                        <div class="field">
                            <label>{{$t("retrieve password answer")}}</label>
                            <input name="confirmanswer" id="confirmanswer" placeholder="必填">
                        </div>
                    </div>
                    <div class="field">
                        <label>{{$t("invite code")}}</label>
                        <input name="invite_code" placeholder="必填">
                    </div>
                    <div class="two fields">
                        <div class="field">
                            <label>{{$t("captcha")}}</label>
                            <input name="vcode" size=4 type=text>
                        </div>
                        <div class="field">
                            <label style="opacity: 0">Captcha image</label>
                            <img  alt="click to change" src="/api/captcha?from=register"
                                  onclick="this.src='/api/captcha?from=register&random='+Math.random()" width="20%">
                        </div>
                    </div>
                </div>
                <button class="ui primary disabled button" type="submit" id="submit">Submit</button>
                <button class="ui button" type="reset" name="reset">Reset</button>
                <div class="ui error message"></div>
                <br><br>
            </div></div>
    </div>
</template>

<script lang="ts">
import { Mixins } from "vue-property-decorator";
import InitMixin from "../mixin/init";

export default class RegisterPage extends Mixins(InitMixin) {
    mounted () {
        super.mounted();
    }
}
</script>

<style scoped>

</style>
