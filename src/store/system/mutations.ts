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
    },
    setLanguageServerUrl (state, languageServerUrl) {
        state.languageServerUrl = languageServerUrl;
        localStorage.setItem("languageServerUrl", languageServerUrl);
    }
};

export default mutations;
