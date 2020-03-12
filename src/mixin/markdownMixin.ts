import Vue from "vue";
import { Component } from "vue-property-decorator";
import markdownIt from "@/lib/markdownIt/markdownIt";
@Component
export default class markdownMixin extends Vue {
    markdownIt = markdownIt;
}
