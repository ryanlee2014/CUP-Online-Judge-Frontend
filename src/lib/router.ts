import store from "../store";
import { NavigationGuard } from "vue-router/types/router";

interface INavigationGuardAdaptor {
    adminAuth: NavigationGuard
}

export default {
    adminAuth: function(to, from, next) {
        if (store.getters.admin) {
            next();
        }
    }
} as INavigationGuardAdaptor;
