<template>
    <div class="ui container">
        <h2 class="ui dividing header">Global Setting</h2>
        <div class="ui grid">
            <div class="row">
                <div class="ui form">
                    <div class="field">
                        <div class="two fields">
                            <div class="field">
                                <div class='ui toggle checkbox'>
                                    <input type='checkbox'>
                                    <label>{{$t("contest mode")}}</label>
                                </div>
                            </div>
                            <div class="field">
                                <div class='ui toggle checkbox'>
                                    <input type='checkbox'>
                                    <label>关闭访问</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import mixins from "../../mixin/init";
import { Component, Mixins } from "vue-property-decorator";
@Component
export default class GlobalSetting extends Mixins(mixins) {
}
</script>

<style scoped>

</style>
