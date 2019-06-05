<template>
    <div class="ui container">
        <h2 class="ui dividing header">System Management Panel</h2>
        <div class="ui segment">
            <Monitor class="padding"></Monitor>
        </div>
    </div>
</template>

<script>
import mixins from "../../mixin/init";
import Monitor from "../../components/admin/monitor";
export default {
    name: "index",
    mixins: [mixins],
    components: {
        Monitor
    }
};
</script>

<style scoped>

</style>
