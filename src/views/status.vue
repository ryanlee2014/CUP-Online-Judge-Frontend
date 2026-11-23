<template>
    <div class="ui container padding" v-if="contestMode">
        <ContestMode/>
    </div>
    <div class="pa-st-wrap" v-else-if="arena">
        <st-arena-hero :language-name="mine ? (language_name[mine.language] || '') : ''"
                       :memory="mine ? memoryText(mine.memory) : ''" :sub="mine" :time="mine ? timeText(mine.time) : ''"
                       :title="mineTitle" class="pa-st-herobox" v-if="myId"></st-arena-hero>
        <div class="pa-st-tabs">
            <button :class="{ on: current_tag === t.k }" :key="t.k" @click="tag(t.k, $event)" class="pa-btn pa-tab"
                    v-for="t in arenaTabs">{{ $t(t.l) }}</button>
        </div>
        <template v-if="current_tag === 'status'">
            <div class="pa-st-bar">
                <button :class="{ on: user_id !== myId || !myId }" @click="onlyMe(false)" class="pa-btn pa-tab">{{ $t("pa.st.all") }}</button>
                <button :class="{ on: !!myId && user_id === myId }" @click="onlyMe(true)" class="pa-btn pa-tab" v-if="myId">{{ $t("pa.st.onlyMe") }}</button>
                <label class="pa-st-field"><span class="pa-mute">{{ $t("pa.st.problem") }}</span>
                    <input @keypress.enter="search" size="6" type="text" v-model="problem_id"></label>
                <label class="pa-st-field"><span class="pa-mute">{{ $t("pa.st.user") }}</span>
                    <input @keypress.enter="search" size="10" type="text" v-model="user_id"></label>
                <label class="pa-st-field"><span class="pa-mute">{{ $t("pa.st.language") }}</span>
                    <select @change="search" v-model="language">
                        <option :value="-1">{{ $t("pa.st.any") }}</option>
                        <option :key="i" :value="i" v-for="(n, i) in language_name">{{ n }}</option>
                    </select></label>
                <label class="pa-st-field"><span class="pa-mute">{{ $t("pa.st.result") }}</span>
                    <select @change="search" v-model="problem_result">
                        <option :value="-1">{{ $t("pa.st.any") }}</option>
                        <option :key="i" :value="i" v-for="(n, i) in result">{{ $t(n) }}</option>
                    </select></label>
                <button @click="search" class="pa-btn pa-primary">{{ $t("pa.st.search") }}</button>
                <span class="pa-st-gap"></span>
                <label class="pa-st-check"><input type="checkbox" v-model="auto_refresh"> {{ $t("pa.st.autoRefresh") }}</label>
                <label class="pa-st-check"><input type="checkbox" v-model="sim_checkbox"> {{ $t("pa.st.simOnly") }}</label>
                <label class="pa-st-check" v-if="isadmin"><input :checked="!!privilege" @change="privilege = !privilege" type="checkbox"> {{ $t("pa.st.hideTestRun") }}</label>
            </div>
            <list-state :empty-text="$t('noMatchingSubmission')" :state="listState" @retry="retryList"></list-state>
            <st-arena-table :answer_class="judge_color" :answer_icon="icon_list" :dim="dim && listLoaded"
                            :isadmin="isadmin" :language_name="language_name" :now="now" :problem_list="problem_list"
                            :result="result" :self="self" :target="target"
                            v-show="listLoaded && hasRows"></st-arena-table>
            <div class="pa-st-pages">
                <button :disabled="page_cnt == 0" @click="page(-page_cnt)" class="pa-btn pa-tab">{{ $t("pa.st.top") }}</button>
                <button :disabled="page_cnt == 0" @click="page(-1)" class="pa-btn pa-tab">◀ {{ $t("pa.st.prev") }}</button>
                <span class="pa-px pa-mute">{{ page_cnt + 1 }}</span>
                <button :disabled="problem_list.length == 0" @click="page(1)" class="pa-btn pa-tab">{{ $t("pa.st.next") }} ▶</button>
            </div>
        </template>
        <div class="pa-st-graph" v-else>
            <keep-alive>
                <Graph ref="graph" v-if="current_tag === 'graph'"></Graph>
                <ResultGraph :label-name="labelName" v-if="current_tag === 'result'"></ResultGraph>
                <UserGraph v-if="current_tag === 'user'"></UserGraph>
            </keep-alive>
        </div>
    </div>
    <div class="padding ui container" v-else>
        <h2 class="ui dividing header">
            {{$t("status")}}
        </h2>
        <div class="ui top attached tabular menu">
            <a :class="(current_tag == 'status'?'active':'')+' item'" @click="tag('status',$event)" id="submitstatus"
               v-cloak>{{$t("submit status")}}</a>
            <a :class="(current_tag == 'graph'?'active':'')+' item'" @click="tag('graph',$event)" id="graph" v-cloak>{{$t("submit graph")}}</a>
            <a :class="(current_tag == 'result'?'active':'') + ' item'" @click="tag('result',$event)">
                {{$t("result statistic")}}
            </a>
            <a :class="(current_tag == 'user'?'active':'') + ' item'" @click="tag('user',$event)">
                {{$t("user statistic")}}
            </a>
        </div>
        <div class="ui bottom attached segment" v-show="current_tag === 'status'">
            <div align=center class="input-append">
                <form class="ui form segment" id=simform method="get">
                    <div class="four fields">
                        <div class="field">
                            <label>{{$t("problem_id")}}</label>
                            <input class="form-control" name=problem_id size=4 type=text v-model="problem_id">
                        </div>
                        <div class="field">
                            <label>{{$t("user_id")}}</label>
                            <input class="form-control" name=user_id size=4 type=text v-model="user_id"
                                   value=''>
                        </div>
                        <div class="field">
                            <label>{{$t("language")}}</label>
                            <div class="ui fluid search dropdown selection" size="1">
                                <input @change="language=$event.target.value" name="language"
                                       type="hidden" v-model="language">
                                <i class="dropdown icon"></i>
                                <div class="default text">All</div>
                                <div class="menu">
                                    <div class='item' data-value='-1'>All<i class="dropdown icon"
                                                                            style="visibility: hidden; "></i></div>
                                    <div :data-value="i" :key="i" class="item"
                                         v-for="i in Array.from(Array(language_name?language_name.length:0).keys())">
                                        <i :class="language_icon[i]+' color'"></i>
                                        {{language_name[i]}}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field">
                            <label>{{$t("result")}}</label>
                            <div class="ui fluid search dropdown selection" size="1">
                                <input @change="problem_result=$event.target.value"
                                       type="hidden" v-model="problem_result">
                                <i class="dropdown icon"></i>
                                <div class="default text">All</div>
                                <div class="menu">
                                    <div class='item' data-value='-1'>All<i class="dropdown icon"
                                                                            style="visibility: hidden; "></i></div>
                                    <div :data-value="i" :key="i" class="item"
                                         v-for="i in Array.from(Array(judge_color ? judge_color.length : 0).keys())">
                                        <span :class="judge_color[i]">
                                        <i :class="judge_icon[i]+' icon'"></i>
                                        {{result[i]}}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div :class="(isadmin ? 'five' : 'four')+' fields center aligned'">
                        <div class="field" style="margin:auto">
                            <div class="ui toggle checkbox">
                                <input @click="auto_refresh=!auto_refresh" checked="true" type="checkbox">
                                <label>{{$t("auto refresh")}}</label>
                            </div>
                        </div>
                        <div class="field" style="margin:auto">
                            <div class="ui toggle checkbox">
                                <input @click="sim_checkbox=!sim_checkbox" type="checkbox">
                                <label>{{$t("show cheat only")}}</label>
                            </div>
                        </div>
                        <div class="field" style="margin:auto" v-if="isadmin">
                            <div class="ui toggle checkbox">
                                <input @click="privilege=!privilege" type="checkbox">
                                <label>{{$t("test run invisible")}}</label>
                            </div>
                        </div>
                        <div class="field" style="margin:auto">
                            <div class="ui toggle checkbox">
                                <input @click="list_self_only" type="checkbox">
                                <label>{{$t("show user only")}}</label>
                            </div>
                        </div>
                        <div class="field" style="margin:auto">
                            <button @click.prevent="search($event)" class="ui labeled icon mini button">
                                <i class="search icon"></i>{{$t("search")}}
                            </button>
                        </div>

                    </div>
                </form>
            </div>
            <br>
            <div class="row">
                <list-state :empty-text="$t('noMatchingSubmission')" :state="listState"
                            @retry="retryList"></list-state>
                <status-table :answer_class="judge_color" :answer_icon="icon_list"
                              :isadmin="isadmin" :language_name="language_name" :problem_list="problem_list"
                              :result="result"
                              :self="self"
                              :target="target"
                              v-show="listLoaded && hasRows"></status-table>
                <div class="ui active inverted dimmer" v-if="dim && listLoaded">
                    <div class="ui large text loader">Loading</div>
                </div>
            </div>
            <br>
            <div class="row">
                <a :class="'ui button '+(page_cnt == 0?'disabled':'')" @click="page_cnt != 0 && page(-page_cnt,$event)"
                   v-cloak>Top</a>
                <div class="ui buttons">
                    <button :class="'ui left labeled icon button '+(page_cnt == 0?'disabled':'')" @click="page_cnt!=0&&page(-1,$event)"
                            v-cloak>
                        <i class="left arrow icon"></i>
                        Prev
                    </button>
                    <div class="or" v-cloak></div>
                    <button :class="'ui right labeled icon button '+(problem_list.length == 0?'disabled':'')" @click="problem_list.length != 0 && page(1,$event)"
                            v-cloak>
                        <i class="right arrow icon"></i>
                        Next
                    </button>
                </div>
            </div>
        </div>
        <keep-alive>
            <Graph v-if="current_tag === 'graph'" ref="graph"></Graph>
            <ResultGraph v-if="current_tag === 'result'" :label-name="labelName"></ResultGraph>
            <UserGraph v-if="current_tag === 'user'"></UserGraph>
        </keep-alive>
    </div>
