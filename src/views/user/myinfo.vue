<template>
    <UserContainer :userId="userId"></UserContainer>
</template>

<script lang="ts">
import mixins from "../../mixin/init";
import UserContainer from "../../components/user/UserContainer.vue";
import { Component, Mixins } from "vue-property-decorator";
@Component({
    components: {
        UserContainer: UserContainer
    }
})
export default class MyInfo extends Mixins(mixins) {
    userId = "";
    mounted () {
        this.userId = this.$store.getters.user_id;
    }
}
</script>

<style scoped>

</style>
