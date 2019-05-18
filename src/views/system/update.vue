<template>
    <div class="ui main text container padding">
            <div class="ui raised segment" :key="key" v-for="(row,key) in log">
                <h3 class="ui dividing header">
                    Version {{row.version}} {{dayjs(row.mtime).format("YYYY-MM-DD")}}
                </h3>
                <p v-html="row.msg">
                </p>
            </div>
        </div>
</template>

<script>
    import mixins from '../../mixin/init'
    const dayjs = require("dayjs");
    export default {
        name: "update",
        mixins: [mixins],
        data() {
            return {
                log: [],
                dayjs
            }
        },
        mounted() {
            this.axios.get(`/api/update_log`)
                .then(({data}) => {
                    this.log = data.data;
                });
        }
    }
</script>

<style scoped>

</style>
