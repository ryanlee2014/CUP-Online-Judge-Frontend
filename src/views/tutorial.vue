<template>
    <div class="ui container padding">
        <h2 class="ui dividing header">
            Solution
            <div class="sub header">
                公测中
            </div>
        </h2>
        <div class="ui grid">
            <div class="row">
                <div class="thirteen wide column">
                </div>
                <div class="three wide right aligned column">
                    <a :href="'newtutorialpost.php?from='+source+'&id='+id"
                       class="ui labeled icon blue mini button" target="_blank"><i class="write icon"></i>
                        Post
                    </a>
                </div>
            </div>
        </div>
        <div :key="key" class="ui grid" v-for="(thread_head,key) in content">
            <div class="four wide column">
                <div class="ui link card">
                    <div class="image">
                        <img :src="'../avatar/'+thread_head.user_id+'.jpg'" @click="location.href='userinfo.php?user='+thread_head.user_id"
                             v-if="thread_head.avatar === 1">
                        <img src="/assets/images/wireframe/white-image.png" v-else>
                    </div>
                    <div class="content">
                        <div class="header"><a :href="'userinfo.php?user='+thread_head.user_id" class="black"
                                               target="_blank">{{thread_head.nick}}</a></div>
                        <div class="meta">
                            <a :href="'userinfo.php?user='+thread_head.user_id"
                               target="_blank">{{thread_head.user_id}}</a>
                        </div>
                        <div class="description" v-html="markdownIt.renderRaw(thread_head.biography||'')">
                        </div>
                    </div>
                    <div class="extra content">
      <span class="right floated">

      </span>
                        <span>
        <i class="user icon"></i>
        Solved {{thread_head.solved}}
      </span>
                    </div>
                </div>
            </div>
            <div class="twelve wide column">
                <div class="ui existing full segment">
                    <a :href="'tutorialedit.php?tutorial_id='+thread_head.tutorial_id+'&from='+thread_head.source.toLowerCase()+'&id='+thread_head.problem_id" class="ui blue right ribbon label"
                       v-if="thread_head.user_id + '' ===  owner">Edit</a>
                    <div class="ui vertical segment" v-html="markdownIt.render(thread_head.content||'')"></div>

                    <div class="ui raised segment">
                        <div class="ui tiny statistics">
                            <div class="statistic">
                                <div class="value none-transform">
                                    {{thread_head.time}}
                                    <span class="subscript">ms</span>
                                </div>
                                <div class="label none-transform">
                                    Running Time
                                </div>
                            </div>
                            <div class="statistic">
                                <div class="value none-transform">
                                    {{thread_head.memory}}
                                    <span class="subscript">KB</span>
                                </div>
                                <div class="label none-transform">
                                    Used Memory
                                </div>
                            </div>
                            <div class="statistic">
                                <div class="value none-transform">
                                    {{language_name[thread_head.language]}}
                                    <span class="subscript">&nbsp;</span>
                                </div>
                                <div class="label none-transform">
                                    Language
                                </div>
                            </div>
                            <div class="statistic">
                                <div :class="'value none-transform '+judge_color[thread_head.result]">
                                    <i :class="icon_list[thread_head.result]+' icon'"></i>
                                    {{result_name[thread_head.result]}}
                                    <span class="subscript">&nbsp;</span>
                                </div>
                                <div class="label none-transform">
                                    Result
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="ui styled fluid accordion">
                        <div class="title">AC代码<i class="dropdown icon"></i></div>
                        <div class="content"
                             v-html="markdownIt.render('```' + language_markdown[thread_head.language] + '\n' +thread_head.code + '\n```')"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import mixins from '../mixin/init'
    import mermaid from 'mermaid'
    import markdownIt from '../lib/markdownIt/markdownIt'
    const $ = window.$ = window.jQuery = require("jquery");
    const Clipboard = require("clipboard");
    require("../static/js/semantic.min");
    export default {
        name: "tutorial",
        mixins: [mixins],
        data: function () {
            return {
                content: "",
                id: this.$route.params.problem_id,
                source: this.$route.query.from || "local",
                judge_color:[],
                language_name: [],
                icon_list:[],
                result_name: [],
                owner: "",
                language_markdown: [],
                markdownIt
            }
        },
        created: function () {
            $(document).on("click", function () {
                $(".mermaid").each(function (el, v) {
                    if ($(v).is(":visible")) {
                        mermaid.init(undefined, v)
                    }
                })
            });
        },
        updated() {
            this.$nextTick(function () {
                $('.ui.accordion')
                    .accordion({
                        'exclusive': false
                    });
                var copy_content = new Clipboard(".copy.context", {
                    text: function (trigger) {
                        return $(trigger).parent().next().text();
                    }
                });
                copy_content.on("success", function (e) {
                    $(e.trigger)
                        .popup({
                            title: 'Finished',
                            content: 'Context is in your clipboard',
                            on: 'click'
                        })
                        .popup("show");
                })
            })
        },
        mounted: function () {
            this.axios.get(`/api/tutorial/${this.source}/${this.id}`)
                .then(({data}) => {
                    const d = data;
                    Object.assign(this, {
                        content: d.data,
                        id: this.$route.params.problem_id,
                        source: this.$route.query.from || "local",
                        judge_color: d.const_variable.judge_color,
                        language_name: d.const_variable.language_name,
                        icon_list: d.const_variable.icon_list,
                        result_name: d.const_variable.result,
                        owner: d.self,
                        language_markdown: d.const_variable.language_common_name
                    });
                });
            this.axios.get(`/api/tutorial/${this.source}/${this.id}`)
                .then(({data}) => {
                    const d = data;
                    this.content = d.data;
                    this.owner = d.self;
                });
            const $title = $("title").html();
            $("title").html("Tutorial " + this.id + " -- " + $title);
        }
    }
</script>

<style scoped>
    .subscript{
        font-size: 1rem;
    }
    .none-transform{
        text-transform: none !important;
    }
</style>
