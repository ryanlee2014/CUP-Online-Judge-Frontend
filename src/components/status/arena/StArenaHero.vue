<template>
    <div class="pa-card pa-st-hero" :class="state">
        <template v-if="sub">
            <PixelBalloon :class="{ fly: state === 'ac' }" :problem-id="Math.abs(sub.problem_id)" :size="9" class="pa-st-balloon"/>
            <div class="pa-st-mid">
                <div class="pa-px pa-mute pa-st-meta">
                    {{ $t("pa.st.mine") }} #{{ sub.solution_id }}
                    <template v-if="sub.problem_id"> · <router-link :to="`/problem/submit/${Math.abs(sub.problem_id)}`">P{{ Math.abs(sub.problem_id) }} {{ title }}</router-link></template>
                    <template v-if="languageName"> · {{ languageName }}</template>
                </div>
                <div class="pa-px pa-st-big">
                    <template v-if="state === 'pd'">{{ $t("pa.st.judging") }}<template v-if="total"> {{ passed }} / {{ total }}</template><i class="pa-st-cur"></i></template>
                    <router-link :to="`/status/info/${infoRoute}/${sub.solution_id}`" v-else>{{ bigText }}</router-link>
                </div>
                <div class="pa-st-cells" v-if="cells.length">
                    <i :class="c" :key="i" v-for="(c, i) in cells"></i>
                </div>
                <div class="pa-mute pa-st-sub" v-else-if="state === 'pd'">{{ $t("pa.st.pointsUnknown") }}</div>
            </div>
            <div class="pa-st-right pa-px pa-mute">
                <div v-if="sub.judger">{{ $t("pa.st.judger") }} {{ sub.judger }}</div>
                <div v-if="state !== 'pd' && state !== 'ce'">{{ time }} · {{ memory }}</div>
                <div class="pa-st-hint" v-if="state === 'ac'">{{ $t("pa.st.gotBalloon", { color: colorName }) }}</div>
                <div class="pa-st-hint" v-else-if="state !== 'run'">{{ $t("pa.st.balloonUp") }}</div>
            </div>
        </template>
        <div class="pa-mute pa-st-empty" v-else>{{ $t("pa.st.noMine") }}</div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PixelBalloon from "@/components/pixel/PixelBalloon.vue";
import { balloonIndex, resultClass, resultShort } from "@/util/pixelArena";
import { testCells } from "@/util/problemsetArena";

export default defineComponent({
    name: "StArenaHero",
    components: { PixelBalloon },
    props: {
        sub: { type: Object, default: null },
        title: { type: String, default: "" },
        languageName: { type: String, default: "" },
        time: { type: String, default: "" },
        memory: { type: String, default: "" }
    },
    computed: {
        result (): number {
            return Number(this.sub ? (this.sub as any).result : 0);
        },
        state (): string {
            return this.sub ? resultClass(this.result) : "none";
        },
        total (): number {
            return parseInt((this.sub as any)?.total_point) || 0;
        },
        passed (): number {
            return parseInt((this.sub as any)?.pass_point) || 0;
        },
        cells (): string[] {
            return this.sub ? testCells(this.result, (this.sub as any).pass_point, (this.sub as any).total_point) : [];
        },
        bigText (): string {
            const c = this.result;
            const key = `pa.result.${c}`;
            const word = c === 4 ? "AC" : this.$te(key) ? (this.$t(key) as string) : resultShort(c);
            if (c !== 4 && c !== 11 && c !== 13 && this.total) {
                return `${word} · ${this.$t("pa.st.points", { a: this.passed, b: this.total })}`;
            }
            return word;
        },
        infoRoute (): string {
            return this.result === 11 ? "compile" : "runtime";
        },
        colorName (): string {
            const i = balloonIndex(Math.abs((this.sub as any)?.problem_id));
            return this.$t(`pa.balloon.${i}`) as string;
        }
    }
});
</script>

<style scoped>
    .pa-st-hero {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 32px;
        padding: 26px 36px;
        box-shadow: 0 0 0 4px var(--pa-y), 0 8px 0 0 var(--pa-shadow) !important;
    }

    .pa-st-hero.none {
        display: block;
        box-shadow: 0 0 0 3px var(--pa-line2) !important;
    }

    .pa-st-meta {
        font-size: 14px;
    }

    .pa-st-meta a {
        color: var(--pa-mute);
    }

    .pa-st-meta a:hover {
        color: var(--pa-ink);
    }

    .pa-st-big {
        margin: 10px 0 14px;
        font-size: 40px;
        line-height: 1.1;
        color: var(--pa-y);
    }

    .pa-st-big a {
        color: inherit !important;
    }

    .ac .pa-st-big { color: var(--pa-ac); }
    .wa .pa-st-big { color: var(--pa-wa); }
    .tle .pa-st-big { color: var(--pa-tle); }
    .ce .pa-st-big { color: var(--pa-ce); }
    .run .pa-st-big { color: var(--pa-ink); }

    .pa-st-cur {
        display: inline-block;
        width: 14px;
        height: 36px;
        margin-left: 8px;
        vertical-align: -4px;
        background: var(--pa-y);
        animation: pa-cur 1s steps(2) infinite;
    }

    @keyframes pa-cur {
        50% { opacity: 0; }
    }

    .pa-st-cells {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        max-width: 640px;
    }

    .pa-st-cells i {
        width: 22px;
        height: 22px;
        background: #34346a;
    }

    .pa-st-cells i.ac { background: var(--pa-ac); }
    .pa-st-cells i.bad { background: var(--pa-wa); }
    .pa-st-cells i.run { background: var(--pa-y); animation: pa-cur 1s steps(2) infinite; }

    .pa-st-right {
        text-align: right;
        font-size: 14px;
        line-height: 2;
    }

    .pa-st-hint {
        color: var(--pa-ink);
    }

    .pa-st-sub, .pa-st-empty {
        font-size: 14px;
    }

    .pa-st-balloon.fly {
        animation: pa-fly 1.2s steps(6) 1;
    }

    @keyframes pa-fly {
        from { transform: translateY(40px); }
        to { transform: translateY(0); }
    }

    @media (max-width: 900px) {
        .pa-st-hero {
            grid-template-columns: auto minmax(0, 1fr);
        }

        .pa-st-right {
            grid-column: 1 / -1;
            text-align: left;
        }
    }
</style>
