export interface IContestSetListDTO {
    contestset_id: number,
    contest_id: number,
    contest_set_record_id: number,
    title: string,
    start_time: string | null,
    end_time: string | null,
    maker: string,
    user?: string
}
