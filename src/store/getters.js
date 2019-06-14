import { notUndefinedOrNull } from "./util/index";

const getters = {
    logined: state => !!state.userInfo.logined,
    user_id: state => state.userInfo.userInfo.user_id,
    nick: state => state.userInfo.userInfo.nick,
    avatar: state => !!state.userInfo.userInfo.avatar,
    getAvatarURL: state => {
        const hasAvatar = !!state.userInfo.userInfo.avatar;
        const avatarUrl = state.userInfo.userInfo.avatarUrl;
        const userId = state.userInfo.userInfo.user_id;
        if (hasAvatar && notUndefinedOrNull(avatarUrl) && avatarUrl.length === 0) {
            return `/avatar/${userId}.jpg`;
        }
        else if (!notUndefinedOrNull(avatarUrl) && avatarUrl.length > 0) {
            return avatarUrl;
        }
        else {
            return "/image/default-user.png";
        }
    },
    avatarUrl: state => notUndefinedOrNull(state.userInfo.userInfo.avatarUrl) ? state.userInfo.userInfo.avatarUrl : "",
    admin: state => !!state.userInfo.userInfo.admin,
    token: state => state.userInfo.token,
    onlineUser: state => state.socket.onlineUser,
    path: state => state.routeInfo.path,
    fullPath: state => state.routeInfo.fullPath,
    code: state => state.code.code,
    share: state => state.code.share,
    language: state => state.code.language
};

export default getters;
