<template>
    <div class="following bar topmenu" style="z-index: 900;">
        <Large></Large>
        <Small></Small>
        <Nano></Nano>
    </div>
</template>

<script>
    import Large from "./size/large";
    import Small from "./size/Small";
    import Nano from "./size/nano";
    export default {
        name: "Navbar",
        components: {
            Large,
            Small,
            Nano
        }
    }
</script>

<style scoped>

</style>
