<template>
    <div class="ui inverted vertical footer segment" style="margin-top:150px">
        <div class="ui container">
            <div class="ui stackable inverted equal height stackable grid">
                <div class="three wide column">
                    <h3 class="ui inverted header">
                        <router-link to="/about" class="white link">{{$t("about")}}</router-link>
                    </h3>
                    <div class="ui inverted link list">
                        <a href="mailto:gxlhybh@gmail.com" class="item">{{$t("contact developer")}}</a>
                        <router-link to="/opensource" class="item">{{$t("opensource-notice")}}</router-link>
                        <router-link to="/privacy" class="item">{{$t("privacy policy")}}</router-link>
                        <router-link to="copyright" class="item">{{$t("copyright-notice")}}</router-link>
                    </div>
                </div>
                <div class="four wide column">
                    <h3 class="ui inverted header">{{$t("creative common")}}
                        <div class="sub header">
                            <a class="white link" href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh" target="_blank">{{$t("cc-by-nc-nd")}}
                                <div class="sub header">(CC BY-NC-ND 4.0)</div>
                            </a>
                        </div>
                    </h3>
                    <div class="ui mini images">

                        <img class="ui image" src="@/static/image/cc_icon_white_x2.png">
                        <img class="ui image" src="@/static/image/attribution_icon_white_x2.png">
                        <img class="ui image" src="@/static/image/nc_white_x2.png">
                        <img class="ui image" src="@/static/image/nd_white_x2.png">
                    </div>
                </div>
                <div class="four wide column">
                    <h3 class="ui inverted header">
                        ACM Programming Club
                        <div class="sub header">
                            <i class="github icon"></i>
                            GitHub:<a href="https://github.com/CUP-ACM-Programming-Club" target="_blank">CUPACM Programming Club</a>
                        </div>
                        <div class="sub header">
                            <i class="address card outline icon"></i>
                            Current Member:
                            <router-link to="/ranklisk/?acm">List</router-link>
                        </div>
                    </h3>
                </div>
                <div class="five wide column">
                    <h3 class="ui inverted header">© {{$t("oj-name")}} 2017-{{ year }}
                        <div class="sub header">  Impressed by HUSTOJ & SYZOJ & ECNUOJ</div>
                        <div class="sub header">  Powered By Vue.js,Node.js,Semantic-UI</div>
                        <div class="sub header">Software Designer:<a href="https://github.com/ryanlee2014" target="_blank">Ryan Lee(李昊元)</a></div>
                    </h3>
                    <!--<iframe src="https://ghbtns.com/github-btn.html?user=CUP-ACM-Programming-Club&repo=CUP-Online-Judge-Express&type=star&count=true" frameborder="0" scrolling="0" width="80px" height="20px"></iframe>
                    <iframe src="https://ghbtns.com/github-btn.html?user=CUP-ACM-Programming-Club&repo=CUP-Online-Judge-Express&type=fork&count=true" frameborder="0" scrolling="0" width="80px" height="20px"></iframe>-->
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import config from "@/../config/environment.json";
import dayjs from "dayjs";
@Component({
    i18n: {
        messages: config.title
    }
})
export default class Bottom extends Vue {
    year = dayjs().format("YYYY")
}
</script>

<style scoped>

</style>
