<template>
    <div class="ui container padding">
        <ContestMode/>
    </div>
</template>

<script lang="ts">
import InitMixin from "../../mixin/init";
import ContestMode from "../../components/contestMode/block.vue";
import { Mixins, Component } from "vue-property-decorator";
@Component({
    components: {
        ContestMode
    }
})
export default class ContestModeView extends Mixins(InitMixin) {
}
</script>

<style scoped>

</style>
