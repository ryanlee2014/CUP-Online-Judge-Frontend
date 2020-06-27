import axios, { AxiosRequestConfig } from "axios";
import router from "@/router";
import store from "@/store";
import UrlParser from "url-parse";
import queryString from "query-string";

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
        else if (data.data && data.data.need_init) {
            store.commit("setInitState", false);
            router.replace({
                path: "/init"
            });
            return Promise.reject(response);
        }
        else {
            return Promise.resolve(response);
        }
    });
    const _get: any = axios.get;
    const cache: {[x: string]: Promise<any>} = {};
    axios.cacheGet = function (url: string, config?: AxiosRequestConfig) {
        if (cache[url]) {
            return cache[url];
        }
        else {
            const response = cache[url] = _get.call(this, url, config);
            return response;
        }
    };

    axios.noCacheGet = function (url: string, config?: AxiosRequestConfig) {
        const parsedUrl = new UrlParser(url, false);
        const parsedObject = queryString.parse(parsedUrl.query as unknown as string);
        parsedObject.timeHash = (Math.random() * 100 * Date.now().valueOf()).toString();
        parsedUrl.set("query", parsedObject);
        return _get.call(this, parsedUrl.toString(), config);
    };
}
