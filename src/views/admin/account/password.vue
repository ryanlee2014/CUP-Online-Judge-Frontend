<template>
    <div class="ui container padding">
        <h2 class="ui dividing header">Modify Password</h2>
        <div class="ui form">
            <div class="field">
                <div class="two fields">
                    <div class="field">
                        <label>{{$t("user_id")}}</label>
                        <input type="text" v-model="user_id">
                    </div>
                    <div class="field">
                        <label>{{$t("password")}}</label>
                        <input type="text" v-model="password">
                    </div>
                </div>
            </div>
            <div class="field">
                <div class="fields">
                    <div class="field">
                        <button class="ui primary button" @click="changePassword">
                            {{$t("modify password")}}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import mixins from "../../../mixin/init";

export default {
    name: "password",
    mixins: [mixins],
    data () {
        return {
            user_id: "",
            password: ""
        };
    },
    methods: {
        changePassword () {
            this.axios.post("/api/admin/account/password/modify", this.$data)
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
