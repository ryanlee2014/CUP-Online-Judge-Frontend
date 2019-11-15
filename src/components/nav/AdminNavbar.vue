<template>
    <div>
        <div class="following bar topmenu" style="z-index: 900;">
            <Menu :connected="socketConnected" :judger="judger" :logined="logined" :nick="nick" :user="user"></Menu>
        </div>
        <ProfileCard :admin="admin" :avatar="avatar" :nick="nick" :user_id="user_id"/>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Mixins } from "vue-property-decorator";
import ProfileCard from "./components/ProfileCard.vue";
import NavbarMixin from "../../mixin/NavbarMixin";
import Menu from "./admin/Menu.vue";
@Component({
    components: {
        ProfileCard: ProfileCard,
        Menu: Menu
    }
})
export default class AdminNavbar extends Mixins(NavbarMixin) {
}
</script>

<style scoped>

</style>
