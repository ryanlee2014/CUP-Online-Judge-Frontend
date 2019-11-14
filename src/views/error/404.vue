<template>
    <div class="ui container padding">
        <img class="ui center aligned medium rounded image" src="/img/maji.jpg" style="margin:auto">
        <h2 class="ui block header center aligned">{{$t("majiyabakune")}}</h2>
        <div class="ui large warning message">
            <div class="header">
                Error Code:404
            </div>
            {{$t("404statement")}}
        </div>
    </div>
</template>

<script lang="ts">
import mixins from "../../mixin/init";
import { Mixins, Component } from "vue-property-decorator";

@Component
export default class PageNotFound extends Mixins(mixins) {

}
</script>

<style scoped>

</style>
