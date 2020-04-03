import { GetterTree } from "vuex";
import { ISystemState } from "@/store/system/system";
import { IRootState } from "@/store/root";
import store from "@/store";
const getters: GetterTree<ISystemState, IRootState> = {
    contestMode: state => !store.getters.admin && state.contestMode,
    init: state => state.init
};

export default getters;
