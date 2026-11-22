import Vue, { defineComponent } from "vue";
import { Component } from "vue-property-decorator";
import $ from "jquery";

/**
 * Options-API mixin (Vue 3 compatible). Class components keep using the default export below.
 */
export const darkModeMixin = defineComponent({
    updated () {
        this.renderDarkMode();
    },
    methods: {
        renderDarkMode (): void {
            if (this.$store.getters.darkMode) {
                $("*:not(.not.theme)").addClass("inverted");
                $(".dimmer.inverted").removeClass("inverted");
            }
            else {
                $("*:not(.not.theme)").removeClass("inverted");
                $(".dimmer").addClass("inverted");
            }
        }
    }
});

@Component({ mixins: [darkModeMixin] })
export default class DarkModeMixin extends Vue {
    renderDarkMode!: () => void;
}
