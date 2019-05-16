<template>
    <div class="ui negative message">
        <div class="header">
            <i class="ban icon"></i>访问限制</div>
        <p>根据管理员设置的策略，本次contest请使用{{address}}访问</p>
    </div>
</template>

<script>
    export default {
        name: "limitHostname",
        props: {
            address: {
                type: String,
                default: location.href
            }
        }
    }
</script>

<style scoped>

</style>
