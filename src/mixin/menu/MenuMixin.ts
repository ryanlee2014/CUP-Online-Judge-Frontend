import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class MenuMixin extends Vue {
    @Prop({ default: "" }) nick!: string;
    @Prop({ default: false }) logined!: boolean;
    @Prop({ default: 0 }) user!: number;
    @Prop({ default: 0 }) judger!: number;
    @Prop({ default: false }) connected!: boolean;
}
