<template>
    <div class="ui text container" v-lazy-container="{ selector: 'img' }">
        <div class="ui basic segment" id="mainContent">
            <h2 class="ui dividing header">
                Hall of Fame
                <div class="sub header">姓名不分先后</div>
            </h2>
            <div class="left ui rail" id="contents">

                <div class="ui sticky left">
                    <h3 class="ui header">目录</h3>
                    <div class="ui link list" id="linkedlist" style="overflow-y:auto">

                    </div>
                </div>
            </div>
            <div class="ui segment" id="icpc2015changchun">
                <h3 class="ui header contents">2015 长春(东北师范大学)</h3>
                <div class="right ui rail">
                    <div class="ui sticky changchun">
                        <h3 class="ui header">ICPC2015 长春</h3>
                        <h4>纪念奖</h4>
                        <p>队名:启元(START)</p>
                        <p>成员:王国霞 贾林鹏 刘兴</p>
                    </div>
                </div>
                <img class="ui image" data-src="/glory_image/2015CHANGCHUN.jpg">
            </div>
            <div class="ui segment" id="icpc2015beijing">
                <h3 class="ui header contents">2015 北京(北京大学)</h3>
                <div class="right ui rail">
                    <div class="ui sticky beijing">
                        <h3 class="ui header">ICPC2015 北京</h3>
                        <h4>纪念奖</h4>
                        <p>队名:START</p>
                        <p>成员:王蕊 刘贺静 薛文第</p>
                    </div>
                </div>
                <img class="ui image" data-src="/glory_image/2015BEIJING.jpg">
            </div>
            <div class="ui segment" id="icpc2016qingdao">
                <h3 class="ui header contents">2016 青岛(中国石油大学(华东))</h3>
                <div class="right ui rail">
                    <div class="ui sticky qingdao2016">
                        <h3 class="ui header">ICPC2016 青岛</h3>
                        <h4>纪念奖</h4>
                        <p>队名:菜鸟</p>
                        <p>成员:冯云豪 吕博枫 季来虎</p>
                    </div>
                </div>
                <img class="ui image" data-src="/assets/images/wireframe/white-image.png">
            </div>
            <div class="ui segment" id="ccpc2017">
                <h3 class="ui header contents">2017 秦皇岛(东北大学秦皇岛分校)</h3>
                <div class="right ui rail">
                    <div class="ui sticky one">
                        <h3 class="ui header">CCPC2017 秦皇岛</h3>
                        <h4>铜奖</h4>
                        <p>队名:罚吹留下了悔恨的泪水</p>
                        <p>成员:冯云豪 吕博枫 李昊元</p>

                    </div>
                </div>
                <img class="ui image" data-src="/glory_image/QINHUANGDAO.jpg">
            </div>
            <div class="ui segment" id="example2">
                <h3 class="ui header contents">2017 青岛(中国石油大学(华东))</h3>
                <div class="right ui rail">
                    <div class="ui sticky two">
                        <h3 class="ui header">ICPC2017 青岛</h3>
                        <h4>铜奖</h4>
                        <p>队名:我们教练还没来得及给我们取</p>
                        <p>成员:陈哲 季来虎 王智健</p>
                    </div>
                </div>
                <img class="ui image" data-src="/glory_image/QINGDAO.jpg">
            </div>
            <div class="ui segment" id="icpc2017beijing">
                <h3 class="ui header contents">2017 北京(北京大学)</h3>
                <div class="right ui rail">
                    <div class="ui sticky beijing2017">
                        <h3 class="ui header">ICPC2017 北京</h3>
                        <h4>铜奖</h4>
                        <p>队名:XLK</p>
                        <p>成员:许思睿 连浩丞 夏方略</p>
                    </div>
                </div>
                <img class="ui image" data-src="/glory_image/2017BEIJING.jpg">
            </div>
            <div class="ui segment" id="icpc2017ecfinal">
                <h3 class="ui header contents">2017 上海(上海大学)EC-Final</h3>
                <div class="right ui rail">
                    <div class="ui sticky ICPC2017ECFINAL">
                        <h3 class="ui header">ICPC2017EC-Final 上海</h3>
                        <h4>纪念奖</h4>
                        <p>队名:罚吹留下了悔恨的泪水</p>
                        <p>成员:冯云豪 吕博枫 李昊元</p>
                    </div>
                </div>
                <img class="ui image" data-src="/glory_image/ICPC2017ECFINAL.jpg">
            </div>
            <div class="ui segment" id="tianti2018">
                <h3 class="ui header contents">2018 北京(北京工业大学)</h3>
                <div class="right ui rail">
                    <div class="ui sticky tianti2018">
                        <h3 class="ui header">2018程序设计天梯赛</h3>
                        <h4>团体全国二等奖 北京市一等奖</h4>
                        <p>队名:Meister</p>
                        <p>成员:冯云豪 李昊元 吕博枫 许思睿 连浩丞<br>夏方略 高宇翔 王智健 陈哲 季来虎</p>
                    </div>
                </div>
                <img class="ui image" data-src="/glory_image/2018tianti.png">
            </div>
            <div class="ui segment" id="icpc2018ningxia">
                <h3 class="ui header contents">2018 宁夏(宁夏理工学院)</h3>
                <div class="right ui rail">
                    <div class="ui sticky ningxia2018">
                        <h3 class="ui header">ICPC2018 Multi-Province 宁夏</h3>
                        <h4>银奖 铜奖</h4>
                        <p>队名:我为祖国献石油<br>队名:我为石油献代码</p>
                        <p>成员:冯云豪 李昊元 吕博枫<br>成员:许思睿 连浩丞 高宇翔</p>
                    </div>
                </div>
                <img class="ui image" data-src="/glory_image/2018NINGXIA.jpg">
            </div>
            <div class="ui segment" id="ccpc2018jilin">
                <h3 class="ui header contents">2018 吉林(北华大学)</h3>
                <div class="right ui rail">
                    <div class="ui sticky jilin2018">
                        <h3 class="ui header">CCPC2018 Regional 吉林</h3>
                        <h4>铜奖</h4>
                        <p>队名：我为祖国献石油</p>
                        <p>成员:冯云豪 李昊元 吕博枫</p>
                    </div>
                </div>
                <img class="ui image" data-src="/glory_image/2018JILIN.jpg">
            </div>
            <div class="ui segment" id="2018xiaomi">
                <h3 class="ui header contents">2018 北京(小米)</h3>
                <div class="right ui rail">
                    <div class="ui sticky XIAOMI2018">
                        <h3 class="ui header">首届小米高校编程大赛</h3>
                        <h4>银奖(Rank.8) 银奖(Rank.14)</h4>
                        <p>李昊元 吕博枫</p>
                    </div>
                </div>
                <img class="ui image" data-src="/glory_image/2018XIAOMI.jpg">
            </div>
            <div class="ui segment" id="ccpc2018qinhuangdao">
                <h3 class="ui header contents">2018 秦皇岛(东北大学秦皇岛分校)</h3>
                <div class="ui right rail">
                    <div class="ui sticky CCPC2018QINHUANGDAO">
                        <h3 class="ui header">CCPC2018 秦皇岛</h3>
                        <h4>铜奖</h4>
                        <p>队名:我为石油献代码</p>
                        <p>成员:高宇翔 连浩丞 许思睿</p>
                        <h4>纪念奖</h4>
                        <p>队名:祖国盛开石油花</p>
                        <p>成员:季来虎 陈哲 王智健</p>
                    </div>
                </div>
                <img class="ui image" data-src="/glory_image/CCPC2018QINHUANGDAO.jpg">
            </div>
            <div class="ui segment" id="icpc2018nanjing">
                <h3 class="ui header contents">2018 南京(南京航空航天大学)</h3>
                <div class="ui right rail">
                    <div class="ui sticky ICPC2018NANJING">
                        <h3 class="ui header">ICPC2018 南京</h3>
                        <h4>铜奖</h4>
                        <p>队名:我为祖国献石油</p>
                        <p>成员:冯云豪 李昊元 吕博枫</p>
                        <h4>纪念奖</h4>
                        <p>队名:我为石油献代码</p>
                        <p>成员:高宇翔 连浩丞 许思睿</p>
                    </div>
                </div>
                <img class="ui image" data-src="/glory_image/ICPC2018NANJING.jpg">
                <img class="ui image" data-src="/glory_image/ICPC2018NANJING2.jpg">
            </div>
            <div class="ui segment" id="icpc2018qingdao">
                <h3 class="ui header contents"><a name="2018qingdao"></a>2018 青岛(中国石油大学(华东))</h3>
                <div class="ui right rail">
                    <div class="ui sticky ICPC2018QINGDAO">
                        <h3 class="ui header">ICPC2018 青岛</h3>
                        <h4>铜奖</h4>
                        <p>队名:我为祖国献石油</p>
                        <p>成员:冯云豪 李昊元 吕博枫</p>
                        <h4>纪念奖</h4>
                        <p>队名:锦绣河山美如画</p>
                        <p>成员:高宇翔 连浩丞 许思睿</p>
                        <h4>纪念奖</h4>
                        <p>队名:石油滚滚流</p>
                        <p>成员:夏方略 赵云霄 王亚奇</p>
                    </div>
                </div>
                <img class="ui image" data-src="/glory_image/ICPC2018QINGDAO1.jpg">
                <img class="ui image" data-src="/glory_image/ICPC2018QINGDAO2.jpg">
                <img class="ui image" data-src="/glory_image/ICPC2018QINGDAO3.jpg">
            </div>
            <div class="ui segment" id="ccpc2018shenzhen">
                <h3 class="ui header contents">2018 深圳(哈尔滨工业大学(深圳)) Final</h3>
                <div class="ui right rail">
                    <div class="ui sticky CCPC2018SHENZHEN">
                        <h3 class="ui header">CCPC2018Final 深圳</h3>
                        <h4>纪念奖</h4>
                        <p>队名:我为祖国献石油</p>
                        <p>成员:冯云豪 李昊元 吕博枫</p>
                    </div>
                </div>
                <img class="ui image" data-src="/glory_image/CCPC2018SHENZHEN.jpg">
            </div>
            <div class="ui segment" id="icpc2018ecfinal">
                <h3 class="ui header contents">2018 西安(西北工业大学)EC-Final</h3>
                <div class="ui right rail">
                    <div class="ui sticky ICPC2018ECFINAL">
                        <h3 class="ui header">ICPC2018EC-Final 西安</h3>
                        <h4>铜奖</h4>
                        <p>队名:我为祖国献石油</p>
                        <p>成员:冯云豪 李昊元 吕博枫</p>
                    </div>
                </div>
                <img class="ui image" data-src="/glory_image/ICPC2018ECFINAL.jpg">
            </div>
            <div class="ui segment" id="tianti2019">
                <h3 class="ui header contents">2019 北京(北京工业大学)</h3>
                <div class="right ui rail">
                    <div class="ui sticky tianti2019">
                        <h3 class="ui header">2019程序设计天梯赛</h3>
                        <h3 class="ui header">北京市高校三等奖</h3>
                        <h4>全国团队一等奖 北京市团队特等奖</h4>
                        <p>队名:锦绣河山美如画</p>
                        <p>成员:王亚奇 李昊元 夏方略 吕博枫 赵云霄<br>连浩丞 高宇翔 许思睿 陈若朋 冯云豪</p>
                        <h4>北京市团队三等奖</h4>
                        <p>队名:祖国建设跨骏马</p>
                        <p>成员:王博 付旭 李贺 赵明仪 单联天<br>胡思颍 杨德闯 周浩楠 王振洋 李军贤</p>
                    </div>
                </div>
                <img class="ui image" data-src="/glory_image/2019CCCC_1.jpg">
                <img class="ui image" data-src="/glory_image/2019CCCC_2.jpg">
            </div>
            <div class="ui segment" id="ccpc2019harbin">
                <h3 class="ui header contents">2019 哈尔滨(东北林业大学)</h3>
                <div class="ui right rail">
                    <div class="ui sticky CCPC2019HARBIN">
                        <h3 class="ui header">CCPC2019 哈尔滨</h3>
                        <h4>铜奖</h4>
                        <p>队名:昆仑山下送晚霞</p>
                        <p>成员:单联天 王亚奇 夏方略</p>
                    </div>
                </div>
                <img data-src="/glory_image/CCPC2019HARBIN.jpg" class="ui image">
            </div>
            <div class="ui segment" id="yourlegend">
                <h3 class="ui header contents">20XX XX(XX大学)</h3>
                <div class="ui right rail">
                    <div class="ui sticky YOURLEGEND">
                        <h3 class="ui header">CONTEST XX</h3>
                        <h4>...奖？</h4>
                        <p>队名: ...?</p>
                        <p>成员: You...?</p>
                    </div>
                </div>
                <img class="ui image" data-src="/assets/images/wireframe/white-image.png">
            </div>
        </div>

    </div>
