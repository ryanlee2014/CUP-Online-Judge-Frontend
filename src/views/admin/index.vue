<template>
    <div class="ui container">
        <h2 class="ui dividing header">System Management Panel</h2>
        <div class="ui segment">
            <Monitor class="padding"></Monitor>
        </div>
    </div>
</template>

<script lang="ts">
import mixins from "../../mixin/init";
import Monitor from "../../components/admin/monitor.vue";
import { Mixins, Component } from "vue-property-decorator";
@Component({
    components: {
        Monitor: Monitor
    }
})
export default class AdminIndex extends Mixins(mixins) {

}
</script>

<style scoped>

</style>
