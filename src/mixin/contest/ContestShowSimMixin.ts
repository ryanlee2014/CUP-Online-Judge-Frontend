import Vue, { defineComponent } from "vue";
import { Component } from "vue-property-decorator";

/**
 * Options-API mixin (Vue 3 compatible). Class components keep using the ContestShowSimMixin class below.
 */
export const contestShowSimMixin = defineComponent({
    data () {
        return {
            showSim: false
        };
    },
    methods: {
        initContestConfig (contestId: string | number): void {
            this.axios.get(`/api/contest/config/${contestId}`)
                .then(({ data }) => {
                    this.showSim = data.data.showSim;
                });
        }
    }
});

@Component({ mixins: [contestShowSimMixin] })
export class ContestShowSimMixin extends Vue {
    showSim!: boolean;
    initContestConfig!: (contestId: string | number) => void;
}