</template>
<i18n>
    {
    "zh-cn": {
    "auto refresh": "自动刷新",
    "show cheat only": "仅显示判重提交",
    "test run invisible": "不显示测试运行",
    "show user only": "仅显示本人提交",
    "submit status": "提交状态",
    "submit graph": "提交图表",
    "result statistic": "结果统计",
    "user statistic": "用户统计",
    "noMatchingSubmission": "没有符合条件的提交"
    },
    "en": {
    "auto refresh": "Auto Refresh",
    "show cheat only": "Show Cheating Only",
    "test run invisible": "Exclude Test Run",
    "submit status": "Submit Status",
    "show user only": "Show Yourself Only",
    "submit graph": "Submission Graph",
    "result statistic": "Result Statistics",
    "user statistic": "User statistics",
    "noMatchingSubmission": "No submissions match the current filter"
    },
    "ja": {
    "auto refresh": "自動リフレッシュ",
    "show cheat only": "チート提出のみを表示",
    "test run invisible": "テスト提出非表示",
    "submit status": "提出リスト",
    "show user only": "自分だけを表示",
    "submit graph": "提出グラフ",
    "result statistics": "結果統計",
    "user statistic": "ユーザー統計",
    "noMatchingSubmission": "条件に一致する提出はありません"
    }
    }
