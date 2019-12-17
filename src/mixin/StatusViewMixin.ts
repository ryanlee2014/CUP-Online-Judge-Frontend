import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

@Component
export default class StatusViewMixin extends Vue {
    current_tag: string = "status";
    user_id: any = null;
    problem_result: any = -1;
    problem_id: any = null;
    language: any = -1;
    sim_checkbox: boolean = false;
    privilege: any = 0;
    auto_refresh: boolean = true;

    @Watch("sim_checkbox")
    @Watch("privilege")
    onSimCheckboxChanged () {
        this.search();
    }

    @Watch("auto_refresh")
    onAutoRefreshChanged (newVal: boolean) {
        if (newVal) {
            this.search();
        }
    }

    search () {
        console.error("Implement this method");
    }

    getUserId () {
        if (this.$route.query) {
            return this.$route.query.user_id;
        }
        return null;
    }

    getResult () {
        if (this.$route.query) {
            return this.$route.query.jresult;
        }
        return null;
    }

    getProblemID () {
        if (this.$route.query) {
            return this.$route.query.problem_id;
        }
        return null;
    }

    getLanguage () {
        if (this.$route.query) {
            return this.$route.query.language;
        }
        return null;
    }

    setQuery () {
        let queryobject: any = {};
        if (this.user_id && this.user_id!.length > 0) {
            queryobject["user_id"] = this.user_id;
        }
        if (this.problem_result && this.problem_result !== -1) {
            queryobject["jresult"] = this.problem_result;
        }
        if (this.problem_id && this.problem_id !== 0) {
            queryobject["problem_id"] = this.problem_id;
        }
        if (this.language && this.language !== -1) {
            queryobject["language"] = this.language;
        }
        this.$router.push({ path: this.$route.path, query: queryobject });
    }

    tag (tag_name: any) {
        this.current_tag = tag_name;
    }

    list_self_only () {
        let selfUserId = this.$store.getters.user_id;
        if (this.user_id == null || this.user_id !== selfUserId) {
            this.user_id = selfUserId;
        }
        else {
            this.user_id = null;
        }
        this.search();
    }
}
