import Vue from "vue";
import { Component } from "vue-property-decorator";
import $ from "jquery";

@Component
export default class DarkModeMixin extends Vue {
    updated () {
        this.renderDarkMode();
    }

    renderDarkMode () {
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
