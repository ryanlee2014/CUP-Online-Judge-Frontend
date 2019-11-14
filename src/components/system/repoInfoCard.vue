<template>
    <div class="ui card">
        <div class="content">
            <div class="header">
                <slot name="header"></slot>
            </div>
            <div class="meta">
                <slot name="meta"></slot>
            </div>
            <p>
                <slot name="content"></slot>
            </p>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import Vue from "vue";
@Component
export default class RepoInfoCard extends Vue {

}
</script>

<style scoped>

</style>
