<template>
    <rank-view :cid="cid"></rank-view>
</template>

<script lang="ts">

import { Component, Mixins } from "vue-property-decorator";
import RankView from "@/components/contest/ContestRank/RankView.vue";
import InitMixin from "@/mixin/init";
@Component({
    components: { RankView }
})
export default class ContestRank extends Mixins(InitMixin) {
        cid = "";
        created () {
            this.cid = this.$route.params.contest_id;
        }
}
</script>

<style scoped>
</style>
