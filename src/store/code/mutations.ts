import { MutationTree } from "vuex";
import { ICodeState } from "@/store/code/code";

const mutations: MutationTree<ICodeState> = {
    setCodeInfo (state, payload) {
        Object.assign(state, payload);
    }
};

export default mutations;
