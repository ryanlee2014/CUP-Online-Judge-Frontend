import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component
export default class CaptchaMixin extends Vue {
    captchaHash = Math.random();
}
