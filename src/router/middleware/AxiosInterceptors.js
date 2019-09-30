import axios from "axios";
import router from "../../router";

export default function () {
    axios.interceptors.response.use(response => {
        const { data } = response;
        if (data.status === "error" && data.statement.ban === true) {
            router.replace({
                path: "/ban"
            });
            return Promise.reject(response);
        }
        else if (data.rule === -1) {
            router.replace({
                path: "/unavailable"
            });
        }
        else {
            return Promise.resolve(response);
        }
    });
}
