<template>
    <div class="pa-card pa-ps-table" :class="{ 'pa-reloading': reloading, 'pa-notag': !show_tag }">
        <div class="pa-ps-row pa-ps-head pa-px">
            <span class="c-st"></span>
            <a class="c-id" @click="$emit('sort', 'problem_id', 0)">{{ $t("pa.ps.id") }}<i class="pa-ord" v-if="order_target === 'problem_id'">{{ order ? "▼" : "▲" }}</i></a>
            <span class="c-title">{{ $t("pa.ps.title") }}</span>
            <span class="c-tag" v-if="show_tag">{{ $t("pa.ps.tags") }}</span>
            <a class="c-rate" @click="$emit('sort', 'present', 1)">{{ $t("pa.ps.rate") }}<i class="pa-ord" v-if="order_target === 'present'">{{ order ? "▼" : "▲" }}</i></a>
            <a class="c-cnt" @click="$emit('sort', 'accepted', 1)">{{ $t("pa.ps.accepted") }}<i class="pa-ord" v-if="order_target === 'accepted'">{{ order ? "▼" : "▲" }}</i></a>
            <span class="c-diff">{{ $t("pa.ps.difficulty") }}</span>
        </div>
        <div :key="row.problem_id" class="pa-ps-row" :class="{ stuck: row.ac === false }" v-for="row in rows">
            <span class="c-st">
                <router-link :to="`/problem/submit/${row.problem_id}`" v-if="row.ac === true" :title="$t('pa.ps.passed')">
                    <PixelBalloon :problem-id="row.problem_id" :size="3"/>
                </router-link>
                <i class="pa-sq wa" v-else-if="row.ac === false" :title="$t('pa.ps.tried')"></i>
                <i class="pa-sq-empty" v-else></i>
            </span>
            <span class="c-id pa-px">{{ row.problem_id }}</span>
            <span class="c-title">
                <router-link class="pa-ps-title" :to="`/problem/submit/${row.problem_id}`" v-html="row.title || ''"></router-link>
                <sub class="pa-new pa-px" v-if="row.new">NEW</sub>
                <span class="pa-ps-last" v-if="row.ac === false && stuck[row.problem_id]">{{ stuck[row.problem_id] }}</span>
            </span>
            <span class="c-tag" v-if="show_tag">
                <a :key="t" class="pa-chip" @click="$emit('tag', t)" v-for="t in topicLabels(row)">{{ t }}</a>
            </span>
            <span class="c-rate">
                <span class="pa-bar"><i :class="{ on: n <= rateCells(row) }" :key="n" v-for="n in 10"></i></span>
                <span class="pa-px pa-mute">{{ ratePct(row) }}%</span>
            </span>
            <span class="c-cnt pa-px pa-mute">{{ row.accepted }}/{{ row.submit }}</span>
            <span class="c-diff">
                <template v-if="difficulty(row)">
                    <i :class="{ on: n <= difficulty(row).stars }" :key="n" class="pa-star" v-for="n in 4">★</i>
                </template>
                <span class="pa-dim" v-else>—</span>
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PixelBalloon from "@/components/pixel/PixelBalloon.vue";
import { markdownWorkerMixin } from "@/mixin/MarkdownWorkerMixin";
import { DIFFICULTY_STARS, passCells, passPercent } from "@/util/problemsetArena";

export default defineComponent({
    name: "PsArenaTable",
    components: { PixelBalloon },
    mixins: [markdownWorkerMixin],
    props: {
        problems: { type: Array, default: () => [] },
        show_tag: { type: Boolean, default: false },
        hide_currect: { type: Boolean, default: false },
        order: { default: 0 as any },
        order_target: { type: String, default: "" },
        stuck: { type: Object, default: () => ({}) },
        reloading: { type: Boolean, default: false }
    },
    data () {
        return { titles: {} as Record<string, string> };
    },
    computed: {
        rows (): any[] {
            const hide = this.hide_currect;
            return (this.problems as any[])
                .filter((r: any) => !(hide && r.ac === true))
                .map((r: any) => Object.assign({}, r, { title: this.titles[r.problem_id] }));
        }
    },
    watch: {
        problems: {
            immediate: true,
            handler (list: any[]): void {
                (list || []).forEach(async (p: any) => {
                    if (typeof p.title === "string" && this.titles[p.problem_id] === undefined) {
                        this.$set(this.titles, p.problem_id, await (this as any).renderRawAsync(p.title));
                    }
                });
            }
        }
    },
    methods: {
        labels (row: any): string[] {
            const l = row.label;
            if (Array.isArray(l)) {
                return l;
            }
            return typeof l === "string" && l.trim() ? l.trim().split(/\s+/) : [];
        },
        topicLabels (row: any): string[] {
            return this.labels(row).filter(t => DIFFICULTY_STARS[t] === undefined && t !== "标签待整理");
        },
        difficulty (row: any): { name: string; stars: number } | null {
            const d = this.labels(row).find(t => DIFFICULTY_STARS[t] !== undefined);
            return d ? { name: d, stars: DIFFICULTY_STARS[d] } : null;
        },
        rateCells (row: any): number {
            return passCells(row.accepted, row.submit);
        },
        ratePct (row: any): number {
            return passPercent(row.accepted, row.submit);
        }
    }
});
</script>

