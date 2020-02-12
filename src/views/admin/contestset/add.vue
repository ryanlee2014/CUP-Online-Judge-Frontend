<template>
    <ContestSetEditor @postData="add"></ContestSetEditor>
</template>

<script lang="ts">

import { Component, Mixins } from "vue-property-decorator";
import InitMixin from "../../../mixin/init";
import ContestSetEditor from "@/components/contestset/manage/editor.vue";
import ContestSetEditMixin from "@/mixin/ContestSetEditMixin";

@Component({
    components: {
        ContestSetEditor
    }
})
export default class ContestSetAdd extends Mixins(InitMixin, ContestSetEditMixin) {

}
</script>

<style scoped>

</style>
