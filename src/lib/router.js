import store from '../store'
export default {
    adminAuth: function(to, from, next) {
        if (store.getters.admin) {
            next();
        }
    }
}
