<template>
    <div class="ui grid">
        <div class="four wide column">
            <div class="ui link card">
                <div class="image">
                    <router-link :src="getAvatarURL(thread_head)" :to="`/user/${thread_head.user_id}`"
                                 tag="img" v-if="hasAvatarURL(thread_head)">
                    </router-link>
                    <img src="/assets/images/wireframe/white-image.png" v-else>
                </div>
                <div class="content">
                    <div class="header">
                        <router-link :to="`/user/${thread_head.user_id}`" class="black">
                            {{thread_head.nick}}
                        </router-link>
                    </div>
                    <div class="meta">
                        <router-link :to="`/user/${thread_head.user_id}`">
                            {{thread_head.user_id}}
                        </router-link>
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
            <div class="ui sticky" id="sticky_content" style="left: 50.1429px;">
                <h3 class="ui header" id="contents" v-show="content">目录</h3>
                <div id="contentContainer"></div>
            </div>
        </div>
        <div class="twelve wide column">
            <div class="ui existing full segment" id="main_context">
                <router-link :to="`/discuss/edit/${id}`" class="ui blue right ribbon label"
                             v-if="thread_head.user_id + '' === owner">
                    Edit
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
<script>
import markdownIt from "../../lib/markdownIt/markdownIt";
import avatarMixin from "../../mixin/avatarMixin";
export default {
    name: "MainContent",
    mixins: [avatarMixin],
    props: {
        thread_head: {
            type: Object,
            default: () => {
                return {};
            }
        },
        content: {
            type: Boolean,
            default: false
        },
        owner: {
            type: String,
            default: ""
        },
        id: {
            type: String,
            default: ""
        }
    },
    data () {
        return {
            markdownIt
        };
    },
    methods: {
        readTime: function (content) {
            const doc = document.createElement("div");
            doc.innerHTML = content;
            return parseInt(Math.ceil(doc.innerText.length / 300) ** 1.41428579532);
        }
    }
};
</script>

<style scoped>
    .full.segment {
        height: 100%;
    }

    .black {
        color: black;
    }
</style>
