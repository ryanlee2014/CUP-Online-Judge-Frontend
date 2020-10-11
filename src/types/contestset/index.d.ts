export interface IContestSetRequestDTO {
    title: string,
    description: string,
    defunct: string,
    visible: boolean,
    contestIdList: (string | number)[],
    contestSetId?: number | string,
    topicAssistant?: string[],
    userList: string[]
}

export interface ITopicAssistant {
    topic_assistant_id: number,
    topic_id: number,
    user_id: string
}

export interface IContestSetResponseDTO {
    contestset_id?: number,
    title: string,
    creator?: string,
    description: string,
    visible: boolean,
    defunct: string,
    create_time: string,
    assistant: ITopicAssistant[],
    userList: []
}

export interface IContestSetEditDTO extends IContestSetResponseDTO{
}
