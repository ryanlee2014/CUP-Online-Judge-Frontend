import jquery from "jquery";
import "fomantic-ui/dist/semantic.min";
import { Component } from "vue-property-decorator";
import Vue from "vue";
// @ts-ignore
window.$ = window.jQuery = jquery;

@Component
export default class SemanticEnvMixin extends Vue {

}
