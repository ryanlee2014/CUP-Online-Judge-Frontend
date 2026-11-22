import Vue, { defineComponent } from "vue";
import { Component } from "vue-property-decorator";
import util from "../lib/util";
const { getAvatarURL, hasAvatarURL } = util;

/**
 * Options-API mixin (Vue 3 compatible). Class components keep using the default export below.
 */
export const avatarMixin = defineComponent({
    methods: {
        getAvatarURL (...arg: any): any {
            return getAvatarURL.apply(this, arg);
        },
        hasAvatarURL (...arg: any): any {
            return hasAvatarURL.apply(this, arg);
        }
    }
});

@Component({ mixins: [avatarMixin] })
export default class AvatarMixin extends Vue {
    getAvatarURL!: (...arg: any) => any;
    hasAvatarURL!: (...arg: any) => any;
}
