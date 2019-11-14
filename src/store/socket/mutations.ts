import { ISocketState } from "@/store/socket/socket";
import { MutationTree } from "vuex";

const mutations: MutationTree<ISocketState> = {
    setOnlineUser (state, { onlineUser }) {
        if (onlineUser && onlineUser.length) {
            state.onlineUser = onlineUser;
        }
    }
};

export default mutations;
