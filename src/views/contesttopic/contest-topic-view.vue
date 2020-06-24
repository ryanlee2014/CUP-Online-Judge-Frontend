<template>
    <div class="ui padding container">
        <h2 class="ui dividing header">
            {{$t("contest topic")}}
        </h2>
        <table class="ui padded borderless unstackable selectable table">
            <thead>
                <tr>
                    <th>
                        {{$t("title")}}
                    </th>
                    <th v-if="admin" width="7%">
                        {{$t("visible")}}
                    </th>
                    <th v-if="admin" width="7%">
                        {{$t("enable")}}
                    </th>
                    <th width="15%">
                        {{$t("creator")}}
                    </th>
                    <th width="20%">
                        {{$t("create time")}}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in contestTopicList" :key="row.contestset_id" :class="isVisible(row)">
                    <td>
                        <router-link :to="`/topic/${row.contestset_id}/`">
                            {{row.title}}
                        </router-link>
                    </td>
                    <td v-if="admin">
                        {{ row.visible ? $t("visible") : $t("hide") }}
                    </td>
                    <td v-if="admin">
                        {{ row.defunct === "N" ? $t("enable") : $t("disable") }}
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
import { mapGetters } from "vuex";

@Component({
    computed: {
        ...mapGetters(["admin"])
    },
    i18n: {
        messages: {
            "zh-cn": {
                visible: "可见",
                hide: "隐藏",
                enable: "启用",
                disable: "停用"
            },
            en: {
                visible: "Visible",
                hide: "Invisible",
                enable: "Enabled",
                disable: "Disabled"
            },
            ja: {
                visible: "見える",
                hide: "隠れる",
                enable: "有効",
                disable: "無効"
            }
        }
    }
})
export default class ContestTopicView extends Mixins(InitMixin) {
    dayjs = dayjs;
    contestTopicList: IContestSetResponseDTO[] = [];
    currentPage = 0;

    mounted () {
        this.initData();
    }

    isVisible (row: any) {
        return !row.visible ? "active" : "";
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
