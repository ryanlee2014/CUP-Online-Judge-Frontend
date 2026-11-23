<template>
    <div class="pa-root pa-home">
        <div class="pa-home-inner">
            <!-- row 1: the one thing to do next + contest clock -->
            <div class="pa-row1">
                <section class="pa-card pa-focus pa-task" v-if="logined">
                    <PixelBalloon class="pa-task-balloon" :problem-id="task ? task.problem_id : null" :size="10" v-if="task"/>
                    <template v-if="loading.status">
                        <div class="pa-skel pa-skel-sm"></div>
                        <div class="pa-skel pa-skel-lg"></div>
                        <div class="pa-skel pa-skel-md"></div>
                    </template>
                    <template v-else-if="task">
                        <div class="pa-px pa-kicker">▶ 当前任务 · P{{ task.problem_id }}</div>
                        <h1 class="pa-px pa-task-title">{{ taskTitle || ("P" + task.problem_id) }}</h1>
                        <div class="pa-task-line">
                            <span class="pa-result" :class="resultClass(task.result)">{{ resultShort(task.result) }}</span>
                            <span>{{ relativeTime(task.in_date) }}提交，{{ resultText(task.result) }}<template v-if="draft">，草稿已保存</template></span>
                        </div>
                        <div class="pa-task-cases" v-if="passSquares">
                            <span class="pa-px pa-mute">通过比例</span>
                            <span class="pa-sq" v-for="(c, i) in passSquares" :key="i" :class="c"></span>
                            <span class="pa-px pa-mute">{{ passPercent }}%</span>
                        </div>
                        <div class="pa-actions">
                            <router-link class="pa-btn pa-primary" :to="`/problem/submit/${task.problem_id}`">继续挑战 <span class="pa-key">↵</span></router-link>
                            <router-link class="pa-btn" :to="`/status?problem_id=${task.problem_id}&user_id=${userId}`">我的提交</router-link>
                            <router-link class="pa-btn" to="/problemset">去题库</router-link>
                        </div>
                    </template>
                    <template v-else>
                        <div class="pa-px pa-kicker">▶ 当前任务</div>
                        <h1 class="pa-px pa-task-title">最近没有卡住的题</h1>
                        <div class="pa-task-line pa-mute" v-if="statusError">提交记录没加载出来。<a class="pa-link" @click="loadStatus">重试</a></div>
                        <div class="pa-task-line pa-mute" v-else>最近的提交都通过了，去题库挑一道新的吧。</div>
                        <div class="pa-solved" v-if="solvedCount !== null">
                            <span class="pa-px pa-solved-num">{{ solvedCount }}</span>
                            <span class="pa-mute">道题已通过</span>
                        </div>
                        <div class="pa-actions">
                            <router-link class="pa-btn pa-primary" to="/problemset">去题库 <span class="pa-key">↵</span></router-link>
                            <router-link class="pa-btn" to="/contest">竞赛 &amp; 作业</router-link>
                        </div>
                    </template>
                </section>

                <section class="pa-card pa-focus pa-task" v-else>
                    <div class="pa-px pa-kicker">▶ 中国石油大学（北京）</div>
                    <h1 class="pa-px pa-task-title">CUP Online Judge</h1>
                    <div class="pa-task-line pa-mute">程序设计在线评测：题库、比赛、作业都在这里。登录后首页会记住你卡在哪道题。</div>
                    <div class="pa-actions">
                        <router-link class="pa-btn pa-primary" to="/login">登录 <span class="pa-key">↵</span></router-link>
                        <router-link class="pa-btn" to="/register">注册</router-link>
                        <router-link class="pa-btn" to="/problemset">先看看题库</router-link>
                    </div>
                </section>

                <div class="pa-side">
                    <section class="pa-card pa-clock">
                        <template v-if="nextContest">
                            <div class="pa-px pa-mute pa-center">下一场 · {{ nextContest.title }}</div>
                            <div class="pa-px pa-clock-digits">
                                <template v-if="clock.days > 0">{{ pad2(clock.days) }}<span>:</span></template>{{ pad2(clock.hours) }}<span>:</span>{{ pad2(clock.minutes) }}<span>:</span>{{ pad2(clock.seconds) }}
                            </div>
                            <div class="pa-px pa-clock-units"><template v-if="clock.days > 0">天 </template>时 分 秒</div>
                            <div class="pa-px pa-dim pa-center">{{ formatDate(nextContest.start_time) }} 开始<template v-if="nextContest.private"> · 需报名</template></div>
                            <div class="pa-center pa-clock-link"><router-link class="pa-link" :to="`/contest/${nextContest.contest_id}`">去比赛页 ▶</router-link></div>
                        </template>
                        <template v-else-if="loading.contest">
                            <div class="pa-skel pa-skel-sm"></div>
                            <div class="pa-skel pa-skel-lg"></div>
                        </template>
                        <template v-else>
                            <div class="pa-px pa-mute pa-center">近 30 天没有安排比赛</div>
                            <div class="pa-px pa-clock-digits pa-dim">--<span>:</span>--<span>:</span>--</div>
                            <div class="pa-center pa-clock-link"><router-link class="pa-link" to="/contest">看全部竞赛 ▶</router-link></div>
                        </template>
                    </section>

                    <section class="pa-card pa-shelf" v-if="logined">
                        <div class="pa-head">
                            <span class="pa-px pa-mute">我的气球 <span class="pa-y">×{{ solvedCount === null ? "…" : solvedCount }}</span></span>
                            <router-link class="pa-px pa-mute pa-more" :to="`/user/${userId}`">主页 ▶</router-link>
                        </div>
                        <div class="pa-balloons" v-if="recentAc.length">
                            <router-link v-for="pid in recentAc" :key="pid" :to="`/problem/submit/${pid}`" :title="`P${pid}`">
                                <PixelBalloon :problem-id="pid" :size="4"/>
                            </router-link>
                        </div>
                        <div class="pa-mute pa-empty" v-else>每通过一道题，就收到一个这道题颜色的气球。</div>
                    </section>
                </div>
            </div>

            <!-- row 2 -->
            <div class="pa-row2">
                <section class="pa-card pa-list">
                    <div class="pa-head"><span class="pa-px pa-h">进行中的竞赛 &amp; 作业</span><router-link class="pa-px pa-mute pa-more" to="/contest">全部 ▶</router-link></div>
                    <div class="pa-dash"></div>
                    <template v-if="running.length">
                        <router-link class="pa-item" v-for="c in running" :key="c.contest_id" :to="`/contest/${c.contest_id}`">
                            <div class="pa-item-main">
                                <div class="pa-item-title">{{ c.title }}</div>
                                <div class="pa-item-sub">{{ endsIn(c.end_time) }}<template v-if="c.private"> · 需报名</template></div>
                            </div>
                            <span class="pa-px pa-tag">{{ c.contest_id }}</span>
                        </router-link>
                    </template>
                    <div class="pa-mute pa-empty" v-else-if="!loading.contest">现在没有进行中的竞赛或作业。</div>
                </section>

                <section class="pa-card pa-list" v-if="logined">
                    <div class="pa-head"><span class="pa-px pa-h">最近提交</span><router-link class="pa-px pa-mute pa-more" :to="`/status?user_id=${userId}`">全部 ▶</router-link></div>
                    <div class="pa-dash"></div>
                    <template v-if="recent.length">
                        <router-link class="pa-item" v-for="s in recent" :key="s.solution_id" :to="submissionLink(s)">
                            <span class="pa-result" :class="resultClass(s.result)">{{ resultShort(s.result) }}</span>
                            <div class="pa-item-main">
                                <div class="pa-item-title">P{{ s.problem_id }} {{ titleOf(s.problem_id) }}</div>
                                <div class="pa-item-sub">{{ relativeTime(s.in_date) }}<template v-if="s.contest_id"> · 比赛 {{ s.contest_id }}</template> · {{ s.time }}ms</div>
                            </div>
                        </router-link>
                    </template>
                    <div class="pa-mute pa-empty" v-else-if="!loading.status">还没有提交记录。</div>
                </section>

                <section class="pa-card pa-list">
                    <div class="pa-head"><span class="pa-px pa-h">常用入口</span></div>
                    <div class="pa-dash"></div>
                    <router-link class="pa-item" to="/about/icpc"><div class="pa-item-main"><div class="pa-item-title">关于 ICPC</div><div class="pa-item-sub">国际大学生程序设计竞赛介绍</div></div></router-link>
                    <router-link class="pa-item" to="/about/fame"><div class="pa-item-main"><div class="pa-item-title">名人堂</div><div class="pa-item-sub">历届获奖队员</div></div></router-link>
                    <router-link class="pa-item" to="/discuss/thread/23"><div class="pa-item-main"><div class="pa-item-title">内推信息</div><div class="pa-item-sub">校友实习 / 工作内推</div></div></router-link>
                    <a class="pa-item" href="https://docs.cupacm.com" target="_blank" rel="noopener"><div class="pa-item-main"><div class="pa-item-title">CUPACM 文档</div><div class="pa-item-sub">评测环境、语言版本、常见问题</div></div></a>
                    <a class="pa-item" href="javascript:void(0)" @click="switchToClassic"><div class="pa-item-main"><div class="pa-item-title">切回旧版界面</div><div class="pa-item-sub">随时可以在顶部「功能」菜单里切换回来</div></div></a>
                </section>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import { initMixin } from "../../mixin/init";
