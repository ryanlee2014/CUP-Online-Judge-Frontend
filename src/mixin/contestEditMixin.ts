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
        return val;
    }
}
