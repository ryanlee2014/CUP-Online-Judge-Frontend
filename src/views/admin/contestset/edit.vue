<template>
    <contest-set-editor @postData="edit" :contest-set-info="contestSetEditInfo"></contest-set-editor>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import InitMixin from "../../../mixin/init";
import ContestSetEditMixin from "../../../mixin/ContestSetEditMixin";
import ContestSetEditor from "../../../components/contestset/manage/editor.vue";
import { IContestSetRequestDTO } from "@/types/contestset";
@Component({
    components: {
        ContestSetEditor
    }
})
export default class ContestSetEdit extends Mixins(InitMixin, ContestSetEditMixin) {
    edit (payload: IContestSetRequestDTO) {
        this.axios.post("/api/admin/contestset/edit", payload)
            .then(({ data }) => {
                alert("修改成功");
            })
            .catch(reason => {
                alert("修改失败, 错误信息将在Console输出");
                console.error(reason);
            });
    }
}
</script>

<style scoped>

</style>
