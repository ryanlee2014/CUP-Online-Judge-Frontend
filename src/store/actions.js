import axios from 'axios'
export default {
    NavStatus ({commit}) {
        axios.get("/api/user/self")
            .then(response => {
                const data = response.data;
                console.log(data);
                if (data.status === "OK") {
                    commit("setUserData", data.data);
                }
            });
    }
}
