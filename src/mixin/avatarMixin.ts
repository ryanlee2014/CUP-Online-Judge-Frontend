import Vue from "vue";
import Component from "vue-class-component";
import util from "../lib/util";
const { getAvatarURL, hasAvatarURL } = util;

@Component
export default class AvatarMixin extends Vue {
    getAvatarURL (...arg: [any?]) {
        return getAvatarURL.apply(this, arg);
    }

    hasAvatarURL (...arg: [any?]) {
        return hasAvatarURL.apply(this, arg);
    }
}
