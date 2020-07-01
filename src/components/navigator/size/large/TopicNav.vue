<template>
    <navigator-component :connected="connected" :judger="judger" :logined="logined" :nick="nick" :user="user">
        <template v-slot:content>
            <router-link :to="`/topic/${contestSetId}`" class="item" exact-active-class="active">{{$t("topic worklist")}}</router-link>
            <router-link :to="`/topic/rank/${contestSetId}`" class="item" exact-active-class="active">{{$t("topic ranklist")}}</router-link>
        </template>
    </navigator-component>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import NavigatorComponent from "./common/NavigatorComponent.vue";
import MenuMixin from "../../../../mixin/menu/MenuMixin";
@Component({
    components: { NavigatorComponent },
    i18n: {
        messages: {
            "zh-cn": {
                "topic ranklist": "专题排名",
                "topic worklist": "专题作业列表"
            },
            en: {
                "topic ranklist": "Topic Ranklist",
                "topic worklist": "Topic Worklist"
            },
            ja: {
                "topic ranklist": "トピックランキング",
                "topic worklist": "トピックワークリスト"
            }
        }
    }
})
export default class TopicNav extends Mixins(MenuMixin) {
    contestSetId = "";
    created () {
        this.contestSetId = this.$route.params.contestSetId;
    }
}
</script>

<style scoped>

</style>
