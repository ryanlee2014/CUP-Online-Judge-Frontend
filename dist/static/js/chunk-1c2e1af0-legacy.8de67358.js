(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1c2e1af0"],{"0443":function(e){e.exports=JSON.parse('{"title":"CUP Online Judge"}')},"07ac":function(e,t,a){var c=a("23e7"),i=a("6f53").values;c({target:"Object",stat:!0},{values:function(e){return i(e)}})},"2cd4":function(e,t,a){"use strict";var c=a("d4ec"),i=a("bee2"),n=a("99de"),o=a("7e84"),s=a("262e"),r=a("9ab4"),l=a("2b0e"),d=a("60a3"),u=a("f1ed"),g=a("0443"),p=function(e){function t(){return Object(c["a"])(this,t),Object(n["a"])(this,Object(o["a"])(t).apply(this,arguments))}return Object(s["a"])(t,e),Object(i["a"])(t,[{key:"mounted",value:function(){u["a"].init(this.$store.getters.homepage),document.title=g.title}}]),t}(l["a"]);p=Object(r["c"])([d["a"]],p),t["a"]=p},"6f53":function(e,t,a){var c=a("83ab"),i=a("df75"),n=a("fc6a"),o=a("d1e7").f,s=function(e){return function(t){var a,s=n(t),r=i(s),l=r.length,d=0,u=[];while(l>d)a=r[d++],c&&!o.call(s,a)||u.push(e?[a,s[a]]:s[a]);return u}};e.exports={entries:s(!0),values:s(!1)}},"9b84":function(e,t,a){"use strict";a.r(t);var c=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"ui container padding"},[a("div",{staticClass:"ui grid"},[a("div",{staticClass:"row"},[a("div",{staticClass:"column"},[a("div",{staticClass:"ui menu borderless",staticStyle:{margin:"0",padding:"0",position:"relative",height:"35px",color:"black",width:"100%","text-align":"right"},attrs:{id:"modeBar"}},[a("div",{staticClass:"right menu"},[e.editorPackage?a("monaco-theme-selector",{model:{value:e.theme,callback:function(t){e.theme=t},expression:"theme"}}):a("ace-theme-selector",{model:{value:e.theme,callback:function(t){e.theme=t},expression:"theme"}})],1)]),e.editorPackage?a("monaco-editor",{attrs:{fontSize:e.fontSize,selected_language:e.selected_language,theme:e.theme},model:{value:e.code,callback:function(t){e.code=t},expression:"code"}}):a("ace-editor",{attrs:{fontSize:e.fontSize,selected_language:e.selected_language,theme:e.theme},model:{value:e.code,callback:function(t){e.code=t},expression:"code"}}),a("div",{staticClass:"ui menu borderless",staticStyle:{margin:"0",padding:"0",position:"relative",height:"30px",color:"black",width:"100%"},attrs:{id:"statusBar"}},[a("div",{staticClass:"item",staticStyle:{"text-align":"center"}},[e._v(" CUP Online Judge "),a("div",{staticClass:"item"},[a("div",{staticClass:"ui toggle checkbox"},[a("input",{directives:[{name:"model",rawName:"v-model",value:e.editorPackage,expression:"editorPackage"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(e.editorPackage)?e._i(e.editorPackage,null)>-1:e.editorPackage},on:{change:function(t){var a=e.editorPackage,c=t.target,i=!!c.checked;if(Array.isArray(a)){var n=null,o=e._i(a,n);c.checked?o<0&&(e.editorPackage=a.concat([n])):o>-1&&(e.editorPackage=a.slice(0,o).concat(a.slice(o+1)))}else e.editorPackage=i}}}),a("label",[e._v("切换编辑器")])])]),a("div",{directives:[{name:"show",rawName:"v-show",value:!e.editorPackage,expression:"!editorPackage"}],staticClass:"item"},[a("span",{staticClass:"item"},[e._v("字号:")]),a("div",{staticClass:"ui input"},[a("input",{directives:[{name:"model",rawName:"v-model",value:e.fontSize,expression:"fontSize"}],staticStyle:{width:"60px","text-align":"center",height:"30px"},attrs:{id:"fontsize",type:"text"},domProps:{value:e.fontSize},on:{input:function(t){t.target.composing||(e.fontSize=t.target.value)}}})])])])])],1)])])])},i=[],n=(a("07ac"),a("d4ec")),o=a("bee2"),s=a("99de"),r=a("7e84"),l=a("262e"),d=a("9ab4"),u=a("f6bf"),g=a("cc87"),p=a("3865"),h=a("2f90"),m=a("2cd4"),v=a("60a3"),b=a("2ef0"),f=a.n(b),k={c11:0,cpp17:1,pascal:2,java10:3,ruby:4,bash:5,python2:6,php:7,perl:8,csharp:9,"obj-c":10,freebasic:11,schema:12,clang:13,clangpp:14,lua:15,javascript:16,go:17,python3:18,cpp11:19,cpp98:20,c99:21,kotlin:22,java8:23,java7:24,pypy:25,pypy3:26,java6:27,clang11:28,clangpp17:29},j=a("1ae0"),y=function(e){function t(){var e;return Object(n["a"])(this,t),e=Object(s["a"])(this,Object(r["a"])(t).apply(this,arguments)),e.theme="ace/theme/monokai",e.code="",e.editorPackage=!0,e.fontSize="16",e.selected_language=0,e}return Object(l["a"])(t,e),Object(o["a"])(t,[{key:"onEditorPackageChange",value:function(e){this.theme=e?"vs-dark":"ace/theme/monokai"}},{key:"onCodeChange",value:function(e){e&&this.detectLanguageDebouncer()}},{key:"mounted",value:function(){document.title="Whiteboard -- ".concat(document.title)}},{key:"detectLanguageDebouncer",value:function(){var e=this;f.a.debounce((function(){var t=j(e.code,Object.values(k));e.selected_language!==t&&(e.selected_language=t)}),100)()}}]),t}(Object(v["b"])(m["a"]));Object(d["c"])([Object(v["d"])("editorPackage")],y.prototype,"onEditorPackageChange",null),Object(d["c"])([Object(v["d"])("code")],y.prototype,"onCodeChange",null),y=Object(d["c"])([Object(v["a"])({components:{aceEditor:u["a"],aceThemeSelector:g["a"],monacoEditor:p["a"],monacoThemeSelector:h["a"]}})],y);var O=y,C=O,P=a("2877"),x=Object(P["a"])(C,c,i,!1,null,"ffb5dc7c",null);t["default"]=x.exports}}]);