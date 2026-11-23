<template>
    <div class="mainwindow five wide column pa-statement" id="left-side">
        <div class="pa-st-kicker pa-px">
            <span>P{{ problem_id }}</span>
            <span class="pa-st-dot">·</span>
            <span>{{ $t("pa.statement.balloon", { name: balloonName }) }}</span>
        </div>
        <h1 class="pa-st-title">
            <PixelBalloon :problem-id="original_id || problem_id" :size="4" class="pa-st-balloon"/>
            <span class="pa-px" id="probid" v-html="titleHtml"></span>
        </h1>
        <div class="pa-st-chips pa-px">
            <span>{{ $t("time limit") }} {{ time }}s</span>
            <span>{{ $t("memory limit") }} {{ memory }}MB</span>
            <span v-if="spj">Special Judge</span>
            <span>{{ $t("pa.statement.passed", { a: accepted, s: submit }) }}</span>
        </div>
        <div class="pa-st-tabs pa-px">
            <span class="on">{{ $t("pa.statement.problem") }}</span>
            <router-link :to="`/tutorial/${original_id}`" v-if="normal_problem || isadmin">{{ $t("read solution") }}</router-link>
            <router-link :to="`/status/problem/${original_id}`">{{ $t("history") }}</router-link>
            <a @click.prevent="switch_screen">{{ $t("switch single screen") }}</a>
            <router-link :to="`/problem/edit/${original_id}`" v-if="iseditor || isadmin">{{ $t("edit problem") }}</router-link>
        </div>

        <section>
            <h3 class="pa-px">{{ $t("problem description") }}</h3>
            <div class="pa-st-body" id="problem_description" v-html="description"></div>
        </section>
        <section v-if="input">
            <h3 class="pa-px">{{ $t("input") }}</h3>
            <div class="pa-st-body" id="problem_input" v-html="input"></div>
        </section>
        <section v-if="output">
            <h3 class="pa-px">{{ $t("output") }}</h3>
            <div class="pa-st-body" id="problem_output" v-html="output"></div>
        </section>
        <section>
            <h3 class="pa-px">{{ $t("pa.statement.samples") }}</h3>
            <div class="pa-samples">
                <div class="pa-sample">
                    <div class="pa-sample-head pa-px"><span>{{ $t("sampleinput") }} #1</span><a class="copy context">{{ $t("pa.statement.copy") }}</a></div>
                    <pre><span class="sample_input" id="problem_sample_input" v-text="sampleinput"></span></pre>
                </div>
                <div class="pa-sample">
                    <div class="pa-sample-head pa-px"><span>{{ $t("sampleoutput") }} #1</span><a class="copy context">{{ $t("pa.statement.copy") }}</a></div>
                    <pre><span class="sample_output" id="problem_sample_output" v-text="sampleoutput"></span></pre>
                </div>
            </div>
        </section>
        <section v-if="hint">
            <h3 class="pa-px">{{ $t("hint") }}</h3>
            <div class="pa-st-body" v-html="hint"></div>
        </section>
        <section class="pa-st-meta">
            <span v-if="source">{{ $t("from") }}：<router-link :to="`/problemset?tag=${encodeURI(source)}`" id="problem_source" v-text="source"></router-link></span>
            <span>{{ $t("uploader") }}：<router-link :to="`/user/${uploader}`" v-if="uploader !== 'Administrator'">{{ uploader }}</router-link><template v-else>Administrator</template></span>
        </section>
        <section class="pa-st-meta" v-if="admin && contestList.length">
            <h3 class="pa-px">{{ $t("problem in contest") }}</h3>
            <p :key="key" v-for="(row, key) in contestList">
                <router-link :to="`/contest/${row.contestId}`">
                    [{{ isPrivateContest(row.private) }}] Contest {{ row.contestId }}: {{ row.title }}
                </router-link>
            </p>
        </section>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LeftPanel from "./leftPanel.vue";
import PixelBalloon from "@/components/pixel/PixelBalloon.vue";
import { balloonIndex } from "@/util/pixelArena";
import markdownIt from "../../../lib/markdownIt/markdownIt";

