<template>
    <div class="ui container padding">
        <div class="ui form">
            <div class="field">
                <div class="two fields">
                    <div class="field">
                        <label>{{$t("type")}}</label>
                        <div class="ui fluid search dropdown selection" size="1">
                            <input @change="rejudgeType=$event.target.value" name="language"
                                   type="hidden" v-model="rejudgeType">
                            <i class="dropdown icon"></i>
                            <div class="default text">All</div>
                            <div class="menu">
                                <div class="item" data-value="1">
                                    Solution
                                </div>
                                <div class="item" data-value="2">
                                    Contest
                                </div>
                                <div class="item" data-value="3">
                                    Problem
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <label>{{$t("id")}}</label>
                        <input type="text" v-model="id">
                    </div>
                </div>
            </div>
            <div class="field">
                <div class="fields">
                    <div class="field">
                        <button class="ui primary button" @click="rejudge">
                            {{$t("rejudge")}}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import mixins from "../../../mixin/init";
import { Component, Mixins } from "vue-property-decorator";
interface IType {
    [id: string]: string
}
const idType: IType = {
    1: "solution_id",
    2: "contest_id",
    3: "problem_id"
};

const postType: IType = {
    1: "solution",
    2: "contest",
    3: "problem"
};

@Component
export default class Rejudge extends Mixins(mixins) {
    rejudgeType: number = 1;
    id = 0;
    makeSendData () {
        const data: any = {};
        data[idType[this.rejudgeType]] = this.id;
        return data;
    }

    rejudge () {
        this.axios.post(`/api/admin/problem/rejudge/${postType[this.rejudgeType]}`, this.makeSendData())
            .then(({ data }) => {
                alert(this.$t("success"));
            })
            .catch(({ data }) => {
                alert(data.statement);
            });
    }
}
</script>

<style scoped>

</style>
