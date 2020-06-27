import { AxiosRequestConfig, AxiosResponse, AxiosStatic } from "axios";
declare module "axios" {
    interface AxiosStatic {
        cacheGet<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
        noCacheGet<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
    }
}
