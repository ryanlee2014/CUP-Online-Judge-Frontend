(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-bed8c1d0"],{"886e":function(t,e,i){"use strict";i.r(e);var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"ui container",attrs:{id:"contest_table"}},[2===t.mode?i("ContestNotStart"):t._e(),1===t.mode?i("LoginForm"):t._e(),3===t.mode?i("contest-mode"):t._e(),4===t.mode?i("LimitHostname",{attrs:{content:t.limit_content}}):t._e(),0===t.mode?i("div",{staticClass:"padding"},[i("h2",{staticClass:"ui dividing header"},[t._v(" Contest Problem Set ")]),i("div",{staticClass:"ui grid"},[i("div",{staticClass:"row"},[i("div",{staticClass:"eleven wide column"},[i("table",{staticClass:"ui basic unstackable table",attrs:{id:"problemset",width:"95%"}},[i("thead",[i("tr",{staticClass:"toprow"},[i("th",{staticStyle:{"text-align":"center"},attrs:{width:"18%"},on:{click:function(e){return t.orderBy(0)}}},[i("a",{staticStyle:{cursor:"pointer"}},[0===t.type?i("i",{class:"sort numeric icon "+(t.order>0?"up":"down")}):i("i",{staticClass:"checkmark icon",staticStyle:{opacity:"0"}}),t._v(" "+t._s(t.$t("id"))+" ")])]),i("th",{attrs:{width:"44%"},on:{click:function(e){return t.orderBy(1)}}},[i("a",{staticStyle:{cursor:"pointer"}},[1===t.type?i("i",{class:"sort numeric icon "+(t.order>0?"up":"down")}):i("i",{staticClass:"checkmark icon",staticStyle:{opacity:"0"}}),t._v(" "+t._s(t.$t("title")))])]),t.now.isAfter(t.end_time)?i("th",{attrs:{width:"10%"}}):t._e(),i("th",{staticStyle:{"text-align":"center"},attrs:{width:"16%"}},[i("a",{staticStyle:{cursor:"pointer"}},[i("span",{on:{click:function(e){return t.orderBy(2)}}},[2===t.type?i("i",{class:"sort numeric icon "+(t.order>0?"up":"down")}):t._e(),t._v(" "+t._s(t.$t("accept")))])]),t._v("/"),i("a",{staticStyle:{cursor:"pointer"}},[i("span",{on:{click:function(e){return t.orderBy(3)}}},[3===t.type?i("i",{class:"sort numeric icon "+(t.order>0?"up":"down")}):t._e(),t._v(t._s(t.$t("submit")))])])]),i("th",{staticStyle:{"text-align":"center"},attrs:{width:"12%"},on:{click:function(e){return t.orderBy(4)}}},[i("a",{staticStyle:{cursor:"pointer"}},[4===t.type?i("i",{class:"sort numeric icon "+(t.order>0?"up":"down")}):t._e(),t._v(" "+t._s(t.$t("accept percentage")))])])])]),i("tbody",t._l(t.problem_table,(function(e,n){return i("tr",{key:n,class:1===e.ac?"positive":-1===e.ac?"negative":"",attrs:{id:"popup"+n},on:{mouseenter:function(i){return t.triggerPopup(n,e.pid)}}},[i("td",{staticClass:"center aligned"},[t._v(t._s(e.oj_name?e.oj_name:e.pid?"LOCAL ":"")+t._s(e.pid)),e.pid?i("br"):t._e(),t._v("Problem "+t._s(e.pnum+1001)+" ")]),i("td",[1===e.ac?i("i",{staticClass:"checkmark icon"}):-1===e.ac?i("i",{staticClass:"remove icon"}):i("i",{staticClass:"checkmark icon",staticStyle:{opacity:"0"}}),t.dayjs().isBefore(t.end_time)&&t.dayjs().isAfter(t.start_time)?i("router-link",{attrs:{to:"/contest/problem/"+t.cid+"/"+e.pnum},domProps:{innerHTML:t._s(t.contest(t.markdownIt.renderRaw(e.title),e.pnum))}}):i("router-link",{attrs:{to:"/problem/submit/"+e.pid},domProps:{innerHTML:t._s(t.contest(t.markdownIt.renderRaw(e.title),e.pnum))}})],1),t.now.isAfter(t.end_time)?i("td",[i("router-link",{attrs:{to:"/tutorial/"+e.pid}},[t._v(t._s(t.$t("solution")))])],1):t._e(),i("td",{staticStyle:{"text-align":"center"}},[t._v(t._s(e.accepted)+"/"+t._s(e.submit))]),i("td",{staticStyle:{"text-align":"center"}},[t._v(t._s((100*e.accepted/Math.max(e.submit,1)).toString().substring(0,4))+" % ")])])})),0)])]),i("div",{staticClass:"five wide column"},[i("div",[i("ContestInfo",{attrs:{admin:t.admin,cid:t.cid,description:t.description,end_time:t.end_time,private_contest:t.private_contest,start_time:t.start_time,title:t.title}}),i("br")],1)])])])]):t._e()],1)},a=[],r=(i("a4d3"),i("e01a"),i("99af"),i("4de4"),i("4160"),i("c975"),i("4e82"),i("e439"),i("dbb4"),i("b64b"),i("e25e"),i("159b"),i("ade3")),s=i("d4ec"),c=i("bee2"),o=i("99de"),d=i("7e84"),l=i("262e"),u=i("9ab4"),p=function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)},m=[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("div",{staticClass:"ui negative message"},[i("div",{staticClass:"header"},[i("i",{staticClass:"ban icon"}),t._v(" 竞赛尚未开始 ")]),i("p",[t._v("请等待竞赛开始后刷新 ")])])])}],_=i("2b0e"),b=i("60a3"),v=function(t){function e(){return Object(s["a"])(this,e),Object(o["a"])(this,Object(d["a"])(e).apply(this,arguments))}return Object(l["a"])(e,t),e}(_["a"]);v=Object(u["c"])([b["a"]],v);var f=v,h=f,y=i("2877"),O=Object(y["a"])(h,p,m,!1,null,"18109bdc",null),j=O.exports,g=function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)},w=[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("h2",{staticClass:"ui dividing header"},[t._v("私有竞赛/作业")]),i("form",{staticClass:"ui form",attrs:{id:"contest_form",method:"post"}},[i("div",{staticClass:"fields"},[i("div",{staticClass:"six wide field"},[i("label",[t._v("请输入密码")]),i("input",{staticClass:"input-mini",attrs:{id:"contest_pass",name:"password",type:"password"}})])]),i("input",{staticClass:"ui primary button",attrs:{type:"submit"}})])])}],C=i("1157"),k=i.n(C),S=k.a,x=function(t){function e(){return Object(s["a"])(this,e),Object(o["a"])(this,Object(d["a"])(e).apply(this,arguments))}return Object(l["a"])(e,t),Object(c["a"])(e,[{key:"mounted",value:function(){var t=this;S("#contest_form").submit((function(){return t.axios.post("/api/contest/password/".concat(t.$route.params.contest_id),{password:S("#contest_pass").val()}).then((function(e){var i=e.data;"OK"===i.status?t.$parent.mode=0:alert(i.statement)})),!1}))}}]),e}(_["a"]);x=Object(u["c"])([b["a"]],x);var $=x,P=$,I=Object(y["a"])(P,g,w,!1,null,"3bb2b0fe",null),E=I.exports,M=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"ui raised segment"},[i("h1"),i("h2",{staticClass:"ui header",staticStyle:{"text-align":"center"}},[i("i",{staticClass:"star outline icon"}),t._v("Contest "+t._s(t.cid))]),i("h2",{staticClass:"ui header",staticStyle:{"text-align":"center"}},[t._v(t._s(t.title))]),i("p",[t._v(t._s(t.description))]),i("div",{staticStyle:{"text-align":"center"}},[t._v("Start Time "+t._s(t.start_time.format("YYYY-MM-DD HH:mm:ss"))+" "),i("br"),t._v(" Now "),i("span",{attrs:{id:"nowdate"}},[t._v(t._s(t.now.format("YYYY-MM-DD HH:mm:ss")))]),i("br"),t._v("End Time "+t._s(t.end_time.format("YYYY-MM-DD HH:mm:ss"))+" ")]),i("div",{class:"ui top right attached label "+(t.private_contest?"red":"green")},[t._v(t._s(t.private_contest?"Private":"Public")+" ")]),i("div",{class:"ui top left attached "+(t.now.isAfter(t.end_time)?"red":t.now.isBefore(t.start_time)?"grey":"green")+" label"},[t.now.isAfter(t.end_time)?i("span",{staticClass:"red"},[t._v("Ended")]):t.now.isBefore(t.start_time)?i("span",{staticClass:"red"},[t._v("Pending")]):i("span",{staticClass:"green"},[t._v("Running")])]),i("div",{staticStyle:{"text-align":"center"}},[i("div",{staticClass:"row padding"},[i("div",{staticClass:"ui buttons mini"},[t.admin?i("a",{staticClass:"ui button orange",attrs:{href:"/copystatus.php?cid="+t.cid}},[t._v("判重表")]):t._e(),t.admin?i("a",{staticClass:"ui button yellow",attrs:{href:"/copymap.php?cid="+t.cid}},[t._v("判重图")]):t._e()])])])])},D=[],Y=i("5a0c"),B=i.n(Y),H=function(t){function e(){var t;return Object(s["a"])(this,e),t=Object(o["a"])(this,Object(d["a"])(e).apply(this,arguments)),t.now=B()(),t}return Object(l["a"])(e,t),Object(c["a"])(e,[{key:"mounted",value:function(){var t=this;setInterval((function(){t.now=B()()}),1e3)}}]),e}(_["a"]);Object(u["c"])([Object(b["c"])({default:B()()})],H.prototype,"start_time",void 0),Object(u["c"])([Object(b["c"])({default:B()()})],H.prototype,"end_time",void 0),Object(u["c"])([Object(b["c"])({default:""})],H.prototype,"description",void 0),Object(u["c"])([Object(b["c"])({default:""})],H.prototype,"title",void 0),Object(u["c"])([Object(b["c"])({default:!1})],H.prototype,"admin",void 0),Object(u["c"])([Object(b["c"])({default:!1})],H.prototype,"private_contest",void 0),Object(u["c"])([Object(b["c"])({default:0})],H.prototype,"cid",void 0),H=Object(u["c"])([b["a"]],H);var L=H,A=L,T=Object(y["a"])(A,M,D,!1,null,"14cecf33",null),K=T.exports,N=i("d3a2"),R=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"ui negative message"},[t._m(0),i("p",[t._v(t._s(t.content))])])},F=[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"header"},[i("i",{staticClass:"ban icon"}),t._v("访问限制")])}],J=function(t){function e(){return Object(s["a"])(this,e),Object(o["a"])(this,Object(d["a"])(e).apply(this,arguments))}return Object(l["a"])(e,t),e}(_["a"]);Object(u["c"])([Object(b["c"])({default:""})],J.prototype,"content",void 0),J=Object(u["c"])([b["a"]],J);var q=J,z=q,G=Object(y["a"])(z,R,F,!1,null,"1446e3db",null),Q=G.exports,U=i("2cd4"),V=i("6b34"),W=i("2f62"),X=i("2ef0"),Z=i.n(X);function tt(t,e){var i=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),i.push.apply(i,n)}return i}function et(t){for(var e=1;e<arguments.length;e++){var i=null!=arguments[e]?arguments[e]:{};e%2?tt(Object(i),!0).forEach((function(e){Object(r["a"])(t,e,i[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(i)):tt(Object(i)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(i,e))}))}return t}var it=k.a,nt=function(t){function e(){var t;return Object(s["a"])(this,e),t=Object(o["a"])(this,Object(d["a"])(e).apply(this,arguments)),t.cid=0,t.problem_table=[],t.start_time=B()(),t.end_time=B()(),t.description="",t.title="",t.now=B()(),t.problemInfo={},t.current_mode=0,t.order=1,t.type=0,t.contest_mode=!1,t.limit_content="",t.private_contest=!1,t.dayjs=B.a,t.markdownIt=V["a"],t}return Object(l["a"])(e,t),Object(c["a"])(e,[{key:"created",value:function(){this.cid=parseInt(this.$route.params.contest_id)}},{key:"mounted",value:function(){var t=this.$route.params.contest_id;document.title="Contest ".concat(t," -- ").concat(document.title),this.getInfo(),this.run(this.run)}},{key:"getInfo",value:function(){var t=this;(this.admin||this.contest_manager)&&this.axios.get("/api/contest/problem_info/".concat(this.cid)).then((function(e){var i=e.data;if("OK"===i.status){var n=i.data;n.forEach((function(e){return t.problemInfo[e.problem_id]=e}))}}))}},{key:"triggerPopup",value:function(t,e){var i=this.problemDetail(e);it("#popup"+t).popup({hoverable:!0,html:i}).popup("show")}},{key:"problemDetail",value:function(t){console.log("problem_id",t);var e=this.problemInfo[t];if(console.log("this.problemInfo",this.problemInfo),console.log("problemInfo",e),e){var i=e.accepted,n=e.submit,a=Math.floor(100*i/n),r=e.label,s='<div class="content">\n提交: '.concat(n," 通过:").concat(i," 通过率:").concat(a,"%\n<br>\n标签:").concat(r,"\n</div>");return s}return""}},{key:"run",value:function(t){var e=this.$route.params.contest_id,i=this;this.cid=parseInt(e),this.axios.get("/api/contest/problem/"+e).then((function(e){console.log(e);var n=e.data;if("OK"!==n.status){if(console.log(n),"Permission denied"===n.statement)return void(i.mode=1);if(101===n.error_code)return void(i.mode=2);if(n.contest_mode)return void(i.mode=3)}Z.a.forEach(n.data,(function(t){t.accepted||(t.accepted=0),t.submit||(t.submit=0)}));var a=n.limit,r=n.contest_mode;if(n.admin&&(a=null,r=!1),a&&-1===location.href.indexOf(a))return i.mode=4,void(i.limit_content="根据管理员设置的策略，本次contest请使用"+a+"访问");i.problem_table=n.data;var s=n.info;i.start_time=B()(s.start_time),i.end_time=B()(s.end_time),i.title=s.title,i.contest_mode=r,i.description=s.description,i.private_contest=Boolean(s.private),"function"===typeof t&&t()}))}},{key:"detect_source",value:function(t){return t.oj_name&&"local"!==t.oj_name.toLowerCase()?t.oj_name.toLowerCase():"new"}},{key:"contest",value:function(t,e){return this.contest_mode?"Problem "+String.fromCharCode("A".charCodeAt(0)+parseInt(e)):t}},{key:"orderBy",value:function(t){var e=this;e.type===t&&(e.order=-e.order);var i=function(t,i){return e.order*(t.pnum-i.pnum)},n=function(t,i){return e.order*(t.title>i.title?1:t.title<i.title?-1:0)},a=function(t,i){return e.order*(t.submit-i.submit)},r=function(t,i){return e.order*(t.accepted-i.accepted)},s=function(t,i){var n=t.accepted/Math.max(t.submit,1),a=i.accepted/Math.max(i.submit,1);return e.order*(n-a)},c=[i,n,r,a,s];e.problem_table.sort(c[t]),e.type=t}},{key:"mode",get:function(){return this.current_mode},set:function(t){var e=t!==this.current_mode;this.current_mode=t,e&&this.run(this.run)}}]),e}(Object(b["b"])(U["a"]));nt=Object(u["c"])([Object(b["a"])({components:{ContestNotStart:j,LoginForm:E,ContestInfo:K,ContestMode:N["a"],LimitHostname:Q},computed:et({},Object(W["b"])(["admin","contest_manager"]))})],nt);var at=nt,rt=at,st=Object(y["a"])(rt,n,a,!1,null,"75356c24",null);e["default"]=st.exports},d3a2:function(t,e,i){"use strict";var n=function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)},a=[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"ui negative message"},[i("div",{staticClass:"header"},[i("i",{staticClass:"ban icon"}),t._v("竞赛模式")]),i("p",[t._v("根据管理员设置，该页面禁止进入")])])}],r=i("d4ec"),s=i("99de"),c=i("7e84"),o=i("262e"),d=i("9ab4"),l=i("60a3"),u=i("2b0e"),p=function(t){function e(){return Object(r["a"])(this,e),Object(s["a"])(this,Object(c["a"])(e).apply(this,arguments))}return Object(o["a"])(e,t),e}(u["a"]);p=Object(d["c"])([l["a"]],p);var m=p,_=m,b=i("2877"),v=Object(b["a"])(_,n,a,!1,null,"3631ce6f",null);e["a"]=v.exports}}]);