</i18n>
<script lang="ts">
import statusTable from "../components/status/status-table.vue";
import ContestMode from "../components/contestMode/block.vue";
import ListState, { ListStateType } from "../components/common/ListState.vue";
import { initMixin } from "../mixin/init";
import * as _ from "lodash-es";
import md5 from "md5";
import { defineComponent } from "vue";
import { statusViewMixin } from "@/mixin/StatusViewMixin";
import AwaitLock from "await-lock";
import { parameterHash } from "@/util/util";
import { mapGetters } from "vuex";
import StArenaTable from "@/components/status/arena/StArenaTable.vue";
import StArenaHero from "@/components/status/arena/StArenaHero.vue";
import { uiModeState } from "@/util/uiMode";
import { shortTitle } from "@/util/pixelArena";

// Shared by every instance, like the former @Lock(new AwaitLock()) / @RunOnceEachKey decorators on Submit.
const submitLock = new AwaitLock();
const submitRunOnceCache: Record<string, boolean> = {};

function runOnceEachKey (this: any, args: any[]): any {
    const keyHash = md5(parameterHash(args));
    if (!submitRunOnceCache[keyHash]) {
        submitRunOnceCache[keyHash] = true;
        return this.submitHandler(...args);
    }
}

// Same as the former @Lock: acquires, calls without awaiting, releases.
async function lockedSubmit (this: any, args: any[]): Promise<any> {
    await submitLock.acquireAsync();
    const resp = runOnceEachKey.call(this, args);
    submitLock.release();
    return resp;
}

