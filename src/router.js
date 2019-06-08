import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import adminAuth from "./lib/router";
import Guard from "./router/util/guard";

Vue.use(Router);

const router = new Router({
    mode: "history",
    routes: [
        {
            path: "/",
            name: "home",
            component: Home
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
                contest_manager: true
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
            path: "/contest/edit/:contest_id",
            name: "Contest Edit",
            component: () => import("./views/contest/manage/edit.vue"),
            meta: {
                auth: true,
                admin: true,
                contest_manager: true
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
            path: "*",
            redirect: "/"
        }
    ]
});

router.beforeEach(Guard);

export default router;
