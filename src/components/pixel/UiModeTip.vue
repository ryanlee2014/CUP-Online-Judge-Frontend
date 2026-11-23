<template>
    <div class="pa-tip-layer" v-if="visible">
        <div class="pa-tip-ring" :style="ringStyle" v-if="anchor"></div>
        <div class="pa-tip" :style="boxStyle" role="dialog" aria-live="polite" aria-labelledby="pa-tip-title">
            <div class="pa-tip-arrow" :style="arrowStyle" v-if="anchor"></div>
            <div class="pa-tip-title pa-px" id="pa-tip-title">{{ $t("pa.tip.title") }}</div>
            <!-- message text is our own locale string; only the menu / item names are interpolated -->
            <div class="pa-tip-text" v-html="$t('pa.tip.body', { menu: $t('feature'), item: $t('pa.switchClassic') })"></div>
            <div class="pa-tip-actions">
                <button class="pa-btn pa-primary" type="button" @click="dismiss">{{ $t("pa.tip.gotIt") }}</button>
                <button class="pa-btn" type="button" @click="switchBack">{{ $t("pa.tip.switchNow") }}</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { setUiMode, uiModeState } from "@/util/uiMode";

export const UI_TIP_KEY = "cupoj:ui-mode-tip-seen";

function tipSeen (): boolean {
    try {
        return localStorage.getItem(UI_TIP_KEY) === "1";
    }
    catch (e) {
        return true;
    }
}

function markSeen (): void {
    try {
        localStorage.setItem(UI_TIP_KEY, "1");
    }
    catch (e) {
        // ignore
    }
}

interface Rect { left: number; top: number; width: number; height: number }

// One-time onboarding for the new interface: points at the 「功能」 menu, where 「切回旧版界面」 lives.
export default defineComponent({
    name: "UiModeTip",
    data () {
        return {
            seen: tipSeen(),
            ready: false,
            anchor: null as Rect | null,
            timer: 0 as number
        };
    },
    computed: {
        visible (): boolean {
            return this.ready && !this.seen && uiModeState.mode === "arena" && !(this as any).$route.path.startsWith("/admin");
        },
        ringStyle (): Record<string, string> {
            const a = this.anchor as Rect;
            return { left: `${a.left - 6}px`, top: `${a.top - 4}px`, width: `${a.width + 12}px`, height: `${a.height + 8}px` };
        },
        boxStyle (): Record<string, string> {
            const a = this.anchor;
            if (!a) {
                return { right: "24px", top: "78px" };
            }
            const width = 380;
            const left = Math.max(12, Math.min(window.innerWidth - width - 12, a.left + a.width / 2 - 40));
            return { left: `${left}px`, top: `${a.top + a.height + 18}px`, width: `${width}px` };
        },
        arrowStyle (): Record<string, string> {
            const a = this.anchor as Rect;
            const box = this.boxStyle;
            const boxLeft = parseFloat(box.left || "0");
            return { left: `${Math.max(16, a.left + a.width / 2 - boxLeft - 8)}px` };
        }
    },
    mounted () {
        if (this.seen) {
            return;
        }
        // wait for the top bar (and its Semantic dropdowns) to render
        this.timer = window.setTimeout(() => {
            this.locate();
            this.ready = true;
        }, 1200);
        window.addEventListener("resize", this.locate);
    },
    beforeDestroy () {
        window.clearTimeout(this.timer);
        window.removeEventListener("resize", this.locate);
    },
    methods: {
        locate (): void {
            const items = Array.from(document.querySelectorAll(".following.bar.topmenu .ui.dropdown.item")) as HTMLElement[];
            const label = String(this.$t("feature"));
            const el = items.find(i => i.offsetParent !== null && (i.innerText || "").includes(label));
            if (!el) {
                this.anchor = null;
                return;
            }
            const r = el.getBoundingClientRect();
            this.anchor = { left: r.left, top: r.top, width: r.width, height: r.height };
        },
        dismiss (): void {
            markSeen();
            this.seen = true;
        },
        switchBack (): void {
            markSeen();
            this.seen = true;
            setUiMode("classic");
        }
    }
});
</script>

<style scoped>
    .pa-tip-layer {
        position: fixed;
        inset: 0;
        z-index: 2000;
        pointer-events: none;
    }

    .pa-tip-ring {
        position: fixed;
        box-shadow: 0 0 0 3px var(--pa-y), 0 0 0 9999px rgba(8, 8, 20, .45);
        animation: pa-tip-blink 1s steps(2) 3;
    }

    .pa-tip {
        position: fixed;
        pointer-events: auto;
        background: var(--pa-card);
        color: var(--pa-ink);
        padding: 18px 20px 18px;
        box-shadow: 0 -4px 0 0 var(--pa-y), 0 4px 0 0 var(--pa-y), -4px 0 0 0 var(--pa-y), 4px 0 0 0 var(--pa-y), 8px 8px 0 0 var(--pa-shadow);
        font-family: var(--pa-font);
    }

    .pa-tip-arrow {
        position: absolute;
        top: -16px;
        width: 16px;
        height: 12px;
        background: var(--pa-y);
        clip-path: polygon(50% 0, 100% 100%, 0 100%);
    }

    .pa-tip-title {
        font-size: 17px;
        color: var(--pa-y);
        margin-bottom: 8px;
    }

    .pa-tip-text {
        font-size: 14px;
        line-height: 1.75;
        color: #d6d5ef;
        margin-bottom: 16px;
    }

    .pa-tip-text b {
        color: var(--pa-ink);
    }

    .pa-tip-actions {
        display: flex;
        gap: 14px;
    }

    .pa-tip-actions .pa-btn {
        font-size: 14px;
        padding: 8px 14px;
        white-space: nowrap;
    }

    @keyframes pa-tip-blink {
        50% { box-shadow: 0 0 0 3px transparent, 0 0 0 9999px rgba(8, 8, 20, .45); }
    }
</style>
