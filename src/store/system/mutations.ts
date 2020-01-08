import { ISystemState } from "@/store/system/system";
import { MutationTree } from "vuex";

const mutations: MutationTree<ISystemState> = {
    setContestMode (state, contestMode) {
        state.contestMode = contestMode;
    }
};

export default mutations;
