<template>
    <div>
        <h3 class="ui dividing header">
            {{$t("result statistic")}}
        </h3>
        <div class="table-scroll">
            <table class="ui padded selectable unstackable table" style="text-align:center" v-if="finish" width="90%">
                <thead v-cloak>
                <th>{{$t("problem")}}</th>
                <th :key="key" v-for="(i,key) in statistics.total_result">
                    <router-link :to="`/contest/status/${cid}?jresult=${i}`">{{statistics.status[i]}}</router-link>
                </th>
                <th>{{$t("total number")}}</th>
                </thead>
                <tbody>
                <tr :key="i" v-for="i in Array.from(Array(statistics.total_problem + 1).keys())">
                    <td>
                        <router-link :to="`/contest/status/${cid}?problem_id=${i}`">{{(1001 + i)}}</router-link>
                    </td>
                    <td :key="key" :class="row>0?'active positive':''" v-for="(row,key) in statistics.stat_data[i]">
                        <router-link :to="`/contest/status/${cid}?problem_id=${i}&jresult=${key}`">{{row}}</router-link>
                    </td>
                    <td>{{statistics.totalSumResult[i]}}</td>
                </tr>
                <tr>
                    <td>
                        <router-link :to="`/contest/status/${cid}`">Total</router-link>
                    </td>
                    <td :key="key" :class="row > 0?'active positive':''" v-for="(row,key) in statistics.stat_sum">
                        <router-link :to="`/contest/status/${cid}?jresult=${key}`">{{row}}</router-link>
                    </td>
                    <td>{{statistics.total_submit}}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <h3 class="ui dividing header">
            {{$t("submit language statistic")}}
        </h3>
        <div class="table-scroll">
            <table class="ui padded selectable unstackable table" style="text-align:center" v-if="finish" width="90%">
                <thead v-cloak>
                <th>{{$t("problem")}}</th>
                <th :key="key" v-for="(i,key) in statistics.used_lang">
                    <router-link :to="`/contest/status/${cid}?language=${i}`">{{language_name.local[i]}}</router-link>
                </th>
                <th>Total</th>
                </thead>
                <tbody>
                <tr :key="i" v-for="i in Array.from(Array(statistics.total_problem + 1).keys())">
                    <td>
                        <router-link :to="`/contest/status/${cid}?problem_id=${(1001 + i)}`">{{(1001 + i)}}</router-link>
                    </td>
                    <td :key="key" :class="row>0?'active positive':''" v-for="(row,key) in statistics.lang_data[i]">
                        <router-link :to="`/contest/status/${cid}?problem_id=${(1001 + i)}&language=${key}`">{{row}}</router-link>
                    </td>
                    <td>{{statistics.totalSumProblem[i]}}</td>
                </tr>
                <tr>
                    <td>
                        <router-link :to="`/contest/status/${cid}`">Total</router-link>
                    </td>
                    <td :key="key" :class="row > 0?'active positive':''" v-for="(row,key) in statistics.lang_sum">
                        <router-link :to="`/contest/status/${cid}?language=${key}`">{{row}}</router-link>
                    </td>
                    <td>{{statistics.total_submit}}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<i18n>
    {
    "zh-cn": {
    "auto refresh": "自动刷新",
    "show cheat only": "仅显示判重提交",
    "test run invisible": "不显示测试运行",
    "show user only": "仅显示本人提交",
    "submit status": "提交状态",
    "submit graph": "提交图表",
    "result statistic": "结果统计",
    "user statistic": "用户统计",
    "submit language statistic": "语言统计",
    "not selected": "未选择"
    },
    "en": {
    "auto refresh": "Auto Refresh",
    "show cheat only": "Show Cheating Only",
    "test run invisible": "Exclude TestRun Submission",
    "submit status": "Submit Status",
    "show user only": "Show Yourself Only",
    "submit graph": "Submission Graph",
    "result statistic": "Result Statistics",
    "user statistic": "User statistics",
    "submit language statistic": "Submit Language Statistic",
    "not selected": "Not Selected"
    },
    "ja": {
    "auto refresh": "自動リフレッシュ",
    "show cheat only": "チート提出のみを表示",
    "test run invisible": "テスト提出を表示しない",
    "submit status": "提出リスト",
    "show user only": "自分だけを表示",
    "submit graph": "提出グラフ",
    "result statistics": "結果統計",
    "submit language statistic": "言語統計",
    "user statistic": "ユーザー統計",
    "not selected": "選択されていません"
    }
    }
</i18n>
<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";

@Component
export default class Statistics extends Vue {
    @Prop({ default: () => { return {}; } }) statistics!: any;
    @Prop({ default: 0 }) cid!: number;
    @Prop({ default: false }) finish!: boolean;
    @Prop({ default: () => { return {}; } }) language_name!: any;
}
</script>

<style scoped>

</style>
