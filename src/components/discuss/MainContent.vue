<template>
    <div class="ui grid">
        <div class="four wide column">
            <UserCard :thread_head="thread_head"></UserCard>
            <div class="ui sticky" id="sticky_content" style="left: 50.1429px;">
                <h3 class="ui header" id="contents" v-show="content">目录</h3>
                <div id="contentContainer"></div>
            </div>
        </div>
        <div class="twelve wide column">
            <div class="ui existing full segment" id="main_context">
                <router-link :to="`/discuss/edit/${id}`" class="ui blue right ribbon label"
                             v-if="thread_head.user_id + '' === owner">
                    {{$t("edit")}}
                </router-link>
                <div class="ui info message">
                    <div class="header">
                        {{$tc("read time cost", readTime(thread_head.content), {n: readTime(thread_head.content)})}}
                    </div>
                </div>
                <div v-html="thread_head.content"></div>
            </div>
        </div>
    </div>

</template>
<i18n>
    {
    "zh-cn": {
    "read time cost": "阅读本文需要大约{n}分钟"
    },
    "en": {
    "read time cost": "It takes about {n} minute to read this article | It takes about {n} minutes to read this article"
    },
    "ja": {
    "read time cost": "この記事を読むには約{n}分かかります"
    }
    }
</i18n>
<script lang="ts">
import markdownIt from "../../lib/markdownIt/markdownIt";
import avatarMixin from "../../mixin/avatarMixin";
import { Mixins, Component, Prop } from "vue-property-decorator";
import UserCard from "@/components/user/UserCard.vue";
const doc = document.createElement("div");

@Component({
    components: {
        UserCard
    }
})
export default class DiscussContent extends Mixins(avatarMixin) {
    @Prop({ default: () => { return {}; } }) thread_head!: any;
    @Prop({ default: false }) content!: boolean;
    @Prop({ default: "" }) owner!: string;
    @Prop({ default: "" }) id!: string;

    markdownIt = markdownIt;

    readTime (content: string) {
        doc.innerHTML = content;
        return Math.trunc(Math.ceil(doc.innerText.length / 300) ** 1.41428579532);
    }
}
</script>

<style scoped>
    .full.segment {
        height: 100%;
    }

    .black {
        color: black;
    }
</style>
