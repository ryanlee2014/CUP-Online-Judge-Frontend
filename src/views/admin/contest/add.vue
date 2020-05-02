<template>
    <contest-editor @postData="add"></contest-editor>
</template>

<script lang="ts">
import mixins from "../../../mixin/init";
import ContestAddMixin from "../../../mixin/contestAddMixin";
import ContestEditor from "../../../components/contest/manage/edit.vue";
import { Component, Mixins } from "vue-property-decorator";

@Component({
    components: {
        ContestEditor
    }
})
export default class ContestAdd extends Mixins(mixins, ContestAddMixin) {
}
</script>

<style scoped>

</style>
