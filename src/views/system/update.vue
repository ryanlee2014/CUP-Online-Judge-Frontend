<template>
    <div class="ui main text container padding">
            <div class="ui raised segment" :key="key" v-for="(row,key) in log">
                <h3 class="ui dividing header">
                    Core Version {{row.version}} Frontend Version {{row.frontend_version}} {{dayjs(row.mtime).format("YYYY-MM-DD")}}
                </h3>
                <p v-html="row.msg">
                </p>
            </div>
        </div>
</template>

<script lang="ts">
import mixins from "../../mixin/init";
import { Component, Mixins } from "vue-property-decorator";
import dayjs from "dayjs";
@Component
export default class UpdateInfo extends Mixins(mixins) {
    log = [];
    dayjs = dayjs;
    mounted () {
        document.title = `Update log -- ${document.title}`;
        this.axios.get("/api/update_log")
            .then(({ data }) => {
                this.log = data.data;
            });
    }
}
</script>

<style scoped>

</style>
