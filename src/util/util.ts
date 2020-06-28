import axios from "axios";
export function parameterHash (args: any[]) {
    return args.map(e => {
        if (typeof e === "number") {
            return e.toString();
        }
        else if (typeof e === "string") {
            return e;
        }
        else {
            return JSON.stringify(e);
        }
    }).reduce((accumulator, currentValue) => accumulator + currentValue);
}

export function isContestAssistant (contestId: number | string): Promise<boolean> {
    return axios.get(`/api/contest/assistant/${contestId}`)
        .then(({ data }) => data.data);
}
