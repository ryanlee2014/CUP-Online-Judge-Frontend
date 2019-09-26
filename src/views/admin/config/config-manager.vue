<template>
    <base-manager :prefix="prefix"></base-manager>
</template>

<script>

import baseManager from "../../../components/admin/config/base-manager";
export default {
    name: "config-manager",
    data () {
        return {
            prefix: "config"
        };
    },
    components: {
        baseManager
    }
};
</script>

<style scoped>

</style>
