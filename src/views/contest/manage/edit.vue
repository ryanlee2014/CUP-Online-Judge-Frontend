<template>
    <contest-editor :contestInfo="data" :externalProblemSelected="problemSelected" :externalUserListText="userListText"
                    @postData="edit"></contest-editor>
</template>

<script>
import mixins from "../../../mixin/init";
import contestEditMixin from "../../../mixin/contestEditMixin";
import ContestEditor from "../../../components/contest/manage/edit";
import Middleware from "../../../module/Middleware/core";

const _ = require("lodash");
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
            val = this.dataFormat(val);
            this.axios.post("/api/admin/contest/edit", val)
                .then(({ data }) => {
                    if (data.status === "OK") {
                        alert(this.$t("success"));
                    }
                    else {
                        alert(this.$t("error"));
                    }
                });
        }
    }
};
</script>

<style scoped>

</style>
