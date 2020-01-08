import { GetterTree } from "vuex";
import { ISystemState } from "@/store/system/system";
import { IRootState } from "@/store/root";
const getters: GetterTree<ISystemState, IRootState> = {
    contestMode: state => state.contestMode
};

export default getters;
