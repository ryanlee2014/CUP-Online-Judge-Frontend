<template>
    <contest-edit @postData="add"></contest-edit>
</template>

<script>
import mixins from "../../../mixin/init";
import ContestEditMixin from "../../../mixin/contestEditMixin";
import ContestEdit from "../../../components/contest/manage/edit";
export default {
    name: "add",
    mixins: [mixins, ContestEditMixin],
    components: {
        ContestEdit
    },
    data () {
        return {};
    },
    methods: {
        add (val) {

        }
    }
};
</script>

<style scoped>

</style>
