<template>
    <div class="ui container padding">
        <div>
            <h2 class="ui dividing header">
                Rank List
            </h2>
            <RankList :rank="ranklist"></RankList>
        </div>
    </div>
</template>

<script>
    import RankList from "../components/ranklist/MainContent";
    import util from "../lib/util"
    const $ = require("jquery");
    window.$ = window.jQuery = $;
    require("../static/js/semantic.min");
    util.init();
    export default {
        name: "ranklist",
        components: {
            RankList
        },
        data: function () {
            return {
                ranklist: {}
            }
        },
        mounted: function () {
            this.axios.get(`/api/ranklist/${this.$route.query.page ? `?page=${this.$route.query.page}` : ''}`)
                .then((response) => this.ranklist = response.data);
        }
    }
</script>

<style scoped>

</style>
