(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5fac88e1"],{"0443":function(t){t.exports=JSON.parse('{"title":"CUP Online Judge"}')},"2cd4":function(t,e,i){"use strict";var n=i("9ab4"),s=i("2b0e"),o=i("60a3"),a=i("f1ed"),c=i("0443"),r=class extends s["a"]{mounted(){a["a"].init(this.$store.getters.homepage),document.title=c.title}};r=Object(n["c"])([o["a"]],r),e["a"]=r},"2d07":function(t,e,i){"use strict";var n=i("2ec3"),s=i.n(n);s.a},"2ec3":function(t,e,i){},"9a8b":function(t,e,i){"use strict";i.r(e);var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"ui container"},[i("h2",{staticClass:"ui dividing header"},[t._v("Compile Information")]),i("div",{staticClass:"ui segment same_width",domProps:{innerHTML:t._s(t.info)}})])},s=[],o=(i("e260"),i("1276"),i("ddb0"),i("9ab4")),a=i("2cd4"),c=i("60a3"),r=document.createElement("div"),d=class extends(Object(c["b"])(a["a"])){constructor(){super(...arguments),this.info="",this.solution_id=""}created(){this.solution_id=this.$route.params.solution_id}mounted(){document.title="".concat(this.solution_id," Compile Information -- ").concat(document.title),this.axios.get("/api/status/compile_info/".concat(this.solution_id)).then(t=>{var{data:e}=t;"OK"===e.status?this.info=this.convertHTML(e.data.info).split(" ").join("&nbsp;"):this.info="您无权访问"})}convertHTML(t){return r.innerText=t,r.innerHTML}};d=Object(o["c"])([c["a"]],d);var u=d,l=u,h=(i("2d07"),i("2877")),f=Object(h["a"])(l,n,s,!1,null,"3d51e334",null);e["default"]=f.exports}}]);