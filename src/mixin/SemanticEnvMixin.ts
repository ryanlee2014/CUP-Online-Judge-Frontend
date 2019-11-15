import jquery from "jquery";
import "../../semantic/semantic-ui/semantic.min";
import { Component } from "vue-property-decorator";
import Vue from "vue";
// @ts-ignore
window.$ = window.jQuery = jquery;

@Component
export default class SemanticEnvMixin extends Vue {

}
