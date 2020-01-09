import axios from "axios";
import router from "../../router";

export default function () {
    axios.interceptors.response.use(response => {
        const { data } = response;
        if (data.status === "error") {
            if (data.contest_mode === true) {
                router.replace({
                    path: "/forbidden/contest_mode"
                });
            }
            else if (data.statement.ban === true) {
                router.replace({
                    path: "/ban"
                });
            }
            return Promise.reject(response);
        }
        else if (data.rule === -1) {
            router.replace({
                path: "/unavailable"
            });
            return Promise.reject(response);
        }
        else {
            return Promise.resolve(response);
        }
    });
}
