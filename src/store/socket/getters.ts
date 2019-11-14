import { GetterTree } from "vuex";
import { ISocketState } from "@/store/socket/socket";
import { IRootState } from "@/store/root";

const getters: GetterTree<ISocketState, IRootState> = {
    onlineUser: state => state.onlineUser
};

export default getters;
