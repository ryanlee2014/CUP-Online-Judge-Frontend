<template>
    <div class="ui container">
        <h2 class="ui dividing header">Compile Information</h2>
        <div class="ui segment same_width" v-html="info">
        </div>
    </div>
</template>

<script>
    import mixins from '../../../mixin/init'
    export default {
        name: "compile",
        mixins: [mixins],
        data() {
            return {
                info: "",
                solution_id: this.$route.params.solution_id
            }
        },
        mounted() {
            document.title = `${this.solution_id} Compile Information -- ${document.title}`;
            this.axios.get(`/api/status/compile_info/${this.solution_id}`)
                .then(({data}) => {
                    if(data.status === "OK") {
                        this.info = data.data.info.split("\n").join("<br>").split(" ").join("&nbsp;");
                    }
                    else {
                        this.info = "您无权访问";
                    }
                })
        }
    }
</script>

<style scoped>
    .same_width {
        font-family: Consolas,"Courier New",Courier,FreeMono,monospace;
    }
</style>
