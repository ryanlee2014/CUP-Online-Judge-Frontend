<template>
    <div class="ui container padding">
        <h2 class="ui dividing header">{{$t("modify password")}}</h2>
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
{
    "zh-cn": {
        "modify password": "密码修改"
    },
    "en": {
        "modify password": "Modify Password"
    },
    "ja": {
        "modify password": "パスワード変更"
    }
}
<script lang="ts">
import mixins from "../../../mixin/init";
import { Component, Mixins } from "vue-property-decorator";

@Component
export default class ChangePassword extends Mixins(mixins) {
    user_id = "";
    password = "";
    changePassword () {
        this.axios.post("/api/admin/account/password/modify", this.$data)
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
