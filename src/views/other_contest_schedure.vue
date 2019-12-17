<template>
    <div class="ui padding container pusher">

        <!-- Main component for a primary marketing message or call to action -->
        <div id=main>
            <table align=center class="ui padded celled selectable table hidden" width=80%>
                <thead class=toprow>
                <tr>
                    <th class="column-1">OJ</th>
                    <th class="column-2">Name</th>
                    <th class="column-3">Start Time</th>
                    <th class="column-4">Week</th>
                    <th class="column-5">Access</th>
                </tr>
                </thead>
                <tbody class="row-hover">
                <tr :class="idx % 2 === 0 ? 'oddrow' : 'evenrow'" :key="idx" v-for="(row, idx) in json">
                    <td>
                        {{row.oj}}
                    </td>
                    <td>
                        <a href="row.link" target="_blank">
                            {{row.name}}
                        </a>
                    </td>
                    <td>
                        {{row.start_time}}
                    </td>
                    <td>
                        {{row.week}}
                    </td>
                    <td>
                        row.access
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div align=center>DataSource:http://contests.acmicpc.info/contests.json Spider Author:<a
                href="http://contests.acmicpc.info">doraemonok</a></div>

    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import jquery from "jquery";
import InitMixin from "../mixin/init";
const $: any = jquery;
export default class OtherContestSchedure extends Mixins(InitMixin) {
    json: any = {};

    mounted () {
        this.axios.get("/recent_contest.json")
            .then(({ data }) => {
                this.json = data;
            });
        this.axios.get("fresh_contest.php");
    }
}
</script>

<style scoped>

</style>
