<template>
    <div class="ui container padding">
        <div class="ui large error message">
            <div class="header">
                {{$t("no privilege to access")}}
            </div>
            {{$t("you have been banned")}}
        </div>
    </div>
</template>

<script lang="ts">
import mixins from "../../mixin/init";
import { Mixins, Component } from "vue-property-decorator";

@Component
export default class Ban extends Mixins(mixins) {

}
</script>

<style scoped>

</style>
