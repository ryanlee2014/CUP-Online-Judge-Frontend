import { isObject, notUndefinedOrNull } from "../util/index";

function addContestPrivilege (state, contest) {
    if (isObject(contest)) {
        for (let property in contest) {
            if (Object.prototype.hasOwnProperty.call(contest, property)) {
                state.userInfo.contest[property] = true;
            }
        }
    }
}

function addProblemMakerPrivilege (state, problemMaker) {
    if (isObject(problemMaker)) {
        for (let property in problemMaker) {
            if (Object.prototype.hasOwnProperty.call(problemMaker, property)) {
                state.userInfo.problem_maker[property] = true;
            }
        }
    }
}

function addContestMakerPrivilege (state, contestMaker) {
    if (isObject(contestMaker)) {
        for (let property in contestMaker) {
            if (Object.prototype.hasOwnProperty.call(contestMaker, property)) {
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
        state.userInfo.editor = !!payload.privilege.editor;
        state.userInfo.avatarUrl = notUndefinedOrNull(payload.avatar) ? payload.avatarUrl : "";
        addContestPrivilege(state, payload.privilege.contest);
        addProblemMakerPrivilege(state, payload.privilege.problem_maker);
        addContestMakerPrivilege(state, payload.privilege.contest_maker);
    }
};