<style scoped>
    .pa-ps-table {
        padding: 8px 16px 10px;
        transition: opacity .2s;
    }

    .pa-reloading {
        opacity: .55;
    }

    .pa-ps-row {
        display: grid;
        grid-template-columns: 36px 64px minmax(0, 1fr) 200px 150px 96px 72px;
        align-items: center;
        gap: 14px;
        min-height: 58px;
        padding: 8px 10px;
        border-bottom: 2px dashed var(--pa-line2);
        color: var(--pa-ink);
    }

    .pa-notag .pa-ps-row {
        grid-template-columns: 36px 64px minmax(0, 1fr) 150px 96px 72px;
    }

    .pa-ps-row:last-child {
        border-bottom: 0;
    }

    .pa-ps-row:not(.pa-ps-head):hover {
        background: rgba(255, 255, 255, .03);
    }

    .pa-ps-head {
        min-height: 44px;
        color: var(--pa-mute);
        font-size: 14px;
        border-bottom: 3px solid var(--pa-line2);
    }

    .pa-ps-head a {
        color: var(--pa-mute);
        cursor: pointer;
    }

    .pa-ps-head a:hover {
        color: var(--pa-ink);
    }

    .pa-ord {
        font-style: normal;
        margin-left: 4px;
        color: var(--pa-y);
        font-size: 11px;
    }

    .pa-ps-row.stuck {
        background: rgba(255, 216, 74, .06);
        box-shadow: inset 4px 0 0 var(--pa-y);
    }

    .c-st {
        display: flex;
        justify-content: center;
    }

    .c-id {
        color: var(--pa-mute);
        font-size: 15px;
    }

    .c-title {
        min-width: 0;
        line-height: 1.45;
    }

    .pa-ps-title {
        color: var(--pa-ink) !important;
        font-size: 16px;
    }

    .pa-ps-title:hover {
        color: var(--pa-y) !important;
    }

    .pa-ps-title >>> p {
        display: inline;
        margin: 0;
    }

    .pa-new {
        color: var(--pa-y);
        margin-left: 6px;
        font-size: 11px;
    }

    .pa-ps-last {
        display: block;
        margin-top: 2px;
        font-size: 13px;
        color: #b7a76a;
    }

    .c-tag {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        justify-content: flex-end;
    }

    .pa-chip {
        padding: 1px 8px;
        font-size: 13px;
        color: var(--pa-mute);
        background: #2c2c5a;
        cursor: pointer;
        white-space: nowrap;
    }

    .pa-chip:hover {
        color: var(--pa-ink);
        background: #383870;
    }

    .c-rate {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
    }

    .pa-bar {
        display: inline-flex;
        gap: 2px;
    }

    .pa-bar i {
        width: 7px;
        height: 14px;
        background: #34346a;
    }

    .pa-bar i.on {
        background: #b9b8ec;
    }

    .c-cnt {
        font-size: 13px;
        text-align: right;
    }

    .c-diff {
        white-space: nowrap;
        font-size: 14px;
    }

    .pa-star {
        font-style: normal;
        color: #3c3c74;
    }

    .pa-star.on {
        color: var(--pa-y);
    }

    .pa-sq-empty {
        display: inline-block;
        width: 14px;
        height: 14px;
        border: 2px solid #4a4a86;
    }

    .pa-sq {
        margin-right: 0;
    }
</style>
