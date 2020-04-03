export interface IRegisterDTO {
    userId: string,
    nick: string,
    password: string,
    confirmQuestion: string,
    confirmAnswer: string,
    inviteCode: string,
    captcha: string
}

export interface IRegisterPagePayload extends IRegisterDTO {
    repeatPassword: string
}
