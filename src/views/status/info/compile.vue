<template>
    <div class="ui container">
        <h2 class="ui dividing header">Compile Information</h2>
        <div class="ui segment same_width" v-html="info">
        </div>
    </div>
</template>

<script lang="ts">
import mixins from "../../../mixin/init";
import { Mixins, Component } from "vue-property-decorator";
const doc = document.createElement("div");
@Component
export default class CompileInfo extends Mixins(mixins) {
    info = "";
    solution_id = "";
    created () {
        this.solution_id = this.$route.params.solution_id;
    }

    mounted () {
        document.title = `${this.solution_id} Compile Information -- ${document.title}`;
        this.axios.get(`/api/status/compile_info/${this.solution_id}`)
            .then(({ data }) => {
                if (data.status === "OK") {
                    this.info = this.convertHTML(data.data.info).split(" ").join("&nbsp;");
                }
                else {
                    this.info = "您无权访问";
                }
            });
    }

    convertHTML (html: string) {
        doc.innerText = html;
        return doc.innerHTML;
    }
}
</script>

<style scoped>
    .same_width {
        font-family: Consolas,"Courier New",Courier,FreeMono,monospace;
    }
</style>
