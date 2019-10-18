<template>
    <UserContainer :userId="userId"></UserContainer>
</template>

<script>
import mixins from "../mixin/init";
import UserContainer from "../components/user/UserContainer";

export default {
    name: "user",
    mixins: [mixins],
    data () {
        return {
            userId: ""
        };
    },
    mounted () {
        this.userId = this.$route.params.user_id;
    },
    components: {
        UserContainer
    }
};
</script>

<style scoped>

</style>
