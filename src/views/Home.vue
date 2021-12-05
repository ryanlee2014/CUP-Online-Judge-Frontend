<template>
    <div>
        <div>
            <div class="ui inverted not theme vertical masthead center aligned segment gr5" id="background">
                <div id="main_container">
                    <div class="ui container">
                        <div class="ui large secondary inverted not theme pointing menu">
                        </div>
                    </div>
                    <div class="ui grid" id="main_masthead" style="transform: translateX(25%)">
                        <div class="ui text container transition main title eight wide column" id="left">
                            <h1 class="ui inverted not theme header text shape">
                                <div class="sides">
                                    <div class="ui inverted not theme header side active hometitle">{{$t("oj-name")}}</div>
                                </div>
                            </h1>
                            <div class="column buttonset">
                                <router-link class="ui inverted not theme large button download basic" to="/about/icpc">
                                    <i class="newspaper outline icon"></i>
                                    {{$t("about icpc")}}
                                </router-link>
                                <!--
                                <router-link class="ui inverted not theme large button download basic" to="/discuss/thread/20">
                                    <i class="briefcase icon"></i>
                                    校招内推
                                </router-link>
                                -->
                                <router-link class="ui inverted not theme large button download basic" to="/about/fame">
                                    <i class="chess queen icon"></i>
                                    {{$t("hall of fame")}}
                                </router-link>
                            </div>
                            <br>

                            <div class="column">
                                <!-- Place this tag where you want the button to render. -->
                                <!-- Place this tag where you want the button to render. -->
                                <github-button data-text="Star" style="vertical-align: middle;" class="github_button" data-size="large" href="https://github.com/ryanlee2014/CUP-Online-Judge" data-show-count="true" aria-label="Star ryanlee2014/CUP-Online-Judge on GitHub">Star</github-button>
                                <!-- Place this tag where you want the button to render. -->
                                &nbsp;
                                <github-button data-text="Fork" style="vertical-align: middle;" class="github_button" data-size="large" href="https://github.com/ryanlee2014/CUP-Online-Judge/fork" data-show-count="true" aria-label="Fork ryanlee2014/CUP-Online-Judge on GitHub">Fork</github-button>
                            </div>
                            <br>
                            <a href="https://promotion.aliyun.com/ntms/act/ambassador/sharetouser.html?userCode=1ohno31e&utm_source=1ohno31e"
                                   title="阿里云限量红包，上云就上阿里云，享数字化转型，市场占有率超过第 2-5 名总和" class="ui small image main title" target="_blank">
                            <img src="../static/image/aliyun.svg" alt="Aliyun">
                        </a>
                            <!--<a class="vultr" href="https://www.vultr.com/?ref=7250019" target="_blank"><img src="./image/vultr.png" class="ui small image main title" style="display:inline-block"></a>-->
                            <!--<h4></h4>-->
                            <!--<a class="ui huge inverted not theme download button" href="cprogrammingcontest">查看复赛情况</a>-->
                        </div>
                        <div class="ui text container transition main title eight wide column" id="right"
                             style="opacity: 0">
                            <div class="ui grid">
                                <div class="two wide column"></div>
                                <div class="twelve wide column">
                                    <div class="ui warning message" style="margin-top:15em">
                                        <!--<i class="close icon"></i>-->
                                        <div class="header">提示</div>
                                        <p style="font-size:1em">系统将于2019年3月21日12:00-18:00期间停止一般用户的访问提交。</p>
                                        <!--
                                        <ul class="list">
                    <li>考试/测验请访问http://acm.cup.edu.cn</li>
                    <li>普通用户/IPv6用户请访问https://www.cupacm.com</li>
                    <li>外网用户请访问https://oj.cupacm.com</li>
                    </ul>
                                        -->
                                    </div>
                                    <div class="row">

                                    </div>
                                </div>
                                <div class="two wide column">

                                </div>
                            </div>

                        </div>
                    </div>
                    <div class="ui vertical divider inverted" id="divider" style="opacity: 0">

                    </div>
                    <br>
                </div>
            </div>

        </div>

        <div class="ui vertical stripe segment">
            <div class="ui middle aligned stackable grid container">
                <div class="row">
                    <div class="eight wide column">
                        <h3 class="ui header">推荐使用<a href="https://www.jetbrains.com"
                                                     target="_blank">JetBrains系列IDE套件</a>完成编程
                        </h3>
                        <p>ICPC World Final 指定IDE:<b>CLion,PyCharm,Intellij IDEA</b><br><br>基于CMake与GNU Compile
                            Collection的CLion,业界推荐的Intellij Idea,简单容易上手的PyCharm，这些跨平台IDE将会减少许多做题过程中不必要的麻烦，更加集中精力打出AK</p>
                        <h3 class="ui header">推荐使用高效的<a class="chrome" href="https://www.iplaysoft.com/tools/chrome/"
                                                        target="_blank">Chrome浏览器</a>使用评测系统
                        </h3>
                        <p>一个优秀的浏览器可以更加完美高效的绘制页面，提升使用的舒适度。基于V8引擎的Chrome浏览器能够让每一个题目的启动和提交都能行云流水。</p>
                    </div>
                    <div class="six wide right floated column">
                        <img class="ui large borderless rounded image"
                             src="@/static/image/jetbrains.png">
                    </div>
                </div>
            </div>
        </div>
        <div class="ui vertical stripe segment">
            <div class="ui text container">
                <h3 class="ui header">ICPC</h3>
                <p>
                    国际大学生程序设计竞赛（英语：International Collegiate Programming Contest,
                    ICPC）是一项旨在展示大学生创新能力、团队精神和在压力下编写程序、分析和解决问题能力的年度竞赛。经过40多年的发展，国际大学生程序设计竞赛已经发展成为最具影响力的大学生计算机竞赛。赛事之前仅由IBM公司赞助，2017年新增JetBrains公司赞助,
                    2018年起，美国计算机协会（ACM）不再赞助ICPC。（Wikipedia）</p>
            </div>
        </div>
    </div>

