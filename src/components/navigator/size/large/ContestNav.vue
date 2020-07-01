<template>
    <navigator-component :connected="connected" :judger="judger" :logined="logined" :nick="nick" :user="user">
        <template v-slot:content>
            <router-link :to="`/contest/${contest_id}`" class="item" exact-active-class="active">{{$t("contest problem")}}</router-link>
            <router-link :to="`/contest/status/${contest_id}`" class="item" exact-active-class="active">{{$t("contest history")}}
            </router-link>
            <router-link :to="`/contest/rank/${contest_id}`" class="item" exact-active-class="active">{{$t("contest ranklist")}}</router-link>
            <router-link v-if="hasPrivilege" :to="`/contest/edit/${contest_id}`" class="item" exact-active-class="active">{{$t("edit contest")}}</router-link>
        </template>
    </navigator-component>
</template>
<i18n>
    {
        "zh-cn": {
            "contest problem": "竞赛问题",
            "contest history": "竞赛提交历史"
        },
        "en": {
            "contest problem": "Contest ProblemSet",
            "contest history": "Contest Submit History"
        },
        "ja": {
            "contest problem": "コンテスト問題セット",
            "contest history": "コンテスト提出記録"
        }
    }
</i18n>
<script lang="ts">
import SocketMenu from "../../components/SocketMenu.vue";
import { mapGetters } from "vuex";
import { Component, Mixins, Prop } from "vue-property-decorator";
import Vue from "vue";
import { isContestAssistant } from "@/util/util";
import NavigatorComponent from "@/components/navigator/size/large/common/NavigatorComponent.vue";
import MenuMixin from "@/mixin/menu/MenuMixin";

@Component({
    components: {
        NavigatorComponent,
        SocketMenu: SocketMenu
    },
    computed: {
        ...mapGetters(["contest_maker", "contest_manager", "admin"])
    }
})
export default class ContestNav extends Mixins(MenuMixin) {
    get hasPrivilege () {
        const contestId = this.contest_id;
        return !!(this.contest_maker[`m${contestId}`] || this.contest_manager || this.admin || this.contest_assistant);
    }

    contest_maker: any;
    contest_manager: any;
    contest_assistant: boolean = false;
    admin: any;

    mounted () {
        isContestAssistant(this.contest_id).then(e => { this.contest_assistant = e; });
    }

    contest_id = "";
    created () {
        this.contest_id = this.$route.params.contest_id;
    }
}
</script>

<style scoped>
    .ui.container {
        width: 95%!important
    }
</style>
