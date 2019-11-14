<template>
    <div class="ui container padding">
        <div class="ui grid">
            <div class="row">
                <div class="ui column">
                    <div class='ui toggle checkbox refresh'>
                        <input type='checkbox' v-model="refresh">
                        <label>{{$t("stop auto refresh")}}</label>
                    </div>
                    <div class='ui toggle checkbox sort'>
                        <input type='checkbox'>
                        <label>{{$t("auto sort")}}</label>
                    </div>
                </div>
            </div>
        </div>
        <div class="ui grid">
            <div class="row">
                <addressList></addressList>
                <userList></userList>
            </div>
        </div>
    </div>
</template>
<i18n src="../locales/online.json"></i18n>
<script lang="ts">
import mixins from "../mixin/init";
import addressList from "../components/online/addressList.vue";
import userList from "../components/online/userList.vue";
import { Component, Mixins } from "vue-property-decorator";
@Component({
    components: {
        addressList,
        userList
    }
})
export default class Online extends Mixins(mixins) {
    refresh = localStorage.getItem("refresh") === "true";
    mounted () {
        document.title = `Online user -- ${document.title}`;
    }
}
</script>

<style scoped>

</style>
