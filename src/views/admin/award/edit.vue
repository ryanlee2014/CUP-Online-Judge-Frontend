<template>
    <award-editor :award-info="awardInfo" @postData="edit"></award-editor>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import AwardEditor from "../../../components/award/edit.vue";
import InitMixin from "@/mixin/init";
import dayjs from "dayjs";
import RouterBackMixin from "@/mixin/router/RouterBackMixin";

interface IAward {
    award_id: number,
    user_id: string,
    award: string,
    year: number
}

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
export default class AwardEdit extends Mixins(InitMixin, RouterBackMixin) {
    awardInfo: IAward = {
        award_id: 0,
        user_id: "",
        award: "",
        year: dayjs().year()
    };

    edit (award: IAwardDTO) {
        this.axios.post(`/api/admin/award/edit/${award.awardId}`, award)
            .then(({ data }) => {
                alert(this.$t("success"));
                this.routerBack();
            });
    }

    mounted () {
        this.axios.get(`/api/admin/award/get/${this.$route.params.award_id}`)
            .then(({ data }) => {
                this.awardInfo = data.data[0];
            });
    }
}
</script>

<style scoped>

</style>
