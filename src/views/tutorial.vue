<template>
    <div class="ui container padding" v-if="contestMode"></div>
    <div class="ui container padding" v-else >
        <h2 class="ui dividing header">
            {{$t("tutorial")}}
            <div class="sub header">
                β
            </div>
        </h2>
        <div class="ui grid">
            <div class="row">
                <div class="thirteen wide column">
                </div>
                <div class="three wide right aligned column">
                    <router-link :to="`/tutorial/new/${id}`" class="ui labeled icon blue mini button"><i class="write icon"></i>{{$t("post new solution")}}</router-link>
                </div>
            </div>
        </div>
        <div :key="key" class="ui grid" v-for="(thread_head,key) in content">
            <div class="four wide column">
                <UserCard :thread_head="thread_head"></UserCard>
            </div>
            <div class="twelve wide column">
                <div class="ui existing full segment">
                    <router-link :to="`/tutorial/edit/${thread_head.tutorial_id}`" class="ui blue right ribbon label" v-if="thread_head.user_id + '' === owner">{{$t("edit")}}</router-link>
                    <div class="ui vertical segment" v-html="thread_head.content"></div>

                    <div class="ui raised segment">
                        <div class="ui tiny statistics">
                            <div class="statistic">
                                <div class="value none-transform">
                                    {{thread_head.time}}
                                    <span class="subscript">ms</span>
                                </div>
                                <div class="label none-transform">
                                    {{$t("time")}}
                                </div>
                            </div>
                            <div class="statistic">
                                <div class="value none-transform">
                                    {{thread_head.memory}}
                                    <span class="subscript">KB</span>
                                </div>
                                <div class="label none-transform">
                                    {{$t("memory")}}
                                </div>
                            </div>
                            <div class="statistic">
                                <div class="value none-transform">
                                    {{language_name[thread_head.language]}}
                                    <span class="subscript">&nbsp;</span>
                                </div>
                                <div class="label none-transform">
                                    {{$t("programming language")}}
                                </div>
                            </div>
                            <div class="statistic">
                                <div :class="'value none-transform '+judge_color[thread_head.result]">
                                    <i :class="icon_list[thread_head.result]+' icon'"></i>
                                    {{result_name[thread_head.result]}}
                                    <span class="subscript">&nbsp;</span>
                                </div>
                                <div class="label none-transform">
                                    {{$t("result")}}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="ui styled fluid accordion">
                        <div class="title">{{$t("source code")}}<i class="dropdown icon"></i></div>
                        <div class="content"
                             v-html="thread_head.code"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import mixins from "../mixin/init";
import avatarMixin from "../mixin/avatarMixin";
import mermaidMixin from "../mixin/mermaidMixin";
import ContestMode from "../components/contestMode/block.vue";
import { Component, Mixins } from "vue-property-decorator";
import jquery from "jquery";
import { mapGetters } from "vuex";
import UserCard from "@/components/user/UserCard.vue";
import MarkdownWorkerMixin from "@/mixin/MarkdownWorkerMixin";
const $: any = jquery;
const Clipboard = require("clipboard");
@Component({
    components: {
        UserCard,
        ContestMode
    },
    computed: mapGetters(["contestMode"])
})
export default class Tutorial extends Mixins(mixins, avatarMixin, mermaidMixin, MarkdownWorkerMixin) {
    $route: any;
    content: any = [];
    id = "";
    source = "local";
    judge_color = [];
    language_name = [];
    icon_list = [];
    result_name = [];
    owner = "";
    language_markdown = [];
    created () {
        this.id = this.$route.params.problem_id;
        this.source = this.$route.query.from || "local";
    }

    updated () {
        this.$nextTick(function () {
            $(".ui.accordion")
                .accordion({
                    exclusive: false
                });
            const copyContent = new Clipboard(".copy.context", {
                text: function (trigger: any) {
                    return $(trigger).parent().next().text();
                }
            });
            copyContent.on("success", function (e: any) {
                $(e.trigger)
                    .popup({
                        title: "Finished",
                        content: "Context is in your clipboard",
                        on: "click"
                    })
                    .popup("show");
            });
        });
    }

    mounted () {
        document.title = `Tutorial -- ${document.title}`;
        this.axios.get(`/api/tutorial/${this.source}/${this.id}`)
            .then(({ data }) => {
                const d = data;
                const content: any[] = d.data;
                const language_markdown = d.const_variable.language_common_name;
                content.forEach(async (e: any) => {
                    e.content = await this.renderAsync(e.content);
                    e.code = await this.renderAsync("```" + language_markdown[e.language] + "\n" + e.code + "\n```");
                });

                Object.assign(this, {
                    content: content,
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
        const $title = document.title;
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
