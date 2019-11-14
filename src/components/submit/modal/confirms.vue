<template>
    <div class="ui basic modal confirms hidden">
        <div class="ui icon header">
            <i class="archive icon"></i>提示
        </div>
        <div class="content" id="confirm_box" v-html="confirm_text">
        </div>
        <div class="actions">
            <div class="ui red basic cancel inverted button">
                <i class="remove icon"></i>
                返回
            </div>
            <div class="ui green ok inverted button">
                <i class="checkmark icon"></i>
                确认提交
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";

@Component
export default class Confirm extends Vue {
    @Prop({ default: "" }) confirm_text!: string;
}
</script>

<style scoped>

</style>
