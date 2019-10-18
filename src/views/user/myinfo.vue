<template>
    <UserContainer :userId="userId"></UserContainer>
</template>

<script>
import mixins from "../../mixin/init";
import UserContainer from "../../components/user/UserContainer";
export default {
    name: "myinfo",
    mixins: [mixins],
    data () {
        return {
            userId: this.$store.getters.user_id
        };
    },
    components: {
        UserContainer
    }
};
</script>

<style scoped>

</style>
