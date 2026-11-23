<template>
    <HomeArena v-if="arena"/>
    <HomeClassic v-else/>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { uiModeState } from "@/util/uiMode";

// Home page: new (像素赛场) or classic, following the interface switch.
export default defineComponent({
    name: "Home",
    components: {
        HomeArena: () => import("./home/HomeArena.vue"),
        HomeClassic: () => import("./home/HomeClassic.vue")
    },
    computed: {
        arena (): boolean {
            return uiModeState.mode === "arena";
        }
    }
});
</script>
