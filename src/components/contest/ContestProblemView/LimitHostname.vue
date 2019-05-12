<template>
    <div class="ui negative message">
        <div class="header"><i class="ban icon"></i>访问限制</div>
        <p>{{content}}</p>
    </div>
</template>

<script>
    export default {
        name: "LimitHostname",
        props:{
            content:{
                type: String,
                default: ""
            }
        }
    }
</script>

<style scoped>

</style>
