<template>
    <base-manager :prefix="prefix"></base-manager>
</template>

<script lang="ts">

import baseManager from "../../../components/admin/config/base-manager.vue";
import InitMixin from "../../../mixin/init";
import { Component, Mixins } from "vue-property-decorator";
@Component({
    components: {
        baseManager: baseManager
    }
})
export default class ConfigManager extends Mixins(InitMixin) {
    prefix = "config";
}
</script>

<style scoped>

</style>
