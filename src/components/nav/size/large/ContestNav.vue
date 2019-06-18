<template>
    <div class="ui borderless network secondary menu" id="navbar-large">
        <div class="ui container">
            <div class="ui dropdown item" tabindex="0">
                <div class="text">{{$t("general")}}</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    <router-link class="item" exact-active-class="active" to="/"><i class="home icon"></i>{{$t("home")}}
                    </router-link>
                    <router-link class="item" exact-active-class="active" to="/problemset"><i class="browser icon"></i>{{$t("problemset")}}
                    </router-link>
                    <router-link class="item" exact-active-class="active" to="/status"><i
                            class="tasks icon"></i>{{$t("history")}}
                    </router-link>
                    <router-link class="item" exact-active-class="active" to="/ranklist"><i class="trophy icon"></i>{{$t("ranklist")}}
                    </router-link>
                    <router-link class="item" exact-active-class="active" to="/discuss"><i
                            class="comment alternate icon"></i>{{$t("discuss")}}
                    </router-link>
                    <router-link class="item" exact-active-class="active" to="/contest"><i class="puzzle icon"></i>{{$t("contest")}}&amp;{{$t("homework")}}
                    </router-link>
                    <div class=" item" tabindex="0"><i class="right dropdown icon"></i>
                        <div class="text"><i class="options icon"></i>{{$t("feature")}}</div>
                        <div class="menu">
                            <router-link class="item" exact-active-class="active" to="/faq"><i class="help icon"></i>{{$t("faq")}}
                            </router-link>
                            <router-link class="item" exact-active-class="active" to="/extra/software"><i
                                    class="plug icon"></i>{{$t("useful")}}{{$t("software")}}
                            </router-link>
                            <router-link class="item" exact-active-class="active" to="/extra/whiteboard"><i
                                    class="calendar outline icon"></i>{{$t("whiteboard")}}
                            </router-link>
                            <router-link class="item" exact-active-class="active" to="/about/fame"><i
                                    class="chess queen icon"></i>{{$t("hall of fame")}}
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
            <router-link :to="`/contest/${contest_id}`" class="item" exact-active-class="active">{{$t("contest problem")}}</router-link>
            <router-link :to="`/contest/status/${contest_id}`" class="item" exact-active-class="active">{{$t("contest history")}}
            </router-link>
            <router-link :to="`/contest/rank/${contest_id}`" class="item" exact-active-class="active">{{$t("contest ranklist")}}</router-link>
            <SocketMenu :connected="connected" :judger="judger" :logined="logined" :nick="nick" :user="user"
            ></SocketMenu>
        </div>
    </div>
</template>
<i18n>
    {
        "zh-cn": {
            "contest problem": "比赛问题",
            "contest history": "比赛提交历史",
            "contest ranklist": "比赛排名"
        },
        "en": {
            "contest problem": "Contest ProblemSet",
            "contest history": "Contest Submit History",
            "contest ranklist": "Contest Ranklist"
        },
        "ja": {
            "contest problem": "コンテスト問題セット",
            "contest history": "コンテスト提出記録",
            "contest ranklist": "コンテストランキング"
        }
    }
</i18n>
<script>
import SocketMenu from "../../components/SocketMenu";

export default {
    name: "ContestNav",
    components: {
        SocketMenu
    },
    props: {
        nick: {
            type: String,
            default: ""
        },
        logined: {
            type: Boolean,
            default: false
        },
        user: {
            type: Number,
            default: 0
        },
        judger: {
            type: Number,
            default: 0
        },
        connected: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            contest_id: this.$route.params.contest_id
        };
    }
};
</script>

<style scoped>
    .ui.container {
        width: 95%!important
    }
</style>
