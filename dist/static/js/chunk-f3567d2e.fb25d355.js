(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-f3567d2e"],{"0443":function(t){t.exports=JSON.parse('{"title":"CUP Online Judge"}')},"2cd4":function(t,e,a){"use strict";var n=a("9ab4"),c=a("2b0e"),r=a("60a3"),i=a("3657"),s=a("0443"),o=class extends c["a"]{mounted(){i["a"].init(this.$store.getters.homepage),document.title=s.title}};o=Object(n["c"])([r["a"]],o),e["a"]=o},8215:function(t,e,a){"use strict";var n=a("f283"),c=a.n(n);c.a},9513:function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"ui pagination menu",staticStyle:{"box-shadow":"none"}},[a("a",{class:"icon item "+(t.current_page?"":"disabled"),on:{click:function(e){t.current_page&&t.page(e,-t.current_page)}}},[a("i",{staticClass:"angle double left icon"})]),a("a",{class:"icon item "+(t.current_page?"":"disabled"),on:{click:function(e){t.current_page&&t.page(e,-1)}}},[a("i",{staticClass:"left chevron icon"})]),t._l(t.pageList,(function(e){return a("div",{key:e},[a("a",{class:(t.current_page+1==e?"active":"")+" item page",on:{click:function(e){return t.page(e)}}},[t._v(" "+t._s(e)+" ")])])})),a("a",{class:"icon item "+(t.current_page+1==Math.ceil(t.total/t.page_cnt)?"disabled":""),on:{click:function(e){t.current_page+1<Math.ceil(t.total/t.page_cnt)&&t.page(e,1)}}},[a("i",{staticClass:"right chevron icon"})]),a("a",{class:"icon item "+(t.current_page+1==Math.ceil(t.total/t.page_cnt)?"disabled":""),on:{click:function(e){t.current_page+1<Math.ceil(t.total/t.page_cnt)&&t.page(e,Math.ceil(t.total/t.page_cnt)-1-t.current_page)}}},[a("i",{staticClass:"angle double right icon"})])],2)},c=[],r=(a("e260"),a("ddb0"),a("9ab4")),i=a("1157"),s=a.n(i),o=a("60a3"),l=a("2b0e"),u=(s.a,class extends l["a"]{constructor(){super(...arguments),this.total_menu=0}created(){var t=document.body.clientWidth,e=1100;t>1127&&(t=e),this.total_menu=Math.max(0,Math.trunc(.7*t/42)-4)}get pageList(){var{current_page:t,page_cnt:e,total:a,total_menu:n}=this,c=Array.from(Array(Math.min(Math.ceil(a/e),n)).keys()).map((function(c){return t<n/2?Math.trunc(c+1):t+n/2+1>Math.ceil(a/e)?Math.trunc(Math.ceil(a/e)-n+1+c):Math.trunc(t+c-n/2+1)}));return this.$emit("pageUpdated",c),c}page(t,e){e?this.onPageChanged(null,e):this.onPageChanged(parseInt(t.target.innerText)-1)}});Object(r["c"])([Object(o["c"])()],u.prototype,"total",void 0),Object(r["c"])([Object(o["c"])()],u.prototype,"page_cnt",void 0),Object(r["c"])([Object(o["c"])()],u.prototype,"current_page",void 0),Object(r["c"])([Object(o["c"])()],u.prototype,"onPageChanged",void 0),u=Object(r["c"])([o["a"]],u);var p=u,d=p,g=a("2877"),_=Object(g["a"])(d,n,c,!1,null,"68aad065",null);e["a"]=_.exports},c4d9:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"ui container padding"},[a("Pagination",{attrs:{current_page:t.current_page,page_cnt:t.page_cnt,total:t.total_number,"on-page-changed":t.page}}),a("table",{staticClass:"ui celled structured table"},[a("thead",[a("tr",[a("th",[t._v(t._s(t.$t("problem_id")))]),a("th",[t._v(t._s(t.$t("title")))]),a("th",[t._v(t._s(t.$t("from")))]),a("th",[t._v(t._s(t.$t("available")))]),a("th",[t._v(t._s(t.$t("upload time")))]),a("th",[t._v(t._s(t.$t("remove")))])])]),a("tbody",t._l(t.list,(function(e){return a("tr",{key:e.problem_id},[a("td",[t._v(" "+t._s(e.problem_id)+" ")]),a("td",[a("a",{attrs:{href:"/problem/edit/"+e.problem_id,target:"_blank"}},[t._v(t._s(e.title))])]),a("td",[a("a",{attrs:{href:"/problemset?tag="+e.source,target:"_blank"},domProps:{innerHTML:t._s(e.source)}})]),a("td",[a("button",{class:"ui inverted labeled icon button "+(t.defunctToBoolean(e.defunct)?"green":"red"),on:{click:function(a){return t.defunct(e.problem_id)}}},[a("i",{class:(t.defunctToBoolean(e.defunct)?"checkmark":"remove")+" icon"}),t._v(" "+t._s(t.defunctToBoolean(e.defunct)?t.$t("available"):t.$t("unavailable"))+" ")])]),a("td",[t._v(" "+t._s(null!==e.in_date?t.dayjs(e.in_date).format("YYYY-MM-DD HH:mm:ss"):t.$t("unknown"))+" ")]),a("td",[a("button",{staticClass:"ui labeled icon black button",on:{click:function(a){return t.remove(e.problem_id)}}},[a("i",{staticClass:"trash icon"}),t._v(" "+t._s(t.$t("remove"))+" ")])])])})),0)]),a("Pagination",{attrs:{current_page:t.current_page,page_cnt:t.page_cnt,total:t.total_number,"on-page-changed":t.page}})],1)},c=[],r=(a("e260"),a("ddb0"),a("9ab4")),i=a("2cd4"),s=a("9513"),o=a("5a0c"),l=a.n(o),u=a("60a3"),p=class extends(Object(u["b"])(i["a"])){constructor(){super(...arguments),this.current_page=0,this.list=[],this.dayjs=l.a,this.total_number=0,this.page_cnt=50}created(){var t=this.$route.query,e=0;Object.prototype.hasOwnProperty.call(t,"page")&&(e=parseInt(t.page)),isNaN(e)||(this.current_page=e)}onCurrentPageChanged(t){this.setQuery(),this.flushData(t)}mounted(){this.flushData(this.current_page)}defunctToBoolean(t){return"N"===t}flushData(t){this.axios.get("/api/admin/problem/list/".concat(t)).then(t=>{var{data:e}=t;this.list=e.data.data,this.total_number=e.data.count})}setQuery(){var t={};t.page=this.current_page,this.$router.push({path:this.$route.path,query:t})}remove(t){}page(t,e){this.current_page=e?this.current_page+e:t}defunct(t){this.axios.post("/api/admin/problem/defunct",{id:t}).then(t=>{var{data:e}=t;"OK"===e.status?this.flushData(this.current_page):alert(e.statement)})}};Object(r["c"])([Object(u["d"])("current_page")],p.prototype,"onCurrentPageChanged",null),p=Object(r["c"])([Object(u["a"])({components:{Pagination:s["a"]}})],p);var d=p,g=d,_=(a("8215"),a("2877")),h=Object(_["a"])(g,n,c,!1,null,"0f95797e",null);e["default"]=h.exports},f283:function(t,e,a){}}]);