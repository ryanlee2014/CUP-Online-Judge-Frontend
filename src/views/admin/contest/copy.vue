<template>
    <contest-editor :contestInfo="data" :externalUserListText="userListText" @postData="edit"></contest-editor>
</template>

<script>
import mixins from "../../../mixin/init";
import contestEditMixin from "../../../mixin/contestEditMixin";
import ContestEditor from "../../../components/contest/manage/edit";
export default {
    name: "copy",
    mixins: [mixins, contestEditMixin],
    components: {
        ContestEditor
    },
    data () {
        return {};
    },
    mounted () {

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
