import { GetterTree } from "vuex";
import { IUserInfoState } from "@/store/userInfo/userInfo";
import { IRootState } from "@/store/root";
import { notUndefinedOrNull } from "@/store/util";

const getters: GetterTree<IUserInfoState, IRootState> = {
    logined: state => state.logined,
    user_id: state => state.userInfo.user_id,
    nick: state => state.userInfo.nick,
    avatar: state => state.userInfo.avatar,
    getAvatarURL: state => {
        const hasAvatar = state.userInfo.avatar;
        const avatarUrl = state.userInfo.avatarUrl;
        const userId = state.userInfo.user_id;
        try {
            if (hasAvatar && (!notUndefinedOrNull(avatarUrl) || avatarUrl.length === 0)) {
                return `/avatar/${userId}.jpg`;
            }
            else if (notUndefinedOrNull(avatarUrl) && avatarUrl.length > 0) {
                return avatarUrl;
            }
            else {
                return "/image/default-user.png";
            }
        }
        catch (e) {
            console.log(e);
            console.log("hasAvatar", hasAvatar);
            console.log("avatarUrl", avatarUrl);
            console.log("userId", userId);
            console.log("notUndefinedOrNull", notUndefinedOrNull(avatarUrl));
        }
    },
    avatarUrl: state => notUndefinedOrNull(state.userInfo.avatarUrl) ? state.userInfo.avatarUrl : "",
    admin: state => state.userInfo.admin,
    contest_manager: state => state.userInfo.contest_manager,
    contest_maker: state => !!state.userInfo.contest_maker,
    editor: state => state.userInfo.editor,
    token: state => state.token
};

export default getters;
