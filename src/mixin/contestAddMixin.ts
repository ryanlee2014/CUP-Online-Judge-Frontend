import _ from "lodash";
import { Component, Mixins } from "vue-property-decorator";
import RouterBackMixin from "@/mixin/router/RouterBackMixin";
@Component
export default class ContestAddMixin extends Mixins(RouterBackMixin) {
    contest_id = "0";
    data = {};
    userListText = "";
    problemSelected = "";
    mounted () {
        this.initData();
    }

    add (val: any) {
        val = this.dataFormat(val);
        this.axios.post("/api/admin/contest/add", val)
            .then(({ data }) => {
                alert(this.$t("success"));
                this.routerBack();
            }).catch(reason => {
                alert(this.$t("error"));
            });
    }

    created () {
        this.contest_id = this.$route.params.contest_id;
    }

    initData () {
        this.axios.get(`/api/admin/contest/edit/${this.contest_id}`)
            .then(({ data }) => {
                if (data.data.length > 0) {
                    this.data = data;
                }
            });
        this.axios.get(`/api/admin/contest/edit/user/${this.contest_id}`)
            .then(({ data }) => {
                if (data.data.length > 0) {
                    this.userListText = data.data.map((el: any) => el.user_id).join("\n");
                }
            });
        this.axios.get(`/api/contest/problem/${this.contest_id}`)
            .then(({ data }) => {
                if (data.status === "OK") {
                    this.problemSelected = data.data.map((el: any) => el.pid).join(",");
                }
            });
    }

    dataFormat (val: any) {
        val = _.cloneDeep(val);
        delete val.userListText;
        delete val.languageSelected;
        delete val.languageSet;
        val.problemSelected = val.problemSelected.split(",").map((el: any) => parseInt(el));
        if (typeof val.hostname !== "string" || val.hostname === "null" || val.hostname === null) {
            val.hostname = "";
        }
        return val;
    }
}
