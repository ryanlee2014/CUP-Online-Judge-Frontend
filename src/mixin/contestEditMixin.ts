import Vue from "vue";
import _ from "lodash";
import { Component } from "vue-property-decorator";
@Component
export default class ContestEditMixin extends Vue {
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
                if (data.status === "OK") {
                    alert(this.$t("success"));
                }
                else {
                    alert(this.$t("error"));
                }
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
