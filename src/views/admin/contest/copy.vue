<template>
    <contest-editor :contestInfo="data" :externalUserListText="userListText" :externalProblemSelected="problemSelected" @postData="edit"></contest-editor>
</template>

<script lang="ts">
import mixins from "../../../mixin/init";
import contestEditMixin from "../../../mixin/contestEditMixin";
import ContestEditor from "../../../components/contest/manage/edit.vue";
import { Component, Mixins } from "vue-property-decorator";
@Component({
    components: {
        ContestEditor
    }
})
export default class ContestCopy extends Mixins(mixins, contestEditMixin) {
    edit (val: any) {
        console.log("get", val);
    }
}
</script>

<style scoped>

</style>
