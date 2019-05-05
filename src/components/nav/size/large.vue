<template>
    <div id="navbar-large" class="ui borderless network secondary menu">
        <div class="ui container">
            <router-link to="/" class="item"><i class="home icon"></i>首页</router-link>
            <router-link to="/problemset" class="item"><i class="browser icon"></i>问题</router-link>
            <router-link to="/status" class="item"><i
                    class="tasks icon"></i>历史</router-link>
            <a href="/ranklist.php" class="item"><i class="trophy icon"></i>排名</a>
            <a href="/discuss.php" class="item"><i class="comment alternate icon"></i>讨论</a> <a
                href="/contest.php" class="item"><i class="puzzle icon"></i>竞赛&amp;作业</a>
            <div tabindex="0" class="ui dropdown item">
                <div class="text"><i class="options icon"></i>功能</div>
                <i class="dropdown icon"></i>
                <div class="menu"><a href="/faqs.php" class="item"><i class="help icon"></i>常见问答</a> <a
                        href="/specialsubject.php" class="item"><i class="rocket icon"></i>ACM专题</a> <a
                        href="/recent-contest.php" class="item"><i class="sitemap icon"></i>名校联赛</a> <a
                        href="/acmmanager.php" class="item"><i class="road icon"></i>ACM管理系统</a> <a
                        href="/software.php" class="item"><i class="plug icon"></i>常用软件</a> <a
                        href="/whiteboard.php" class="item"><i class="calendar outline icon"></i>白板(β版测试)</a> <a
                        target="_blank" class="item tutorial"><i
                        class="question circle outline icon"></i>C/C++语言参考手册</a>
                    <a href="https://wiki.cupacm.com" class="item"><i class="book icon"></i>Wiki</a> <a
                            href="/fame.php" class="item"><i class="chess queen icon"></i>Hall of Fame</a></div>
            </div>
            <a href="/vjudgeindex.php" class="item"><i class="lab icon"></i>Virtual
                Judge</a>
            <div class="right menu"><a href="newonline.php" class="item online_num"><i class="users icon"></i>2人&nbsp;<i
                    class="microchip icon"></i>8</a>
                <div tabindex="0" class="ui dropdown item detail">
                    <div class="text"><span class="profile_group">Ryan Lee(李昊元)</span></div>
                    <i class="dropdown icon"></i>
                    <div class="menu"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "large"
    }
</script>

<style scoped>

</style>
