<template>
    <div class="ui container padding">
        <init-config @configUpdated="updateStatus" v-if="status === 1"></init-config>
        <init-admin v-if="status === 2"></init-admin>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import InitMixin from "../../mixin/init";
import InitConfig from "@/components/init/init-config.vue";
import InitAdmin from "@/components/init/init-admin.vue";

@Component({
    components: { InitAdmin, InitConfig }
})
export default class Init extends Mixins(InitMixin) {
    status = 1;
    updateStatus () {
        this.status = 2;
    }
}
</script>

<style scoped>

</style>
