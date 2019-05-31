const dayjs = require("dayjs");
const _ = require("lodash");

String.prototype.hashCode = function () {
    let hash = 0; let i; let chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
};

function earlyFirstComparator (a, b) {
    if (a.isBefore(b)) {
        return 1;
    }
    else if (a.isAfter(b)) {
        return -1;
    }
    else {
        return 0;
    }
}

function toArray (targetObject) {
    let newArray = [];
    for (let index in targetObject) {
        if (targetObject.hasOwnProperty(index) && !isNaN(parseInt(index))) {
            newArray.push(targetObject[index]);
        }
    }
    return newArray;
}

function ProblemFactory () {
    let baseProblem = {
        submit: [],
        accept: [],
        sim: 0,
        try_time: 0,
        first_blood: false,
        _submit: new Set(),
        _accept: new Set()
    };
    baseProblem.set = function (data) {
        Object.assign(baseProblem, data);
    };
    baseProblem.update = function (index, data) {
        if (this[index] !== null && typeof this[index] === "object" && typeof this[index].push === "function") {
            if (!this["_" + index].has(data.toString().hashCode())) {
                this["_" + index].add(data.toString().hashCode());
                this[index].push(data);
            }
        }
        else if (typeof this[index] === "number") {
            this[index] = data;
        }
        return this;
    };
    baseProblem.addSubmit = function (submission) {
        switch (parseInt(submission.result)) {
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
    };
    baseProblem.calculatePenaltyTime = function (start_time) {
        if (this.accept.length > 0) {
            this.accept.sort(earlyFirstComparator);
            this.submit.sort(earlyFirstComparator);
            let difftime = this.accept[0].diff(start_time, "second");
            this.try_time = 0;
            for (let submission of this.submit) {
                if (submission.isBefore(this.accept[0])) {
                    ++this.try_time;
                    difftime += 1200;
                }
                else {
                    break;
                }
            }
            return difftime;
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
    return baseProblem;
}

function ProblemListFactory (total) {
    let problem = {};
    for (let i = 0; i < total; ++i) {
        problem[i] = ProblemFactory();
    }
    problem.get = function (i) {
        if (typeof problem[i] !== "undefined") {
            return problem[i];
        }
        else {
            total = Math.max(i, total);
            return problem[i] = ProblemFactory();
        }
    };

    problem.toArray = function () {
        let tempArray = toArray(problem);
        return tempArray;
    };

    problem.calculatePenaltyTime = function (start_time) {
        let penalty_time = 0;
        for (let index in problem) {
            if (problem.hasOwnProperty(index) && !isNaN(parseInt(index))) {
                penalty_time += problem[index].calculatePenaltyTime(start_time);
            }
        }
        return penalty_time;
    };

    problem.calculateAC = function () {
        let ac = 0;
        for (let index in problem) {
            if (problem.hasOwnProperty(index) && !isNaN(parseInt(index))) {
                if (problem[index].accept.length > 0) {
                    ++ac;
                }
            }
        }
        return ac;
    };
    return problem;
}

/**
 * @return {string}
 */
function NickFactory (nick) {
    if (typeof nick !== "string") {
        nick = "";
    }
    return nick.length > 0 ? nick.trim() : "未注册";
}

/**
 * @return {string}
 */
function UserIDFactory (user_id) {
    if (typeof user_id !== "string") {
        user_id = "";
    }
    return user_id.trim();
}

function SetFactory () {
    let set = new Set();
    let _add = set.add;
    set.add = function (val) {
        if (typeof val !== "undefined") {
            _add.apply(set, arguments);
        }
    };
    return set;
}

function SubmitterFactory (nick, total_problem, user_id) {
    return {
        ac: 0,
        nick: NickFactory(nick),
        problem: ProblemListFactory(total_problem),
        penalty_time: 0,
        fingerprintSet: SetFactory(),
        hardwareFingerprintSet: SetFactory(),
        ipSet: SetFactory(),
        real_name: "",
        user_id: UserIDFactory(user_id),
        addData (val) {
            this.fingerprintSet.add(val.fingerprint);
            this.hardwareFingerprintSet.add(val.fingerprintRaw);
            this.ipSet.add(val.ip);
            this.problem.get(val.num).update("sim", val.sim);
            this.problem.get(val.num).set({ start_time: val.start_time });
            this.problem.get(val.num).addSubmit(val);
        },
        calculatePenaltyTime () {
            this.penalty_time = this.problem.calculatePenaltyTime(start_time);
        },
        calculateAC () {
            this.ac = this.problem.calculateAC();
        },
        calculateFirstBlood (firstBloodList) {
            for (let index in this.problem) {
                if (this.problem.hasOwnProperty(index) && !isNaN(parseInt(index)) && this.problem[index].isAccepted()) {
                    let difftime = this.problem[index].getAcceptTime().diff(this.problem[index].start_time, "second");
                    firstBloodList.get(index).setFirstBlood(difftime, this.problem.get(index));
                }
            }
        }
    };
}

function firstBloodFactory () {
    const INFINITY = 1e11;
    let firstBloodInfo = {
        time: INFINITY,
        person: { first_blood: true }
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
    return firstBloodInfo;
}

function firstBloodListFactory (total) {
    let first_blood = {};
    for (let i = 0; i < total; ++i) {
        first_blood[i] = firstBloodFactory();
    }
    first_blood.get = function (i) {
        if (typeof this[i] !== "undefined") {
            return this[i];
        }
        else {
            return this[i] = firstBloodFactory();
        }
    };
    return first_blood;
}

function SubmitterComparator (policy) {
    let factor = 1;
    switch (policy.toLowerCase()) {
    case "greater":
        factor = 1;
        break;
    case "lesser":
        factor = -1;
        break;
    }
    return (a, b) => factor * (a.ac !== b.ac ? b.ac - a.ac : a.penalty_time - b.penalty_time);
}

export {
    ProblemFactory,
    ProblemListFactory,
    SubmitterFactory,
    SetFactory,
    NickFactory,
    firstBloodListFactory,
    firstBloodFactory,
    SubmitterComparator
};
