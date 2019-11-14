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
                                    {{$t("history")}}
                                </router-link>
                                <a @click.prevent="switch_screen($event)"
                                   class='ui button blue'>{{$t("switch side screen")}}</a>
                                <router-link :to="`/tutorial/${original_id}`" class="ui button teal"
                                             v-if="normal_problem || isadmin">
                                    {{$t("read solution")}}
                                </router-link>
                                <router-link v-if="iseditor||isadmin" :to="`/problem/edit/${original_id}`" class="ui button violet">{{$t("edit problem")}}</router-link>
                            </div>
                        </div>
                        <div :class="(!bodyOnTop ? 'six' :'eight' ) + ' wide center aligned column light element'">
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div :style="(bodyOnTop?'opacity:1;':'opacity:0;')" class="ui vertical segment single">
            <div>
                <div class="ui vertical grid">
                    <div class="row no padding">
                        <div class="five wide column">
                            <div class="ui header" style="font-size:1.71428571rem"
                                 v-html="temp_title"></div>
                        </div>
                        <div class="five wide center aligned column">
                            <div class='ui mini buttons'>
                                <router-link :to="`/status/problem/${original_id}`" class="ui button orange">
                                    {{$t("history")}}
                                </router-link>
                                <a @click.prevent="switch_screen($event)"
                                   class='ui button blue'>{{$t("switch side screen")}}</a>
                                <router-link :to="`/tutorial/${original_id}`" class="ui button teal"
                                             v-if="normal_problem || isadmin">
                                    {{$t("read solution")}}
                                </router-link>
                                <router-link v-if="iseditor||isadmin" :to="`/problem/edit/${original_id}`" class="ui button violet">{{$t("edit problem")}}</router-link>
                            </div>
                        </div>
                        <div class="six wide center aligned column">
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
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <h2 class='ui header hidden'>{{$t("problem description")}}</h2>
        <div class='ui hidden' v-html="description"></div>
        <h2 class='ui header hidden'>{{$t("input")}}</h2>
        <div class='ui hidden' v-html="input||''"></div>
        <h2 class='ui header hidden'>{{$t("output")}}</h2>
        <div class='ui hidden' v-html="output||''"></div>
        <h2 class='ui header hidden'>{{$t("sampleinput")}}</h2>
        <div class="ui bottom attached segment hidden sample_input">
            <div class="ui top attached label"><a class="copy context" data-clipboard-target=".sample_input">Copy
                Sample Input</a></div>
            <pre v-text='sampleinput'></pre>
        </div>
        <h2 class='ui header'>{{$t("sampleoutput")}}</h2>
        <div class="ui bottom attached segment">
            <div class="ui top attached label"><a class="copy context" data-clipboard-target=".sample_output">Copy
                Sample Output</a></div>
            <pre class='sample_output' v-text='sampleoutput'></pre>
        </div>
        <h2 class='ui header'>{{$t("hint")}}</h2>
        <div class='ui' v-html="hint"></div>
        <h2 class='ui header'>{{$t("from")}}</h2>
        <div class='ui'><p>
            <router-link :to="`/problemset?tag=${encodeURI(source)}`" id="problem_source" v-text="source"></router-link>
        </p>
            <p>{{$t("uploader")}}:
                <router-link :to="`/user/${uploader}`" v-if="uploader!=='Administrator'">{{uploader}}</router-link>
                <a v-else>Administrator</a>
            </p>
        </div>
    </div>
</template>

<script lang="ts">
import markdownIt from "../../lib/markdownIt/markdownIt";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component
export default class SinglePageProblemView extends Vue {
    @Prop({ default: true }) bodyOnTop!: boolean;
    @Prop({ default: 0 }) time!: number;
    @Prop({ default: 0 }) memory!: number;
    @Prop({ default: false }) spj!: boolean;
    @Prop({ default: "" }) title!: string;
    @Prop({ default: 0 }) problem_id!: number;
    @Prop({ default: 0 }) submit!: number;
    @Prop({ default: 0 }) accepted!: number;
    @Prop({ default: 0 }) original_id!: number;
    @Prop({ default: () => {} }) switch_screen!: (...arg: any) => any;
    @Prop({ default: true }) normal_problem!: boolean;
    @Prop({ default: false }) iseditor!: boolean;
    @Prop({ default: false }) isadmin!: boolean;
    @Prop({ default: "" }) description!: string;
    @Prop({ default: "" }) input!: string;
    @Prop({ default: "" }) output!: string;
    @Prop({ default: "" }) sampleinput!: string;
    @Prop({ default: "" }) sampleoutput!: string;
    @Prop({ default: "" }) hint!: string;
    @Prop({ default: "" }) source!: string;
    @Prop({ default: "Administrator" }) uploader!: string;
    encodeURI = encodeURI;
    markdownIt = markdownIt;
    location = location;
    get temp_title () {
        return this.problem_id + ": " + markdownIt.renderRaw(this.title);
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
