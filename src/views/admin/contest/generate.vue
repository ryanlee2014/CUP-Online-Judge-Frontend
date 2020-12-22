<template>
    <div class="ui container padding">
        <h2 class="ui dividing header">{{$t("contest account generate")}}</h2>
        <div class="ui grid">
            <div class="row">
                <div class="eight wide column">
                    <div class="ui form">
                        <div class="field">
                            <div class="two fields" v-show="resultNickList.length === 0">
                                <div class="field">
                                    <label>{{$t("account prefix")}}</label>
                                    <input type="text" v-model="prefix">
                                </div>
                                <div class="field">
                                    <label>{{$t("count")}}</label>
                                    <input type="text" placeholder="number only" v-model="num">
                                </div>
                            </div>
                            <div class="field" v-show="resultNickList.length === 0">
                                <label>{{$t("contest account nick")}}</label>
                                <textarea type="text" v-model="nickListText"></textarea>
                            </div>
                            <div class="field">
                                <div class="three fields">
                                    <div class="field" v-show="resultNickList.length === 0">
                                        <a @click.prevent="generateAccount" class="ui primary button">{{$t("add")}}</a>
                                    </div>
                                    <div class="field">
                                        <a @click.prevent="refresh" class="ui button">{{$t("refresh page")}}</a>
                                    </div>
                                    <div class="field">
                                        <a @click.prevent="exportXLS" class="ui primary button">{{$t("保存表格")}}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="eight wide column">
                    <table class="ui celled structured table" id="save">
                        <thead>
                        <tr>
                            <th>{{$t("user_id")}}</th>
                            <th>{{$t("nick")}}</th>
                            <th>{{$t("password")}}</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr :key="key" v-for="(row, key) in (resultNickList.length > 0 ? resultNickList : nickList)">
                                <td>{{row.userId}}</td>
                                <td>{{row.nick}}</td>
                                <td>{{row.password}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import InitMixin from "../../../mixin/init";
import { saveAs } from "file-saver";

interface Account {
    userId: string,
    nick: string,
    password: string
}

@Component
export default class ContestAccountGenerate extends Mixins(InitMixin) {
    prefix = "";
    num = 0;
    nickListText = "";
    nickList: Account[] = [];
    resultNickList: Account[] = [];

    @Watch("nickListText")
    onNickListTextChanged (text: string) {
        const nickList = text.trim().split("\n").map(e => e.trim());
        const userIdList: Account[] = [];
        const len = `${this.num}`.length;
        for (let i = 0; i < this.num; ++i) {
            const userId = `${this.prefix}${`${i}`.padStart(len, "0")}`;
            userIdList.push({
                userId,
                nick: i < nickList.length ? nickList[i] : "",
                password: ""
            });
        }
        this.nickList = userIdList;
    }

    generateAccount () {
        const prefix = this.prefix.trim();
        const num = parseInt(this.num as unknown as string);
        const nickList = this.nickListText.trim().split("\n").map(e => e.trim());
        this.axios.post("/api/admin/account/generate/batch", { prefix, num, nickList })
            .then(({ data }) => {
                this.resultNickList = data.data.accountList;
                alert("创建成功，将自动触发Excel表格下载\n建议验证账号，在菜单栏[用户管理] => [账号验证]验证账号是否有效");
                this.$nextTick(() => {
                    this.exportXLS();
                });
            })
            .catch(({ data }) => {
                alert(data.statement);
            });
    }

    exportXLS () {
        const doc: any = document.getElementById("save");
        let XLSContentHTML = "<html xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:x=\"urn:schemas-microsoft-com:office:excel\" xmlns=\"http://www.w3.org/TR/REC-html40\">" + "<head><meta http-equiv='Content-Type' content='application/vnd.ms-excel; charset=utf-8' /></head>";
        XLSContentHTML += "<table border=1>" + doc.innerHTML.replace("<tbody>", "").replace("</tbody>", "");
        XLSContentHTML += "</table></html>";

        // downloadExl(doc);
        const blob = new Blob([XLSContentHTML], { type: "application/vnd.ms-excel;charset=UTF-8;" });
        saveAs(blob, `${this.$t("contest account generate")}.xls`);
    }

    refresh () {
        location.reload();
    }
}
</script>

<style scoped>

</style>
