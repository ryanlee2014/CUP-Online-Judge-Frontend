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

<script>
import mixins from "../../mixin/init";

export default {
    name: "ban",
    mixins: [mixins]
};
</script>

<style scoped>

</style>
