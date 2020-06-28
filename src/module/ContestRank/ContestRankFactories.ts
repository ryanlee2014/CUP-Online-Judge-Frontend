import dayjs, { Dayjs } from "dayjs";

const DEFAULT_TIME = dayjs();
export interface Problem {
    [id: string]: any,
    submit: Dayjs[],
    accept: Dayjs[],
    sim: number,
    try_time: number,
    start_time: Dayjs,
    first_blood: boolean,
    _submit: Set<number>,
    _accept: Set<number>,
    set: (...arg: any[]) => any,
    update: (...arg: any[]) => any,
    addSubmit: (submission: IContestRankSubmissionDTO) => any,
    calculatePenaltyTime: (...arg: any[]) => any,
    isAccepted: (...arg: any[]) => any,
    getAcceptTime: (...arg: any[]) => any,
    newInstance: (...arg: any[]) => any
}

export interface IContestRankSubmissionDTO {
    avatar: number,
    avatarUrl: string | null,
    code_length: number,
    fingerprint: string | null,
    fingerprintRaw: string | null,
    in_date: string,
    ip: string,
    nick: string,
    num: number,
    problem_id: number,
    result: number,
    sim: number | null,
    solution_id: number,
    user_id: string,
    start_time: Dayjs
}

export interface ISet<T> extends Set<T> {
    newInstance: (...arg: any[]) => any
}

export type FirstBloodList = {
    [id: string]: any,
    get: (...arg: any[]) => any,
    newInstance: (...arg: any[]) => any
};

export type FirstBlood = {
    time: Dayjs | number,
    person: any,
    setFirstBlood: (...arg: any[]) => any,
    newInstance: (...arg: any[]) => any
};

export type ProblemList = {
    [id: string]: any,
    get: (...arg: any[]) => any,
    toArray: (...arg: any[]) => any,
    calculatePenaltyTime: (...arg: any[]) => any,
    calculateAC: (...arg: any[]) => any,
    newInstance: (...arg: any[]) => any
};

export type Submitter = {
    ac: number,
    nick: string,
    problem: ProblemList,
    penalty_time: number,
    fingerprintSet: Set<any>,
    hardwareFingerprintSet: Set<any>,
    ipSet: Set<any>,
    totalSubmitTime: number,
    totalTestRun: number,
    real_name: string,
    user_id: string,
    addData: (...arg: any[]) => any,
    calculatePenaltyTime: (...arg: any[]) => any,
    calculateAC: (...arg: any[]) => any,
    submissionIncrement: () => void,
    testRunIncrement: (val: IContestRankSubmissionDTO) => void,
    calculateFirstBlood: (firstBloodList: FirstBloodList) => any,
    addSubmission: (val: IContestRankSubmissionDTO) => void,
    newInstance: (...arg: any[]) => any,
    rank: number,
    submissions: IContestRankSubmissionDTO[]
};

export function hashCode (str: String) {
    let hash = 0;
    let i;
    let chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
}

function emptyFunction (): void {
    return undefined;
}

export function earlyFirstComparator (a: Dayjs, b: Dayjs) {
    if (a.isBefore(b)) {
        return -1;
    }
    else if (a.isAfter(b)) {
        return 1;
    }
    else {
        return 0;
    }
}

export function toArray (targetObject: any) {
    const newArray = [];
    for (const index in targetObject) {
        if (Object.prototype.hasOwnProperty.call(targetObject, index) && !isNaN(parseInt(index))) {
            newArray.push(targetObject[index]);
        }
    }
    return newArray;
}

export function ProblemFactory (): Problem {
    const baseProblem: Problem = {
        submit: [],
        accept: [],
        sim: 0,
        try_time: 0,
        start_time: DEFAULT_TIME,
        first_blood: false,
        _submit: new Set<number>(),
        _accept: new Set<number>(),
        set: emptyFunction,
        update: emptyFunction,
        addSubmit (submission: IContestRankSubmissionDTO) {
            switch (submission.result) {
            case 4:
                this.update("accept", dayjs(submission.in_date));
                break;
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
                this.update("submit", dayjs(submission.in_date));
                break;
            }
        },
        calculatePenaltyTime: emptyFunction,
        isAccepted: emptyFunction,
        getAcceptTime: emptyFunction,
        newInstance: emptyFunction
    };
    baseProblem.set = function (data) {
        Object.assign(baseProblem, data);
    };
    baseProblem.update = function (index, data) {
        if (this[index] !== null && typeof this[index] === "object" && typeof this[index].push === "function") {
            if (!this["_" + index].has(hashCode(data.toString()))) {
                this["_" + index].add(hashCode(data.toString()));
                this[index].push(data);
            }
        }
        else if (typeof this[index] === "number") {
            this[index] = data;
        }
        return this;
    };
    baseProblem.calculatePenaltyTime = function () {
        const startTime = this.start_time;
        if (this.accept.length > 0) {
            this.accept.sort(earlyFirstComparator);
            this.submit.sort(earlyFirstComparator);
            let diffTime = this.accept[0].diff(startTime, "second");
            this.try_time = 0;
            for (const submission of this.submit) {
                if (submission.isBefore(this.accept[0])) {
                    ++this.try_time;
                    diffTime += 1200; // 20min
                }
                else {
                    break;
                }
            }
            return diffTime;
        }
        else {
            return 0;
        }
    };
    baseProblem.isAccepted = function () {
        return this.accept.length > 0;
    };
    baseProblem.getAcceptTime = function () {
        return this.accept[0];
    };

    baseProblem.newInstance = ProblemFactory;

    return baseProblem;
}

