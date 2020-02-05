import axios from "axios";
import { IUserInfoState } from "@/store/userInfo/userInfo";
import { ActionTree, Commit } from "vuex";
import { IRootState } from "@/store/root";
import store from "@/store";
function getInfo (commit: Commit, tryTime: number) {
    if (tryTime <= 0) {
        return;
    }
    if (store.getters.logined) {
        axios.get("/api/user/self")
            .then(response => {
                const data = response.data;
                if (data.status === "OK") {
                    commit("setUserData", data.data);
                    store.commit("setContestMode", data.data.contest_mode);
                    commit("loginMutate", { login: true });
                }
                else {
                    getInfo(commit, tryTime - 1);
                }
            });
    }
}

const actions: ActionTree<IUserInfoState, IRootState> = {
    NavStatus ({ commit }) {
        getInfo(commit, 3);
    }
};

export default actions;
