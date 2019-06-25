export default {
    data () {
        return {
            contest_id: this.$route.params.contest_id,
            data: {},
            userListText: "",
            problemSelected: ""
        };
    },
    mounted () {
        this.initData();
    },
    methods: {
        initData (options, next) {
            this.axios.get(`/api/admin/contest/edit/${this.contest_id}`)
                .then(({ data }) => {
                    if (data.data.length > 0) {
                        this.data = data;
                    }
                });
            this.axios.get(`/api/admin/contest/edit/user/${this.contest_id}`)
                .then(({ data }) => {
                    if (data.data.length > 0) {
                        this.userListText = data.data.map(el => el.user_id).join("\n");
                    }
                });
            this.axios.get(`/api/contest/problem/${this.contest_id}`)
                .then(({ data }) => {
                    if (data.status === "OK") {
                        this.problemSelected = data.data.map(el => el.pid).join(",");
                    }
                });
        },
        dataFormat (val) {
            val = _.cloneDeep(val);
            delete val.userListText;
            delete val.languageSelected;
            delete val.languageSet;
            val.problemSelected = val.problemSelected.split(",").map(el => parseInt(el));
            return val;
        }
    }
};
