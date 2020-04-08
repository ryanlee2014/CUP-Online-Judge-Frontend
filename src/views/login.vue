<template>
    <div class="ui grid">
        <div class="ui middle aligned center aligned grid" id="background">
            <div class="center aligned column">
                <h2 class="ui teal image header">
                    <!--<img src="assets/images/logo.png" class="image">-->
                    <div class="content">
                        {{$t("login to your account")}}
                    </div>
                </h2>
                <div class="ui large form">
                    <div class="ui stacked segment">
                        <div class="field">
                            <div class="ui left icon input">
                                <i class="user icon"></i>
                                <input @keyup.enter="login" id="user_id" name="user_id" :placeholder="$t('user_id')" type="text"
                                       v-model="user_id">
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui left icon input">
                                <i class="lock icon"></i>
                                <input @keyup.enter="login" id="password" name="password" :placeholder="$t('password')"
                                       type="password" v-model="password"
                                >
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui left input">
                                <input @keyup.enter="login" id="vcode" name="vcode" :placeholder="$t('captcha')" style="width:70%"
                                       type="text" v-model="captcha"
                                >
                                <img alt="click to change" height="40px" id="vcode_graph"
                                     onclick="this.src='/api/captcha?from=login&ramdom='+Math.random()"
                                     src="/api/captcha?from=login">
                            </div>
                        </div>
                        <div @click="login" @keyup.enter="login" class="ui fluid large teal button">{{$t("login")}}</div>
                    </div>

                    <div class="ui error message"></div>

                </div>
                <div class="ui bottom attached warning message">
                    <i class="icon help"></i>
                    {{$t("new to us")}}? <router-link to="/register">{{$t("sign up")}}</router-link>
                    <br>
                    <i class="icon help"></i>
                    {{$t("forgot password")}}? <router-link to="/user/lostpassword">{{$t("reset password")}}</router-link>
                </div>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import mixins from "../mixin/init";
import { Mixins, Component } from "vue-property-decorator";
import jquery from "jquery";

const $: any = jquery;

@Component
export default class Login extends Mixins(mixins) {
    sockets: any;
    $socket: any;
    $route: any;
    mounted () {
        document.title = `Login -- ${document.title}`;
    }

    user_id = "";
    password = "";
    captcha = "";
    login () {
        $(".ui.error.message").hide();
        $(".ui.fluid.large.teal.button").addClass("loading");
        this.axios.defaults.withCredentials = true;
        this.axios.post("/api/login/newlogin", this.$data)
            .then(response => {
                $(".ui.fluid.large.teal.button").removeClass("loading");
                if (response.data.status === "OK") {
                    this.$root.$store.commit("loginMutate", { login: true });
                    this.$socket.connect();
                    sessionStorage.isLogined = "true";
                    this.$store.dispatch("NavStatus");
                    if (this.$route.query.redirect) {
                        this.$router.push({ path: this.$route.query.redirect });
                    }
                    else {
                        this.$router.push({ path: "/" });
                    }
                }
            })
            .catch(response => {
                $(".ui.fluid.large.teal.button").removeClass("loading");
                $("#vcode_graph").attr("src", `/api/captcha?from=login&ramdom=${Math.random()}`);
                $(".ui.middle.aligned.center.aligned.grid .column").transition("shake");
                if (response.data.statement.match("captcha doesn't match")) {
                    $(".ui.error.message").html("验证码错误").show();
                }
                else {
                    $(".ui.error.message").html("账号或密码错误").show();
                }
            });
    }
}
</script>

<style scoped>
    body {
        background-color: #DADADA;
        height: 100%;
        margin: auto
    }

    body > .grid {
        height: 100%;
    }

    .image {
        margin-top: -100px;
    }

    .column {
        max-width: 450px;
        margin: auto
    }

    #background {
        margin: auto;
        width: 50%;
        height: 70vh;
    }
</style>
