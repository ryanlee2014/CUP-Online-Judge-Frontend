(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-f988a850"],{"0443":function(t){t.exports=JSON.parse('{"title":"CUP Online Judge"}')},"2cd4":function(t,e,a){"use strict";var i=a("9ab4"),s=a("2b0e"),n=a("60a3"),o=a("f1ed"),r=a("0443"),c=class extends s["a"]{mounted(){o["a"].init(this.$store.getters.homepage),document.title=r.title}};c=Object(i["c"])([n["a"]],c),e["a"]=c},"946f":function(t,e,a){},dd7b:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"ui grid"},[a("div",{staticClass:"ui middle aligned center aligned grid",attrs:{id:"background"}},[a("div",{staticClass:"center aligned column"},[a("h2",{staticClass:"ui teal image header"},[a("div",{staticClass:"content"},[t._v(" "+t._s(t.$t("login to your account"))+" ")])]),a("div",{staticClass:"ui large form"},[a("div",{staticClass:"ui stacked segment"},[a("div",{staticClass:"field"},[a("div",{staticClass:"ui left icon input"},[a("i",{staticClass:"user icon"}),a("input",{directives:[{name:"model",rawName:"v-model",value:t.user_id,expression:"user_id"}],attrs:{id:"user_id",name:"user_id",placeholder:"username",type:"text"},domProps:{value:t.user_id},on:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.login(e)},input:function(e){e.target.composing||(t.user_id=e.target.value)}}})])]),a("div",{staticClass:"field"},[a("div",{staticClass:"ui left icon input"},[a("i",{staticClass:"lock icon"}),a("input",{directives:[{name:"model",rawName:"v-model",value:t.password,expression:"password"}],attrs:{id:"password",name:"password",placeholder:"Password",type:"password"},domProps:{value:t.password},on:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.login(e)},input:function(e){e.target.composing||(t.password=e.target.value)}}})])]),a("div",{staticClass:"field"},[a("div",{staticClass:"ui left input"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.captcha,expression:"captcha"}],staticStyle:{width:"70%"},attrs:{id:"vcode",name:"vcode",placeholder:"验证码",type:"text"},domProps:{value:t.captcha},on:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.login(e)},input:function(e){e.target.composing||(t.captcha=e.target.value)}}}),a("img",{attrs:{alt:"click to change",height:"40px",id:"vcode_graph",onclick:"this.src='/api/captcha?from=login&ramdom='+Math.random()",src:"/api/captcha?from=login"}})])]),a("div",{staticClass:"ui fluid large teal button",on:{click:t.login,keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.login(e)}}},[t._v("Login")])]),a("div",{staticClass:"ui error message"})]),t._m(0)])])])},s=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"ui bottom attached warning message"},[a("i",{staticClass:"icon help"}),t._v(" New to us? "),a("a",{attrs:{href:"registerpage.php"}},[t._v("Sign Up")]),a("br"),a("i",{staticClass:"icon help"}),t._v(" Forgot password? "),a("a",{attrs:{href:"lostpassword.php"}},[t._v("Reset your password")])])}],n=(a("e260"),a("466d"),a("ddb0"),a("9ab4")),o=a("2cd4"),r=a("60a3"),c=a("1157"),d=a.n(c),l=d.a,u=class extends(Object(r["b"])(o["a"])){constructor(){super(...arguments),this.user_id="",this.password="",this.captcha=""}mounted(){document.title="Login -- ".concat(document.title)}login(){l(".ui.error.message").hide(),l(".ui.fluid.large.teal.button").addClass("loading"),this.axios.defaults.withCredentials=!0,this.axios.post("/api/login/newlogin",this.$data).then(t=>{l(".ui.fluid.large.teal.button").removeClass("loading"),"OK"===t.data.status&&(this.$root.$store.commit("loginMutate",{login:!0}),this.$socket.connect(),sessionStorage.isLogined="true",this.$socket.disconnect(),setTimeout(()=>this.$socket.connect(),700),this.$store.dispatch("NavStatus"),this.$route.query.redirect?this.$router.push({path:this.$route.query.redirect}):this.$router.push({path:"/"}))}).catch(t=>{l(".ui.fluid.large.teal.button").removeClass("loading"),l("#vcode_graph").attr("src","/api/captcha?from=login&ramdom=".concat(Math.random())),l(".ui.middle.aligned.center.aligned.grid .column").transition("shake"),t.data.statement.match("captcha doesn't match")?l(".ui.error.message").html("验证码错误").show():l(".ui.error.message").html("账号或密码错误").show()})}};u=Object(n["c"])([r["a"]],u);var p=u,h=p,g=(a("de46"),a("2877")),m=Object(g["a"])(h,i,s,!1,null,"3056aad3",null);e["default"]=m.exports},de46:function(t,e,a){"use strict";var i=a("946f"),s=a.n(i);s.a}}]);