import axios from 'axios/index'
export default {
    NavStatus ({commit}) {
        axios.get("/api/user/self")
            .then(response => {
                const data = response.data;
                if (data.status === "OK") {
                    commit("setUserData", data.data);
                    commit("loginMutate", {login: true});
                }
            });
    }
}
