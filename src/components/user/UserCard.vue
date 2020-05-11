<template>
    <div class="ui link card">
        <div class="image">
            <router-link :to="`/user/${thread_head.user_id}`">
                <v-gravatar :size="400" style="width: 100%; display: flex" hostname="cn.gravatar.com" :email="thread_head.email"></v-gravatar>
            </router-link>
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
            <div class="description" v-html="biography">
            </div>
        </div>
        <div class="extra content">
<span class="right floated">

</span>
            <span>
<i class="user icon"></i>
{{$t("solved")}} {{thread_head.solved}}
</span>
        </div>
    </div>

</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import avatarMixin from "../../mixin/avatarMixin";
import { IUserCardInfo } from "@/types/user/usercard";
import MarkdownWorkerMixin from "@/mixin/MarkdownWorkerMixin";

@Component
export default class UserCard extends Mixins(avatarMixin, MarkdownWorkerMixin) {
    @Prop({ default: (): IUserCardInfo => { return { biography: "", solved: 0, user_id: "", nick: "", email: "" }; } }) thread_head!: IUserCardInfo;
    biography: string = "";

    @Watch("thread_head")
    async onThreadHeadChanged (val: IUserCardInfo) {
        this.biography = await this.renderRawAsync(val.biography);
    }
}
</script>

<style scoped>

</style>
