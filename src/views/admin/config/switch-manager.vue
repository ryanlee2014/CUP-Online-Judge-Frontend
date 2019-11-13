<template>
    <base-manager :prefix="prefix" :range="range"></base-manager>
</template>

<script>

import baseManager from "../../../components/admin/config/base-manager.vue";
import { Component, Mixins } from "vue-property-decorator";
import InitMixin from "../../../mixin/init";
@Component({
    components: {
        baseManager: baseManager
    }
})
export default class SwitchManager extends Mixins(InitMixin) {
    prefix = "switch";
    range = "(范围:0-100)";
}
</script>

<style scoped>

</style>
