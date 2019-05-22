<template>
    <div class="ui container pusher">
        <div class="padding">
            <h2 class="ui dividing header" v-show="!finished">
                加载中,请稍后
            </h2>
            <div class="ui grid" v-show="finished">
                <div class="row">
                    <div class="five wide column">
                        <div class="ui card" id="user_card" style="width: 100%; ">
                            <div class="blurring dimmable image" id="avatar_container">
                                <img :src="avatar"
                                     style=" " v-cloak>
                                <div class="ui placeholder" v-cloak>
                                    <div class="square image"></div>
                                </div>
                            </div>
                            <div class="content">
                                <div class="ui placeholder" v-cloak>
                                    <div class="header">
                                        <div class="line"></div>
                                        <div class="line"></div>
                                    </div>
                                    <div class="paragraph">
                                        <div class="line"></div>
                                    </div>
                                </div>
                                <div
                                        class="header" v-cloak>{{nick}}&nbsp;&nbsp;<a
                                        :href="'mail.php?to_user='+user_id" v-cloak><i class="mail icon"></i></a></div>
                                <div class="meta" v-cloak>
                                    <i class="user circle outline icon"></i>
                                    <a class="group">{{privilege}}</a>
                                    <i class="user circle outline icon" v-if="user_id === '2016011253'"></i><a
                                        class="group" v-if="user_id === '2016011253'">
                                    系统开发/维护
                                </a>
                                    <br v-if="acm_user">
                                    <a class='group' v-if="acm_user"><i class='user icon'></i>ACM{{acm_user.level?"正式":"后备"}}队员</a>
                                    <br>
                                    注册时间: {{dayjs(reg_time).format("YYYY-MM-DD")}}
                                    <a :key="row.year + row.award" class="group" v-for="row in award"><br>
                                        <i class="trophy icon"></i>
                                        {{row.year + "年" + row.award}}</a>
                                </div>
                            </div>
                            <div class="extra content" v-cloak>
                                <a><i class="check icon"></i>本地&nbsp;通过 {{local_accepted}} 题
                                </a>
                                <a style="float:right;"><i class="line chart icon"></i>Rank:&nbsp;{{rank}}</a>
                                <br>
                                <a>
                                    <i class="check icon"></i>VJudge&nbsp;通过 {{vjudge_solved}}&nbsp;题&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </a>
                                <a style="float:right"><i class="line chart icon"></i>Rank:&nbsp;{{vjudge_rank}}</a>
                                <br>
                                <a>
                                    <i class="check icon"></i>其他平台&nbsp;通过 {{other_accepted - vjudge_solved}}&nbsp;题

                                </a>
                            </div>
                        </div>
                        <div class="ui card" style="width:100%;">
                            <div class="content">
                                <div class="header">
                                    状态
                                </div>
                            </div>

                            <div class="content">
                                <div class="ui placeholder" v-cloak>
                                    <div class="line"></div>
                                    <div class="line"></div>
                                </div>
                                <div class="ui header" v-cloak v-if="online">
                                    当前在线
                                </div>
                                <div class="ui header" v-cloak v-if="!online">
                                    离线
                                    <div class="sub header">
                                        上次登录:{{last_login?new Date(last_login).toLocaleString():""}}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="ui card" style="width:100%">
                            <div class="content">
                                <div class="header">
                                    发表的帖子
                                </div>
                            </div>
                            <div class="content">
                                <div class="ui placeholder" v-cloak>
                                    <div class="line"></div>
                                    <div class="line"></div>
                                </div>
                                <table class="ui very basic table" v-cloak>
                                    <thead>
                                    <th>ID</th>
                                    <th>标题</th>
                                    </thead>
                                    <tbody>
                                    <tr :key="row.article_id" v-for="row in article_publish">
                                        <td>
                                            {{row.article_id}}
                                        </td>
                                        <td>
                                            <router-link :to="`/discuss/thread/${row.article_id}`">
                                                {{row.title}}
                                            </router-link>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="ui card" style="width:100%" v-cloak v-if="admin">
                            <div class="content">
                                <div class="header">
                                    使用的操作系统
                                </div>
                            </div>
                            <div class="content">
                                <table class="ui very basic table">
                                    <thead>
                                    <th>系统</th>
                                    <th>版本</th>
                                    <th>频率</th>
                                    </thead>
                                    <tbody>
                                    <tr :key="row.os_name + row.os_version" v-for="row in os">
                                        <td>
                                            {{row.os_name}}
                                        </td>
                                        <td>
                                            {{row.os_version}}
                                        </td>
                                        <td>
                                            {{row.cnt}}
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="ui card" style="width:100%" v-cloak v-if="admin">
                            <div class="content">
                                <div class="header">
                                    使用的浏览器
                                </div>
                            </div>
                            <div class="content">
                                <table class="ui very basic table">
                                    <thead>
                                    <th>浏览器</th>
                                    <th>版本</th>
                                    <th>频率</th>
                                    </thead>
                                    <tbody>
                                    <tr :key="row.browser_name + row.browser_version" v-for="row in browser">
                                        <td>
                                            {{row.browser_name}}
                                        </td>
                                        <td>
                                            {{row.browser_version}}
                                        </td>
                                        <td>
                                            {{row.cnt}}
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="eleven wide column">
                        <div class="ui grid">
                            <div class="row">
                                <div class="sixteen wide column">
                                    <div class="ui grid">
                                        <div class="row">
                                            <div class="eight wide column">
                                                <div class="ui grid">
                                                    <div class="row">
                                                        <div class="column">
                                                            <h4 class="ui top attached block header"><i
                                                                    class="id card icon"></i>用户名</h4>
                                                            <div class="ui attached segment">
                                                                <div v-cloak>
                                                                    {{user_id}}
                                                                </div>
                                                                <div class="ui placeholder" v-cloak>
                                                                    <div class="line"></div>
                                                                    <div class="line"></div>
                                                                </div>
                                                            </div>
                                                            <h4 class="ui attached block header">
                                                                <i class="id badge icon"></i>个人介绍
                                                            </h4>
                                                            <div class="ui attached segment"
                                                                 v-html="markdownIt.renderRaw(biography||'')">
                                                                <div class="ui placeholder" v-cloak>
                                                                    <div class="line"></div>
                                                                    <div class="line"></div>
                                                                </div>
                                                            </div>
                                                            <h4 class="ui attached block header"><i
                                                                    class="university icon"></i>学校
                                                            </h4>
                                                            <div class="ui attached segment">
                                                                <div v-cloak>{{school}}</div>
                                                                <div class="ui placeholder" v-cloak>
                                                                    <div class="line"></div>
                                                                    <div class="line"></div>
                                                                </div>
                                                            </div>
                                                            <h4 class="ui attached block header"><i
                                                                    class="mail square icon"></i>邮件</h4>
                                                            <div class="ui attached segment">
                                                                <div v-cloak><a
                                                                        :href="'mailto:'+email">{{email}}</a></div>
                                                                <div class="ui placeholder" v-cloak>
                                                                    <div class="line"></div>
                                                                    <div class="line"></div>
                                                                </div>
                                                            </div>
                                                            <h4 class="ui attached block header">
                                                                <i class="newspaper icon"></i>Blog
                                                            </h4>
                                                            <div class="ui attached segment">
                                                                <div v-cloak>
                                                                    <a :href="blog" target="_blank">{{blog}}</a>
                                                                </div>
                                                                <div class="ui placeholder" v-cloak>
                                                                    <div class="line"></div>
                                                                    <div class="line"></div>
                                                                </div>
                                                            </div>
                                                            <h4 class="ui attached block header">
                                                                <i class="github icon"></i>GitHub
                                                            </h4>
                                                            <div class="ui bottom attached segment">
                                                                <iframe :src="'https://ghbtns.com/github-btn.html?user='+github+'&type=follow&count=true'"
                                                                        frameborder="0"
                                                                        height="20px"
                                                                        scrolling="0" v-cloak v-if="github"
                                                                        width="170px"></iframe>
                                                                <div class="ui placeholder" v-cloak>
                                                                    <div class="line"></div>
                                                                    <div class="line"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="eight wide column">
                                                <h4 class="ui top attached block header"><i class="pie chart icon"></i>提交统计
                                                </h4>
                                                <div class="ui bottom attached segment">
                                                    <div id="pie_chart_legend">
                                                    </div>
                                                    <div>
                                                        <iframe class="chartjs-hidden-iframe"
                                                                style="display: block; overflow: hidden; border: 0px; margin: 0px; top: 0px; left: 0px; bottom: 0px; right: 0px; height: 100%; width: 100%; position: absolute; pointer-events: none; z-index: -1;"
                                                                tabindex="-1"></iframe>
                                                        <canvas height="455"
                                                                id="pie_chart"
                                                                style="width: 260px; display: block; height: 260px;"
                                                                width="455"></canvas>
                                                    </div>
                                                </div>
                                                <!--
                                                <h4 class="ui top attached block header">
                                                    <i class="pie chart icon"></i>
                                                    能力雷达图(维护中)
                                                </h4>
                                                <div class="ui attached segment">
                                                    <div style="width:100%;">
                                                        <canvas id="canvat"></canvas>
                                                    </div>
                                                </div>-->
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="sixteen wide column">
                                                <h4 class="ui top attached block header">提交热力图</h4>
                                                <div class="ui bottom attached segment heatmap">
                                                    <div class="ui placeholder" v-cloak>
                                                        <div class="line"></div>
                                                        <div class="line"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="eight wide column">
                                                <div class="row">
                                                    <div class="column">
                                                        <h4 class="ui top attached block header">CUP Online Judge</h4>
                                                        <div class="ui attached segment">
                                                            <router-link :to="`/problem/submit/${row.problem_id}`" :key="row.problem_id"
                                                                         v-cloak v-for="row in accept.local">
                                                                {{row.problem_id}}
                                                            </router-link>
                                                            <div class="ui placeholder" v-cloak>
                                                                <div class="line"></div>
                                                                <div class="line"></div>
                                                            </div>
                                                        </div>
                                                        <h4 class="ui attached block header">HDU</h4>
                                                        <div class="ui attached segment">
                                                            <a :href="'hdusubmitpage.php?id='+row.problem_id"
                                                               :key="row.problem_id"
                                                               v-cloak v-for="row in accept.hdu">
                                                                {{row.problem_id}}</a>
                                                            <div class="ui placeholder" v-cloak>
                                                                <div class="line"></div>
                                                                <div class="line"></div>
                                                            </div>
                                                        </div>
                                                        <h4 class="ui attached block header">POJ</h4>
                                                        <div class="ui attached segment">
                                                            <a :href="'pojsubmitpage.php?id='+row.problem_id"
                                                               :key="row.problem_id"
                                                               v-cloak v-for="row in accept.poj">
                                                                {{row.problem_id}}</a>
                                                            <div class="ui placeholder" v-cloak>
                                                                <div class="line"></div>
                                                                <div class="line"></div>
                                                            </div>
                                                        </div>
                                                        <h4 class="ui attached block header">UVA</h4>
                                                        <div class="ui attached segment">
                                                            <a :href="'uvasubmitpage.php?id='+row.problem_id"
                                                               :key="row.problem_id"
                                                               v-cloak v-for="row in accept.uva">
                                                                {{row.problem_id}}</a>
                                                            <div class="ui placeholder" v-cloak>
                                                                <div class="line"></div>
                                                                <div class="line"></div>
                                                            </div>
                                                        </div>
                                                        <h4 class="ui attached block header">其他</h4>
                                                        <div class="ui bottom attached segment">
                                                            <a :key="row.problem_id" href="javascript:void(0)"
                                                               v-cloak v-for="row in accept.other">
                                                                {{row.oj_name + " " + row.problem_id}}</a>
                                                            <div class="ui placeholder" v-cloak>
                                                                <div class="line"></div>
                                                                <div class="line"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">

                                                </div>
                                                <div class="row">

                                                </div>
                                            </div>
                                            <div class="eight wide column">
                                                <h4 class="ui top attached block header"><i class="pie chart icon"></i>编程语言
                                                </h4>
                                                <div class="ui bottom attached segment">
                                                    <div id="pie_chart_language_legend">
                                                        <div class="ui placeholder" v-cloak>
                                                            <div class="line"></div>
                                                            <div class="line"></div>
                                                            <div class="line"></div>
                                                            <div class="line"></div>
                                                            <div class="line"></div>
                                                            <div class="line"></div>
                                                            <div class="line"></div>
                                                            <div class="line"></div>
                                                            <div class="line"></div>
                                                            <div class="line"></div>
                                                            <div class="line"></div>
                                                            <div class="line"></div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <iframe class="chartjs-hidden-iframe"
                                                                style="display: block; overflow: hidden; border: 0px; margin: 0px; top: 0px; left: 0px; bottom: 0px; right: 0px; height: 100%; width: 100%; position: absolute; pointer-events: none; z-index: -1;"
                                                                tabindex="-1"></iframe>
                                                        <canvas height="455"
                                                                id="pie_chart_language"
                                                                style="width: 260px; display: block; height: 260px;"
                                                                width="455"></canvas>
                                                    </div>
                                                </div>
                                                <h4 class="ui top attached block header"><i class="pie chart icon"></i>提交频率
                                                </h4>
                                                <div class="ui bottom attached segment">
                                                    <div class="hidden" id="drawgraphitem">
                                                        <div style="margin:auto">
                                                            <canvas id="canvas"></canvas>
                                                        </div>
                                                    </div>
                                                </div>
                                                <h4 class="ui top attached block header">
                                                    判重信息
                                                </h4>
                                                <div class="ui bottom attached segment">
                                                    <div class="ui small statistics"
                                                         style="text-align:center;display:block;">
                                                        <div class="statistic" style="margin: 0px 0.5em 1em;">
                                                            <div class="value" v-cloak>
                                                                {{same_problem_time}}
                                                            </div>
                                                            <div class="label">
                                                                题目数
                                                            </div>
                                                        </div>
                                                        <div class="statistic" style="margin: 0px 0.5em 1em;">
                                                            <div class="value" v-cloak>
                                                                {{same_aver_length}}
                                                            </div>
                                                            <div class="label">
                                                                平均长度
                                                            </div>
                                                        </div>
                                                        <div class="statistic" style="margin: 0px 0.5em 1em;">
                                                            <div class="value" v-cloak>
                                                                {{same_percentage_aver}}%
                                                            </div>
                                                            <div class="label">
                                                                平均判重度
                                                            </div>
                                                        </div>
                                                        <div class="statistic" style="margin: 0px 0.5em 1em;">
                                                            <div class="value" v-cloak>
                                                                {{total_same}}
                                                            </div>
                                                            <div class="label">
                                                                总次数
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import mixins from '../mixin/init'
    import * as d3 from 'd3';
    import markdownIt from '../lib/markdownIt/markdownIt'
    import calendarHeatmap from '../lib/calendar-heapmap';
    const dayjs = require("dayjs");
    const $ = require("jquery");
    const _ = require("lodash");
    const Chart = require("chart.js");
    window.$ = window.jQuery = $;
    export default {
        name: "user",
        mixins: [mixins],
        data: function () {
            return {
                award: [],
                dayjs,
                markdownIt,
                admin: false,
                biography: "",
                const_variable: {},
                article_publish: [],
                nick: '',
                reg_time: 0,
                school: '',
                github: '',
                email: '',
                vjudge_solved: 0,
                os: '',
                browser: '',
                blog: '',
                recent_submission: {
                    submission: 0,
                    accept: 0
                },
                avatar: '',
                acm_user: false,
                privilege: false,
                submission: {
                    local: 0,
                    hdu: 0,
                    poj: 0,
                    uva: 0,
                    other: 0
                },
                accept: {
                    hdu: 0,
                    poj: 0,
                    uva: 0,
                    local: 0,
                    other: 0
                },
                rank: '',
                vjudge_rank: 0,
                last_login: 0,
                local_accepted: 0,
                other_accepted: 0,
                same_percentage_aver: 0,
                submission_count: [],
                same_problem_time: 0,
                same_aver_length: 0,
                total_same: 0,
                finished: false,
                user_id: this.$route.params.user_id
            }
        },
        methods: {
            initData: function () {
                const user_id = this.$route.params.user_id;
                const that = this;
                this.axios.get(`/api/user/${user_id}`)
                    .then(({data}) => {
                        let d = data;
                        var submission = d.data.submission;
                        var local = [], local_accept = [];
                        var hdu = [], hdu_accept = [];
                        var poj = [], poj_accept = [];
                        var uva = [], uva_accept = [];
                        var other = [], other_accept = [];
                        var pick_ac = function (arr) {
                            var res = [];
                            _.forEach(arr, function (val) {
                                if (val.result === 4 && val.problem_id != 0) {
                                    res.push(val);
                                }
                            })
                            res = _.uniqBy(res, "problem_id");
                            res.sort(function (a, b) {
                                if (!isNaN(a.problem_id) && !isNaN(b.problem_id)) {
                                    return parseInt(a.problem_id) - parseInt(b.problem_id);
                                } else {
                                    if (a.problem_id < b.problem_id) {
                                        return 1;
                                    } else if (a.problem_id === b.problem_id) {
                                        return 0;
                                    } else {
                                        return -1;
                                    }
                                }
                            })
                            return res;
                        }
                        var analsubmission = [];
                        var now = dayjs();
                        _.forEach(submission, function (val) {

                            if ((val.time = dayjs(val.time)).add(3, "month").isAfter(now)) {
                                analsubmission.push(val);
                            }
                            if (val.oj_name === "LOCAL") {
                                local.push(val);
                            } else if (val.oj_name === "HDU") {
                                hdu.push(val);
                            } else if (val.oj_name === "POJ") {
                                poj.push(val);
                            } else if (val.oj_name === "UVA") {
                                uva.push(val);
                            } else {
                                other.push(val);
                            }

                        });
                        analsubmission.sort(function (a, b) {
                            if (a.time.isBefore(b.time)) {
                                return -1;
                            } else {
                                return 1;
                            }
                        });
                        var timeobj = {};
                        var acobj = {};
                        _.forEach(analsubmission, function (val) {
                            var daystr = val.time.format("YYYY-MM-DD");
                            if (!timeobj[daystr]) {
                                timeobj[daystr] = 1;
                                acobj[daystr] = 0;
                                if (parseInt(val.result) === 4) {
                                    acobj[daystr] = 1;
                                }
                            } else {
                                ++timeobj[daystr];
                                if (parseInt(val.result) === 4) {
                                    ++acobj[daystr];
                                }
                            }
                        });

                        hdu_accept = pick_ac(hdu);
                        local_accept = pick_ac(local);
                        poj_accept = pick_ac(poj);
                        uva_accept = pick_ac(uva);
                        other_accept = pick_ac(other);
                        var privilege = d.data.privilege;
                        if (privilege && privilege.length > 0) {
                            for (var i = 0; i < privilege.length; ++i) {
                                if (privilege[i].rightstr === "administrator") {
                                    privilege = "管理员";
                                    break;
                                } else if (privilege[i].rightstr === "source_browser") {
                                    privilege = "代码检查员";
                                    break;
                                } else if (privilege[i].rightstr === "editor") {
                                    privilege = "问题编辑";
                                    break;
                                }
                            }
                        }
                        if (typeof privilege !== "string") {
                            privilege = "普通用户";
                        }
                        var dsort = function (a, b) {
                            return b.cnt - a.cnt;
                        };
                        d.data.os.sort(dsort);
                        d.data.browser.sort(dsort);
                        var github_info = d.data.information.github || "";
                        if (github_info.lastIndexOf("/") == github_info.length - 1) {
                            github_info = github_info.substring(0, github_info.length - 1);
                        }
                        if (github_info.indexOf("github.com") !== -1) {
                            github_info = github_info.substring(github_info.lastIndexOf("/") + 1);
                        }
                        return {
                            award: d.data.award,
                            admin: d.isadmin,
                            biography: d.data.information.biography,
                            const_variable: d.data.const_variable,
                            article_publish: d.data.article_publish,
                            nick: d.data.information.nick,
                            reg_time: d.data.information.reg_time,
                            school: d.data.information.school,
                            submission_count: d.data.submission_count,
                            github: github_info,
                            email: d.data.information.email,
                            vjudge_solved: d.data.information.vjudge_accept,
                            os: d.data.os,
                            browser: d.data.browser,
                            blog: d.data.information.blog,
                            recent_submission: {
                                submission: timeobj,
                                accept: acobj
                            },
                            avatar: d.data.information.avatar ? "/avatar/" + user_id + ".jpg" : "/assets/images/wireframe/white-image.png",
                            user_id: user_id,
                            acm_user: d.data.acm_user,
                            privilege: privilege,
                            submission: {
                                local: local,
                                hdu: hdu,
                                poj: poj,
                                uva: uva,
                                other: other
                            },
                            accept: {
                                hdu: hdu_accept,
                                poj: poj_accept,
                                uva: uva_accept,
                                local: local_accept,
                                other: other_accept
                            },
                            rank: d.data.rank,
                            vjudge_rank: d.data.vjudge_rank,
                            last_login: d.data.login_time ? d.data.login_time[0] ? d.data.login_time[0].time : "" : "",
                            local_accepted: local_accept.length,
                            other_accepted: hdu_accept.length + poj_accept.length + uva_accept.length + other_accept.length,
                            same_percentage_aver: parseInt(d.data.sim_average_percentage),
                            same_problem_time: parseInt(d.data.sim_count),
                            same_aver_length: parseInt(d.data.sim_average_length),
                            total_same: d.data.total_sim_time
                        };
                })
                    .then(data => {
                        Object.assign(this, data);
                        this.finished = true;
                    })
                    .then(() => {
                        $("#preload").hide();
                        let $title = $("title").html();
                        $(".placeholder").remove()
                        this.$nextTick(() => {
                            var now = dayjs().endOf('day').toDate();
                            var yearAgo = dayjs().startOf('day').subtract(1, 'year').toDate();
                            var submission_cnt = this.submission_count;
                            var countForDate = {};
                            _.forEach(submission_cnt, function (row) {
                                if (row.day < 10) row.day = "0" + row.day;
                                if (row.month < 10) row.month = "0" + row.month;
                                var date = row.year + "-" + row.month + "-" + row.day;
                                if (!countForDate[date]) {
                                    countForDate[date] = row.cnt;
                                } else {
                                    countForDate[date] += row.cnt;
                                }
                            });
                            var chartData = d3.timeDays(yearAgo, now).map(function (dateElement) {
                                return {
                                    date: dateElement,
                                    count: countForDate[dayjs(dateElement).format("YYYY-MM-DD")] || 0
                                };
                            });

                            var heatmap = calendarHeatmap()
                                .data(chartData)
                                .selector('.heatmap')
                                .tooltipEnabled(true)
                                .colorRange(['#c6e48b', '#7bc96f', '#239a3b', '#196127'], '#dfdfdf')
                                .onClick(function () {})
                                .tooltipEnabled(true)
                                .legendEnabled(true);
                            heatmap();
                            that.$nextTick(function () {
                                var pie = new Chart(document.getElementById('pie_chart').getContext('2d'), {
                                    type: 'pie',
                                    data: {
                                        datasets: [
                                            {
                                                data: [
                                                    that.local_accepted,
                                                    _.reduce(that.submission.local, function (result, val) {
                                                        if (val.result == 6) {
                                                            return result + 1;
                                                        } else {
                                                            return result;
                                                        }
                                                    }, 0),
                                                    _.reduce(that.submission.local, function (result, val) {
                                                        if (val.result == 10) {
                                                            return result + 1;
                                                        } else {
                                                            return result;
                                                        }
                                                    }, 0),
                                                    _.reduce(that.submission.local, function (result, val) {
                                                        if (val.result == 7) {
                                                            return result + 1;
                                                        } else {
                                                            return result;
                                                        }
                                                    }, 0),
                                                    _.reduce(that.submission.local, function (result, val) {
                                                        if (val.result == 8) {
                                                            return result + 1;
                                                        } else {
                                                            return result;
                                                        }
                                                    }, 0),
                                                    _.reduce(that.submission.local, function (result, val) {
                                                        if (val.result == 9) {
                                                            return result + 1;
                                                        } else {
                                                            return result;
                                                        }
                                                    }, 0),
                                                    _.reduce(that.submission.local, function (result, val) {
                                                        if (val.result == 11) {
                                                            return result + 1;
                                                        } else {
                                                            return result;
                                                        }
                                                    }, 0),
                                                    _.reduce(that.submission.local, function (result, val) {
                                                        if (val.result == 5) {
                                                            return result + 1;
                                                        } else {
                                                            return result;
                                                        }
                                                    }, 0)
                                                ],
                                                backgroundColor: [
                                                    "#66dd66",
                                                    "#ff6384",
                                                    "darkorchid",
                                                    "#ffce56",
                                                    "#00b5ad",
                                                    "#35a0e8",
                                                    "#F7464A",
                                                    "#D4CCC5"
                                                ]
                                            }
                                        ],
                                        labels: [
                                            "Accepted",
                                            "Wrong Answer",
                                            "Runtime Error",
                                            "Time Limit Exceeded",
                                            "Memory Limit Exceeded",
                                            "Output Limit Exceeded",
                                            "Compile Error",
                                            "Presentation Error"
                                        ]
                                    },
                                    options: {
                                        responsive: true,
                                        legend: {
                                            display: false
                                        },
                                        legendCallback: function (chart) {
                                            var text = [];
                                            text.push('<ul style="list-style: none; padding-left: 20px; margin-top: 0; " class="' + chart.id + '-legend">');

                                            var data = chart.data;
                                            var datasets = data.datasets;
                                            var labels = data.labels;

                                            if (datasets.length) {
                                                for (var i = 0; i < datasets[0].data.length; ++i) {
                                                    text.push('<li style="font-size: 12px; width: 50%; display: inline-block; color: #666; "><span style="width: 10px; height: 10px; display: inline-block; border-radius: 50%; margin-right: 5px; background-color: ' + datasets[0].backgroundColor[i] + '; "></span>');
                                                    if (labels[i]) {
                                                        text.push(labels[i]);
                                                    }
                                                    text.push('</li>');
                                                }
                                            }

                                            text.push('</ul>');
                                            return text.join('');
                                        }
                                    },
                                });

                                document.getElementById('pie_chart_legend').innerHTML = pie.generateLegend();
                                var lang = new Chart(document.getElementById('pie_chart_language').getContext('2d'), {
                                    type: 'pie',
                                    data: {
                                        datasets: [
                                            {
                                                data: [
                                                    _.reduce(that.submission.local, function (sum, val) {
                                                        if (val.language === "0" || val.language === "21") {
                                                            return sum + 1;
                                                        } else {
                                                            return sum;
                                                        }
                                                    }, 0),
                                                    _.reduce(that.submission.local, function (sum, val) {
                                                        if (val.language === "1" || val.language === "19" || val.language === "20") {
                                                            return sum + 1;
                                                        } else {
                                                            return sum;
                                                        }
                                                    }, 0),
                                                    _.reduce(that.submission.local, function (sum, val) {
                                                        if (val.language === "3" || val.language === "23" || val.language === "24") {
                                                            return sum + 1;
                                                        } else {
                                                            return sum;
                                                        }
                                                    }, 0),
                                                    _.reduce(that.submission.local, function (sum, val) {
                                                        if (val.language === "6") {
                                                            return sum + 1;
                                                        } else {
                                                            return sum;
                                                        }
                                                    }, 0),
                                                    _.reduce(that.submission.local, function (sum, val) {
                                                        if (val.language === "13") {
                                                            return sum + 1;
                                                        } else {
                                                            return sum;
                                                        }
                                                    }, 0),
                                                    _.reduce(that.submission.local, function (sum, val) {
                                                        if (val.language === "14") {
                                                            return sum + 1;
                                                        } else {
                                                            return sum;
                                                        }
                                                    }, 0),
                                                    _.reduce(that.submission.local, function (sum, val) {
                                                        if (val.language === "2") {
                                                            return sum + 1;
                                                        } else {
                                                            return sum;
                                                        }
                                                    }, 0)
                                                ],
                                                backgroundColor: [
                                                    "#66dd66",
                                                    "#ff6384",
                                                    "darkorchid",
                                                    "#ffce56",
                                                    "#00b5ad",
                                                    "#35a0e8",
                                                    "#E2EAE9"
                                                ]
                                            }
                                        ],
                                        labels: [
                                            "GCC",
                                            "G++",
                                            "Java",
                                            "Python",
                                            "Clang",
                                            "Clang++",
                                            "Pascal"
                                        ]
                                    },
                                    options: {
                                        responsive: true,
                                        legend: {
                                            display: false
                                        },
                                        legendCallback: function (chart) {
                                            var text = [];
                                            text.push('<ul style="list-style: none; padding-left: 20px; margin-top: 0; " class="' + chart.id + '-legend">');

                                            var data = chart.data;
                                            var datasets = data.datasets;
                                            var labels = data.labels;

                                            if (datasets.length) {
                                                for (var i = 0; i < datasets[0].data.length; ++i) {
                                                    text.push('<li style="font-size: 12px; width: 50%; display: inline-block; color: #666; "><span style="width: 10px; height: 10px; display: inline-block; border-radius: 50%; margin-right: 5px; background-color: ' + datasets[0].backgroundColor[i] + '; "></span>');
                                                    if (labels[i]) {
                                                        text.push(labels[i]);
                                                    }
                                                    text.push('</li>');
                                                }
                                            }

                                            text.push('</ul>');
                                            return text.join('');
                                        }
                                    },
                                });

                                document.getElementById('pie_chart_language_legend').innerHTML = lang.generateLegend();
                                var config = {
                                    type: 'line',
                                    data: {
                                        labels: _.keys(that.recent_submission.submission),
                                        datasets: [{
                                            label: "总提交",
                                            backgroundColor: window.chartColors.red,
                                            borderColor: window.chartColors.red,
                                            data: _.values(that.recent_submission.submission),
                                            fill: false,
                                        }, {
                                            label: "正确",
                                            fill: false,
                                            backgroundColor: window.chartColors.blue,
                                            borderColor: window.chartColors.blue,
                                            data: _.values(that.recent_submission.accept),
                                        }]
                                    },
                                    options: {
                                        responsive: true,
                                        title: {
                                            display: false,
                                            text: '统计信息'
                                        },
                                        tooltips: {
                                            mode: 'index',
                                            intersect: false,
                                        },
                                        hover: {
                                            mode: 'nearest',
                                            intersect: true
                                        },
                                        scales: {
                                            xAxes: [{
                                                display: true,
                                                scaleLabel: {
                                                    display: false,
                                                    labelString: '月份'
                                                }
                                            }],
                                            yAxes: [{
                                                display: true,
                                                scaleLabel: {
                                                    display: false,
                                                    labelString: '提交'
                                                }
                                            }]
                                        }
                                    }
                                };
                                var ctx = document.getElementById("canvas").getContext("2d");
                                window.myLine = new Chart(ctx, config);
                            })
                        });
                        $("title").html(that.user_id + " " + that.nick + " " + $title);
                    })
            }
        },
        computed: {
            online: function () {
                return this.$store.getters.onlineUser.some(el => el.user_id === this.user_id);
            }
        },
        mounted:async function () {
            document.title = `User ${this.user_id} -- ${document.title}`;
            this.initData();
        }
    }
</script>

<style scoped>
    @import "../static/css/calendarHeatmap.css";

    text{
        font-size:10px;
    }
</style>
