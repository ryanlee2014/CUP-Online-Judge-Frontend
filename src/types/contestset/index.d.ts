export interface IContestSetRequestDTO {
    title: string,
    description: string,
    defunct: string,
    visible: boolean,
    contestIdList: (string | number)[],
    contestSetId?: number | string,
}

export interface IContestSetResponseDTO {
    contestset_id?: number,
    title: string,
    creator?: string,
    description: string,
    visible: boolean,
    defunct: string,
    create_time: string
}

export interface IContestSetEditDTO extends IContestSetResponseDTO{
    contestIdList: (string | number)[]
}
