import Vue from "vue";
import Router, { Route, RouterOptions } from "vue-router";
import axios from "axios";
import adminAuth from "./lib/router";
import Guard from "./router/util/guard";
import { isContestAssistant } from "@/util/util";

// eslint-disable-next-line no-unused-vars
const emptyFunc = (...arg: any[]) => {
};
// warn if in developing env
const warn = process.env.NODE_ENV !== "production" ? ((console && console.warn) || emptyFunc) : emptyFunc;
const originalPush: (...arg: any[]) => any = Router.prototype.push;
// @ts-ignore
Router.prototype.push = function push (location: any, onResolve: any, onReject: any) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
    // @ts-ignore
    return originalPush.call(this, location).catch(warn);
};

Vue.use(Router);

const router = new Router({
    mode: "history",
    routes: [
        {
            path: "/",
            name: "home",
            component: () => import("./views/Home.vue")
        },
        {
            path: "/about",
            name: "about",
            component: () => import("./views/About.vue")
        },
        {
            path: "/problemset",
            name: "problemset",
            meta: {
                auth: true
            },
            component: () => import("./views/problemset.vue")
        },
        {
            path: "/status",
            name: "status",
            meta: {
                auth: true
            },
            component: () => import("./views/status.vue")
        },
        {
            path: "/status/problem/:id",
            name: "problem status",
            meta: {
                auth: true
            },
            component: () => import("./views/status/problem.vue")
        },
        {
            path: "/ranklist",
            name: "ranklist",
            meta: {
                auth: true
            },
            component: () => import("./views/ranklist.vue")
        },
        {
            path: "/discuss",
            name: "discuss",
            meta: {
                auth: true
            },
            component: () => import("./views/discuss.vue")
        },
        {
            path: "/login",
            name: "login",
            component: () => import("./views/login.vue")
        },
        {
            path: "/user/lostpassword",
            name: "Lost password",
            component: () => import("./views/user/lostpassword.vue"),
            meta: {
                auth: false
            }
        },
        {
            path: "/register",
            name: "register",
            component: () => import("./views/register.vue"),
            meta: {
                auth: false
            }
        },
        {
            path: "/init",
            name: "init",
            component: () => import("./views/system/init.vue"),
            meta: {
                auth: false,
                init: true
            }
        },
        {
            path: "/faq",
            name: "faq",
            component: () => import("./views/faq.vue")
        },
        {
            path: "/online",
            name: "online",
            component: () => import("./views/online.vue"),
            beforeEnter: adminAuth.adminAuth,
            meta: {
                auth: true,
                admin: true
            }
        },
        {
            path: "/usercode/:from/:solution_id",
            name: "usercode",
            component: () => import("./views/code/usercode.vue"),
            meta: {
                auth: true
            }
        },
        {
            path: "/problem/submit/:problem_id",
            name: "normal problem submit",
            component: () => import("./views/problem/submit.vue"),
            meta: {
                auth: true
            }
        },
        {
            path: "/discuss/thread/:id",
            name: "thread view",
            component: () => import("./views/discuss/thread.vue"),
            meta: {
                auth: true
            }
        },
        {
            path: "/user/:user_id",
            name: "user information",
            component: () => import("./views/user.vue"),
            meta: {
                auth: true
            }
        },
        {
            path: "/myinfo",
            name: "My Information",
            component: () => import("./views/user/myinfo.vue"),
            meta: {
                auth: true
            }
        },
        {
            path: "/other_contest_schedure",
            name: "other oj contest schedure",
            component: () => import("./views/other_contest_schedure.vue")
        },
        {
            path: "/contest",
            name: "contest set",
            component: () => import("./views/contest/ContestSetView.vue"),
            meta: {
                auth: true
            }
        },
        {
            path: "/topic",
            name: "contest topic",
            component: () => import("./views/contesttopic/contest-topic-view.vue"),
            meta: {
                auth: true
            }
        },
        {
            path: "/topic/:contestSetId",
            name: "topic contest list",
            component: () => import("./views/contesttopic/contest-topic-problem-view.vue"),
            meta: {
                auth: true
            }
        },
        {
            path: "/topic/rank/:contestSetId",
            name: "topic contest rank",
            component: () => import("./views/contesttopic/contest-topic-rank.vue"),
            meta: {
                auth: true
            }
        },
        {
            path: "/tutorial/:problem_id",
            name: "problem tutorial/solution manual",
            component: () => import("./views/tutorial.vue"),
            meta: {
                auth: true
            }
        },
        {
            path: "/contest/:contest_id",
            name: "contest problem view",
            component: () => import("./views/contest/ContestProblemView.vue"),
            meta: {
                auth: true
            }
        },
        {
            path: "/contest/status/:contest_id",
            name: "contest status view",
            component: () => import("./views/status/contest.vue"),
            meta: {
                auth: true
            }
        },
        {
            path: "/contest/rank/:contest_id",
            name: "contest rank view",
            component: () => import("./views/contest/ContestRank.vue"),
            meta: {
                auth: true
            }
        },
        {
            path: "/contest/problem/:contest_id/:num",
            name: "contest problem",
            component: () => import("./views/problem/submit.vue"),
            meta: {
                auth: true
            }
        },
        {
            path: "/contest/problem/:contest_id/:num/:solution_id",
            name: "contest problem with solution_id",
            component: () => import("./views/problem/submit.vue"),
            meta: {
                auth: true
            }
        },
        {
            path: "/problem/submit/:problem_id/:solution_id",
            name: "problem submit with solution_id",
            component: () => import("./views/problem/submit.vue"),
            meta: {
                auth: true
            }
        },
        {
            path: "/problem/edit/:problem_id",
            name: "problem edit view",
            component: () => import("./views/problem/edit.vue"),
            meta: {
                auth: true,
                admin: true,
                contest_manager: true,
                editor: true
            }
        },
        {
            path: "/admin/problem/add",
            name: "Add problem",
            component: () => import("./views/admin/problem/add.vue"),
            meta: {
                auth: true,
                admin: true
            }
        },
        {
            path: "/compare/:left/:right",
            name: "compare two code",
            component: () => import("./views/code/diff.vue"),
            meta: {
                auth: true
            }
        },
        {
            path: "/opensource",
            name: "open source announcement",
            component: () => import("./views/about/opensource.vue")
        },
        {
            path: "/privacy",
            name: "privacy view",
            component: () => import("./views/about/privacy.vue")
        },
        {
            path: "/copyright",
            name: "copyright view",
            component: () => import("./views/about/copyright.vue")
        },
        {
            path: "/update",
            name: "update log view",
            component: () => import("./views/system/update.vue")
        },
        {
            path: "/about/icpc",
            name: "icpc introduction view",
            component: () => import("./views/about/icpc.vue")
        },
        {
            path: "/about/fame",
            name: "hall of fame view",
            component: () => import("./views/about/fame.vue")
        },
        {
            path: "/extra/software",
            name: "software view",
            component: () => import("./views/extra/software.vue"),
            meta: {
                auth: true
            }
        },
        {
            path: "/extra/whiteboard",
            name: "white board",
            component: () => import("./views/extra/whiteboard.vue"),
            meta: {
                auth: true
            }
        },
        {
            path: "/status/user/contest/:contest_id",
            name: "user status within contests",
            component: () => import("./views/status/user.vue"),
            meta: {
                auth: true
            }
        },
        {
            path: "/extra/broadcast",
            name: "administrator broadcast view",
            component: () => import("./views/extra/broadcast.vue"),
            meta: {
                auth: true,
                admin: true
            }
        },
        {
            path: "/tutorial/edit/:tutorial_id",
            name: "tutorial edit view",
            component: () => import("./views/tutorial/edit.vue"),
            meta: {
                auth: true
            }
        },
        {
            path: "/tutorial/new/:problem_id",
            name: "Add new tutorial view",
            component: () => import("./views/tutorial/add.vue"),
            meta: {
                auth: true
            }
        },
        {
            path: "/problem/upload",
            name: "problem upload view",
            component: () => import("./views/problem/upload.vue"),
            meta: {
                auth: true
            }
        },
        {
            path: "/discuss/add",
            name: "add discuss thread",
            component: () => import("./views/discuss/add.vue"),
            meta: {
                auth: true
            }
        },
        {
            path: "/discuss/edit/:article_id",
            name: "edit discuss main article",
            component: () => import("./views/discuss/edit.vue"),
            meta: {
                auth: true
            }
        },
        {
            path: "/discuss/edit/:article_id/:comment_id",
            name: "edit discuss reply",
            component: () => import("./views/discuss/edit.vue"),
            meta: {
                auth: true
            }
        },
        {
            path: "/status/info/compile/:solution_id",
            name: "compile info view",
            component: () => import("./views/status/info/compile.vue"),
            meta: {
                auth: true
            }
        },
        {
            path: "/status/info/runtime/:solution_id",
            name: "runtime info view",
            component: () => import("./views/status/info/runtime.vue"),
            meta: {
                auth: true
            }
        },
        {
            path: "/admin/contestset/add",
            name: "Add Contest Set",
            component: () => import("./views/admin/contestset/add.vue"),
            meta: {
                auth: true,
                admin: true
            }
        },
        {
            path: "/admin/contestset/copy/:contestSetId",
            name: "Copy Contest Set",
            component: () => import("./views/admin/contestset/copy.vue"),
            meta: {
                auth: true,
                admin: true
            }
        },
        {
            path: "/admin/contestset/edit/:contestSetId",
            name: "Contest Set Edit",
            component: () => import("./views/admin/contestset/edit.vue"),
            meta: {
                auth: true,
                admin: true
            }
        },
        {
            path: "/admin/contestset/list",
            name: "Contest Set List",
            component: () => import("./views/admin/contestset/list.vue"),
            meta: {
                auth: true,
                admin: true
            }
        },
        {
            path: "/user/self/info/modify",
            name: "modify information for current user",
            component: () => import("./views/user/modify.vue"),
            meta: {
                auth: true
            }
        },
        {
            path: "/admin",
            name: "Admin index view",
            component: () => import("./views/admin/index.vue"),
            meta: {
                auth: true,
                admin: true
            }
        },
        {
            path: "/admin/problem/list",
            name: "Admin problem list",
            component: () => import("./views/admin/problem/list.vue"),
            meta: {
                auth: true,
                admin: true
            }
        },
        {
            path: "/admin/contest/list",
            name: "Admin contest list",
            component: () => import("./views/admin/contest/list.vue"),
            meta: {
                auth: true,
                admin: true
            }
        },
        {
            path: "/admin/export/problem",
            name: "Admin export problem list",
            component: () => import("./views/admin/export/ProblemList.vue"),
            meta: {
                auth: true,
                admin: true
            }
        },
        {
            path: "/contest/edit/:contest_id",
            name: "Contest Edit",
            component: () => import("./views/contest/manage/edit.vue"),
            meta: {
                auth: true,
                admin: true,
                contest_manager: true,
                checkPrivilege (to: Route) {
                    return new Promise((resolve, reject) => {
                        isContestAssistant(to.params.contest_id)
                            .then(result => {
                                if (result) {
                                    resolve(result);
                                }
                                else {
                                    reject(new Error("No privilege"));
                                }
                            });
                    });
                }
            }
        },
        {
            path: "/admin/contest/assistant",
            name: "Contest assistant manage",
            component: () => import("./views/admin/contest/assistant.vue"),
            meta: {
                auth: true,
                admin: true
            }
        },
        {
            path: "/admin/user/privilege",
            name: "User Privilege Manager",
            component: () => import("./views/admin/account/privilege.vue"),
            meta: {
                auth: true,
                admin: true
            }
        },
        {
            path: "/admin/user/invite",
            name: "Invite code manager",
            component: () => import("./views/admin/account/invite.vue"),
            meta: {
                auth: true,
                admin: true
            }
        },
        {
            path: "/admin/user/password",
            name: "Modify User Password",
            component: () => import("./views/admin/account/password.vue"),
            meta: {
                auth: true,
                admin: true
            }
        },
        {
            path: "/admin/user/check",
            name: "User account checker",
            component: () => import("./views/admin/account/check.vue"),
            meta: {
                auth: true,
                admin: true
            }
        },
        {
            path: "/admin/contest/team/list",
            name: "Contest Team List",
            component: () => import("./views/admin/contest/userlist.vue"),
            meta: {
                auth: true,
                admin: true
            }
        },
        {
            path: "/admin/judge/rejudge",
            name: "Rejudge",
            component: () => import("./views/admin/judge/rejudge.vue"),
            meta: {
                auth: true,
                admin: true
            }
        },
        {
            path: "/admin/judge/compile",
            name: "Compile settings",
            component: () => import("./views/admin/judge/compile.vue"),
            meta: {
                auth: true,
                admin: true
            }
        },
        {
            path: "/admin/contest/add",
            name: "Add contest",
            component: () => import("./views/admin/contest/add.vue"),
            meta: {
                auth: true,
                admin: true,
                contest_manager: true
            }
        },
        {
            path: "/admin/contest/copy/:contest_id",
            name: "Copy contest",
            component: () => import("./views/admin/contest/copy.vue"),
            meta: {
                auth: true,
                admin: true,
                contest_manager: true
            }
        },
        {
            path: "/admin/config/manager",
            name: "Config Manager",
            component: () => import("./views/admin/config/config-manager.vue"),
            meta: {
                auth: true,
                admin: true
            }
        },
        {
            path: "/admin/switch/manager",
            name: "Switch Manager",
            component: () => import("./views/admin/config/switch-manager.vue"),
            meta: {
                auth: true,
                admin: true
            }
        },
        {
            path: "/admin/user/ban",
            name: "Ban manage",
            component: () => import("./views/admin/account/ban.vue"),
            meta: {
                auth: true,
                admin: true
            }
        },
        {
            path: "/admin/global",
            name: "Global Settings",
            components: () => import("./views/admin/global_setting.vue"),
            meta: {
                auth: true,
                admin: true
            }
        },
        {
            path: "/system/version_control",
            name: "Version Control",
            component: () => import("./views/system/github_repo_info.vue")
        },
        {
            path: "/system/compile_arguments",
            name: "Compile Arguments",
            component: () => import("./views/system/compile_arguments.vue")
        },
        {
            path: "/forbidden/privilege",
            name: "No privilege",
            component: () => import("./views/error/noprivilege.vue")
        },
        {
            path: "/unavailable",
            name: "Unavailable",
            component: () => import("./views/error/unavailable.vue")
        },
        {
            path: "/forbidden/contest_mode",
            name: "Global contest mode state",
            component: () => import("./views/error/contest-mode.vue")
        },
        {
            path: "/ban",
            name: "Ban view",
            component: () => import("./views/error/ban.vue")
        },
        {
            path: "*",
            name: "",
            component: () => import("./views/error/404.vue")
        }
    ]
} as RouterOptions);

router.beforeEach(Guard);

export default router;
