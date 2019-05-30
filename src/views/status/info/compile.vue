<template>
    <div class="ui container">
        <h2 class="ui dividing header">Compile Information</h2>
        <div class="ui segment same_width" v-html="info">
        </div>
    </div>
</template>

<script>
import mixins from "../../../mixin/init";
const doc = document.createElement("div");
export default {
    name: "compile",
    mixins: [mixins],
    data () {
        return {
            info: "",
            solution_id: this.$route.params.solution_id
        };
    },
    mounted () {
        document.title = `${this.solution_id} Compile Information -- ${document.title}`;
        this.axios.get(`/api/status/compile_info/${this.solution_id}`)
            .then(({ data }) => {
                if (data.status === "OK") {
                    this.info = this.convertHTML(data.data.info).split(" ").join("&nbsp;");
                } else {
                    this.info = "您无权访问";
                }
            });
    },
    methods: {
        convertHTML (html) {
            doc.innerText = html;
            return doc.innerHTML;
        }
    }
};
</script>

<style scoped>
    .same_width {
        font-family: Consolas,"Courier New",Courier,FreeMono,monospace;
    }
</style>
