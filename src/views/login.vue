<template>
    <div class="ui middle aligned center aligned grid" id="background">
        <div class="center aligned column">
            <h2 class="ui teal image header">
                <!--<img src="assets/images/logo.png" class="image">-->
                <div class="content">
                    Log-in to your account
                </div>
            </h2>
            <div class="ui large form">
                <div class="ui stacked segment">
                    <div class="field">
                        <div class="ui left icon input">
                            <i class="user icon"></i>
                            <input v-model="user_id" type="text" @keyup.enter="login" name="user_id" id="user_id" placeholder="username">
                        </div>
                    </div>
                    <div class="field">
                        <div class="ui left icon input">
                            <i class="lock icon"></i>
                            <input v-model="password" @keyup.enter="login" type="password" name="password" id="password" placeholder="Password"
                                   >
                        </div>
                    </div>
                    <div class="field">
                        <div class="ui left input">
                            <input v-model="captcha" @keyup.enter="login" name="vcode" type="text" placeholder="验证码" style="width:70%" id="vcode"
                                   >
                            <img alt="click to change" id="vcode_graph" src="/api/captcha?from=login"
                                                                              onclick="this.src='/api/captcha?from=login&ramdom='+Math.random()"
                                                                              height="40px">
                        </div>
                    </div>
                    <div class="ui fluid large teal button" @click="login" @keyup.enter="login" >Login</div>
                </div>

                <div class="ui error message"></div>

            </div>
            <div class="ui bottom attached warning message">
                <i class="icon help"></i>
                New to us? <a href="registerpage.php">Sign Up</a>
                <br>
                <i class="icon help"></i>
                Forgot password? <a href="lostpassword.php">Reset your password</a>
            </div>
        </div>
    </div>
</template>

<script>
    const $ = require("jquery");
    window.$ = window.jQuery = $;

    export default {
        name: "login",
        data: function() {
            return {
                user_id: "",
                password: "",
                captcha: "",
                url_prefix: window.url_prefix
            }
        },
        methods: {
            login: function() {
                const that = this;
                this.axios.defaults.withCredentials = true;
                this.axios.post("/test/login/newlogin", this.$data)
                    .then(response => {
                        if(response.data.status === "OK") {
                            that.$root.$store.commit("loginMutate", {login: true});
                            sessionStorage.isLogined = "true";
                            if(that.$route.query.redirect) {
                                that.$router.push({path: that.$route.query.redirect});
                                that.$store.dispatch("NavStatus");
                            }
                            else {
                                that.$router.push({path: '/'});
                            }
                        }
                    });
            }
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
