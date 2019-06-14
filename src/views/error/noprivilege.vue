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

<script>
import mixins from "../../mixin/init";
export default {
    name: "noprivilege",
    mixins: [mixins]
};
</script>

<style scoped>

</style>
