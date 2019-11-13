<template>
    <UserContainer :userId="userId"></UserContainer>
</template>

<script lang="ts">
import InitMixin from "../mixin/init";
import UserContainer from "../components/user/UserContainer.vue";
import { Component, Mixins } from "vue-property-decorator";

@Component({
    components: {
        UserContainer: UserContainer
    }
})
export default class User extends Mixins(InitMixin) {
    userId = "";
    mounted () {
        this.userId = this.$route.params.user_id;
    }
}
</script>

<style scoped>

</style>
