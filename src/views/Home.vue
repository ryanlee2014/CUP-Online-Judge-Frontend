<template>
    <div>
        <div>
            <div class="ui inverted vertical masthead center aligned segment gr5" id="background">
                <div class="unvisible" id="main_container">
                    <div class="ui container">
                        <div class="ui large secondary inverted pointing menu">
                        </div>
                    </div>
                    <div class="ui grid" id="main_masthead" style="transform: translateX(25%)">
                        <div class="ui text container transition main title eight wide column" id="left">
                            <h1 class="ui inverted header ml14">
  <span class="text-wrapper">
    <span class="letters" data-content="CUP Online Judge"></span>
  </span>

                            </h1>
                            <div class="column buttonset">
                                <router-link class="ui inverted large button download basic" to="/about/icpc">
                                    <i class="newspaper outline icon"></i>
                                    关于ICPC
                                </router-link>
                                <router-link class="ui inverted large button download basic" to="/about/fame">
                                    <i class="chess queen icon"></i>
                                    Hall of Fame
                                </router-link>
                            </div>
                            <br>

                            <div class="column">
                                <router-link class="ui white basic label maintain" to="/update">
                                </router-link>
                                <!-- Place this tag where you want the button to render. -->
                                <a class="github_button"
                                   href="https://travis-ci.com/CUP-ACM-Programming-Club/CUP-Online-Judge-Express"
                                   target="_blank"><img
                                        src="https://travis-ci.com/CUP-ACM-Programming-Club/CUP-Online-Judge-Express.svg?branch=master"
                                        style="vertical-align: middle;"></a>
                                <a class="github_button"
                                   href="https://codebeat.co/projects/github-com-cup-acm-programming-club-cup-online-judge-express-master-7e8760db-7670-4c22-9862-1262dddcb4ec"><img
                                        alt="codebeat badge"
                                        src="https://codebeat.co/badges/bf69c0eb-2bdf-4fbe-a6f0-2bf2a98a597a"
                                        style="vertical-align: middle;"/></a>
                                <a class="github_button"
                                   href="https://codecov.io/gh/CUP-ACM-Programming-Club/CUP-Online-Judge-Express">
                                    <img src="https://codecov.io/gh/CUP-ACM-Programming-Club/CUP-Online-Judge-Express/branch/master/graph/badge.svg"
                                         style="vertical-align: middle;"/>
                                </a>

                            </div>
                            <br><a class="ui inverted large button download basic vultr"
                                   href="https://www.cubecloud.net/aff?aff=1461"
                                   target="_blank">
                            Hosted by CubeCloud
                        </a>
                            <!--<a class="vultr" href="https://www.vultr.com/?ref=7250019" target="_blank"><img src="./image/vultr.png" class="ui small image main title" style="display:inline-block"></a>-->
                            <!--<h4></h4>-->
                            <!--<a class="ui huge inverted download button" href="cprogrammingcontest">查看复赛情况</a>-->
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
                        <h3 class="ui header">推荐使用高效的<a class="chrome" href="software/63.0.3239.84_chrome_installer.exe"
                                                        target="_blank">Chrome浏览器</a>使用评测系统
                        </h3>
                        <p>一个优秀的浏览器可以更加完美高效的绘制页面，提升使用的舒适度。基于V8引擎的Chrome浏览器能够让每一个题目的启动和提交都能行云流水。</p>
                    </div>
                    <div class="six wide right floated column">
                        <img class="ui large borderless rounded image"
                             src="../static/image/jetbrains.png">
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
                <router-link class="ui large buttons" to="/about/icpc">More Information</router-link>
                <h4 class="ui horizontal header divider">
                    <a href="#">Developer</a>
                </h4>
                <h3 class="ui header">平台开发</h3>
                <h4>由 <a class="club" href="https://github.com/CUP-ACM-Programming-Club" target="_blank">ACM程序设计俱乐部</a>
                    <span class="maintainer">维护开发</span> <a class="support">点此支持</a>
                    <div class='ui flowing popup  hidden'>
                        <div class='ui image' style="width:220px"><img src='/img/wechat.png'></div>
                        <div class="ui image" style="width:220px"><img src="/img/alipay_2.jpg"></div>
                        <div class="ui image" style="width:220px"><img src="/img/alipay.jpg"></div>
                    </div>
                </h4>
                <h4 class="ui content">技术栈:Linux + C/C++ + MySQL + PHP + Node.js + ExpressJS + Apache</h4>
                <h4 class="ui content">由Vue.js强力驱动</h4>
                <a class="ui large button" href="https://github.com/CUP-ACM-Programming-Club" target="_blank"><i
                        class="github icon"></i>GitHub</a>
            </div>
        </div>
    </div>

