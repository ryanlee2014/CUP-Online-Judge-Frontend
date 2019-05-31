<template>
    <ContestMode v-if="contest_mode"></ContestMode>
    <div v-else class="ui container padding">
        <h2 class="ui dividing header">
            Source Code
        </h2>
        <div class="ui existing segment" v-cloak>
            <div class="ui raised segment" v-cloak>
                <div class="ui tiny statistics" v-if="code">
                    <div class="statistic">
                        <div class="value none-transform">
                            {{from+' '+problem_id}}
                            <span class="subscript">&nbsp;</span>
                        </div>
                        <div class="label none-transform">
                            Problem
                        </div>
                    </div>
                    <div class="statistic">
                        <div class="value none-transform">
                            {{user_id}}
                            <span class="subscript">&nbsp;</span>
                        </div>
                        <div class="label none-transform">
                            User
                        </div>
                    </div>
                    <div class="statistic">
                        <div class="value none-transform">
                            {{time}}
                            <span class="subscript">ms</span>
                        </div>
                        <div class="label none-transform">
                            Running Time
                        </div>
                    </div>
                    <div class="statistic">
                        <div class="value none-transform">
                            {{memory}}
                            <span class="subscript">KB</span>
                        </div>
                        <div class="label none-transform">
                            Used Memory
                        </div>
                    </div>
                    <div class="statistic">
                        <div class="value none-transform">
                            {{language}}
                            <span class="subscript">&nbsp;</span>
                        </div>
                        <div class="label none-transform">
                            Language
                        </div>
                    </div>
                    <div class="statistic">
                        <div :class="'value none-transform '+judge_color">
                            <i :class="icon+' icon'"></i>
                            {{result}}
                            <span class="subscript">&nbsp;</span>
                        </div>
                        <div class="label none-transform">
                            Result
                        </div>
                    </div>
                    <div class="statistic" v-if="privilege">
                        <div class="value none-transform">
                            <a @click="rejudge" style="cursor:pointer">重新判题</a>
                            <span class="subscript">&nbsp;</span>
                        </div>
                        <div class="label none-transform">
                            <a @click="ban" style="cursor:pointer">封禁</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="ui raised segment" v-if="code">
                <div class="ui top right attached label"><a data-clipboard-target="#code" id="copy">Copy Source Code</a>
                </div>
                <div id="code" v-html="code">
                </div>
            </div>
            <div class="ui existing segment" v-if="statement" v-text="statement">

            </div>
        </div>

    </div>
</template>

<script>
import mixins from "../../mixin/init";
import ContestMode from "../../components/contestMode/block";
const Clipboard = require("clipboard");
const clipboard = new Clipboard("#copy");
const $ = require("jquery");
export default {
    name: "usercode",
    mixins: [mixins],
    components: {
        ContestMode
    },
    mounted () {
        const solution_id = this.$route.params.solution_id;
        document.title = `Solution ${solution_id} -- ${document.title}`;
        this.bindClipboardDOM();
        this.initData();
    },
    data: function () {
        return {
            code: "",
            time: 0,
            memory: 0,
            problem_id: 0,
            result: 0,
            language: 0,
            user_id: this.$store.getters.user_id,
            judge_color: [],
            icon: [],
            from: "",
            statement: false,
            contest_mode: false,
            privilege: false,
            error: false
        };
    },
    methods: {
        initData: function () {
            this.axios.get(`/api/source/${this.$route.params.from}/${this.$route.params.solution_id}`)
                .then(response => {
                    const data = response.data;
                    if (data.status === "OK") {
                        Object.assign(this, data.data);
                        this.privilege = data.privilege && this.$route.params.from === "local";
                        this.problem_id = Math.abs(this.problem);
                        if (typeof this.from !== "string") {
                            this.from = "";
                        }
                    }
                    else {
                        if (data.contest_mode) {
                            this.contest_mode = true;
                            return;
                        }
                        this.code = false;
                        this.statement = data.statement;
                        this.error = true;
                    }
                });
        },
        bindClipboardDOM: function () {
            clipboard.on("success", function (e) {
                $("#copy")
                    .popup({
                        title: "Finished",
                        content: "Your code is in your clipboard",
                        on: "click"
                    })
                    .popup("show");
            });
        },
        ban: function () {
            this.axios.post("/api/status/ban_submission", { solution_id: this.$route.params.solution_id })
                .then(response => {
                    alert("Server receive your request");
                    console.log(response.data);
                });
        },
        rejudge: function () {
            this.axios.post("/api/status/rejudge", { solution_id: this.$route.params.solution_id })
                .then(response => {
                    alert("Server receive youre request");
                    console.log(response.data);
                });
        }
    }
};
</script>

<style scoped>
    .subscript{
        font-size: 1rem;
    }
    .none-transform{
        text-transform: none !important;
    }
</style>
