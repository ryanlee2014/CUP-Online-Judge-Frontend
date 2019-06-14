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

<script>
import mixins from "../../mixin/init";

export default {
    name: "404",
    mixins: [mixins]
};
</script>

<style scoped>

</style>
