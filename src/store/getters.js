const getters = {
    logined: state => !!state.userInfo.logined,
    user_id: state => state.userInfo.user_id,
    nick: state => state.userInfo.userInfo.nick,
    avatar: state => !!state.userInfo.userInfo.avatar,
    admin: state => !!state.userInfo.userInfo.admin,
    token: state => state.userInfo.token
};

export default getters;
