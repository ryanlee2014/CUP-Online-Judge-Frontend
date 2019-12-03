<template>
    <div class="ui container padding">
        <div class="ui grid">
            <div class="row">
                <div class="eight wide column">
                    <table class="ui celled padded selectable table">
                        <thead>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        </thead>
                    </table>
                </div>
                <div class="eight wide column"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import InitMixin from "../../mixin/init";
import { Mixins, Component } from "vue-property-decorator";
@Component
export default class ContestPlagiarism extends Mixins(InitMixin) {
}
</script>

<style scoped>

</style>
