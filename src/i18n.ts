import Vue from "vue";
import VueI18n from "vue-i18n";
import config from "../config/environment.json";
Vue.use(VueI18n);

function loadLocaleMessages () {
    const locales = require.context("./locales", true, /[A-Za-z0-9-_,\s]+\.json$/i);
    const messages: {
        [id: string]: any
    } = {};
    locales.keys().forEach(key => {
        const matched = key.match(/([A-Za-z0-9-_]+)\./i);
        if (matched && matched.length > 1) {
            const locale = matched[1];
            messages[locale] = locales(key);
        }
    });
    for (const key in messages) {
        Object.assign(messages[key], (config.title as any)[key]);
    }
    return messages;
}

export default new VueI18n({
    locale: process.env.VUE_APP_I18N_LOCALE || "zh-cn",
    fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "zh-cn",
    messages: loadLocaleMessages(),
    silentTranslationWarn: true
});
