import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component
export class ContestShowSimMixin extends Vue {
    showSim = false;
    initContestConfig (contestId: string | number) {
        this.axios.get(`/api/contest/config/${contestId}`)
            .then(({ data }) => {
                this.showSim = data.data.showSim;
            });
    }
}
