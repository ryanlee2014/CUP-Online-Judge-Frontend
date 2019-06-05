<template>
    <div>
        <div class="following bar topmenu" style="z-index: 900;">
            <Menu :connected="socketConnected" :judger="judger" :logined="logined" :nick="nick" :user="user"></Menu>
        </div>
        <ProfileCard :admin="admin" :avatar="avatar" :nick="nick" :user_id="user_id"/>
    </div>
</template>

<script>
import ProfileCard from "./components/ProfileCard";
import NavbarMixin from "../../mixin/NavbarMixin";
import Menu from "./admin/Menu";
export default {
    name: "AdminNavbar",
    mixins: [NavbarMixin],
    components: {
        ProfileCard,
        Menu
    }
};
</script>

<style scoped>

</style>
