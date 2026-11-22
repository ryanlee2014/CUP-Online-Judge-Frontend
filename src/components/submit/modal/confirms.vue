<template>
    <div class="ui basic modal confirms hidden">
        <div class="ui icon header">
            <i class="archive icon"></i>{{$t("hint")}}
        </div>
        <div class="content" id="confirm_box" v-html="confirm_text">
        </div>
        <div class="actions">
            <div class="ui red basic cancel inverted button">
                <i class="remove icon"></i>
                {{$t("cancel")}}
            </div>
            <div class="ui green ok inverted button">
                <i class="checkmark icon"></i>
                {{$t("confirm")}}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    name: "Confirm",
    props: {
        confirm_text: { type: String, default: "" }
    }
});
</script>

<style scoped>

</style>
