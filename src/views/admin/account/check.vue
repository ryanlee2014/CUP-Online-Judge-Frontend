<template>
    <div class="ui container padding">
        <h2 class="ui dividing header">
            {{$t("account checker")}}
        </h2>
        <div class="ui form">
            <div class="field">
                <div class="four fields">
                    <div class="field">
                        <label>{{$t("user_id")}}</label>
                        <textarea v-model="userListText"></textarea>
                    </div>
                    <div class="field">
                        <label>{{$t("password")}}</label>
                        <textarea v-model="passwordText"></textarea>
                    </div>
                    <div class="field">
                        <label>{{$t("fail user_id")}}</label>
                        <textarea v-model="resultUserListText"></textarea>
                    </div>
                    <div class="field">
                        <label>{{$t("fail password")}}</label>
                        <textarea v-model="resultPasswordText"></textarea>
                    </div>
                </div>
            </div>
            <div class="fields">
                <div class="field">
                    <button class="ui primary button" @click="Check">
                        {{$t("check")}}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<i18n>
    {
        "zh-cn": {
            "account checker": "账号检查工具"
        },
        "en": {
            "account checker": "Account Checker"
        },
        "ja": {
            "account checker": "アカウントチェッカー"
        }
    }
</i18n>
<script lang="ts">
import mixins from "../../../mixin/init";
import { Component, Mixins } from "vue-property-decorator";

@Component
export default class Check extends Mixins(mixins) {
    userListText = "";
    passwordText = "";
    resultUserListText = "";
    resultPasswordText = "";
    Check () {
        const pairList = this.makePairList();
        if (pairList.length > 0) {
            this.axios.post("/api/admin/account/check", { pairList })
                .then(({ data }) => {
                    this.resultUserListText = this.resultPasswordText = "";
                    if (data.data.fail) {
                        alert(this.$t("several user's accounts failed"));
                        this.resultUserListText = data.data.failUserList.join("\n");
                        this.resultPasswordText = data.data.failPasswordList.join("\n");
                    }
                    else {
                        alert(this.$t("all correct"));
                    }
                });
        }
    }

    makePairList () {
        const userList = this.userListText.split("\n").map(el => el.trim()).filter(el => el.length > 0);
        const passwordList = this.passwordText.split("\n").map(el => el.trim()).filter(el => el.length > 0);
        if (userList.length !== passwordList.length) {
            alert(this.$t("user number mismatch password number"));
            return [];
        }
        const newPairList: any = [];
        userList.forEach(el => {
            newPairList.push({
                user_id: el,
                password: passwordList.shift()
            });
        });
        return newPairList;
    }
}
</script>

<style scoped>

</style>
