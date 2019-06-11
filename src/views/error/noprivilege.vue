<template>
    <div class="ui container padding">
        <div class="ui large warning message">
            <div class="header">
                无权访问
            </div>
            您不能访问本页面
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
