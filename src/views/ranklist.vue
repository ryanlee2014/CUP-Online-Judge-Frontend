<template>
    <div class="ui container padding" v-if="contestMode">
        <ContestMode/>
    </div>
    <div class="ui container padding" v-else>
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
import ContestMode from "../components/contestMode/block.vue";
import { Mixins, Component } from "vue-property-decorator";
import { mapGetters } from "vuex";
@Component({
    components: {
        RankList: RankList,
        ContestMode
    },
    computed: mapGetters(["contestMode"])
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
