import Vue, { defineComponent } from "vue";
import { Component } from "vue-property-decorator";

/**
 * Options-API mixin (Vue 3 compatible). Class components (e.g. views/status/contest.vue)
 * keep using the default export below.
 * Components using it must provide their own `search` / `fetchData` methods.
 */
export const statusViewMixin = defineComponent({
    data () {
        return {
            current_tag: "status" as string,
            user_id: null as any,
            problem_result: -1 as any,
            problem_id: null as any,
            language: -1 as any,
            sim_checkbox: false as boolean,
            privilege: 0 as any,
            auto_refresh: true as boolean
        };
    },
    watch: {
        sim_checkbox (): void {
            this.search();
        },
        privilege (): void {
            this.search();
        },
        auto_refresh (newVal: boolean): void {
            if (newVal) {
                this.search();
            }
        },
        "$route.query" (): void {
            this.fetchData();
        }
    },
    methods: {
        fetchData (): any {

        },
        search (): any {
            console.error("Implement this method");
        },
        getUserId (): any {
            if (this.$route.query) {
                return this.$route.query.user_id;
            }
            return null;
        },
        getResult (): any {
            if (this.$route.query) {
                return this.$route.query.result;
            }
            return null;
        },
        getProblemID (): any {
            if (this.$route.query) {
                return this.$route.query.problem_id;
            }
            return null;
        },
        getLanguage (): any {
            if (this.$route.query) {
                return this.$route.query.language;
            }
            return null;
        },
        setQuery (): void {
            const queryobject: any = {};
            if (this.user_id && this.user_id!.length > 0) {
                queryobject.user_id = this.user_id;
            }
            if (this.problem_result && this.problem_result !== -1) {
                queryobject.result = this.problem_result;
            }
            if (this.problem_id && this.problem_id !== 0) {
                queryobject.problem_id = this.problem_id;
            }
            if (this.language && this.language !== -1) {
                queryobject.language = this.language;
            }
            this.$router.push({ path: this.$route.path, query: queryobject });
        },
        tag (tag_name: any): void {
            this.current_tag = tag_name;
        },
        list_self_only (): void {
            const selfUserId = this.$store.getters.user_id;
            if (this.user_id == null || this.user_id !== selfUserId) {
                this.user_id = selfUserId;
            }
            else {
                this.user_id = null;
            }
            this.search();
        }
    }
});

@Component({ mixins: [statusViewMixin] })
export default class StatusViewMixin extends Vue {
    current_tag!: string;
    user_id!: any;
    problem_result!: any;
    problem_id!: any;
    language!: any;
    sim_checkbox!: boolean;
    privilege!: any;
    auto_refresh!: boolean;
    getUserId!: () => any;
    getResult!: () => any;
    getProblemID!: () => any;
    getLanguage!: () => any;
    setQuery!: () => void;
    list_self_only!: () => void;

    // Declared as real methods (delegating to the options mixin) so that class components
    // can still override them with methods.
    fetchData (): any {
        return (statusViewMixin as any).methods.fetchData.call(this);
    }

    search (): any {
        return (statusViewMixin as any).methods.search.call(this);
    }

    tag (tag_name: any): void {
        (statusViewMixin as any).methods.tag.call(this, tag_name);
    }
}
