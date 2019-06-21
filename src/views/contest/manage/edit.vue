<template>
    <contest-editor :contestInfo="data" :externalUserListText="userListText" :externalProblemSelected="problemSelected" @postData="edit"></contest-editor>
</template>

<script>
import mixins from "../../../mixin/init";
import contestEditMixin from "../../../mixin/contestEditMixin";
import ContestEditor from "../../../components/contest/manage/edit";
import Middleware from "../../../module/Middleware/core";
export default {
    name: "edit",
    mixins: [mixins, contestEditMixin],
    components: {
        ContestEditor
    },
    data () {
        return {};
    },
    methods: {
        edit (val) {
            console.log("get", val);
        }
    }
};
</script>

<style scoped>

</style>
