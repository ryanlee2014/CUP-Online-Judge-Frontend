<template>
    <div>
        <h3 class="ui dividing header">
            Result Statistics
        </h3>
        <div class="table-scroll">
            <table class="ui padded selectable unstackable table" style="text-align:center" v-if="finish" width="90%">
                <thead v-cloak>
                <th>Problem</th>
                <th :key="key" v-for="(i,key) in statistics.total_result">
                    <router-link :to="`/contest/status/${cid}?jresult=${i}`">{{statistics.status[i]}}</router-link>
                </th>
                <th>Total</th>
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
            Submit Language Statistics
        </h3>
        <div class="table-scroll">
            <table class="ui padded selectable unstackable table" style="text-align:center" v-if="finish" width="90%">
                <thead v-cloak>
                <th>Problem</th>
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

<script>
export default {
    name: "Statistics",
    props: {
        statistics: {
            type: Object,
            default: () => { return {}; }
        },
        cid: {
            type: Number,
            default: 0
        },
        finish: {
            type: Boolean,
            default: false
        },
        language_name: {
            type: Object,
            default: () => { return {}; }
        }
    }
};
</script>

<style scoped>

</style>
