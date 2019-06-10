function isObject (obj) {
    return typeof obj === "object" && obj !== null;
}
function addContestPrivilege (state, contest) {
    if (isObject(contest)) {
        for (let property in contest) {
            if (contest.hasOwnProperty(property)) {
                state.userInfo.contest[property] = true;
            }
        }
    }
}

function addProblemMakerPrivilege (state, problemMaker) {
    if (isObject(problemMaker)) {
        for (let property in problemMaker) {
            if (problemMaker.hasOwnProperty(property)) {
                state.userInfo.problem_maker[property] = true;
            }
        }
    }
}

function addContestMakerPrivilege (state, contestMaker) {
    if (isObject(contestMaker)) {
        for (let property in contestMaker) {
            if (contestMaker.hasOwnProperty(property)) {
                state.userInfo.contest_maker[property] = true;
            }
        }
    }
}

export default {
    loginMutate (state, { login }) {
        state.logined = login;
    },
    setUserData (state, payload) {
        state.userInfo.user_id = payload.user_id;
        state.userInfo.nick = payload.nick;
        state.userInfo.avatar = !!payload.avatar;
        state.userInfo.admin = !!payload.admin;
        state.userInfo.avatarUrl = payload.avatarUrl ? payload.avatarUrl : "";
        addContestPrivilege(state, payload.contest);
        addProblemMakerPrivilege(state, payload.problem_maker);
        addContestMakerPrivilege(state, payload.contest_maker);
    }
};
