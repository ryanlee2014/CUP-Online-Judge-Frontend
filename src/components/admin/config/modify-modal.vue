<template>
    <div class="ui modal" ref="modal">
        <div class="header">Header</div>
        <div class="content">
            <p></p>
            <p></p>
            <p></p>
        </div>
    </div>
</template>

<script>
import mixins from "../../../mixin/init";

const $ = require("jquery");
export default {
    name: "modify-modal",
    mixins: [mixins],
    methods: {
        activate () {
            $(this.$refs.modal).modal("show");
        }
    }
};
</script>

<style scoped>

</style>
