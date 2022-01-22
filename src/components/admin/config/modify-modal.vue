<template>
    <div class="ui modal" ref="modal">
        <div class="header">Header</div>
        <div class="content">
            <div class="ui form">
                <div class="field">
                    <label>{{$t("key")}}</label>
                    <div class="one fields">
                        <div class="field">
                            <input name="key" placeholder="key" type="text" v-model="key">
                        </div>
                    </div>
                </div>
                <div class="field">
                    <label>{{$t("value")}}</label>
                    <div class="one fields">
                        <div class="field">
                            <textarea v-model="value"></textarea>
                        </div>
                    </div>
                </div>
                <div class="field">
                    <label>{{$t("comment")}}</label>
                    <div class="one fields">
                        <div class="field">
                            <input name="comment" placeholder="comment" type="text" v-model="comment">
                        </div>
                    </div>
                </div>
                <div class="field">
                    <button @click="submit" class="ui button primary">Submit</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import mixins from "../../../mixin/init";
import { Component, Mixins } from "vue-property-decorator";
import jquery from "jquery";
import Vue from "vue";
const $: any = jquery;
@Component
export default class ModifyModal extends Vue {
    key = "";
    value = "";
    comment = "";

    activate (payload: any) {
        if (typeof payload === "undefined" || typeof payload.key !== "string") {
            payload = { key: "", value: "", comment: "" };
        }
        Object.assign(this, payload);
        $(this.$refs.modal).modal("show");
    }

    deactivate () {
        $(this.$refs.modal).modal("hide");
    }

    submit () {
        this.$emit("callback", this.$data);
    }
}
</script>

<style scoped>

</style>
