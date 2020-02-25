<template>
    <div class="ui container">
        <h2 class="ui dividing header">{{$t("system management panel")}}</h2>
        <div class="ui segment">
            <LoginLog class="padding" />
        </div>
    </div>
</template>

<script lang="ts">
import mixins from "../../mixin/init";
import { Mixins, Component } from "vue-property-decorator";
import LoginLogPanel from "@/components/admin/log/login-log-panel.vue";
@Component({
    components: {
        LoginLog: LoginLogPanel
    }
})
export default class AdminIndex extends Mixins(mixins) {

}
</script>

<style scoped>

</style>