export default defineComponent({
    components: {
        // chart tabs pull in amcharts / chart.js: load them only when a chart tab is opened
        UserGraph: () => import(/* webpackChunkName: "status-graph" */ "@/components/status/UserGraph.vue"),
        ResultGraph: () => import(/* webpackChunkName: "status-graph" */ "@/components/status/ResultGraph.vue"),
        Graph: () => import(/* webpackChunkName: "status-graph" */ "@/components/status/graph.vue"),
        statusTable,
        ContestMode,
        ListState,
        StArenaTable,
        StArenaHero
    },
    mixins: [initMixin, statusViewMixin],
    data () {
        return {
            problem_list: [] as any[],
            icon_list: [] as any[],
            judge_color: [] as any[],
            judge_icon: [] as any[],
            target: {} as any,
            hasDrawedGraph: false,
            language_name: [] as any[],
            result: [] as any[],
            language_icon: [] as any[],
            self: "" as any,
            isadmin: false as any,
            page_cnt: 0,
            dim: false,
            prevSolutionId: 0,
            labelName: [] as any[],
            // list request state (loading skeleton / empty / error + retry)
            listLoaded: false,
            listError: false,
            // 像素赛场: my latest submission pinned on top, live through the socket
            mine: null as any,
            mineTitle: "",
            now: Date.now(),
            arenaTabs: [
                { k: "status", l: "pa.st.tabStatus" },
                { k: "graph", l: "pa.st.tabGraph" },
                { k: "result", l: "pa.st.tabResult" },
                { k: "user", l: "pa.st.tabUser" }
            ]
        };
    },
    computed: {
        ...mapGetters(["contestMode"]),
        arena (): boolean {
            return uiModeState.mode === "arena";
        },
        myId (): string {
            return this.$store.getters.user_id || "";
        },
        hasRows (): boolean {
            return !!this.problem_list && this.problem_list.length > 0;
        },
        listState (): ListStateType {
            if (this.listError) {
                return "error";
            }
            if (!this.listLoaded) {
                return "loading";
            }
            return this.hasRows ? null : "empty";
        }
    },
    watch: {
        myId (): void {
            this.loadMine();
        }
    },
    beforeDestroy () {
        clearInterval((this as any).clock_);
        (this as any).sockets.unsubscribe("submit");
        (this as any).sockets.unsubscribe("result");
    },
    mounted () {
        document.title = `Status -- ${document.title}`;
        this.initData();
        this.loadMine();
        (this as any).clock_ = setInterval(() => {
            this.now = Date.now();
        }, 5000);
        (this as any).sockets.subscribe("submit", (data: any) => {
            this.onMineSubmit(data);
            this.Submit(data);
        });
        (this as any).sockets.subscribe("result", (data: any) => {
            this.onMineResult(data);
            this.Update(data);
        });
    },
    methods: {
        search_func (data: any): void {
            const that = this;
            this.setQuery();
            that.problem_list = data.result;
            that.icon_list = data.const_list.icon_list;
            that.judge_color = data.const_list.judge_color;
            that.target = data.const_list.language.cn.status;
            that.judge_icon = data.const_list.judge_icon;
            that.language_icon = data.const_list.language_icon;
            that.language_name = data.const_list.language_name.local;
            that.result = data.const_list.result.cn;
            that.self = data.self;
            that.isadmin = data.isadmin || data.browse_code;
        },

        /**
         * Runs a status list request (same URL as before) and tracks loaded / error state.
         * Resolves with the response data, or undefined when the request failed (the error state then offers a retry
         * that re-runs exactly the same request).
         */
        requestStatus (url: string, after?: (data: any) => void): Promise<any> {
            const self = this as any;
            const seq = self.listRequestSeq_ = (self.listRequestSeq_ || 0) + 1;
            self.retry_ = () => {
                this.dim = true;
                this.requestStatus(url, after);
            };
            this.listError = false;
            return this.axios.get(url)
                .then(({ data }) => {
                    this.dim = false;
                    this.listLoaded = true;
                    this.search_func(data);
                    if (after) {
                        after(data);
                    }
                    return data;
                }, () => {
                    if (seq === self.listRequestSeq_) {
                        this.dim = false;
                        this.listError = true;
                    }
                    return undefined;
                });
        },

        retryList (): void {
            const retry = (this as any).retry_;
            if (typeof retry === "function") {
                retry();
            }
        },

        search (): Promise<any> {
            this.dim = true;
            this.page_cnt = 0;
            const problemId = this.problem_id || "null";
            const userId = this.user_id || "null";
            const language = this.language == -1 ? "null" : this.language;
            const result = this.problem_result == -1 ? "null" : this.problem_result;
            const pageCount = this.page_cnt * 20;
            const sim = Number(this.sim_checkbox);
            const pri = Number(this.privilege);
            return this.requestStatus(`/api/status/${problemId}/${userId}/${language}/${result}/${pageCount}/${sim}/${pri}`);
        },

        page (num: number): void {
            this.dim = true;
            this.page_cnt += num;
            const problemId = this.problem_id || "null";
            const userId = this.user_id || "null";
            const language = this.language == -1 ? "null" : this.language;
            const result = this.problem_result == -1 ? "null" : this.problem_result;
            const pageCount = this.page_cnt * 20;
            const simCheckbox = Number(this.sim_checkbox);
            const pri = Number(this.privilege);
            this.requestStatus(`/api/status/${problemId}/${userId}/${language}/${result}/${pageCount}/${simCheckbox}/${pri}`);
        },

        loadMine (): void {
            const uid = this.myId;
            if (!uid || !this.arena) {
                return;
            }
            this.axios.get(`/api/status/null/${encodeURIComponent(uid)}/null/null/0/`)
                .then(({ data }: any) => {
                    const last = data && Array.isArray(data.result) ? data.result[0] : null;
                    if (last && (!this.mine || last.solution_id >= this.mine.solution_id)) {
                        this.mine = Object.assign({}, last);
                        this.loadMineTitle();
                    }
                })
                .catch(() => undefined);
        },
        loadMineTitle (): void {
            const id = this.mine ? Math.abs(this.mine.problem_id) : 0;
            this.mineTitle = "";
            if (!id) {
                return;
            }
            this.axios.get("/api/problem/local", { params: { id } })
                .then(({ data }: any) => {
                    const title = data && data.problem && data.problem.title;
                    if (title && this.mine && Math.abs(this.mine.problem_id) === id) {
                        this.mineTitle = shortTitle(title);
                    }
                })
                .catch(() => undefined);
        },
        /** a new submission of mine (from any tab / page) replaces the pinned card, whatever the list filters are */
        onMineSubmit (data: any): void {
            if (!this.arena || !this.myId || !data || data.user_id !== this.myId || !data.val) {
                return;
            }
            if (this.mine && data.submission_id <= this.mine.solution_id) {
                return;
            }
            const changed = !this.mine || Math.abs(this.mine.problem_id) !== Math.abs(data.val.id);
            this.mine = {
                solution_id: data.submission_id,
                problem_id: Math.abs(data.val.id),
                user_id: data.user_id,
                language: data.val.language,
                result: 0,
                pass_point: 0,
                total_point: 0,
                time: 0,
                memory: 0,
                in_date: new Date().toISOString(),
                judger: ""
            };
            if (changed) {
                this.loadMineTitle();
            }
        },
        onMineResult (data: any): void {
            if (!this.mine || !data || Number(data.solution_id) !== Number(this.mine.solution_id)) {
                return;
            }
            this.mine = Object.assign({}, this.mine, {
                result: data.state,
                time: data.time,
                memory: data.memory,
                pass_point: data.pass_point,
                total_point: parseInt(data.total_point) || this.mine.total_point || 0,
                judger: data.judger || this.mine.judger
            });
        },
        onlyMe (on: boolean): void {
            this.user_id = on ? this.myId : null;
            this.search();
        },
        memoryText (m: any): string {
            const kb = parseInt(m);
            return isNaN(kb) ? "" : kb >= 1024 ? `${(kb / 1024).toFixed(1)}MB` : `${kb}KB`;
        },
        timeText (t: any): string {
            const ms = parseInt(t);
            return isNaN(ms) ? "" : `${ms}ms`;
        },
        Submit (data: any): Promise<any> {
            return lockedSubmit.call(this, [data]);
        },

        // body of the former @Lock @RunOnceEachKey Submit
        async submitHandler (data: any): Promise<void> {
            if (!this.auto_refresh) {
                return;
            }
            if (data.submission_id <= this.prevSolutionId) {
                return;
            }
            this.prevSolutionId = data.submission_id;
            if (this.privilege && (data.val.id <= 0 || (data.val.cid && data.val.cid <= 0))) {
                return;
            }
            if (this.sim_checkbox || this.privilege) {
                return;
            }
            if ((!this.user_id || this.user_id === data.user_id) && (this.problem_result === -1) && (this.language === -1 || this.language === data.val.language) && !this.page_cnt && (!this.problem_id || parseInt(this.problem_id) === Math.abs(data.val.id))) {
                const obj: any = {};
                obj.problem_id = Math.abs(data.val.id);
                obj.solution_id = data.submission_id;
                obj.nick = data.nick;
                obj.user_id = data.user_id;
                obj.length = data.val.source.length;
                obj.language = data.val.language;
                obj.memory = obj.time = 0;
                obj.in_date = new Date().toISOString();
                obj.judger = "RATH";
                obj.result = 0;
                obj.ip = data.val.ip;
                obj.total_point = 0;
                obj.fingerprint = data.val.fingerprint;
                obj.fingerprintRaw = data.val.fingerprintRaw;
                obj.sim = false;
                obj.avatar = !!data.val.avatar;
                obj.contest_id = data.val.cid ? Math.abs(data.val.cid) : null;
                obj.sim_id = null;
                this.problem_list.pop();
                this.problem_list.unshift(obj);
            }
        },

        Update (data: any): void {
            if (!this.auto_refresh) {
                return;
            }
            const solution_id = data.solution_id;
            const status = data.state;
            const time = data.time;
            const memory = data.memory;
            const pass_rate = data.pass_rate;
            const sim = data.sim;
            const ip = data.ip;
            const total_point = parseInt(data.total_point) || 0;
            const fingerprint = data.fingerprint;
            const fingerprintRaw = data.fingerprintRaw;
            const pass_point = data.pass_point;
            const that = this;
            _.forEach(this.problem_list, function (val: any, key: any) {
                const i = that.problem_list[key];
                if (i.solution_id == solution_id) {
                    i.result = status;
                    i.time = time;
                    i.memory = memory;
                    i.sim = sim;
                    i.sim_id = data.sim_s_id;
                    i.pass_rate = pass_rate;
                    i.total_point = total_point;
                    i.pass_point = pass_point;
                    i.contest_id = data.contest_id ? Math.abs(data.contest_id) : null;
                    i.ip = ip;
                    i.fingerprint = fingerprint;
                    i.fingerprintRaw = fingerprintRaw;
                }
            });
        },

        initData (): void {
            this.fetchData((data: any) => {
                this.labelName = data.const_list.result.cn;
            });
        },

        fetchData (after?: (data: any) => void): Promise<any> {
            const problem_id = (this.problem_id = this.getProblemID() || null) || "null";
            const user_id = (this.user_id = this.getUserId() || null) || "null";
            const language = (this.language = this.getLanguage() || -1) == -1 ? "null" : this.getLanguage();
            const result = (this.problem_result = this.getResult() || -1) == -1 ? "null" : this.problem_result;
            return this.requestStatus(`/api/status/${problem_id}/${user_id}/${language}/${result}/0/`, after);
        }
    }
});
</script>

