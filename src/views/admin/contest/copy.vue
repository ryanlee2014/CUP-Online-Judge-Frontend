<template>
    <contest-editor :contestInfo="data" :externalUserListText="userListText" :externalProblemSelected="problemSelected" @postData="add"></contest-editor>
</template>

<script lang="ts">
import mixins from "../../../mixin/init";
import contestAddMixin from "../../../mixin/contestAddMixin";
import ContestEditor from "../../../components/contest/manage/edit.vue";
import { Component, Mixins } from "vue-property-decorator";
@Component({
    components: {
        ContestEditor
    }
})
export default class ContestCopy extends Mixins(mixins, contestAddMixin) {
}
</script>

<style scoped>

</style>
