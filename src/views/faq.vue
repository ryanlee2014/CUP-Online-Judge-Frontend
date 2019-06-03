<template>
    <div class="ui main container">
        <h1 class="ui dividing header">{{$t("faq")}}(Version:2019/04/11)</h1>
        <div class="markdown target" v-html="$t(`${$i18n.locale}-contents`)"></div>
    </div>
</template>

<script>
import markdownIt from "../lib/markdownIt/markdownIt";
import mixins from "../mixin/init";
export default {
    name: "faq",
    mixins: [mixins],
    data: function () {
        return {
            html_content: "",
            locales: this.$i18n.locale
        };
    },
    mounted () {
        document.title = `FAQ -- ${document.title}`;
    },
    i18n: (() => {
        const locales = require.context("../static/help/faq", true, /[A-Za-z0-9-_,\s]+\.md$/i);
        const messages = {};
        locales.keys().forEach(el => {
            const matched = el.match(/([A-Za-z0-9-_]+)\./i);
            if (matched && matched.length > 1) {
                const locale = matched[1];
                messages[locale] = {};
                messages[locale][`${locale}-contents`] = markdownIt.render(locales(el).default);
            }
        });
        return {
            messages
        };
    })()
};
</script>

<style scoped>

</style>
