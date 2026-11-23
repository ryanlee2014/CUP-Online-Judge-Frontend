<template>
    <aside class="pa-ps-side">
        <div class="pa-card pa-ps-box">
            <div class="pa-px pa-mute pa-ps-h">{{ $t("pa.ps.myProgress") }}</div>
            <template v-if="userId">
                <div class="pa-ps-big">
                    <span class="pa-px pa-ps-num">{{ solved === null ? "…" : solved }}</span>
                    <span class="pa-mute">/ {{ total || "…" }} {{ $t("pa.ps.problems") }}</span>
                </div>
                <div class="pa-ps-line">
                    <span>{{ $t("pa.ps.thisPage") }}</span>
                    <span class="pa-ps-mini">
                        <i :class="c" :key="i" v-for="(c, i) in pageCells"></i>
                    </span>
                </div>
                <div class="pa-ps-legend pa-mute">
                    <span><i class="ac"></i>{{ $t("pa.ps.passedN", { n: pageStat.ac }) }}</span>
                    <span><i class="wa"></i>{{ $t("pa.ps.stuckN", { n: pageStat.stuck }) }}</span>
                    <span><i></i>{{ $t("pa.ps.untriedN", { n: pageStat.todo }) }}</span>
                </div>
            </template>
            <div class="pa-mute pa-ps-tip" v-else>{{ $t("pa.ps.loginTip") }}</div>
        </div>

        <div class="pa-card pa-ps-box" v-if="userId">
            <div class="pa-ps-hrow">
                <span class="pa-px pa-mute pa-ps-h">{{ $t("pa.ps.recentBalloons") }}</span>
                <router-link class="pa-px pa-mute pa-more" :to="`/user/${userId}`">{{ $t("pa.home.all") }} ▶</router-link>
            </div>
            <div class="pa-ps-balloons" v-if="balloons.length">
                <router-link :key="id" :title="String(id)" :to="`/problem/submit/${id}`" v-for="id in balloons">
                    <PixelBalloon :problem-id="id" :size="4"/>
                </router-link>
            </div>
            <div class="pa-mute pa-ps-tip">{{ $t("pa.home.balloonHint") }}</div>
        </div>

        <slot></slot>
    </aside>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PixelBalloon from "@/components/pixel/PixelBalloon.vue";

export default defineComponent({
    name: "PsArenaSide",
    components: { PixelBalloon },
    props: {
        userId: { type: String, default: "" },
        solved: { type: Number, default: null },
        total: { type: [Number, String], default: 0 },
        problems: { type: Array, default: () => [] },
        balloons: { type: Array, default: () => [] }
    },
    computed: {
        pageStat (): { ac: number; stuck: number; todo: number } {
            const s = { ac: 0, stuck: 0, todo: 0 };
            (this.problems as any[]).forEach((p: any) => {
                if (p.ac === true) {
                    s.ac++;
                }
                else if (p.ac === false) {
                    s.stuck++;
                }
                else {
                    s.todo++;
                }
            });
            return s;
        },
        pageCells (): string[] {
            return (this.problems as any[]).map((p: any) => p.ac === true ? "ac" : p.ac === false ? "wa" : "");
        }
    }
});
</script>

<style scoped>
    .pa-ps-side {
        display: flex;
        flex-direction: column;
        gap: 28px;
    }

    .pa-ps-box {
        padding: 22px 24px;
    }

    .pa-ps-h {
        font-size: 15px;
    }

    .pa-ps-hrow {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
    }

    .pa-more {
        font-size: 13px;
    }

    .pa-ps-big {
        margin: 10px 0 16px;
    }

    .pa-ps-num {
        font-size: 48px;
        line-height: 1;
        color: var(--pa-ink);
        margin-right: 8px;
    }

    .pa-ps-line {
        display: flex;
        white-space: nowrap;
        align-items: center;
        gap: 12px;
        color: var(--pa-mute);
        font-size: 14px;
    }

    .pa-ps-mini {
        display: flex;
        flex-wrap: wrap;
        gap: 2px;
    }

    .pa-ps-mini i {
        width: 6px;
        height: 14px;
        background: #34346a;
    }

    .pa-ps-mini i.ac {
        background: var(--pa-ac);
    }

    .pa-ps-mini i.wa {
        background: var(--pa-wa);
    }

    .pa-ps-legend {
        display: flex;
        gap: 14px;
        margin-top: 10px;
        font-size: 13px;
    }

    .pa-ps-legend i {
        display: inline-block;
        width: 10px;
        height: 10px;
        margin-right: 5px;
        background: #34346a;
    }

    .pa-ps-legend i.ac {
        background: var(--pa-ac);
    }

    .pa-ps-legend i.wa {
        background: var(--pa-wa);
    }

    .pa-ps-balloons {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 10px;
        margin: 16px 0 12px;
    }

    .pa-ps-tip {
        margin-top: 10px;
        font-size: 13px;
        line-height: 1.6;
    }
</style>
