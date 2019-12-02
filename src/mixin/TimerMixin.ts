import { Component } from "vue-property-decorator";
import { Debuglogging } from "@/module/Decorator/method";
import Vue from "vue";

@Component
export default class TimerMixin extends Vue {
    timer_ = [];
    @Debuglogging
    beforeDestroy () {
        const timer = this.timer_;
        timer.forEach(e => clearInterval(e));
    }
}
