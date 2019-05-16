<template>
    <div class="ui container">
        <div :style="(!bodyOnTop?'opacity:1;':'opacity:0;') + 'z-index:99'" class="following bar title"
             v-show="!bodyOnTop">
            <div class="ui container">
                <div :class="(!bodyOnTop ? '' : 'center aligned') + ' ui vertical grid'">
                    <div class="row no padding">
                        <div :class="(!bodyOnTop ? 'five' :'sixteen center aligned' ) + ' wide column light element'">
                            <div class="ui header" id="probid" style="font-size:1.71428571rem"
                                 v-html="temp_title"></div>
                        </div>
                        <div :class="(!bodyOnTop ? 'five' :'sixteen' ) + ' wide center aligned column light element'">
                            <div class='ui mini buttons'>
                                <router-link :to="`/status/problem/${original_id}`" class="ui button orange">
                                    历史
                                </router-link>
                                <a @click.prevent="switch_screen($event)"
                                   class='ui button blue'>切换双屏</a>
                                <router-link :to="`/tutorial/${original_id}`" class="ui button teal"
                                             v-if="normal_problem || isadmin">
                                    查看题解
                                </router-link>
                                <router-link v-if="iseditor||isadmin" :to="`/problem/edit/${original_id}`" class="ui button violet">编辑题目</router-link>
                            </div>
                        </div>
                        <div :class="(!bodyOnTop ? 'six' :'eight' ) + ' wide center aligned column light element'">
                            <div class='ui labels'>
                                <li class='ui label red'
                                    v-text="time"></li>
                                <li class='ui label red'
                                    v-text="memory"></li>
                                <li class='ui label orange' v-cloak v-show="spj">Special Judge</li>
                                <li class='ui label grey'
                                    v-text="submit"></li>
                                <li class='ui label green'
                                    v-text="accepted"></li>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div :style="(bodyOnTop?'opacity:1;':'opacity:0;')" class="ui vertical segment single">
            <div class="ui container">
                <div class="ui vertical grid">
                    <div class="row no padding">
                        <div class="five wide column">
                            <div class="ui header" style="font-size:1.71428571rem"
                                 v-html="temp_title"></div>
                        </div>
                        <div class="five wide center aligned column">
                            <div class='ui mini buttons'>
                                <router-link :to="`/status/problem/${original_id}`" class="ui button orange">
                                    历史
                                </router-link>
                                <a @click.prevent="switch_screen($event)"
                                   class='ui button blue'>切换双屏</a>
                                <router-link :to="`/tutorial/${original_id}`" class="ui button teal"
                                             v-if="normal_problem || isadmin">
                                    查看题解
                                </router-link>
                                <router-link v-if="iseditor||isadmin" :to="`/problem/edit/${original_id}`" class="ui button violet">编辑题目</router-link>
                            </div>
                        </div>
                        <div class="six wide center aligned column">
                            <div class='ui labels'>
                                <li class='ui label red'
                                    v-text="time"></li>
                                <li class='ui label red'
                                    v-text="memory"></li>
                                <li class='ui label orange' v-cloak v-show="spj">Special Judge</li>
                                <li class='ui label grey'
                                    v-text="submit"></li>
                                <li class='ui label green'
                                    v-text="accepted"></li>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <h2 class='ui header hidden'>题目描述</h2>
        <div class='ui hidden' v-html="description"></div>
        <h2 class='ui header hidden'>输入</h2>
        <div class='ui hidden' v-html="input||''"></div>
        <h2 class='ui header hidden'>输出</h2>
        <div class='ui hidden' v-html="output||''"></div>
        <h2 class='ui header hidden'>样例输入</h2>
        <div class="ui bottom attached segment hidden sample_input">
            <div class="ui top attached label"><a class="copy context" data-clipboard-target=".sample_input">Copy
                Sample Input</a></div>
            <pre v-text='sampleinput'></pre>
        </div>
        <h2 class='ui header'>样例输出</h2>
        <div class="ui bottom attached segment">
            <div class="ui top attached label"><a class="copy context" data-clipboard-target=".sample_output">Copy
                Sample Output</a></div>
            <pre class='sample_output' v-text='sampleoutput'></pre>
        </div>
        <h2 class='ui header'>提示</h2>
        <div class='ui' v-html="hint"></div>
        <h2 class='ui header'>来源</h2>
        <div class='ui'><p><a :href='"problemset.php?tag="+encodeURI(source)' id='problem_source'
                              v-text='source'></a></p>
            <p>上传者:<a :href="'userinfo.php?user='+uploader" target="_blank" v-if="uploader!=='Administrator'">{{uploader}}</a><a
                    v-else>Administrator</a></p>
        </div>
    </div>
</template>

<script>
    import markdownIt from '../../lib/markdownIt/markdownIt'

    export default {
        name: "singlePageProblemView",
        props: {
            bodyOnTop: {
                type: Boolean,
                default: true
            },
            time: {
                type: String,
                default: "时间限制: 0秒"
            },
            memory: {
                type: String,
                default: "内存限制: 0MB"
            },
            spj: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: ""
            },
            problem_id: {
                type: Number,
                default: 0
            },
            submit: {
                type: String,
                default: "提交: 0"
            },
            accepted: {
                type: String,
                default: "正确: 0"
            },
            original_id: {
                type: Number,
                default: 0
            },
            switch_screen: {
                type: Function,
                default: () => {
                }
            },
            normal_problem: {
                type: Boolean,
                default: true
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
            source: {
                type: String,
                default: ""
            },
            uploader: {
                type: String,
                default: "Administrator"
            }
        },
        data() {
            return {
                encodeURI,
                markdownIt,
                location
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

    .row.no.padding {
        padding-top: 0em;
        padding-bottom: 0em;
    }

    .ui.vertical.grid {
        padding: 25px
    }

    .light.element {
        transition: all 0.4s;
    }

    .main.submit.layout img {
        display: block;
        margin-left: auto;
        margin-right: auto;
    }
</style>
