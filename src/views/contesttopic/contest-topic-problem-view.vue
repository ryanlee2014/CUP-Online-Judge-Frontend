<template>
    <div class="ui container padding">
        <h2 class="ui dividing header">
            Contest Topic {{contestTopicId}}
        </h2>
        <div class="ui grid">
            <div class="row">
                <div class="ui top attached segment block header">{{$t("description")}}</div>
                <div class="ui bottom attached segment" v-html="markdownIt.renderRaw(description)"></div>
            </div>
            <div class="row">
                <ContestView :contest_list="contest_list"></ContestView>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import InitMixin from "../../mixin/init";
import ContestView from "@/components/contest/contest-view.vue";
import { IContestSetResponseDTO } from "@/types/contestset";
import markdownIt from "@/lib/markdownIt/markdownIt";
@Component({
    components: {
        ContestView
    }
})
export default class ContestTopicContestView extends Mixins(InitMixin) {
    contestTopicId: number | string = "";
    contest_list: any[] = [];
    description: string = "";
    markdownIt = markdownIt;
    created () {
        this.contestTopicId = this.$route.params.contestSetId;
    }

    mounted () {
        this.initData();
    }

    initData () {
        this.axios.get(`/api/contestset/set/${this.contestTopicId}`)
            .then(({ data }) => {
                const contestTopicDTO: IContestSetResponseDTO = data.data;
                this.description = contestTopicDTO.description;
            });
        this.axios.get(`/api/contestset/list/${this.contestTopicId}`)
            .then(({ data }) => {
                const list: any[] = data.data;
                list.forEach(e => {
                    e.user_id = e.maker;
                });
                this.contest_list = list;
            });
    }
}
</script>

<style scoped>

</style>
