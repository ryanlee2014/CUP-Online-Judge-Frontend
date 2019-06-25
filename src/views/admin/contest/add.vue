<template>
    <contest-editor @postData="add"></contest-editor>
</template>

<script>
import mixins from "../../../mixin/init";
import ContestEditMixin from "../../../mixin/contestEditMixin";
import ContestEditor from "../../../components/contest/manage/edit";
export default {
    name: "add",
    mixins: [mixins, ContestEditMixin],
    components: {
        ContestEditor
    },
    data () {
        return {};
    },
    methods: {
        add (val) {
            val = this.dataFormat(val);
            this.axios.post("/api/admin/contest/add", val)
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