</template>

<script>
// @ is an alias to /src
import anime from "animejs";
import util from "../lib/util";
import mixins from "../mixin/init";
const dayjs = require("dayjs");
const $ = require("jquery");
export default {
    name: "home",
    mixins: [mixins],
    mounted () {
        document.title = `Home -- ${document.title}`;
        setTimeout(() => {
            util.init(true, true);
        }, 500);
        $(document).ready(function () {
            $(".image").visibility({
                type: "image",
                transition: "vertical flip in",
                duration: 500
            });
        });
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
        $.get("/api/update_log/latest", function (d) {
            var data = d.data[0];
            var version = data.version;
            var vj_version = data.vj_version;
            var content = data.msg;
            var time = dayjs(data.mtime).format("YYYY-MM-DD");
            $(".maintain").html("Version:" + time).attr("data-html", "<div class='ui header'>" + "升级维护内容" + "<div class='sub header'>引擎版本:" + version + "</div><div class='sub header'>VJ版本:" + vj_version + "</div></div><div class='content'>" + content + "</div>")
                .popup({
                    position: "top center",
                    on: "hover"
                });
        });
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
        $(".ml14 .letters").each(function () {
            // eslint-disable-next-line no-control-regex
            $(this).html($(this).attr("data-content").replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
        });

        // document.getElementById('myVideo').addEventListener('ended',false);

        (function () {
            window.picid = 5;
            $(".ui.borderless.network.secondary.menu").addClass("inverted");
            $.get("/api/login/", function (data) {
                var logined = data.logined;
                setTimeout(function () {
                    $("#main_container").removeClass("unvisible");
                    var main_timeline = anime.timeline({ loop: false })
                        .add({
                            targets: ".ml14 .line",
                            scaleX: [0, 1],
                            opacity: [0.5, 1],
                            easing: "easeInOutExpo",
                            duration: 900
                        }).add({
                            targets: ".ml14 .letter",
                            opacity: [0, 1],
                            translateX: [40, 0],
                            translateZ: 0,
                            scaleX: [0.3, 1],
                            textShadow: "3px 3px 3px #555555",
                            easing: "easeOutExpo",
                            duration: 800,
                            offset: "-=600",
                            delay: function (el, i) {
                                return 0 + 25 * i;
                            }
                        });
                    // eslint-disable-next-line no-constant-condition
                    if (logined && false) {
                        main_timeline.add({
                            targets: "#main_masthead",
                            translateX: ["25%", 0],
                            easing: "easeInOutQuart",
                            duration: 1000,
                            offset: "-=300",
                            complete: function () {
                            }
                        }).add({
                            targets: "#right",
                            opacity: [0, 1],
                            easing: "easeInOutQuart",
                            duration: 1000,
                            offset: "-=300"
                        }).add({
                            targets: "#divider",
                            opacity: [0, 1],
                            easing: "easeInOutQuart",
                            duration: 500,
                            offset: "-=300",
                            complete: function () {
                                var $style = $("style");
                                var $html = $style.eq($style.length - 1).html();
                                $html += "\n.gr5::after{\nopacity:0.5;\n}\n";
                                $style.eq($style.length - 1).html($html);
                            }
                        });
                    }
                }, 300);
            });
        })();
    }
};
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
</style>
