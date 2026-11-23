<template>
    <div class="pa-card pa-st-table" :class="{ 'pa-reloading': dim, 'pa-admin': isadmin }">
        <div class="pa-st-row pa-st-head pa-px">
            <span>{{ $t("pa.st.runId") }}</span>
            <span>{{ $t("pa.st.user") }}</span>
            <span>{{ $t("pa.st.problem") }}</span>
            <span>{{ $t("pa.st.result") }}</span>
            <span>{{ $t("pa.st.time") }}</span>
            <span>{{ $t("pa.st.memory") }}</span>
            <span>{{ $t("pa.st.language") }}</span>
            <span>{{ $t("pa.st.time2") }}</span>
        </div>
        <div :class="{ mine: self && row.user_id === self, fresh: isFresh(row), sim: row.sim }" :key="row.solution_id"
             :title="isadmin && row.ip ? `IP: ${row.ip}` : null" class="pa-st-row" v-for="row in problem_lists">
            <span class="pa-px pa-mute">{{ row.solution_id }}</span>
            <span class="pa-st-user">
                <router-link :to="`/user/${row.user_id}`">{{ row.nick || row.user_id }}</router-link>
                <small class="pa-dim pa-px">{{ row.user_id }}</small>
            </span>
            <span class="pa-st-prob">
                <router-link :to="`/problem/submit/${Math.abs(row.problem_id)}`" class="pa-px" v-if="row.problem_id">{{ Math.abs(row.problem_id) }}</router-link>
                <span class="pa-dim" v-else>—</span>
                <router-link :to="`/contest/${row.contest_id}`" class="pa-dim pa-st-cid" v-if="isadmin && row.contest_id">{{ $t("pa.home.contestN", { id: row.contest_id }) }}</router-link>
            </span>
            <span class="pa-st-res">
                <router-link :class="resClass(row.result)" :to="`/status/info/${infoRoute(row.result)}/${row.solution_id}`"
                             class="pa-result pa-px">{{ resLabel(row.result) }}</router-link>
                <span class="pa-px pa-mute pa-st-pts" v-if="showPoints(row)">{{ row.pass_point || 0 }}/{{ row.total_point }}</span>
                <router-link :to="`/compare/${row.solution_id}/${row.sim_id}`" class="pa-px pa-st-sim" v-if="row.sim">{{ row.sim }}%</router-link>
                <span class="pa-px pa-y pa-st-new" v-if="isFresh(row)">NEW</span>
            </span>
            <span class="pa-px pa-mute">{{ finished(row) ? time_parse(row.time) : "—" }}</span>
            <span class="pa-px pa-mute">{{ finished(row) ? memText(row.memory) : "—" }}</span>
            <span class="pa-st-lang">
                <span>
                    <router-link :title="$t('pa.st.code')" :to="`/usercode/local/${row.solution_id}`" v-if="canView(row)">{{ language_name[row.language] }}</router-link>
                    <span class="pa-mute" v-else>{{ language_name[row.language] }}</span>
                    <router-link :to="`/problem/submit/${Math.abs(row.problem_id)}/${Math.abs(row.solution_id)}`" class="pa-dim pa-st-edit"
                                 v-if="canView(row) && row.problem_id"> · {{ $t("pa.st.edit") }}</router-link>
                </span>
            </span>
            <span class="pa-mute pa-st-when" :title="dayjs(row.in_date).format('YYYY-MM-DD HH:mm:ss') + (row.judger ? ' · ' + row.judger : '')">{{ ago(row.in_date) }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { statusTableMixin } from "@/mixin/status-table-mixin.component";
import { isPending, relativeParts, resultClass, resultShort } from "@/util/pixelArena";

export default defineComponent({
    name: "StArenaTable",
    mixins: [statusTableMixin],
    props: {
        dim: { type: Boolean, default: false },
        now: { type: Number, default: () => Date.now() }
    },
    methods: {
        memText (m: any): string {
            const kb = parseInt(m);
            return isNaN(kb) ? "—" : kb >= 1024 ? `${(kb / 1024).toFixed(1)}MB` : `${kb}KB`;
        },
        resClass (code: number): string {
            return resultClass(Number(code));
        },
        resLabel (code: number): string {
            const c = Number(code);
            const key = `pa.result.${c}`;
            return (isPending(c) || c === 13 || c >= 15) && this.$te(key) ? (this.$t(key) as string) : resultShort(c);
        },
        finished (row: any): boolean {
            return !isPending(Number(row.result)) && Number(row.result) !== 11;
        },
        showPoints (row: any): boolean {
            const r = Number(row.result);
            return !!row.total_point && r !== 4 && r !== 11 && r !== 13;
        },
        canView (row: any): boolean {
            return this.self === row.user_id || !!this.isadmin || row.share == 1;
        },
        isFresh (row: any): boolean {
            const t = new Date(row.in_date).getTime();
            return Number.isFinite(t) && this.now - t < 60 * 1000;
        },
        ago (time: string): string {
            const p = relativeParts(time, this.now);
            return p.key === "date" ? (p.date as string) : (this.$t(`pa.ago.${p.key}`, { n: p.n }) as string);
        }
    }
});
</script>

<style scoped>
    .pa-st-table {
        padding: 8px 16px 10px;
        transition: opacity .2s;
    }

    .pa-reloading {
        opacity: .55;
    }

    .pa-st-row {
        display: grid;
        grid-template-columns: 96px minmax(0, 1.2fr) minmax(0, .8fr) 190px 80px 90px minmax(0, .9fr) 110px;
        align-items: center;
        gap: 12px;
        min-height: 58px;
        padding: 6px 12px;
        border-bottom: 2px dashed var(--pa-line2);
        color: var(--pa-ink);
        font-size: 14px;
    }

    .pa-st-row:last-child {
        border-bottom: 0;
    }

    .pa-st-head {
        min-height: 44px;
        color: var(--pa-mute);
        border-bottom: 3px solid var(--pa-line2);
    }

    .pa-st-row.mine {
        background: rgba(255, 216, 74, .06);
        box-shadow: inset 4px 0 0 var(--pa-y);
    }

    .pa-st-row.fresh {
        animation: pa-st-in .6s steps(4);
    }

    .pa-st-row.sim {
        background: rgba(255, 154, 46, .08);
    }

    @keyframes pa-st-in {
        from { background: rgba(255, 216, 74, .22); }
    }

    .pa-st-user, .pa-st-prob, .pa-st-lang {
        display: flex;
        flex-direction: column;
        min-width: 0;
        line-height: 1.35;
    }

    .pa-st-user a, .pa-st-lang a {
        color: var(--pa-ink);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .pa-st-user small {
        font-size: 11px;
    }

    .pa-st-prob a.pa-px {
        color: var(--pa-ink);
        font-size: 15px;
    }

    .pa-st-cid, .pa-st-edit {
        font-size: 12px;
    }

    .pa-st-res {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
    }

    .pa-st-pts, .pa-st-sim, .pa-st-new {
        font-size: 12px;
    }

    .pa-st-sim {
        color: var(--pa-tle);
    }

    .pa-st-when {
        font-size: 13px;
    }

    a.pa-result {
        color: #15152b !important;
    }

    a.pa-result.pd, a.pa-result.run {
        color: #fff !important;
    }

    .pa-result.pd {
        animation: pa-st-blink 1s steps(2) infinite;
    }

    @keyframes pa-st-blink {
        50% { opacity: .55; }
    }
</style>
