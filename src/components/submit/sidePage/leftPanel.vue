<template>
    <div class="padding ui container mainwindow five wide column"
         id="left-side" style="height:100%;width: 35%;overflow-y: auto;border-radius: 10px;">
        <div class="ui vertical center aligned segment">
            <div class="ui header" id="probid" style="font-size:1.71428571rem" v-html="temp_title"></div>
            <div class='ui labels'>
                <li class='ui label red'
                    v-text="$t('time limit') + ': ' + time + $t('second')"></li>
                <li class='ui label red'
                    v-text="$t('memory limit') + ': ' + memory + 'MB'"></li>
                <li class='ui label orange' v-cloak v-show="spj">Special Judge</li>
                <li class='ui label grey'
                    v-text="$t('submit') + ': ' + submit"></li>
                <li class='ui label green'
                    v-text="$t('accept') + ': ' + accepted"></li>
            </div>
            <br>
            <div class='ui buttons'>
                <router-link :to="`/status/problem/${original_id}`" class="ui button orange">{{$t("history")}}
                </router-link>
                <a @click.prevent="switch_screen"
                   class='ui button blue'>{{$t("switch single screen")}}</a>
                <router-link :to="`/tutorial/${original_id}`" class="ui button teal">{{$t("read solution")}}
                </router-link>
                <router-link :to="`/problem/edit/${original_id}`" class="ui button violet" v-if="iseditor||isadmin">
                    {{$t("edit problem")}}
                </router-link>
            </div>
        </div>
        <br>
        <div class="ui styled accordion">
            <div class='title'>{{$t("problem description")}}<i class="dropdown icon"></i></div>
            <div class='content' id='problem_description' v-html="description">
            </div>
            <div class='title'>{{$t("input")}}<i class="dropdown icon"></i></div>
            <div class='content' id='problem_input' v-html="input||''">
            </div>
            <div class='title'>{{$t("output")}}<i class="dropdown icon"></i></div>
            <div class='content' id='problem_output' v-html="output||''"></div>
            <div class='title'>{{$t("sampleinput")}}<i class="dropdown icon"></i>
            </div>
            <div class='content'>
                <div class="ui bottom attached segment">
                    <div class="ui top attached label"><a class="copy context"
                                                          data-clipboard-target=".sample_input">Copy Sample Input</a>
                    </div>
                    <pre><span class='sample_input' id='problem_sample_input'
                               v-text='sampleinput'></span></pre>
                </div>
            </div>
            <div class='title'>{{$t("sampleoutput")}}<i class="dropdown icon"></i></div>
            <div class='content'>
                <div class="ui bottom attached segment">
                    <div class="ui top attached label"><a class="copy context"
                                                          data-clipboard-target=".sample_output">Copy Sample Output</a>
                    </div>
                    <pre><span class='sample_output'
                               id='problem_sample_output'
                               v-text='sampleoutput'></span></pre>
                </div>
            </div>
            <div class='title'>{{$t("hint")}}<i class="dropdown icon"></i></div>
            <div class='content' v-html="hint">
            </div>

            <div class='title'>{{$t("from")}}<i class="dropdown icon"></i></div>
            <div class='content'>
                <p>
                    <router-link :to="`/problemset?tag=${encodeURI(source)}`" id="problem_source"
                                 v-text="source"></router-link>
                </p>
                <p>{{$t("uploader")}}:
                    <router-link :to="`/user/${uploader}`" v-if="uploader!=='Administrator'">{{uploader}}</router-link>
                    <a v-else>Administrator</a></p>
            </div>
            <div v-if="admin">
            <div class="title">
                Problem In Contest
                <i class="dropdown icon"></i>
            </div>
            <div class="content">
                <p :key="key" v-for="(row, key) in contestList">
                    <router-link  :to="`/contest/${row.contest_id}`">
                        <a :class="`ui ${isPrivateContestLabel(row.private)} label`">{{isPrivateContest(row.private)}}</a>
                        Contest {{row.contest_id}}: {{row.title}}
                    </router-link>
                </p>
            </div>
            </div>
        </div>
    </div>
</template>
<script>
import markdownIt from "../../../lib/markdownIt/markdownIt";
import { mapGetters } from "vuex";
const _ = require("lodash");
export default {
    name: "leftPanel",
    data () {
        return {
            contestList: []
        };
    },
    watch: {
        original_id (newVal) {
            if (this.admin) {
                this.initContestListForAdministrator(newVal);
            }
        }
    },
    methods: {
        initContestListForAdministrator (originalId = this.original_id) {
            if (isNaN(originalId) || originalId < 1000) {
                return;
            }
            this.axios.get(`/api/problem/contest_list/${originalId}`)
                .then(({ data }) => {
                    if (data.status === "OK") {
                        let contestList = data.data;
                        _.uniqWith(contestList, _.isEqual);
                        contestList.sort((a, b) => a.contest_id - b.contest_id);
                        this.contestList = contestList;
                    }
                    else {
                        console.error(`/api/problem/contest_list/${originalId} caused error: `, data);
                    }
                });
        },
        isPrivateContestLabel (state) {
            if (this.isPrivate(state)) {
                return "red";
            }
            else {
                return "green";
            }
        },
        isPrivate (state) {
            return parseInt(state) === 1;
        },
        isPrivateContest (state) {
            if (this.isPrivate(state)) {
                return "Private";
            }
            else {
                return "Public";
            }
        }
    },
    mounted () {
        if (this.admin) {
            this.initContestListForAdministrator();
        }
    },
    props: {
        title: {
            type: String,
            default: ""
        },
        time: {
            type: Number,
            default: 0
        },
        memory: {
            type: Number,
            default: 0
        },
        spj: {
            type: Boolean,
            default: false
        },
        submit: {
            type: Number,
            default: 0
        },
        accepted: {
            type: Number,
            default: 0
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
        },
        ...mapGetters(["logined", "avatar", "admin", "user_id", "nick"])
    }
};
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
</style>
