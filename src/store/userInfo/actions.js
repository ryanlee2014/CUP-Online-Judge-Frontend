import axios from "axios/index";
function getInfo (commit, tryTime) {
    if (tryTime <= 0) {
        return;
    }
    axios.get("/api/user/self")
        .then(response => {
            const data = response.data;
            if (data.status === "OK") {
                commit("setUserData", data.data);
                commit("loginMutate", { login: true });
            } else {
                getInfo(commit, tryTime - 1);
            }
        });
}
export default {
    NavStatus ({ commit }) {
        getInfo(commit, 3);
    }
};
