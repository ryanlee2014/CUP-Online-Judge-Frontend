<template>
    <div>
        <div class="following bar topmenu" style="z-index: 900;">
            <Large :nick="nick"></Large>
            <Small></Small>
            <Nano></Nano>
        </div>
        <ProfileCard :user_id="user_id" :nick="nick" :admin="admin" :avatar="avatar"></ProfileCard>
        <div class="ui vertical center aligned segment hidemenu" style="border-bottom:0px;display:none">
            <div class="ui container">
                <div class="ui inverted borderless large pointing menu" style="opacity:0">

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Large from "./size/large";
    import Small from "./size/Small";
    import Nano from "./size/nano";
    import ProfileCard from "./components/ProfileCard";
    export default {
        name: "Navbar",
        components: {
            Large,
            Small,
            Nano,
            ProfileCard
        },
        props: {
            user_id: {
                type: String,
                default: ""
            },
            nick: {
                type: String,
                default: ""
            },
            admin: {
                type: Boolean,
                default: false
            },
            avatar: {
                type: Boolean,
                default: false
            },
            logined: {
                type: Boolean,
                default: false
            }
        },
        data: function () {
            return {}
        },
        updated() {
            console.log(this.logined);
        },
        mounted() {
        }
    }
</script>

<style scoped>

</style>
