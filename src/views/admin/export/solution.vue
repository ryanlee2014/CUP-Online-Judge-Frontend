<template>
    <div class="ui container padding">
        <h2 class="ui dividing header">{{$t("export solution")}}</h2>
        <div class="ui positive message">
            <div class="header">提示</div>
            页面建设中
        </div>
        <div class="ui form">
            <div class="field"></div>
        </div>
    </div>
</template>

<script lang="ts">
import InitMixin from "@/mixin/init";
import { Mixins } from "vue-property-decorator";

export default class SolutionExport extends Mixins(InitMixin) {

}
</script>

<style scoped>

</style>
