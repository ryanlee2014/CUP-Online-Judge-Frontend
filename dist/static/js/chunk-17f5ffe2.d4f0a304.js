(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-17f5ffe2"],{3865:function(t,e,i){"use strict";var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{ref:"source",staticStyle:{width:"100%",height:"460px"},style:{width:"100%",height:t.height+"px",fontSize:t.fontSize+"px"},attrs:{cols:"180",rows:"20"}})},s=[],n=(i("e260"),i("2532"),i("ddb0"),i("9ab4")),o=i("c2c6"),c=i("6c54"),l=i("2b0e"),r=i("60a3"),d=class extends l["a"]{constructor(){super(...arguments),this.editor=null,this.source_code=""}onSourceCodeChanged(t){this.$emit("input",t)}onValueChanged(t){t!==this.source_code&&(this.source_code=t,this.editor.getModel().setValue(t))}onSelectedLanguageChanged(t){if(this.editor){var e=this.editor.getModel(),i=o["editor"].createModel(e.getValue(),c["a"][parseInt(t)]);this.editor.setModel(i),e&&e.dispose(),this.modelEventRegistry()}}onThemeChanged(t){this.editor&&(t.includes("vs")||t.includes("hc-black")?o["editor"].setTheme(t):o["editor"].setTheme("vs-dark"))}onFontSizeChanged(t){this.editor&&!isNaN(parseInt(t))&&this.editor.updateOptions({fontSize:parseInt(t)})}onHeightChanged(t){this.editor&&this.$nextTick(()=>{this.editor.layout()})}mounted(){this.$nextTick(()=>{this.initEditor()})}initEditor(){this.editor=o["editor"].create(this.$refs.source,{value:this.value,language:c["a"][this.selected_language],minimap:{enabled:this.minimap},fontLigatures:!0,scrollBeyondLastLine:!1,readOnly:this.readOnly}),this.editor.updateOptions({fontSize:this.getFontSizeFromStorage()}),o["editor"].setTheme(this.getThemeFromStorage()),this.modelEventRegistry()}modelEventRegistry(){var t=this.editor.getModel();t.onDidChangeContent(()=>{this.source_code=this.editor.getModel().getValue(),this.$store.commit("setCodeInfo",{code:this.source_code})})}getDataFromStorage(t,e){var i;try{i=JSON.parse(localStorage.submitConfig)[e]}catch(a){i=t}return i}getThemeFromStorage(){return this.getDataFromStorage("vs-dark","theme")}getFontSizeFromStorage(){return this.getDataFromStorage(16,"fontSize")}};Object(n["c"])([Object(r["c"])({default:"18"})],d.prototype,"fontSize",void 0),Object(n["c"])([Object(r["c"])({default:0})],d.prototype,"selected_language",void 0),Object(n["c"])([Object(r["c"])({default:"vs-dark"})],d.prototype,"theme",void 0),Object(n["c"])([Object(r["c"])({default:""})],d.prototype,"value",void 0),Object(n["c"])([Object(r["c"])({default:460})],d.prototype,"height",void 0),Object(n["c"])([Object(r["c"])({default:!1})],d.prototype,"readOnly",void 0),Object(n["c"])([Object(r["c"])({default:!0})],d.prototype,"minimap",void 0),Object(n["c"])([Object(r["d"])("source_code")],d.prototype,"onSourceCodeChanged",null),Object(n["c"])([Object(r["d"])("value")],d.prototype,"onValueChanged",null),Object(n["c"])([Object(r["d"])("selected_language")],d.prototype,"onSelectedLanguageChanged",null),Object(n["c"])([Object(r["d"])("theme")],d.prototype,"onThemeChanged",null),Object(n["c"])([Object(r["d"])("fontSize")],d.prototype,"onFontSizeChanged",null),Object(n["c"])([Object(r["d"])("height")],d.prototype,"onHeightChanged",null),d=Object(n["c"])([r["a"]],d);var p=d,u=p,m=i("2877"),h=Object(m["a"])(u,a,s,!1,null,"36cbcbe6",null);e["a"]=h.exports},"4a3b":function(t,e,i){"use strict";i.r(e);var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"ui container padding"},[i("div",{staticClass:"ui grid"},[t._m(0),i("div",{staticClass:"two column row"},[i("div",{staticClass:"column"},[i("div",{staticClass:"ui input",staticStyle:{width:"100%"}},[i("input",{directives:[{name:"model",rawName:"v-model",value:t.title,expression:"title"}],attrs:{type:"text"},domProps:{value:t.title},on:{input:function(e){e.target.composing||(t.title=e.target.value)}}})])]),i("div",{staticClass:"column",staticStyle:{"z-index":"1700"}},[i("select",{staticClass:"ui search dropdown label selection",attrs:{multiple:""},on:{change:function(e){t.label=t.select(".label.selection.ui.dropdown").dropdown("get value")}}},t._l(t.all_label,(function(e){return i("option",{key:e,domProps:{value:e,textContent:t._s(e)}})})),0)])]),i("div",{staticClass:"three column row"},[i("div",{staticClass:"column"},[i("div",{staticClass:"ui labeled input"},[i("div",{staticClass:"ui label"},[t._v(" Time ")]),i("input",{directives:[{name:"model",rawName:"v-model",value:t.time,expression:"time"}],attrs:{type:"text"},domProps:{value:t.time},on:{input:function(e){e.target.composing||(t.time=e.target.value)}}})])]),i("div",{staticClass:"column"},[i("div",{staticClass:"ui labeled input"},[i("div",{staticClass:"ui label"},[t._v(" Memory ")]),i("input",{directives:[{name:"model",rawName:"v-model",value:t.memory,expression:"memory"}],attrs:{type:"text"},domProps:{value:t.memory},on:{input:function(e){e.target.composing||(t.memory=e.target.value)}}})])]),i("div",{staticClass:"column",staticStyle:{margin:"auto"}},[i("div",{staticClass:"ui toggle checkbox"},[i("input",{directives:[{name:"model",rawName:"v-model",value:t.spj,expression:"spj"}],attrs:{type:"checkbox"},domProps:{checked:t.spj,checked:Array.isArray(t.spj)?t._i(t.spj,null)>-1:t.spj},on:{change:function(e){var i=t.spj,a=e.target,s=!!a.checked;if(Array.isArray(i)){var n=null,o=t._i(i,n);a.checked?o<0&&(t.spj=i.concat([n])):o>-1&&(t.spj=i.slice(0,o).concat(i.slice(o+1)))}else t.spj=s}}}),i("label",[t._v("Special Judge")])])])]),t._m(1),i("div",{staticClass:"row"},[i("mavon-editor",{ref:"description",attrs:{markInstance:t.descriptionInstance},model:{value:t.description,callback:function(e){t.description=e},expression:"description"}})],1),i("br"),t._m(2),i("div",{staticClass:"row"},[i("mavon-editor",{ref:"input",attrs:{markInstance:t.inputInstance},model:{value:t.input,callback:function(e){t.input=e},expression:"input"}})],1),i("br"),t._m(3),i("div",{staticClass:"row"},[i("mavon-editor",{ref:"output",attrs:{markInstance:t.outputInstance},model:{value:t.output,callback:function(e){t.output=e},expression:"output"}})],1),i("br"),t._m(4),i("div",{staticClass:"row"},[i("div",{staticClass:"ui form",staticStyle:{"min-width":"85%"}},[i("div",{staticClass:"field"},[i("textarea",{directives:[{name:"model",rawName:"v-model",value:t.sampleinput,expression:"sampleinput"}],domProps:{value:t.sampleinput},on:{input:function(e){e.target.composing||(t.sampleinput=e.target.value)}}})])])]),i("br"),t._m(5),i("div",{staticClass:"row"},[i("div",{staticClass:"ui form",staticStyle:{"min-width":"85%"}},[i("div",{staticClass:"field"},[i("textarea",{directives:[{name:"model",rawName:"v-model",value:t.sampleoutput,expression:"sampleoutput"}],domProps:{value:t.sampleoutput},on:{input:function(e){e.target.composing||(t.sampleoutput=e.target.value)}}})])])]),t._m(6),i("div",{staticClass:"row"},t._l(t.files,(function(e){return i("div",{key:e,staticClass:"ui label"},[i("a",{attrs:{href:t.makeHref(e)}},[t._v(" "+t._s(e)+" ")]),i("i",{staticClass:"delete icon",on:{click:function(i){return t.removeFile(e)}}})])})),0),i("div",{staticClass:"row"},[i("div",{staticClass:"four wide column"},[i("div",{staticClass:"ui grid"},[i("div",{staticClass:"row"},[i("div",{staticClass:"eight wide column"},[i("form",{ref:"upload_file_form"},[i("a",{staticClass:"ui button",on:{click:t.selectFile}},[t._v(t._s(t.uploadFileName))]),i("input",{ref:"file_input",staticStyle:{display:"none"},attrs:{name:"upload_file",type:"file"},on:{change:t.fileChanged}})])]),i("div",{staticClass:"eight wide column"},[i("a",{staticClass:"ui primary button",on:{click:t.uploadFile}},[t._v(t._s(t.$t("submit")))])])])])]),t._m(7)]),t._m(8),i("div",{staticClass:"row"},[i("div",{staticClass:"four wide column"},[i("div",{staticClass:"ui attached vertical fluid pointing menu",staticStyle:{height:"370px","overflow-y":"scroll","overflow-x":"hidden"}},[i("a",{class:0===t.prependSelected?"active item":"item",on:{click:function(e){t.prependSelected=0}}},[t._v("C "),i("div",{staticClass:"ui right floated",staticStyle:{opacity:"0.4","margin-top":"8px","font-size":"0.7em"}},[t._v("GNU C99/C11 LLVM Clang ")])]),i("a",{class:1===t.prependSelected?"active item":"item",on:{click:function(e){t.prependSelected=1}}},[t._v("C++ "),i("div",{staticClass:"ui right floated",staticStyle:{opacity:"0.4","margin-top":"8px","font-size":"0.7em"}},[t._v("GNU C++11/C++89/C++17 LLVM Clang++ ")])]),i("a",{class:2===t.prependSelected?"active item":"item",on:{click:function(e){t.prependSelected=2}}},[t._v("Pascal "),i("div",{staticClass:"ui right floated",staticStyle:{opacity:"0.4","margin-top":"8px","font-size":"0.7em"}},[t._v("fpc Pascal ")])]),i("a",{class:3===t.prependSelected?"active item":"item",on:{click:function(e){t.prependSelected=3}}},[t._v("Java "),i("div",{staticClass:"ui right floated",staticStyle:{opacity:"0.4","margin-top":"8px","font-size":"0.7em"}},[t._v(" openJDK 1.6/1.7/1.8/1.10 ")])]),i("a",{class:16===t.prependSelected?"active item":"item",on:{click:function(e){t.prependSelected=16}}},[t._v("JavaScript "),i("div",{staticClass:"ui right floated",staticStyle:{opacity:"0.4","margin-top":"8px","font-size":"0.7em"}},[t._v(" NodeJS 10.13.0 ")])]),i("a",{class:6===t.prependSelected?"active item":"item",on:{click:function(e){t.prependSelected=6}}},[t._v("Python "),i("div",{staticClass:"ui right floated",staticStyle:{opacity:"0.4","margin-top":"8px","font-size":"0.7em"}},[t._v(" Python 2.7/3.6 PyPy2/3 ")])]),i("a",{class:9===t.prependSelected?"active item":"item",on:{click:function(e){t.prependSelected=9}}},[t._v("C# "),i("div",{staticClass:"ui right floated",staticStyle:{opacity:"0.4","margin-top":"8px","font-size":"0.7em"}},[t._v(" Mono ")])])])]),i("div",{staticClass:"ten wide column"},[i("monaco-editor",{attrs:{selected_language:t.prependSelected},model:{value:t.prepend[t.prependSelected],callback:function(e){t.$set(t.prepend,t.prependSelected,e)},expression:"prepend[prependSelected]"}})],1)]),t._m(9),i("div",{staticClass:"row"},[i("div",{staticClass:"four wide column"},[i("div",{staticClass:"ui attached vertical fluid pointing menu",staticStyle:{height:"370px","overflow-y":"scroll","overflow-x":"hidden"}},[i("a",{class:0===t.appendSelected?"active item":"item",on:{click:function(e){t.appendSelected=0}}},[t._v("C "),i("div",{staticClass:"ui right floated",staticStyle:{opacity:"0.4","margin-top":"8px","font-size":"0.7em"}},[t._v("GNU C99/C11 LLVM Clang ")])]),i("a",{class:1===t.appendSelected?"active item":"item",on:{click:function(e){t.appendSelected=1}}},[t._v("C++ "),i("div",{staticClass:"ui right floated",staticStyle:{opacity:"0.4","margin-top":"8px","font-size":"0.7em"}},[t._v("GNU C++11/C++89/C++17 LLVM Clang++ ")])]),i("a",{class:2===t.appendSelected?"active item":"item",on:{click:function(e){t.appendSelected=2}}},[t._v("Pascal "),i("div",{staticClass:"ui right floated",staticStyle:{opacity:"0.4","margin-top":"8px","font-size":"0.7em"}},[t._v("fpc Pascal ")])]),i("a",{class:3===t.appendSelected?"active item":"item",on:{click:function(e){t.appendSelected=3}}},[t._v("Java "),i("div",{staticClass:"ui right floated",staticStyle:{opacity:"0.4","margin-top":"8px","font-size":"0.7em"}},[t._v(" OpenJDK 1.6/1.7/1.8/1.10 ")])]),i("a",{class:16===t.appendSelected?"active item":"item",on:{click:function(e){t.appendSelected=16}}},[t._v("JavaScript "),i("div",{staticClass:"ui right floated",staticStyle:{opacity:"0.4","margin-top":"8px","font-size":"0.7em"}},[t._v(" NodeJS 10.13.0 ")])]),i("a",{class:6===t.appendSelected?"active item":"item",on:{click:function(e){t.appendSelected=6}}},[t._v("Python "),i("div",{staticClass:"ui right floated",staticStyle:{opacity:"0.4","margin-top":"8px","font-size":"0.7em"}},[t._v(" Python 2.7/3.6 PyPy2/3 ")])]),i("a",{class:9===t.appendSelected?"active item":"item",on:{click:function(e){t.appendSelected=9}}},[t._v("C# "),i("div",{staticClass:"ui right floated",staticStyle:{opacity:"0.4","margin-top":"8px","font-size":"0.7em"}},[t._v(" Mono ")])])])]),i("div",{staticClass:"ten wide column"},[i("monaco-editor",{attrs:{selected_language:t.appendSelected},model:{value:t.append[t.appendSelected],callback:function(e){t.$set(t.append,t.appendSelected,e)},expression:"append[appendSelected]"}})],1)]),"local"===t.from?i("div",{staticClass:"row"},[i("h2",{staticClass:"ui header"},[t._v(" Hint ")])]):t._e(),"local"===t.from?i("div",{staticClass:"row"},[i("mavon-editor",{ref:"hint",attrs:{markInstance:t.hintInstance,test:"1"},model:{value:t.hint,callback:function(e){t.hint=e},expression:"hint"}})],1):t._e(),i("a",{staticClass:"ui button",on:{click:t.submit}},[t._v("提交")])])])},s=[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"row"},[i("h2",{staticClass:"ui header"},[t._v(" Title ")])])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"row"},[i("h2",{staticClass:"ui header"},[t._v(" Description ")])])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"row"},[i("h2",{staticClass:"ui header"},[t._v(" Input ")])])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"row"},[i("h2",{staticClass:"ui header"},[t._v(" Output ")])])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"row"},[i("h2",{staticClass:"ui header"},[t._v(" Sample Input ")])])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"row"},[i("h2",{staticClass:"ui header"},[t._v(" Sample Output ")])])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"row"},[i("h2",{staticClass:"ui header"},[t._v("Files")])])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"twelve wide column"},[i("p")])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"row"},[i("h2",{staticClass:"ui header"},[t._v(" Prepend Code ")])])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"row"},[i("h2",{staticClass:"ui header"},[t._v(" Append Code ")])])}],n=(i("e01a"),i("e260"),i("cca6"),i("1276"),i("498a"),i("ddb0"),i("9ab4")),o=i("2cd4"),c=i("6b34"),l=i("3865"),r=i("60a3"),d=i("986d"),p=i("1157"),u=i.n(p),m=i("2ef0"),h=u.a,v=class extends(Object(r["b"])(o["a"])){constructor(){super(...arguments),this.title="",this.description="",this.time="",this.memory="",this.input="",this.output="",this.spj=!1,this.sampleinput="",this.sampleoutput="",this.uploadFileName="",this.descriptionInstance=c["a"].newInstance(),this.inputInstance=c["a"].newInstance(),this.outputInstance=c["a"].newInstance(),this.hintInstance=c["a"].newInstance(),this.hint="",this.source="",this.from="local",this.label=[],this.all_label=[],this.prepend={},this.prependSelected=0,this.append={},this.appendSelected=0,this.files=[],this.id="0",this.select=h}created(){this.id=this.$route.params.problem_id,this.uploadFileName=this.$t("select file")}mounted(){document.title="Problem ".concat(this.id," Edit -- ").concat(document.title),this.initData()}makeHref(t){return"/api/admin/problem/download/data/".concat(this.id,"/").concat(t)}PrependAppendLanguage(t,e,i){var a=this[t][e];"undefined"!==typeof a&&i.forEach(e=>{this[t][e]=a})}submit(){var t="local";this.PrependAppendLanguage("prepend",0,[21,13,28]),this.PrependAppendLanguage("prepend",1,[19,20,14,29]),this.PrependAppendLanguage("prepend",3,[23,24,27]),this.PrependAppendLanguage("append",3,[23,24,27]),this.PrependAppendLanguage("append",0,[21,13,28]),this.PrependAppendLanguage("append",1,[19,20,14,29]);var e=this.id,i={imageData:{}},a={payload:[],problemId:e};Object.keys(this.prepend).forEach(t=>{this.prepend[t].trim().length>0&&a.payload.push({language:parseInt(t),code:this.prepend[t]})});var s={payload:[],problemId:e};for(var n of(Object.keys(this.append).forEach(t=>{this.append[t].trim().length>0&&s.payload.push({language:parseInt(t),code:this.append[t]})}),this.$children))if("undefined"!==typeof n.markdownIt){var o=n.$vnode.data.model;i[o.expression]=o.value,i.imageData[o.expression]=n.markdownIt.__image||{}}i["time"]=this.time,i["memory"]=this.memory,i["title"]=this.title,i["sampleinput"]=this.sampleinput,i["sampleoutput"]=this.sampleoutput,i["spj"]=Number(this.spj),i["hint"]=this.hint;var c=this.label;i["label"]=Object(d["a"])(c).join(" "),this.axios.post("/api/problem/".concat(this.source,"/").concat(e),{json:i}).then(i=>{var{data:a}=i;"OK"===a.status&&(this.axios.get("/api/problem/".concat(t,"?id=").concat(e)),alert("提交成功"))}),console.log(a),console.log(s),this.axios.post("/api/problem/prefile/prepend",a),this.axios.post("/api/problem/prefile/append",s)}imageHandler(t,e){var i={0:"description",1:"input",2:"output",3:"hint"},a=-1;m["forEach"](e.data,(e,s)=>{this.$refs[i[t]].markdownIt.image_add_with_check(e.name,e.data),a=Math.max(a,parseInt(e.name))}),this.$refs[i[t]].$children[0].num=a+1,this.$refs[i[t]].iRender()}initData(){var t=this,e=this.id;this.axios.get("/api/problem/local",{params:{id:this.id,raw:""}}).then(i=>{var{data:a}=i,s=a.problem,n={title:s.title,description:s.description,time:s.time_limit,memory:s.memory_limit,input:s.input,output:s.output,spj:!!parseInt(s.spj),sampleinput:s.sample_input,sampleoutput:s.sample_output,hint:s.hint,source:"local",label:s.label?s.label.split(" "):[],all_label:[],files:[]};Object.assign(this,n),this.axios.get("/api/problem/".concat(this.source,"/?label=true")).then(e=>{var{data:i}=e,a=h(".label.selection.ui.dropdown");t.all_label=i.data;var s=t.label;a.dropdown({allowAdditions:!0}).on("click",(function(){t.label=a.dropdown("get value")}));for(var n=0;n<s.length;++n)a.dropdown("set selected",s[n])}),this.initMarkdown("description",e,0),this.initMarkdown("input",e,1),this.initMarkdown("output",e,2),this.initMarkdown("hint",e,3),this.initFiles()}),this.initPrependAppendCode("prepend","prepend"),this.initPrependAppendCode("append","append")}initFiles(){this.axios.get("/api/file/".concat(this.id)).then(t=>{var{data:e}=t;"OK"===e.status&&(this.files=e.data)})}initPrependAppendCode(t,e){this.axios.get("/api/problem/prefile/".concat(e,"/").concat(this.id)).then(e=>{var{data:i}=e;if(i=i.data,i.payload&&i.payload.length&&i.payload.length>0){var a=i.payload;a.forEach(e=>{this[t][e.language]=e.code})}})}initMarkdown(t,e,i){this.axios.get("/api/photo/".concat(t,"/").concat(e)).then(t=>{var{data:e}=t;"OK"===e.status&&this.imageHandler(i,e)})}selectFile(){this.$refs.file_input.click()}fileChanged(t){this.uploadFileName=t.target.files[0].name}uploadFile(){var t=new FormData(this.$refs.upload_file_form),e={onUploadProgress:function(t){var e=Math.round(100*t.loaded/t.total);console.log(e)}};this.axios.post("/api/admin/problem/data/set/".concat(this.id),t,e).then(t=>{var{data:e}=t;alert("上传成功"),this.initFiles()})}removeFile(t){var e=confirm("是否删除".concat(t,"?"));e&&this.axios.get("/api/admin/problem/data/remove/".concat(this.id,"/").concat(t)).then(e=>{var{data:i}=e;alert("文件: ".concat(t,"已删除")),this.initFiles()})}};v=Object(n["c"])([Object(r["a"])({components:{monacoEditor:l["a"]}})],v);var f=v,g=f,C=i("2877"),_=Object(C["a"])(g,a,s,!1,null,"57415882",null);e["default"]=_.exports},"6c54":function(t,e,i){"use strict";e["a"]=["cpp","cpp","pascal","java","ruby","bash","python","php","perl","csharp","objectivec","freebasic","schema","cpp","cpp","lua","javascript","go","python","cpp","cpp","cpp","kotlin","java","java","python","python","java","cpp","cpp",""]},"986d":function(t,e,i){"use strict";function a(t){return t.filter((function(t,e,i){return i.indexOf(t)===e}))}i.d(e,"a",(function(){return a}))}}]);