</template>

<script>
import mixins from "../../mixin/init";

const $ = require("jquery");
window.$ = window.jQuery = $;
const _ = require("lodash");
export default {
    name: "fame",
    mixins: [mixins],
    mounted () {
        document.title = `Hall of fame -- ${document.title}`;
        this.$Lazyload.$on("loaded", (el) => {
            const $parent = $(el.el).parent();
            $parent.find(".sticky").sticky({
                context: `#${$parent.attr("id")}`,
                offset: 50
            });
        });
        var $headers = $(".ui.header.contents");
        var len = $headers.length;
        var list = $("#linkedlist");
        for (var i = 0; i < len; ++i) {
            var id = $headers.eq(i).parent().attr("id");
            var name = $headers.eq(i).text();
            var ahtml = "<a name='" + id + "' ></a>";
            $headers.eq(i).append(ahtml);
            ahtml = "<a class='quick item' href='#" + id + "' >" + name + "</a>";
            list.append(ahtml);
        }
        this.$nextTick(() => {
            $(".ui.sticky.left")
                .sticky({
                    context: "#mainContent",
                    offset: 50
                });
            $(".quick.item").on("click", function (d) {
                $([document.documentElement, document.body]).animate({
                    scrollTop: $(this.getAttribute("href")).offset().top - 50
                }, 600);
                return false;
            });
        });
    },
    updated () {
        $(".ui.sticky.left")
            .sticky({
                context: "#mainContent",
                offset: 50
            });
    }
};
</script>

<style scoped>

</style>
