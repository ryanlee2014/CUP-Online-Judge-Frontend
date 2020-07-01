<template>
    <rank-view :cid="cid"></rank-view>
</template>

<script lang="ts">

import { Component, Mixins } from "vue-property-decorator";
import RankView from "@/components/contest/ContestRank/RankView.vue";
import InitMixin from "@/mixin/init";
import { TopicItem } from "@/types/topic/TopicItem";
@Component({
    components: { RankView }
})
export default class TopicRank extends Mixins(InitMixin) {
        cid = "";
        tid = "";
        created () {
            const tid = this.tid = this.$route.params.contestSetId;
            this.axios.get(`/api/contestset/list/${tid}`)
                .then(({ data }) => {
                    this.cid = (data.data as TopicItem[]).map(e => e.contest_id).join(",");
                });
        }
}
</script>

<style scoped>

</style>
