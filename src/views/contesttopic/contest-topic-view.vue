<template>
    <div class="ui padding container">
        <h2 class="ui dividing header">
            Contest Topic
        </h2>
        <table class="ui padded celled unstackable selectable table">
            <thead>
                <tr>
                    <th width="55%">
                        {{$t("title")}}
                    </th>
                    <th width="25%">
                        {{$t("creator")}}
                    </th>
                    <th width="20%">
                        {{$t("create time")}}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in contestTopicList" :key="row.contestset_id">
                    <td>
                        <router-link :to="`/topic/${row.contestset_id}/`">
                            {{row.title}}
                        </router-link>
                    </td>
                    <td>
                        <router-link :to="`/user/${row.creator}`">
                            {{row.creator}}
                        </router-link>
                    </td>
                    <td>{{dayjs(row.create_time).format("YYYY-MM-DD HH:mm:ss")}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import InitMixin from "@/mixin/init";
import { IContestSetResponseDTO } from "@/types/contestset";
import dayjs from "dayjs";

@Component
export default class ContestTopicView extends Mixins(InitMixin) {
    dayjs = dayjs;
    contestTopicList: IContestSetResponseDTO[] = [];
    currentPage = 0;

    mounted () {
        this.initData();
    }

    initData () {
        this.axios.get("/api/contestset/set", {
            params: {
                page: this.currentPage
            }
        })
            .then(({ data }) => {
                this.contestTopicList = data.data;
            });
    }
}
</script>

<style scoped>

</style>
