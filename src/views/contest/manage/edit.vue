<template>
    <contest-editor :contestInfo="data" :externalProblemSelected="problemSelected" :externalUserListText="userListText"
                    @postData="edit"></contest-editor>
</template>

<script lang="ts">
import mixins from "../../../mixin/init";
import contestAddMixin from "../../../mixin/contestAddMixin";
import ContestEditor from "../../../components/contest/manage/edit.vue";
import { Mixins, Component } from "vue-property-decorator";
@Component({
    components: {
        ContestEditor: ContestEditor
    }
})
export default class ContestEdit extends Mixins(mixins, contestAddMixin) {
    edit (val: any) {
        val = this.dataFormat(val);
        this.axios.post("/api/admin/contest/edit", val)
            .then(({ data }) => {
                if (data.status === "OK") {
                    alert(this.$t("success"));
                }
                else {
                    alert(this.$t("error"));
                }
            })
            .catch(reason => {
                alert(this.$t("error"));
            });
    }
}
</script>

<style scoped>

</style>
