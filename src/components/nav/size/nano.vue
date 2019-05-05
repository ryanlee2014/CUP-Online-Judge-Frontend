<template>
    <div id="navbar-nano" class="ui borderless network secondary menu">
        <div class="ui container">
            <div class="msg header item">
                <router-link to="/" class="item"><i class="home icon"></i>首页</router-link>
            </div>
            <div tabindex="0" class="ui dropdown item">
                <div class="text">通用</div>
                <i class="dropdown icon"></i>
                <div class="menu"><a href="/faqs.php" class="item">常见问答</a>

                    <router-link to="/problemset" class="item"><i class="browser icon"></i>问题</router-link>
                    <router-link to="/status" class="item"><i
                            class="tasks icon"></i>历史
                    </router-link>
                    <a href="ranklist.php" class="item">排名</a>
                    <div tabindex="0" class="item"><i class="right dropdown icon"></i>
                        <div class="text">其他</div>
                        <div class="menu"><a href="/contest.php" class="item">竞赛&amp;作业</a> <a
                                href="/specialsubject.php" class="item">ACM专题</a> <a href="/recent-contest.php"
                                                                                     class="item">名校联赛</a> <a
                                href="/acmmanager.php" class="item">ACM管理系统</a> <a href="/software.php"
                                                                                   class="item">常用软件</a> <a
                                href="/whiteboard.php" class="item">白板(β版测试)</a> <a href="/vjudgeindex.php"
                                                                                    class="item">Virtual
                            Judge</a> <a href="https://wiki.cupacm.com" class="item">Wiki</a> <a
                                href="/cppreference/en/" target="_blank" class="item tutorial">C/C++语言参考手册</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right menu">
                <a href="newonline.php" target="_blank" class="item online_num2">
                    <i class="users icon"></i>2人&nbsp;
                    <i
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
        name: "nano"
    }
</script>

<style scoped>

</style>
