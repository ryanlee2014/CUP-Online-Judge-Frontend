<template>
    <div class="ui container padding">
        <h2 class="ui dividing header">
            {{$t("contest topic")}} {{contestTopicId}} {{title}}
        </h2>
        <div class="ui grid">
            <div class="row">
                <div class="ui card" style="width: 100%">
                    <div class="content">
                        <div class="header">{{$t("description")}}</div>
                    </div>
                    <div class="content">
                        <div class="ui small feed" v-html="descriptionHtml">
                        </div>
                    </div>
                </div>
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
import dayjs from "dayjs";
import { IContestSetListDTO } from "@/types/topic/TopicContestList";
import MarkdownWorkerMixin from "@/mixin/MarkdownWorkerMixin";
@Component({
    components: {
        ContestView
    }
})
export default class ContestTopicContestView extends Mixins(InitMixin, MarkdownWorkerMixin) {
    contestTopicId: number | string = "";
    contest_list: any[] = [];
    description: string = "";
    descriptionHtml: string = "";
    title: string = "";
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
                this.title = contestTopicDTO.title;
                this.renderRawAsync(this.description).then(result => {
                    this.descriptionHtml = result;
                });
            });
        this.axios.get(`/api/contestset/list/${this.contestTopicId}`)
            .then(({ data }) => {
                const list: IContestSetListDTO[] = data.data;
                list.sort((a, b) => {
                    if (a.start_time === null && b.start_time === null) {
                        return 0;
                    }
                    else if (a.start_time === null) {
                        return 1;
                    }
                    else if (b.start_time === null) {
                        return -1;
                    }
                    else {
                        const dayjsA = dayjs(a.start_time);
                        const dayjsB = dayjs(b.start_time);
                        if (dayjsA.isBefore(dayjsB)) {
                            return -1;
                        }
                        else if (dayjsB.isAfter(dayjsB)) {
                            return 1;
                        }
                        return dayjsA.isBefore(dayjsB) ? -1 : dayjsA.isAfter(dayjsB) ? 1 : 0;
                    }
                });
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