import PixelBalloon from "../../components/pixel/PixelBalloon.vue";
import { draftKey, loadDraft } from "@/util/codeDraft";
import { setUiMode } from "@/util/uiMode";
import {
    countdown, Countdown, ContestLite, pad2, pickCurrentTask, pickNextContest, pickRunning,
    relativeTime, resultClass, resultShort, shortTitle, SubmissionLite
} from "@/util/pixelArena";

interface Submission extends SubmissionLite {
    time?: number;
    num?: number;
}

const RESULT_TEXT: Record<number, string> = {
    5: "格式错误", 6: "答案错误", 7: "时间超限", 8: "内存超限", 9: "输出超限", 10: "运行错误", 11: "编译错误", 15: "提交被拒绝", 16: "系统错误"
};

export default defineComponent({
    name: "HomeArena",
    components: { PixelBalloon },
    mixins: [initMixin],
    data () {
        return {
            loading: { status: true, contest: true },
            statusError: false,
            submissions: [] as Submission[],
            contests: [] as ContestLite[],
            titles: {} as Record<string, string>,
            solvedCount: null as number | null,
            now: Date.now(),
            timer: 0 as number
        };
    },
    computed: {
        ...mapGetters(["logined", "user_id"]),
        userId (): string {
            return (this as any).user_id || "";
        },
        task (): Submission | null {
            return pickCurrentTask(this.submissions);
        },
        taskTitle (): string {
            return this.task ? this.titleOf(this.task.problem_id) : "";
        },
        draft (): boolean {
            if (!this.task) {
                return false;
            }
            const key = draftKey({ problem_id: String(this.task.problem_id) });
            return !!(key && loadDraft(key));
        },
        passPercent (): number {
            const r = this.task ? Number(this.task.pass_rate) : NaN;
            return Number.isFinite(r) ? Math.round(r * 100) : 0;
        },
        passSquares (): string[] | null {
            if (!this.task || this.task.result === 11 || !Number.isFinite(Number(this.task.pass_rate))) {
                return null;
            }
            const ok = Math.min(9, Math.floor(this.passPercent / 10));
            return Array.from({ length: 10 }, (_, i) => (i < ok ? "ac" : i === ok ? "wa" : ""));
        },
        recent (): Submission[] {
            // newest submission per problem, so ten retries of one problem don't fill the list
            const seen: Record<string, boolean> = {};
            const out: Submission[] = [];
            for (const s of this.submissions) {
                const key = `${s.contest_id || ""}:${s.problem_id}`;
                if (!seen[key]) {
                    seen[key] = true;
                    out.push(s);
                }
            }
            return out.slice(0, 5);
        },
        recentAc (): number[] {
            const seen: number[] = [];
            for (const s of this.submissions) {
                const pid = Number(s.problem_id);
                if (s.result === 4 && seen.indexOf(pid) < 0) {
                    seen.push(pid);
                }
            }
            return seen.slice(0, 12);
        },
        nextContest (): ContestLite | null {
            return pickNextContest(this.contests, this.now);
        },
        running (): ContestLite[] {
            return pickRunning(this.contests, this.now).slice(0, 4);
        },
        clock (): Countdown {
            return countdown(this.nextContest ? new Date(this.nextContest.start_time).getTime() - this.now : 0);
        }
    },
    watch: {
        logined (v: boolean) {
            if (v) {
                this.loadUserData();
            }
        }
    },
    mounted () {
        document.title = `Home -- ${this.$t("oj-name")}`;
        this.timer = window.setInterval(() => {
            this.now = Date.now();
        }, 1000);
        this.loadContests();
        if ((this as any).logined) {
            this.loadUserData();
        }
        else {
            this.loading.status = false;
        }
    },
    beforeDestroy () {
        window.clearInterval(this.timer);
    },
    methods: {
        pad2,
        relativeTime,
        switchToClassic (): void {
            setUiMode("classic");
        },
        resultClass,
        resultShort,
        resultText (code: number): string {
            return RESULT_TEXT[code] || resultShort(code);
        },
        titleOf (pid: number | string): string {
            return this.titles[String(pid)] || "";
        },
        submissionLink (s: Submission): string {
            return `/status?problem_id=${s.problem_id}&user_id=${this.userId}`;
        },
        formatDate (t: string): string {
            const d = new Date(t);
            return `${d.getMonth() + 1} 月 ${d.getDate()} 日 ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
        },
        endsIn (t: string): string {
            const ms = new Date(t).getTime() - this.now;
            const c = countdown(ms);
            if (c.days >= 1) {
                return `还剩 ${c.days} 天`;
            }
            if (c.hours >= 1) {
                return `还剩 ${c.hours} 小时`;
            }
            return `还剩 ${Math.max(1, c.minutes)} 分钟`;
        },
        loadUserData (): void {
            this.loadStatus();
            this.loadSolved();
        },
        loadStatus (): void {
            if (!this.userId) {
                this.loading.status = false;
                return;
            }
            this.loading.status = true;
            this.statusError = false;
            this.axios.get(`/api/status/null/${encodeURIComponent(this.userId)}/null/null/0/0/0`)
                .then(({ data }: any) => {
                    this.submissions = Array.isArray(data && data.result) ? data.result : [];
                    this.loadTitles();
                })
                .catch(() => {
                    this.statusError = true;
                })
                .finally(() => {
                    this.loading.status = false;
                });
        },
        loadTitles (): void {
            const ids: number[] = [];
            const task = this.task;
            if (task) {
                ids.push(Number(task.problem_id));
            }
            this.recent.forEach(s => {
                if (!s.contest_id && ids.indexOf(Number(s.problem_id)) < 0) {
                    ids.push(Number(s.problem_id));
                }
            });
            ids.slice(0, 6).forEach(id => {
                if (this.titles[String(id)]) {
                    return;
                }
                this.axios.get("/api/problem/local", { params: { id } })
                    .then(({ data }: any) => {
                        const title = data && data.problem && data.problem.title;
                        if (title) {
                            this.$set(this.titles, String(id), shortTitle(title));
                        }
                    })
                    .catch(() => undefined);
            });
        },
        loadSolved (): void {
            if (!this.userId) {
                return;
            }
            this.axios.get("/api/ranklist", { params: { page: 0, search: this.userId, time_stamp: "" } })
                .then(({ data }: any) => {
                    const row = data && Array.isArray(data.ranklist) ? data.ranklist.find((r: any) => r.user_id === this.userId) : null;
                    this.solvedCount = row ? Number(row.solved) || 0 : null;
                })
                .catch(() => undefined);
        },
        loadContests (): void {
            this.loading.contest = true;
            this.axios.get("/api/contest/list", { params: { page: 1 } })
                .then(({ data }: any) => {
                    this.contests = Array.isArray(data && data.data) ? data.data : [];
                })
                .catch(() => undefined)
                .finally(() => {
                    this.loading.contest = false;
                });
        }
    }
});
</script>

<style scoped>
    .pa-home {
        min-height: 100vh;
        padding: 96px 0 64px;
    }

    .pa-home-inner {
        max-width: 1240px;
        margin: 0 auto;
        padding: 0 28px;
    }

    .pa-row1 {
        display: grid;
        grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
        gap: 40px;
        margin-bottom: 44px;
    }

    .pa-side {
        display: flex;
        flex-direction: column;
        gap: 32px;
    }

    .pa-task {
        padding: 40px 44px 44px;
        min-height: 320px;
    }

    .pa-task-balloon {
        position: absolute;
        right: 40px;
        top: -34px;
    }

    .pa-kicker {
        color: var(--pa-y);
        font-size: 15px;
        margin-bottom: 16px;
    }

    .pa-task-title {
        font-size: 36px;
        line-height: 1.25;
        margin: 0 0 18px;
        padding-right: 90px;
        color: var(--pa-ink);
        word-break: break-word;
    }

    .pa-task-line {
        display: flex;
        gap: 12px;
        align-items: center;
        font-size: 15px;
        color: #c9c8ee;
        margin-bottom: 16px;
    }

    .pa-task-cases {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-bottom: 28px;
        font-size: 13px;
    }

    .pa-task-cases .pa-px:first-child {
        margin-right: 10px;
    }

    .pa-task-cases .pa-px:last-child {
        margin-left: 8px;
    }

    .pa-solved {
        display: flex;
        align-items: baseline;
        gap: 12px;
        margin: 6px 0 26px;
    }

    .pa-solved-num {
        font-size: 48px;
        line-height: 1;
        color: var(--pa-ink);
        text-shadow: 4px 4px 0 var(--pa-shadow);
    }

    .pa-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 18px;
        margin-top: 8px;
    }

    .pa-clock {
        padding: 26px 24px 22px;
    }

    .pa-center {
        text-align: center;
    }

    .pa-clock-digits {
        font-size: 60px;
        line-height: 1;
        text-align: center;
        margin: 16px 0 8px;
        text-shadow: 4px 4px 0 var(--pa-shadow);
        color: var(--pa-ink);
    }

    .pa-clock-digits span {
        color: var(--pa-y);
    }

    .pa-clock-units {
        text-align: center;
        word-spacing: 18px;
        color: var(--pa-ink);
        margin-bottom: 8px;
    }

    .pa-clock-link {
        margin-top: 10px;
    }

    .pa-shelf {
        padding: 20px 24px 22px;
    }

    .pa-head {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 12px;
    }

    .pa-y {
        color: var(--pa-y);
    }

    .pa-more {
        font-size: 13px;
    }

    .pa-more:hover,
    .pa-link:hover {
        color: var(--pa-ink);
    }

    .pa-link {
        color: var(--pa-mute);
        font-family: var(--pa-font-px);
        cursor: pointer;
    }

    .pa-balloons {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    .pa-balloons a {
        transition: transform .15s;
    }

    .pa-balloons a:hover {
        transform: translateY(-4px);
    }

    .pa-row2 {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 40px;
    }

    .pa-list {
        padding: 22px 26px 12px;
        min-height: 300px;
    }

    .pa-h {
        font-size: 18px;
        color: var(--pa-ink);
    }

    .pa-item {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px 0;
        border-bottom: 2px dashed var(--pa-line2);
        color: var(--pa-ink);
    }

    .pa-item:last-child {
        border-bottom: 0;
    }

    .pa-item:hover .pa-item-title {
        color: var(--pa-y);
    }

    .pa-item-main {
        flex: 1;
        min-width: 0;
    }

    .pa-item-title {
        font-size: 15px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .pa-item-sub {
        font-size: 12px;
        color: var(--pa-mute);
        margin-top: 3px;
    }

    .pa-tag {
        font-size: 13px;
        padding: 3px 8px;
        background: #2c2c58;
        color: var(--pa-mute);
    }

    .pa-empty {
        padding: 18px 0;
        line-height: 1.7;
    }

    .pa-skel {
        background: #2c2c58;
        margin-bottom: 18px;
        animation: pa-pulse 1.2s steps(3) infinite;
    }

    .pa-skel-sm { height: 16px; width: 40%; }
    .pa-skel-md { height: 18px; width: 70%; }
    .pa-skel-lg { height: 40px; width: 85%; }

    @keyframes pa-pulse {
        50% { opacity: .45; }
    }

    @media (max-width: 1000px) {
        .pa-row1,
        .pa-row2 {
            grid-template-columns: minmax(0, 1fr);
            gap: 32px;
        }
    }

    @media (max-width: 640px) {
        .pa-home {
            padding-top: 84px;
        }

        .pa-home-inner {
            padding: 0 16px;
        }

        .pa-task {
            padding: 26px 22px 28px;
            min-height: 0;
        }

        .pa-task-title {
            font-size: 24px;
            padding-right: 60px;
        }

        .pa-task-balloon {
            right: 18px;
            transform: scale(.7);
            transform-origin: top right;
        }

        .pa-actions .pa-btn.pa-primary {
            flex: 1 1 100%;
            justify-content: center;
        }

        .pa-clock-digits {
            font-size: 40px;
        }
    }
</style>
