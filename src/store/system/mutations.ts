import { ISystemState } from "@/store/system/system";
import { MutationTree } from "vuex";

const mutations: MutationTree<ISystemState> = {
    setContestMode (state, contestMode) {
        state.contestMode = contestMode;
    },
    setInitState (state, initState) {
        state.init = initState;
    },
    setDarkMode (state, mode) {
        state.darkMode = mode;
    }
};

export default mutations;
