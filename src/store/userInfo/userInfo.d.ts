interface IKVStruct {
    [id: string]: boolean
}

interface IUserInfoDetail {
    user_id: string,
    nick: string,
    avatar: boolean,
    email: string,
    avatarUrl: string,
    admin: boolean,
    editor: boolean,
    contest_manager: boolean,
    contest: IKVStruct,
    problem_maker: IKVStruct,
    contest_maker: IKVStruct
}

export interface IUserInfoState {
    logined: boolean,
    userInfo: IUserInfoDetail,
    token: string
}
