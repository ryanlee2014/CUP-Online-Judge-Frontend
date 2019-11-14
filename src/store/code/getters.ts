import { GetterTree } from "vuex";
import { ICodeState } from "@/store/code/code";
import { IRootState } from "@/store/root";
const getters: GetterTree<ICodeState, IRootState> = {
    code: state => state.code,
    share: state => state.share,
    language: state => state.language
};
export default getters;
