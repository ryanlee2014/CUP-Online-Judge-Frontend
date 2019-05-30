<template>
    <div class="ui grid">
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
                                <input @keyup.enter="login" id="user_id" name="user_id" placeholder="username" type="text"
                                       v-model="user_id">
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui left icon input">
                                <i class="lock icon"></i>
                                <input @keyup.enter="login" id="password" name="password" placeholder="Password"
                                       type="password" v-model="password"
                                >
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui left input">
                                <input @keyup.enter="login" id="vcode" name="vcode" placeholder="验证码" style="width:70%"
                                       type="text" v-model="captcha"
                                >
                                <img alt="click to change" height="40px" id="vcode_graph"
                                     onclick="this.src='/api/captcha?from=login&ramdom='+Math.random()"
                                     src="/api/captcha?from=login">
                            </div>
                        </div>
                        <div @click="login" @keyup.enter="login" class="ui fluid large teal button">Login</div>
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

    </div>
</template>

<script>
import mixins from "../mixin/init"

const $ = require("jquery")
window.$ = window.jQuery = $
export default {
  name: "login",
  mixins: [mixins],
  mounted () {
    document.title = `Login -- ${document.title}`
  },
  data: function () {
    return {
      user_id: "",
      password: "",
      captcha: "",
      url_prefix: window.url_prefix
    }
  },
  methods: {
    login: function () {
      const that = this
      $(".ui.error.message").hide()
      $(".ui.fluid.large.teal.button").addClass("loading")
      this.axios.defaults.withCredentials = true
      this.axios.post("/api/login/newlogin", this.$data)
        .then(response => {
          $(".ui.fluid.large.teal.button").removeClass("loading")
          if (response.data.status === "OK") {
            this.$root.$store.commit("loginMutate", { login: true })
            sessionStorage.isLogined = "true"
            this.$socket.disconnect()
            setTimeout(() => this.$socket.connect(), 700)
            this.$store.dispatch("NavStatus")
            if (that.$route.query.redirect) {
              this.$router.push({ path: this.$route.query.redirect })
            } else {
              this.$router.push({ path: "/" })
            }
          } else {
            $("#vcode_graph").attr("src", `/api/captcha?from=login&ramdom=${Math.random()}`)
            $(".ui.middle.aligned.center.aligned.grid .column").transition("shake")
            if (response.data.statement.match("captcha doesn't match")) {
              $(".ui.error.message").html("验证码错误").show()
            } else {
              $(".ui.error.message").html("账号或密码错误").show()
            }
          }
        })
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
