(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7f39625b"],{"0443":function(t){t.exports=JSON.parse('{"title":"CUP Online Judge"}')},"2cd4":function(t,e,i){"use strict";var s=i("d4ec"),a=i("bee2"),r=i("99de"),n=i("7e84"),c=i("262e"),l=i("9ab4"),u=i("2b0e"),d=i("60a3"),o=i("f1ed"),v=i("0443"),p=function(t){function e(){return Object(s["a"])(this,e),Object(r["a"])(this,Object(n["a"])(e).apply(this,arguments))}return Object(c["a"])(e,t),Object(a["a"])(e,[{key:"mounted",value:function(){o["a"].init(this.$store.getters.homepage),document.title=v.title}}]),e}(u["a"]);p=Object(l["c"])([d["a"]],p),e["a"]=p},4971:function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"ui container padding"},[i("h2",{staticClass:"ui dividing header"},[t._v("User Privilege")]),i("div",{staticClass:"ui form"},[i("div",{staticClass:"field"},[i("div",{staticClass:"two fields"},[i("div",{staticClass:"field"},[i("label",[t._v(t._s(t.$t("user_id")))]),i("input",{directives:[{name:"model",rawName:"v-model",value:t.user_id,expression:"user_id"}],attrs:{type:"text"},domProps:{value:t.user_id},on:{input:function(e){e.target.composing||(t.user_id=e.target.value)}}})]),i("div",{staticClass:"field"},[i("label",[t._v(t._s(t.$t("privilege")))]),i("div",{staticClass:"ui fluid search dropdown selection",attrs:{id:"privilege"}},[i("input",{directives:[{name:"model",rawName:"v-model",value:t.rightstr,expression:"rightstr"}],attrs:{type:"hidden"},domProps:{value:t.rightstr},on:{change:function(e){t.rightstr=e.target.value},input:function(e){e.target.composing||(t.rightstr=e.target.value)}}}),i("i",{staticClass:"dropdown icon"}),i("div",{staticClass:"default text"}),i("div",{staticClass:"menu"},t._l(t.privilegeList,(function(e,s){return i("div",{key:s,staticClass:"item",attrs:{"data-value":e}},[t._v(" "+t._s(e)+" ")])})),0)])])])]),i("div",{staticClass:"field"},[i("div",{staticClass:"two fields"},[i("div",{staticClass:"field"}),i("div",{staticClass:"field"},[i("a",{staticClass:"ui primary button",on:{click:t.addPrivilege}},[t._v(t._s(t.$t("add")))])])])])]),i("table",{staticClass:"ui celled structured table"},[i("thead",[i("tr",[i("th",[t._v(t._s(t.$t("user_id")))]),i("th",[t._v(t._s(t.$t("privilege")))]),i("th",[t._v(t._s(t.$t("remove")))])])]),i("tbody",t._l(t.userList,(function(e,s){return i("tr",{key:s},[i("td",[t._v(t._s(e.user_id))]),i("td",[t._v(t._s(e.rightstr))]),i("td",[i("a",{staticClass:"ui labeled icon black button",on:{click:function(i){return t.removePrivilege(e.user_id,e.rightstr)}}},[i("i",{staticClass:"trash icon"}),t._v(" "+t._s(t.$t("remove"))+" ")])])])})),0)])])},a=[],r=i("d4ec"),n=i("bee2"),c=i("99de"),l=i("7e84"),u=i("262e"),d=i("9ab4"),o=i("2cd4"),v=i("60a3"),p=i("1157"),h=i.n(p),g=h.a,f=function(t){function e(){var t;return Object(r["a"])(this,e),t=Object(c["a"])(this,Object(l["a"])(e).apply(this,arguments)),t.userList=[],t.privilegeList=[],t.user_id="",t.rightstr="",t}return Object(u["a"])(e,t),Object(n["a"])(e,[{key:"mounted",value:function(){this.initData(),this.initjQuery()}},{key:"basePrivilege",value:function(t,e,i){var s=this;this.axios.post(t,{user_id:e,rightstr:i}).then((function(t){var e=t.data;"OK"===e.status?alert(s.$t("success")):alert(e.statement),s.initData()}))}},{key:"addPrivilege",value:function(){this.basePrivilege("/api/admin/account/privilege/add",this.user_id,this.rightstr)}},{key:"removePrivilege",value:function(t,e){this.basePrivilege("/api/admin/account/privilege/remove",t,e)}},{key:"initData",value:function(){var t=this;this.axios.get("/api/admin/account/privilege").then((function(e){var i=e.data;"OK"===i.status?(t.userList=i.data.userList,t.privilegeList=i.data.privilegeList):alert(i.statement)}))}},{key:"initjQuery",value:function(){g(".ui.dropdown").dropdown()}}]),e}(Object(v["b"])(o["a"]));f=Object(d["c"])([v["a"]],f);var _=f,b=_,m=i("2877"),C=Object(m["a"])(b,s,a,!1,null,"8075cc24",null);e["default"]=C.exports}}]);