export default {
    loginMutate(state, {login}) {
        state.logined = login;
    },
    setUserData(state, payload) {
        state.userInfo.user_id = payload.user_id;
        state.userInfo.nick = payload.nick;
        state.userInfo.avatar = !!payload.avatar;
        state.userInfo.admin = !!payload.admin;
    }
}
