function ProblemFactory() {
    let baseProblem = {
        submit: [],
        accept: [],
        sim: 0
    };
    baseProblem.set = function (data) {
        Object.assign(baseProblem, data);
    };
    baseProblem.update = function (index, data) {
        if (typeof this[index].push === "function") {
            this[index].push(data);
        }
        else if (typeof this[index] === "number") {
            this[index] = data;
        }
        return this;
    };
    return baseProblem;
}

function ProblemListFactory(total) {
    let problem = {};
    for(let i = 0; i < total; ++i) {
        problem[i] = ProblemFactory()
    }
    problem.get = function(i) {
        if (typeof problem[i] !== "undefined") {
            return problem[i];
        }
        else {
            return problem[i] = ProblemFactory();
        }
    };
    return problem;
}

/**
 * @return {string}
 */
function NickFactory(nick) {
    if (typeof nick !== "string") {
        nick = "";
    }
    return nick.length > 0 ? nick.trim() : "未注册";
}

function SetFactory() {
    let set = new Set();
    let _add = set.add;
    set.add = function(val) {
        if (typeof val !== "undefined") {
            _add.apply(set, arguments);
        }
    };
    return set;
}

function SubmitterFactory (nick, total_problem) {
    return {
        ac: 0,
        nick: NickFactory(nick),
        problem: ProblemListFactory(total_problem),
        penalty_time: 0,
        fingerprintSet: SetFactory(),
        hardwareFingerprintSet: SetFactory(),
        ipSet: SetFactory(),
        real_name: "",
        addData(val) {
            this.fingerprintSet.add(val.fingerprint);
            this.hardwareFingerprintSet.add(val.fingerprintRaw);
            this.ipSet.add(val.ip);
            this.problem.get(val.num).update("sim", val.sim);
        }
    }
}

function firstBloodFactory() {
    const INFINITY = 1e11;
    let firstBloodInfo = {
        time: INFINITY,
        person: {first_blood: true}
    };
    firstBloodInfo.setFirstBlood = function (difftime, person) {
        if (typeof this.person !== "undefined") {
            if (difftime < this.person.time) {
                this.person.first_blood = false;
            }
        }
    }
    return firstBloodInfo;
}

function firstBloodListFactory(total) {
    let first_blood = {};
    for(let i = 0; i < total; ++i) {
        first_blood[i] = firstBloodFactory();
    }
}

export {ProblemFactory, ProblemListFactory, SubmitterFactory, SetFactory, NickFactory};
