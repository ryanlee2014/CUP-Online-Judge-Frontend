<template>
    <contest-editor :contestInfo="data" :externalUserListText="userListText" :externalProblemSelected="problemSelected" @postData="add"></contest-editor>
</template>

<script lang="ts">
import mixins from "../../../mixin/init";
import contestEditMixin from "../../../mixin/contestEditMixin";
import ContestEditor from "../../../components/contest/manage/edit.vue";
import { Component, Mixins } from "vue-property-decorator";
@Component({
    components: {
        ContestEditor
    }
})
export default class ContestCopy extends Mixins(mixins, contestEditMixin) {
    edit (val: any) {
        console.log("get", val);
    }
    add (val: any) {
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
</script>

<style scoped>

</style>
