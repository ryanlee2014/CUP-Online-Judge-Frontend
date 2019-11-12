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

<script lang="ts">
import RankList from "../components/ranklist/MainContent.vue";
import InitMixin from "../mixin/init";
import { Mixins, Component } from "vue-property-decorator";
@Component({
    components: {
        RankList: RankList
    }
})
export default class Rank extends Mixins(InitMixin) {
    ranklist = {};
    mounted () {
        document.title = `Ranklist -- ${document.title}`;
        this.axios.get(`/api/ranklist/${this.$route.query.page ? `?page=${this.$route.query.page}` : ""}`)
            .then(response => { this.ranklist = response.data; });
    }
}
</script>

<style scoped>

</style>