export function ProblemListFactory (total: number): ProblemList {
    const problem: ProblemList = {
        get: emptyFunction,
        toArray: emptyFunction,
        calculatePenaltyTime: emptyFunction,
        calculateAC: emptyFunction,
        newInstance: emptyFunction
    };
    for (let i = 0; i < total; ++i) {
        problem[i] = ProblemFactory();
    }
    problem.get = function (i: number) {
        if (typeof problem[i] !== "undefined") {
            return problem[i];
        }
        else {
            total = Math.max(i, total);
            return (problem[i] = ProblemFactory());
        }
    };

    problem.toArray = function () {
        return toArray(problem);
    };

    problem.calculatePenaltyTime = function () {
        let penaltyTime = 0;
        for (const index in problem) {
            if (Object.prototype.hasOwnProperty.call(problem, index) && !isNaN(parseInt(index))) {
                penaltyTime += problem[index].calculatePenaltyTime();
            }
        }
        return penaltyTime;
    };

    problem.calculateAC = function () {
        let ac = 0;
        for (const index in problem) {
            if (Object.prototype.hasOwnProperty.call(problem, index) && !isNaN(parseInt(index))) {
                if (problem[index].accept.length > 0) {
                    ++ac;
                }
            }
        }
        return ac;
    };

    problem.newInstance = ProblemListFactory;

    return problem;
}

/**
 * @return {string}
 */
export function NickFactory (nick: any) {
    if (typeof nick !== "string") {
        nick = "";
    }
    return nick.length > 0 ? nick.trim() : "未注册";
}

/**
 * @return {string}
 */
export function UserIDFactory (userId: any) {
    if (typeof userId !== "string") {
        userId = "";
    }
    return userId.trim();
}

export function SetFactory () {
    const set = new Set<any>();
    const _add = set.add;
    set.add = function (val: any) {
        if (typeof val !== "undefined") {
            // @ts-ignore
            // eslint-disable-next-line prefer-rest-params
            _add.apply(set, arguments);
        }
        return this;
    };
    // @ts-ignore
    set.newInstance = SetFactory;
    return set;
}

export function firstBloodFactory () {
    const INFINITY = 1e11;
    const firstBloodInfo: FirstBlood = {
        time: INFINITY,
        person: { first_blood: true },
        setFirstBlood: emptyFunction,
        newInstance: emptyFunction
    };
    firstBloodInfo.setFirstBlood = function (difftime, person) {
        if (typeof this.person !== "undefined") {
            if (difftime < this.time) {
                this.time = difftime;
                this.person.first_blood = false;
                this.person = person;
                person.first_blood = true;
            }
        }
    };
    firstBloodInfo.newInstance = firstBloodFactory;
    return firstBloodInfo;
}

export function firstBloodListFactory (total?: number) {
    const firstBlood: FirstBloodList = {
        get: emptyFunction,
        newInstance: emptyFunction
    };
    if (typeof total === "number") {
        for (let i = 0; i < total; ++i) {
            firstBlood[i] = firstBloodFactory();
        }
    }
    firstBlood.get = function (i: number) {
        if (typeof this[i] !== "undefined") {
            return this[i];
        }
        else {
            return (this[i] = firstBloodFactory());
        }
    };
    firstBlood.newInstance = firstBloodListFactory;
    return firstBlood;
}

export function SubmitterFactory (nick: string, totalProblem: number, userId?: string): Submitter {
    return {
        ac: 0,
        rank: -1,
        nick: NickFactory(nick),
        problem: ProblemListFactory(totalProblem),
        penalty_time: 0,
        fingerprintSet: SetFactory(),
        hardwareFingerprintSet: SetFactory(),
        ipSet: SetFactory(),
        real_name: "",
        totalSubmitTime: 0,
        totalTestRun: 0,
        user_id: UserIDFactory(userId),
        submissions: [],
        addSubmission (val: IContestRankSubmissionDTO) {
            this.submissions.push(val);
        },
        submissionIncrement () {
            ++this.totalSubmitTime;
        },
        testRunIncrement (val: IContestRankSubmissionDTO) {
            this.totalTestRun += Number(val.problem_id < 0);
        },
        addData (val: IContestRankSubmissionDTO) {
            this.fingerprintSet.add(val.fingerprint);
            this.hardwareFingerprintSet.add(val.fingerprintRaw);
            this.ipSet.add(val.ip);
            this.problem.get(val.num).update("sim", val.sim);
            this.problem.get(val.num).set({ start_time: val.start_time });
            this.problem.get(val.num).addSubmit(val);
            this.submissionIncrement();
            this.testRunIncrement(val);
            this.addSubmission(val);
        },
        calculatePenaltyTime () {
            this.penalty_time = this.problem.calculatePenaltyTime();
        },
        calculateAC () {
            this.ac = this.problem.calculateAC();
        },
        calculateFirstBlood (firstBloodList: FirstBloodList) {
            for (const index in this.problem) {
                try {
                    if (Object.prototype.hasOwnProperty.call(this.problem, index) && !isNaN(parseInt(index)) && this.problem[index].isAccepted()) {
                        const difftime = this.problem[index].getAcceptTime().diff(this.problem[index].start_time, "second");
                        firstBloodList.get(index).setFirstBlood(difftime, this.problem.get(index));
                    }
                }
                catch (e) {
                    console.log(e);
                    console.log("Firstbloodlist", firstBloodList);
                    console.log("this.problem", this.problem);
                }
            }
        },
        newInstance: SubmitterFactory
    };
}

export function SubmitterComparator (policy: string) {
    let factor = 1;
    switch (policy.toLowerCase()) {
    case "greater":
        factor = 1;
        break;
    case "lesser":
        factor = -1;
        break;
    }
    return (a: any, b: any) => factor * (a.ac !== b.ac ? b.ac - a.ac : a.penalty_time - b.penalty_time);
}
