<template>
    <div class="ui container padding">
        <div class="ui large warning message">
            <div class="header">
                {{$t("no privilege to access")}}
            </div>
            {{$t("you cannot access to this page")}}
        </div>
    </div>
</template>

<script lang="ts">
import mixins from "../../mixin/init";
import { Mixins, Component } from "vue-property-decorator";

@Component
export default class NoPrivilege extends Mixins(mixins) {

}
</script>

<style scoped>

</style>
