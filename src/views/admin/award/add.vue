<template>
    <award-editor @postData="add"></award-editor>
</template>

<script lang="ts">
import InitMixin from "../../../mixin/init";
import RouterBackMixin from "../../../mixin/router/RouterBackMixin";
import { Component, Mixins } from "vue-property-decorator";
import AwardEditor from "../../../components/award/edit.vue";

interface IAwardDTO {
    awardId: number,
    userId: string,
    award: string,
    year: number
}

@Component({
    components: {
        AwardEditor
    }
})
export default class AwardAdd extends Mixins(InitMixin, RouterBackMixin) {
    add (award: IAwardDTO) {
        this.axios.post(`/api/admin/award/add`, award)
            .then(({ data }) => {
                alert(this.$t("success"));
                this.routerBack();
            });
    }
}
</script>

<style scoped>

</style>
