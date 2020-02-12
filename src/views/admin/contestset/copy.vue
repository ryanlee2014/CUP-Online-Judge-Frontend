<template>
    <contest-set-editor @postData="add"></contest-set-editor>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import InitMixin from "../../../mixin/init";
import ContestSetEditMixin from "@/mixin/ContestSetEditMixin";
import ContestSetEditor from "@/components/contestset/manage/editor.vue";

@Component({
    components: {
        ContestSetEditor
    }
})
export default class ContestSetCopy extends Mixins(InitMixin, ContestSetEditMixin) {

}
</script>

<style scoped>

</style>
