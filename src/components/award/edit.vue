<template>
    <div class="ui container padding">
        <div class="ui form">
            <div class="field">
                <label>{{ $t("year") }}</label>
                <input type="text" v-model="year">
            </div>
            <div class="field">
                <label>{{ $t("award") }}</label>
                <input type="text" v-model="award">
            </div>
            <div class="field">
                <label>{{ $t("user_id") }}</label>
                <input type="text" v-model="userId">
            </div>
            <div class="field">
                <div class="fields">
                    <div class="field">
                        <button class="ui secondary button">
                            Reset
                        </button>
                    </div>
                    <div class="field">

                        <div class="field" @click="emitData">
                            <button class="ui primary button">
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from "vue-property-decorator";
import Vue from "vue";
import _ from "lodash";
import dayjs from "dayjs";

interface IAward {
    award_id: number,
    user_id: string,
    award: string,
    year: number
}

@Component
export default class AwardManage extends Vue {
    @Prop({
        default: () => {
            return {};
        }
    }) awardInfo!: IAward;

    year = dayjs().year();
    award = "";
    userId = "";
    awardId = 0;

    @Watch("awardInfo")
    onAwardInfoChanged (awardInfo: IAward) {
        this.awardId = awardInfo.award_id;
        this.award = awardInfo.award;
        this.userId = awardInfo.user_id;
        this.year = awardInfo.year;
    }

    emitData () {
        const tempData = _.cloneDeep(this.$data);
        this.$emit("postData", tempData);
    }
}
</script>

<style scoped>

</style>
