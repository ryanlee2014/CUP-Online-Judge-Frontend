(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-f0b87394"],{"0443":function(t){t.exports=JSON.parse('{"title":"CUP Online Judge"}')},"2cd4":function(t,e,a){"use strict";var i=a("d4ec"),c=a("bee2"),s=a("99de"),n=a("7e84"),l=a("262e"),u=a("9ab4"),r=a("2b0e"),o=a("60a3"),d=a("f1ed"),p=a("0443"),f=function(t){function e(){return Object(i["a"])(this,e),Object(s["a"])(this,Object(n["a"])(e).apply(this,arguments))}return Object(l["a"])(e,t),Object(c["a"])(e,[{key:"mounted",value:function(){d["a"].init(this.$store.getters.homepage),document.title=p.title}}]),e}(r["a"]);f=Object(u["c"])([o["a"]],f),e["a"]=f},fe38:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"ui container padding",staticStyle:{"min-height":"400px"}},[a("h2",{staticClass:"ui dividing header"},[t._v("Upload Problem")]),a("div",{staticClass:"ui grid"},[a("div",{staticClass:"row"},[a("div",{staticClass:"ui center aligned segment",staticStyle:{"min-height":"400px"}},[a("div",{staticClass:"ui main container"},[a("form",{staticClass:"ui form",attrs:{action:"/api/upload/user",enctype:"multipart/form-data",method:"post"}},[a("h3",[t._v("Import Problem(RPK):")]),a("div",{staticClass:"field"},[a("a",{staticClass:"ui button",on:{click:t.selectFile}},[t._v(t._s(t.fileStatus))]),a("input",{ref:"file",staticStyle:{display:"none"},attrs:{id:"file",name:"fps",type:"file"},on:{change:t.fileChange}})]),t._m(0),t._m(1)])])])])])])},c=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"two field"},[a("div",{staticClass:"ui left input",staticStyle:{width:"auto"}},[a("input",{attrs:{id:"vcode",name:"captcha",placeholder:"验证码",type:"text"}}),a("img",{attrs:{alt:"click to change",height:"40px",id:"vcode_graph",onclick:"this.src='/api/captcha?from=upload&random='+Math.random()",src:"/api/captcha?from=upload"}})])])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"field"},[a("input",{staticClass:"ui blue button",attrs:{type:"submit",value:"Import"}})])}],s=(a("b0c0"),a("d4ec")),n=a("bee2"),l=a("99de"),u=a("7e84"),r=a("262e"),o=a("9ab4"),d=a("2cd4"),p=a("60a3"),f=function(t){function e(){var t;return Object(s["a"])(this,e),t=Object(l["a"])(this,Object(u["a"])(e).apply(this,arguments)),t.fileStatus="选择文件",t}return Object(r["a"])(e,t),Object(n["a"])(e,[{key:"mounted",value:function(){document.title="Upload problem -- ".concat(document.title)}},{key:"fileChange",value:function(t){this.fileStatus=t.target.files[0].name}},{key:"selectFile",value:function(){this.$refs.file.click()}}]),e}(Object(p["b"])(d["a"]));f=Object(o["c"])([p["a"]],f);var h=f,m=h,b=a("2877"),v=Object(b["a"])(m,i,c,!1,null,"2eb0700a",null);e["default"]=v.exports}}]);