<template>
    <svg :width="8 * size" :height="12 * size" viewBox="0 0 8 12" shape-rendering="crispEdges"
         class="pa-balloon" aria-hidden="true" focusable="false">
        <rect v-for="(r, i) in rects" :key="i" :x="r.x" :y="r.y" width="1.02" height="1.02" :fill="r.fill"/>
    </svg>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { balloonColor, shade } from "@/util/pixelArena";

// X body, D shaded edge, H highlight, s string
const MAP = [
    "..XXXX..",
    ".XXXXXXD",
    "XHHXXXXD",
    "XHXXXXXD",
    "XXXXXXXD",
    "XXXXXXDD",
    ".XXXXXD.",
    "..XXDD..",
    "...XD...",
    "....s...",
    "...s....",
    "....s..."
];

export default defineComponent({
    name: "PixelBalloon",
    props: {
        /** explicit colour; otherwise derived from problemId */
        color: { type: String, default: "" },
        problemId: { type: [Number, String], default: null },
        size: { type: Number, default: 3 }
    },
    computed: {
        rects (): { x: number; y: number; fill: string }[] {
            const base = this.color || balloonColor(this.problemId);
            const dark = shade(base, 0.72);
            const out: { x: number; y: number; fill: string }[] = [];
            MAP.forEach((row, y) => {
                for (let x = 0; x < row.length; x++) {
                    const ch = row[x];
                    const fill = ch === "X" ? base : ch === "D" ? dark : ch === "H" ? "#ffffff" : ch === "s" ? "#8f8fc0" : "";
                    if (fill) {
                        out.push({ x, y, fill });
                    }
                }
            });
            return out;
        }
    }
});
</script>

<style scoped>
    .pa-balloon {
        display: inline-block;
        vertical-align: middle;
    }
</style>