// 像素赛场 layout of the problem statement. Same props / data loading as LeftPanel (extends it).
export default defineComponent({
    name: "LeftPanelArena",
    extends: LeftPanel as any,
    components: { PixelBalloon },
    computed: {
        balloonName (): string {
            return this.$t(`pa.balloon.${balloonIndex((this as any).original_id || (this as any).problem_id)}`) as string;
        },
        titleHtml (): string {
            return markdownIt.renderRaw((this as any).title);
        }
    }
});
</script>

<style scoped>
    .pa-statement {
        width: 40%;
        height: calc(100vh - 92px);
        overflow-y: auto;
        background: #1c1c3a !important;
        color: #d6d5ef !important;
        padding: 26px 32px 40px !important;
        box-shadow: 0 -4px 0 0 var(--pa-line), 0 4px 0 0 var(--pa-line), -4px 0 0 0 var(--pa-line), 4px 0 0 0 var(--pa-line), 8px 8px 0 0 var(--pa-shadow);
    }

    .pa-st-kicker {
        font-size: 13px;
        color: var(--pa-mute);
        margin-left: 46px;
    }

    .pa-st-dot { margin: 0 6px; }

    .pa-st-title {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 6px 0 14px;
        font-size: 28px;
        line-height: 1.25;
        font-weight: normal;
        color: var(--pa-ink);
    }

    .pa-st-title >>> p { margin: 0; display: inline; }

    .pa-st-balloon { flex: none; }

    .pa-st-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 18px;
    }

    .pa-st-chips span {
        font-size: 13px;
        background: #2c2c58;
        color: #b9b8e6;
        padding: 4px 9px;
    }

    .pa-st-tabs {
        display: flex;
        gap: 16px;
        align-items: center;
        flex-wrap: wrap;
        border-bottom: 3px solid var(--pa-line2);
        margin-bottom: 18px;
        font-size: 15px;
    }

    .pa-st-tabs > * {
        padding: 8px 2px;
        white-space: nowrap;
        color: var(--pa-mute) !important;
        cursor: pointer;
    }

    .pa-st-tabs .on {
        background: #33336a;
        color: var(--pa-y) !important;
        padding: 8px 12px;
    }

    .pa-st-tabs a:hover { color: var(--pa-ink) !important; }

    section { margin-bottom: 18px; }

    h3 {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 16px !important;
        margin: 0 0 8px !important;
        color: var(--pa-ink) !important;
    }

    h3::before {
        content: "";
        width: 12px;
        height: 12px;
        background: #5b8cff;
    }

    .pa-st-body {
        font-size: 15px;
        line-height: 1.9;
        color: #d6d5ef;
    }

    .pa-st-body >>> img { max-width: 100%; }
    .pa-st-body >>> .ui.segment,
    .pa-st-body >>> .ui.segments {
        background: #12122a !important;
        color: #d6d5ef !important;
        box-shadow: 0 0 0 2px var(--pa-line2) !important;
    }
    .pa-st-body >>> .ui.label {
        background: #2c2c58 !important;
        color: #b9b8e6 !important;
    }
    .pa-st-body >>> a { color: #8fb2ff; }
    .pa-st-body >>> pre, .pa-st-body >>> code { background: #0d0d1e !important; color: #e9e8ff !important; }
    .pa-st-body >>> span { font-size: inherit !important; }

    .pa-samples {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
    }

    .pa-sample { background: #12122a; padding-bottom: 3px; min-width: 0; box-shadow: 0 0 0 2px var(--pa-line2); }

    .pa-sample-head {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: var(--pa-y);
        padding: 6px 10px;
    }

    .pa-sample-head a { color: var(--pa-y) !important; cursor: pointer; }

    .pa-sample pre {
        background: #0d0d1e;
        color: #e9e8ff;
        margin: 0 3px;
        padding: 10px;
        font-size: 14px;
        overflow-x: auto;
        white-space: pre;
        min-height: 40px;
    }

    .pa-st-meta {
        font-size: 13px;
        color: var(--pa-mute);
        display: flex;
        flex-direction: column;
        gap: 4px;
        border-top: 2px dashed var(--pa-line2);
        padding-top: 12px;
    }

    .pa-st-meta a { color: #8fb2ff !important; }
</style>