<style scoped>
    .ui.form .fields .field .ui.checkbox {
        margin-top: inherit !important;
    }

    /* ---- 像素赛场 ---- */
    .pa-st-wrap {
        max-width: 1440px;
        margin: 0 auto;
        padding: 28px 28px 64px;
    }

    .pa-st-herobox {
        margin-bottom: 36px;
    }

    .pa-st-tabs, .pa-st-bar, .pa-st-pages {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px;
    }

    .pa-st-tabs {
        margin-bottom: 18px;
    }

    .pa-st-bar {
        margin-bottom: 18px;
    }

    .pa-tab {
        height: 40px;
        padding: 0 14px !important;
        font-size: 14px !important;
    }

    .pa-tab.on {
        background: #3a3a7a !important;
        color: #fff !important;
    }

    .pa-tab[disabled] {
        opacity: .4;
        cursor: default;
    }

    .pa-st-bar .pa-primary {
        height: 40px;
    }

    .pa-st-field {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 40px;
        padding: 0 10px;
        background: var(--pa-bg2);
        border: 3px solid var(--pa-line2);
        font-size: 13px;
    }

    .pa-st-field:focus-within {
        border-color: var(--pa-y);
    }

    .pa-st-field input, .pa-st-field select {
        border: 0;
        outline: 0;
        background: transparent;
        color: var(--pa-ink);
        font-size: 14px;
        max-width: 160px;
    }

    .pa-st-field option {
        background: #1b1b3c;
        color: var(--pa-ink);
    }

    .pa-st-gap {
        flex: 1;
    }

    .pa-st-check {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: var(--pa-mute);
        font-size: 13px;
        cursor: pointer;
    }

    .pa-st-check input {
        accent-color: var(--pa-y);
    }

    .pa-st-pages {
        justify-content: center;
        margin-top: 24px;
    }

    .pa-st-graph {
        padding: 20px;
        background: var(--pa-card);
    }
</style>
