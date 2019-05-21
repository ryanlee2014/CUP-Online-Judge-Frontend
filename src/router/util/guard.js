import store from "../../store";
import Vue from "vue";
function getSelfInfo() {
    return Vue.axios.get("/api/user/self");
}

function checkAdmin(to, admin, next) {
    const meta = to.meta;
    if(meta.admin) {
        if(admin) {
            next();
        }
        else {
            getSelfInfo().then(({data}) => {
                if (data.data && data.data.user_id) {
                    store.commit("setUserData", data.data);
                    store.commit("loginMutate", {login: true});
                    if (data.data.admin) {
                        next();
                    }
                    else {
                        next({
                            path: '/'
                        })
                    }
                }
                else {
                    next({
                        path: '/login',
                        query: {
                            redirect: to.fullPath
                        }
                    })
                }
            })
        }
    }
    else if(!meta.admin) {
        next();
    }
}

function getLoginInfo(to, next) {
    getSelfInfo().then(response => {
        if (response.data.data && response.data.data.user_id) {
            store.commit("loginMutate", {login: true});
            sessionStorage.isLogined = true;
            checkAdmin(to, store.getters.admin, next);
        } else {
            next({
                path: '/login',
                query: {
                    redirect: to.fullPath
                }
            })
        }
    });
}
export default function (to, from, next) {
    if (to.meta.auth) {
        if (store.getters.logined) {
            checkAdmin(to, store.getters.admin, next);
        } else if (sessionStorage.isLogined === "true") {
            store.commit("loginMutate", {login: true});
            checkAdmin(to, store.getters.admin, next);
        } else {
            getLoginInfo(to, next);
        }
    } else {
        next();
    }
}
