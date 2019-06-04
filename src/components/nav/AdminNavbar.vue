<template>
    <div>
        <div class="following bar topmenu" style="z-index: 900;">
            <Large :connected="socketConnected" :judger="judger" :logined="logined" :nick="nick" :user="user" v-if="!contest"></Large>
        </div>
        <ProfileCard :admin="admin" :avatar="avatar" :nick="nick" :user_id="user_id"/>
    </div>
</template>

<script>
import ProfileCard from "./components/ProfileCard";

export default {
    name: "AdminNavbar"
};
</script>

<style scoped>

</style>
