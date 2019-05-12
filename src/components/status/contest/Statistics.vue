<template>
    <div>
        <h3 class="ui dividing header">
            Result Statistics
        </h3>
        <div class="table-scroll">
            <table class="ui padded selectable unstackable table" style="text-align:center" v-if="finish" width="90%">
                <thead v-cloak>
                <th>Problem</th>
                <th :key="key" v-for="(i,key) in statistics.total_result"><a :href="'status.php?cid='+cid+'&jresult='+i" target="_blank">{{statistics.status[i]}}</a>
                </th>
                <th>Total</th>
                </thead>
                <tbody>
                <tr :key="i" v-for="i in Array.from(Array(statistics.total_problem + 1).keys())">
                    <td><a :href="'status.php?cid='+cid+'&problem_id='+(i)" target="_blank">{{(1001 + i)}}</a></td>
                    <td :key="key" :class="row>0?'active positive':''" v-for="(row,key) in statistics.stat_data[i]"><a
                            :href="'status.php?cid='+cid+'&problem_id='+(i)+'&jresult='+key">{{row}}</a></td>
                    <td>{{statistics.totalSumResult[i]}}</td>
                </tr>
                <tr>
                    <td><a :href="'status.php?cid='+cid" target="_blank">Total</a></td>
                    <td :key="key" :class="row > 0?'active positive':''" v-for="(row,key) in statistics.stat_sum">
                        <a :href="'status.php?cid='+cid+'&jresult='+key" target="_blank">{{row}}</a>
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
                <th :key="key" v-for="(i,key) in statistics.used_lang"><a :href="'status.php?cid='+cid+'&language='+i" target="_blank">{{language_name.local[i]}}</a>
                </th>
                <th>Total</th>
                </thead>
                <tbody>
                <tr :key="i" v-for="i in Array.from(Array(statistics.total_problem + 1).keys())">
                    <td><a :href="'status.php?cid='+cid+'&problem_id='+(1001 + i)" target="_blank">{{(1001 + i)}}</a>
                    </td>
                    <td :key="key" :class="row>0?'active positive':''" v-for="(row,key) in statistics.lang_data[i]"><a
                            :href="'status.php?cid='+cid+'&problem_id='+(1001 + i)+'&language='+key">{{row}}</a></td>
                    <td>{{statistics.totalSumProblem[i]}}</td>
                </tr>
                <tr>
                    <td><a :href="'status.php?cid='+cid" target="_blank">Total</a></td>
                    <td :key="key" :class="row > 0?'active positive':''" v-for="(row,key) in statistics.lang_sum">
                        <a :href="'status.php?cid='+cid+'&language='+key" target="_blank">{{row}}</a>
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
                default: () => {return {}}
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
                default: () => {return {}}
            }
        }
    }
</script>

<style scoped>

</style>
