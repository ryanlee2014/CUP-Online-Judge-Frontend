import { IRouterInfo } from "@/store/routeInfo/routerInfo";
import { MutationTree } from "vuex";

const mutations: MutationTree<IRouterInfo> = {
    setRouteInfo (state, { path, fullPath }) {
        state.path = path;
        state.fullPath = fullPath;
    },
    setHomepage (state, { homepage }) {
        state.homepage = !!homepage;
    }
};

export default mutations;
