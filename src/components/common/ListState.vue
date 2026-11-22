<template>
    <div class="list-state list-state-skeleton" v-if="state === 'loading'">
        <div class="ui fluid placeholder">
            <div class="line" :key="'h' + i" v-for="i in 2"></div>
        </div>
        <div class="ui fluid placeholder" :key="r" v-for="r in rows">
            <div class="paragraph">
                <div class="full line"></div>
                <div class="medium line"></div>
            </div>
        </div>
    </div>
    <div class="list-state list-state-empty ui basic center aligned segment" v-else-if="state === 'empty'">
        <h4 class="ui icon disabled header">
            <i class="inbox icon"></i>
            {{emptyText}}
        </h4>
    </div>
    <div class="list-state list-state-error ui negative message" v-else-if="state === 'error'">
        <div class="list-state-error-body">
            <span class="list-state-error-text"><i class="exclamation triangle icon"></i>{{errorText || $t("loadFailed")}}</span>
            <button class="ui mini red basic button list-state-retry" type="button" @click="$emit('retry')">
                <i class="redo icon"></i>{{$t("retry")}}
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export type ListStateType = "loading" | "empty" | "error" | null;

/**
 * Placeholder / empty / error states for list pages.
 * `state === null` renders nothing (the list itself is shown by the parent).
 */
export default defineComponent({
    name: "ListState",
    props: {
        state: { type: String as PropType<ListStateType>, default: null },
        emptyText: { type: String, default: "" },
        errorText: { type: String, default: "" },
        rows: { type: Number, default: 6 }
    }
});
</script>

<style scoped>
    .list-state-skeleton {
        padding: 1em 0;
    }

    .list-state-skeleton .ui.placeholder {
        max-width: none;
    }

    .list-state-skeleton .ui.placeholder + .ui.placeholder {
        margin-top: 1.25em;
    }

    .list-state-empty {
        padding: 3em 1em !important;
    }

    .list-state-error-body {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1em;
    }
</style>
<i18n>
    {
    "zh-cn": {
    "loadFailed": "加载失败，请检查网络后重试",
    "retry": "重试"
    },
    "en": {
    "loadFailed": "Failed to load. Please check your network and try again.",
    "retry": "Retry"
    },
    "ja": {
    "loadFailed": "読み込みに失敗しました。ネットワークを確認して再試行してください",
    "retry": "再試行"
    }
    }
</i18n>
