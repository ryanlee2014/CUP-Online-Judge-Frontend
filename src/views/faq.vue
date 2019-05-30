<template>
    <div class="ui main container">
        <h1 class="ui dividing header">FAQ(Version:2019/04/11)</h1>
        <div class="markdown target" v-html="html_content"></div>
    </div>
</template>

<script>
import markdownIt from "../lib/markdownIt/markdownIt";
import mixins from "../mixin/init";
import help_content from "../static/help/faq.md";
export default {
    name: "faq",
    mixins: [mixins],
    data: function () {
        return {
            html_content: markdownIt.render(help_content)
        };
    },
    mounted () {
        document.title = `FAQ -- ${document.title}`;
    }
};
</script>

<style scoped>

</style>
