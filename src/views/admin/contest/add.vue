<template>
    <contest-editor @postData="add"></contest-editor>
</template>

<script lang="ts">
import mixins from "../../../mixin/init";
import ContestEditMixin from "../../../mixin/contestEditMixin";
import ContestEditor from "../../../components/contest/manage/edit.vue";
import { Component, Mixins } from "vue-property-decorator";

@Component({
    components: {
        ContestEditor
    }
})
export default class ContestAdd extends Mixins(mixins, ContestEditMixin) {
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
