<template>
    <div class="ui borderless network secondary menu" id="navbar-large">
        <div class="ui container">
            <router-link class="item" to="/"><i class="home icon"></i>首页</router-link>
            <router-link class="item" to="/problemset"><i class="browser icon"></i>问题</router-link>
            <router-link class="item" to="/status"><i
                    class="tasks icon"></i>历史
            </router-link>
            <router-link class="item" to="/ranklist"><i class="trophy icon"></i>排名</router-link>
            <router-link class="item" to="/discuss"><i class="comment alternate icon"></i>讨论</router-link>
            <router-link class="item" to="/contest"><i class="puzzle icon"></i>竞赛&amp;作业</router-link>
            <div class="ui dropdown item" tabindex="0">
                <div class="text"><i class="options icon"></i>功能</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    <router-link class="item" to="/faq"><i class="help icon"></i>常见问答</router-link>
                    <a class="item" href="/specialsubject.php"><i class="rocket icon"></i>ACM专题</a>
                    <a class="item" href="/recent-contest.php"><i class="sitemap icon"></i>名校联赛</a>
                    <a class="item" href="/acmmanager.php"><i class="road icon"></i>ACM管理系统</a>
                    <a class="item" href="/software.php"><i class="plug icon"></i>常用软件</a>
                    <a class="item" href="/whiteboard.php"><i class="calendar outline icon"></i>白板(β版测试)</a>
                    <a class="item tutorial" target="_blank"><i class="question circle outline icon"></i>C/C++语言参考手册</a>
                    <a class="item" href="https://wiki.cupacm.com"><i class="book icon"></i>Wiki</a>
                    <router-link class="item" to="/about/fame"><i class="chess queen icon"></i>Hall of Fame</router-link>
                </div>
            </div>
            <a class="item" href="/vjudgeindex.php"><i class="lab icon"></i>Virtual
                Judge</a>
            <SocketMenu :nick="nick" :logined="logined" :user="user" :judger="judger" :connected="connected"
            ></SocketMenu>
        </div>
    </div>
</template>

<script>
    import SocketMenu from '../../components/SocketMenu'
    export default {
        name: "large",
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
        }
    }
</script>

<style scoped>

</style>
