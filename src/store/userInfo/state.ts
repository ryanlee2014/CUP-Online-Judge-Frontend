import { IUserInfoState } from "@/store/userInfo/userInfo";

const states: IUserInfoState = {
    logined: false,
    userInfo: {
        user_id: "",
        nick: "",
        avatar: false,
        avatarUrl: "",
        admin: false,
        email: "",
        editor: false,
        contest_manager: false,
        contest: {},
        problem_maker: {},
        contest_maker: {}
    },
    token: ""
};

export default states;
