import { IRouterInfo } from "@/store/routeInfo/routerInfo";
import { IRootState } from "@/store/root";
import { GetterTree } from "vuex";

const getters: GetterTree<IRouterInfo, IRootState> = {
    path: state => state.path,
    fullPath: state => state.fullPath,
    homepage: state => state.homepage
};

export default getters;
