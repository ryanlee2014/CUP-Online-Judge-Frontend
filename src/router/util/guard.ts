import store from "@/store";
import Vue from "vue";
import MiddlewareAdapter from "./middlewareAdapter";
import platfrom from "../middleware/environmentCollector";
import { NavigationGuard, Route } from "vue-router/types/router";
function getSelfInfo () {
    return Vue.axios.get("/api/user/self");
}

type NextFunction = (...arg: any[]) => any;

function errorHandler (next: NextFunction, to: Route) {
    return function (reason: any) {
        if (reason.data.statement === "not login") {
            return next({
                path: "/login",
                query: {
                    redirect: to.fullPath
                }
            });
        }
        else {
            console.error("Undefined error: ", reason);
        }
    };
}

function checkAdmin (to: Route, admin: boolean, next: NextFunction) {
    const meta = to.meta;
    if (meta.admin && admin) {
        return next();
    }
    else {
        getSelfInfo().then(({ data }) => {
            if (data.data && data.data.user_id) {
                store.commit("setUserData", data.data);
                store.commit("setContestMode", data.data.contest_mode);
                store.commit("loginMutate", { login: true });
            }
            else {
                return next({
                    path: "/login",
                    query: {
                        redirect: to.fullPath
                    }
                });
            }

            if (store.getters.admin) {
                return next();
            }

            let needPrivilege = false;
            for (const key in meta) {
                if (!Object.prototype.hasOwnProperty.call(meta, key)) {
                    continue;
                }
                needPrivilege = (needPrivilege || key !== "auth");

                if (meta[key] && store.getters[key]) {
                    needPrivilege = false;
                    return next();
                }
            }

            if (meta.checkPrivilege && typeof meta.checkPrivilege === "function") {
                meta.checkPrivilege(to).then(() => next()).catch(() => {
                    return next({
                        path: "/forbidden/privilege"
                    });
                });
            }
            else if (needPrivilege) {
                return next({
                    path: "/forbidden/privilege"
                });
            }
            else {
                return next();
            }
        }).catch(errorHandler(next, to));
    }
}

function getLoginInfo (to: Route, next: NextFunction) {
    getSelfInfo().then(response => {
        if (response.data.data && response.data.data.user_id) {
            store.commit("loginMutate", { login: true });
            store.commit("setUserData", response.data.data);
            sessionStorage.isLogined = true;
            checkAdmin(to, store.getters.admin, next);
        }
        else {
            return next({
                path: "/login",
                query: {
                    redirect: to.fullPath
                }
            });
        }
    }).catch(errorHandler(next, to));
}

const Guard = function (to: Route, from: Route, next: NextFunction) {
    const middlewareAdapter = new MiddlewareAdapter();
    middlewareAdapter.setFrom(from);
    middlewareAdapter.setTo(to);
    middlewareAdapter.setNext(next);
    middlewareAdapter.add(platfrom);
    next = middlewareAdapter.getNextFn();
    if (to.meta.auth) {
        if (store.getters.logined) {
            checkAdmin(to, store.getters.admin, next);
        }
        else if (sessionStorage.isLogined === "true") {
            store.commit("loginMutate", { login: true });
            checkAdmin(to, store.getters.admin, next);
        }
        else {
            getLoginInfo(to, next);
        }
    }
    else if (to.meta.auth === false) {
        if (to.meta.init === true && !store.getters.init) {
            return next();
        }
        else if (to.meta.init === true) {
            return next({
                path: "/"
            });
        }
        else if (store.getters.logined) {
            return next({
                path: `/user/${store.getters.user_id}`
            });
        }
        else {
            return next();
        }
    }
    else {
        return next();
    }
};

const navigationGuard: NavigationGuard = function (to, from, next) {
    return Guard(to, from, next);
};

export default navigationGuard;
