import { ISystemState } from "@/store/system/system";
import { MutationTree } from "vuex";

const mutations: MutationTree<ISystemState> = {
    setContestMode (state, contestMode) {
        state.contestMode = contestMode;
    },
    setInitState (state, initState) {
        state.init = initState;
    }
};

export default mutations;
