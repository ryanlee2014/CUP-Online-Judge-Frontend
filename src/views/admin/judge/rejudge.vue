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

<script>
import mixins from "../../../mixin/init";
const idType = {
    1: "solution_id",
    2: "contest_id",
    3: "problem_id"
};

const postType = {
    1: "solution",
    2: "contest",
    3: "problem"
};

export default {
    name: "rejudge",
    mixins: [mixins],
    data () {
        return {
            rejudgeType: 1,
            id: 0
        };
    },
    methods: {
        makeSendData () {
            const data = {};
            data[idType[this.rejudgeType]] = this.id;
            return data;
        },
        rejudge () {
            this.axios.post(`/api/admin/problem/rejudge/${postType[this.rejudgeType]}`, this.makeSendData())
                .then(({ data }) => {
                    if (data.status === "OK") {
                        alert(this.$t("success"));
                    }
                    else {
                        alert(data.statement);
                    }
                });
        }
    }
};
</script>

<style scoped>

</style>