</template>
<i18n>
    {
    "zh-cn": {
        "intern": "内推信息"
    },
    "ja": {
        "intern": "内部推薦"
    },
    "en": {
        "intern": "Internship"
    }
    }
</i18n>
<script lang="ts">
// @ is an alias to /src
import { Mixins, Component } from "vue-property-decorator";
import util from "../lib/util";
import InitMixin from "../mixin/init";
import config from "@/../config/environment.json";
import jQuery from "jquery";
const GithubButton = require("vue-github-button").default;
const $: any = jQuery;
@Component({
    components: {
        GithubButton
    }
})
export default class Home extends Mixins(InitMixin) {
    mounted () {
        document.title = `Home -- ${this.$t("oj-name")}`;
        $(function () {
            $(".image").visibility({
                type: "image",
                transition: "vertical flip in",
                duration: 500
            });
        });
        util.init(true, true);

        $(".ui.borderless.network.secondary.menu").addClass("inverted");
        $(".club").attr("data-title", "点击访问GitHub")
            .popup({
                position: "top center",
                on: "hover"
            });

        $(".maintainer").attr("data-html", "<div class='header'>Ryan Lee</div><div class='content'>Maintainer & Developer</div>")
            .popup({
                position: "top center",
                on: "hover"
            });
        /*
        this.axios.get("/api/update_log/latest")
            .then((response) => {
                const data = response.data.data[0];
                const version = data.version;
                const vj_version = data.vj_version;
                const frontendVersion = data.frontend_version;
                const content = data.msg;
                const time = dayjs(data.mtime).format("YYYY-MM-DD");
                $(".maintain").html("Version:" + time).attr("data-html", "<div class='ui header'>" +
                    "升级维护内容" +
                    "<div class='sub header'>引擎版本:" + version +
                    "</div><div class='sub header'>VJ版本:" + vj_version +
                    "</div><div class='sub header'>前端版本:" + frontendVersion +
                        "</div></div><div class='content'>" + content + "</div>")
                    .popup({
                        position: "top center",
                        on: "hover"
                    });
            });

         */
        $(".support")
            .popup({
                position: "bottom center",
                inline: true,
                on: "hover",
                hoverable: true
            });
        $(".chrome").popup({
            title: "点击下载",
            position: "top center",
            on: "hover"
        });
        $(".generator").on("click", function () {
            $(".packer").transition("fade down");
            $(".vultr").transition("fade up");
        });
        // document.getElementById('myVideo').addEventListener('ended',false);
        this.axios.get("/api/login/").then(({ data }) => {
            const logined = data.logined;
            $("#main_container").removeClass("unvisible");
        });
    }
}
</script>
<style scoped>
    a {
        cursor: pointer;
    }

    .white {
        color: white;
    }

    .unvisible {
        display: none;
    }

    .masthead > h3.ui.header {
        margin-top: 50%;
        margin-bottom: 0em;
        font-weight: normal;
    }

    .ml14 {
        font-weight: 200;
        font-size: 3.2em;
    }

    .ml14 .text-wrapper {
        position: relative;
        display: inline-block;
        padding-top: 0.1em;
        padding-right: 0.05em;
        padding-bottom: 0.15em;
    }

    .ml14 .line {
        opacity: 0;
        position: absolute;
        left: 0;
        height: 2px;
        width: 100%;
        background-color: #fff;
        transform-origin: 100% 100%;
        bottom: 0;
    }

    #myVideo {
        position: fixed;
        right: 0;
        bottom: 0;
        min-width: 100%;
        height: 100%;
        width: 100%;
        background: white;
        margin: auto;
        min-height: 100%;
        -ms-transition: opacity 1s cubic-bezier(0.680, -0.550, 0.265, 1.4) 0s;
        -moz-transition: opacity 1s cubic-bezier(0.680, -0.550, 0.265, 1.4) 0s;
        -webkit-transition: opacity 1s cubic-bezier(0.680, -0.550, 0.265, 1.4) 0s;
        transition: opacity 1.5s cubic-bezier(0.680, -0.550, 0.265, 1.4) 0s;
    }

    .ml14 .letter {
        display: inline-block;
        line-height: 1em;
    }
    .hometitle {
        font-weight: normal!important;
        font-size: 1em!important;
    }
</style>
