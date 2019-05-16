<template>
    <div class="padding ui container mainwindow"
         style="height:100%;width: 35%;overflow-y: auto;float:left;border-radius: 10px;" id="left-side">
        <div class="ui vertical center aligned segment">
            <div class="ui header" id="probid" v-html="temp_title" style="font-size:1.71428571rem"></div>
            <div class='ui labels'>
                <li class='ui label red' id="tlimit"
                    v-text="time"></li>
                <li class='ui label red' id="mlimit"
                    v-text="memory"></li>
                <li class='not-compile' :class="'ui label orange'" id="spj" v-cloak v-show="spj">Special Judge
                </li>
                <li class='ui label grey' id="totsub"
                    v-text="submit"></li>
                <li class='ui label green' id="totac"
                    v-text="accepted"></li>
            </div>
            <br>
            <div class='ui buttons'>
                <router-link class="ui button orange" :to="`/status/problem/${original_id}`">历史</router-link>
                <a @click.prevent="switch_screen"
                   class='ui button blue'>切换单屏</a>
                <router-link :to="`/tutorial/${original_id}`" class="ui button teal">查看题解</router-link>
                <router-link v-if="iseditor||isadmin" :to="`/problem/edit/${original_id}`" class="ui button violet">编辑题目</router-link>
            </div>
        </div>
        <br>
        <div class="ui styled accordion">
            <div class='title'>题目描述<i class="dropdown icon"></i></div>
            <div class='content' id='problem_description' v-html="description">
            </div>
            <div class='title'>输入<i class="dropdown icon"></i></div>
            <div class='content' id='problem_input' v-html="input||''">
            </div>
            <div class='title'>输出<i class="dropdown icon"></i></div>
            <div class='content' id='problem_output' v-html="output||''"></div>
            <div class='title'>样例输入<i class="dropdown icon"></i>
            </div>
            <div class='content'>
                <div class="ui bottom attached segment">
                    <div class="ui top attached label"><a data-clipboard-target=".sample_input"
                                                          class="copy context">Copy Sample Input</a></div>
                    <pre><span id='problem_sample_input' class='sample_input'
                               v-text='sampleinput'></span></pre>
                </div>
            </div>
            <div class='title'>样例输出<i class="dropdown icon"></i></div>
            <div class='content'>
                <div class="ui bottom attached segment">
                    <div class="ui top attached label"><a data-clipboard-target=".sample_output"
                                                          class="copy context">Copy Sample Output</a></div>
                    <pre><span id='problem_sample_output'
                               class='sample_output'
                               v-text='sampleoutput'></span></pre>
                </div>
            </div>
            <div class='title'>提示<i class="dropdown icon"></i></div>
            <div class='content' v-html="hint">
            </div>

            <div class='title'>来源<i class="dropdown icon"></i></div>
            <div class='content'><p><a :href='"problemset.php?tag="+encodeURI(source)' id='problem_source'
                                       v-text='source'></a></p>
                <p>上传者:<a target="_blank" v-if="uploader!=='Administrator'" :href="'userinfo.php?user='+uploader">{{uploader}}</a><a v-else>Administrator</a></p></div>

        </div>
    </div>
</template>

<script>
    import markdownIt from '../../../lib/markdownIt/markdownIt'
    export default {
        name: "leftPanel",
        props: {
            title: {
                type: String,
                default: ""
            },
            time: {
                type: String,
                default: ""
            },
            memory: {
                type: String,
                default: ""
            },
            spj: {
                type: Boolean,
                default: false
            },
            submit: {
                type: String,
                default: "0"
            },
            accepted: {
                type: String,
                default: "0"
            },
            original_id: {
                type: Number,
                default: 0
            },
            iseditor: {
                type: Boolean,
                default: false
            },
            isadmin: {
                type: Boolean,
                default: false
            },
            description: {
                type: String,
                default: ""
            },
            input: {
                type: String,
                default: ""
            },
            output: {
                type: String,
                default: ""
            },
            sampleinput: {
                type: String,
                default: ""
            },
            sampleoutput: {
                type: String,
                default: ""
            },
            hint: {
                type: String,
                default: ""
            },
            uploader: {
                type: String,
                default: "Administrator"
            },
            switch_screen: {
                type: Function,
                default: () => () => undefined
            },
            normal_problem: {
                type: Boolean,
                default: true
            },
            source: {
                type: String,
                default: ""
            },
            problem_id: {
                type: Number,
                default: 0
            }
        },
        computed: {
            temp_title: function () {
                return this.problem_id + ": " + markdownIt.renderRaw(this.title);
            }
        }
    }
</script>

<style scoped>
    .ui.modal {
        top: 3%;
    }

    script {
        display: none;
    }

    .not-compile {
        display: none;
    }

    .sample_input {
        color: #ad1457;
    }

    .sample_output {
        color: #ad1457;
    }

    .following.bar.title.light.fixed {
        top: 40px;
        transition: top 0.4s;
    }

    .following.bar.title {
        top: 60px;
        transition: top 0.4s;
    }

    .ui.vertical.center.aligned.grid {
        padding-top: 1em;
        padding-bottom: 2em;
    }

    .row.no.padding {
        padding-top: 0em;
        padding-bottom: 0em;
    }

    .main.submit.layout img {
        display: block;
        margin-left: auto;
        margin-right: auto;
    }
</style>
