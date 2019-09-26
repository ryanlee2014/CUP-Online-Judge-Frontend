<template>
    <base-manager :prefix="prefix" :range="range"></base-manager>
</template>

<script>

import baseManager from "../../../components/admin/config/base-manager";
export default {
    name: "switch-manager",
    data () {
        return {
            prefix: "switch",
            range: "(范围:0-100)"
        };
    },
    components: {
        baseManager
    }
};
</script>

<style scoped>

</style>
