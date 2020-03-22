import Vue from "vue";
import { Component } from "vue-property-decorator";
import PromiseWorker from "promise-worker";
// eslint-disable-next-line import/no-webpack-loader-syntax
const Worker = require("worker-loader?inline=true&name=/dist/markdown.worker.js!@/worker/markdown.web.worker");
@Component
export default class MarkdownWorkerMixin extends Vue {
    worker_ = new PromiseWorker(new Worker());

    async renderAsync (content: string) {
        const ret = await this.worker_.postMessage({
            type: "render",
            content
        });
        console.log("ret", ret);
        return ret;
    }

    async renderRawAsync (content: string) {
        return this.worker_.postMessage({
            type: "renderRaw",
            content
        });
    }
}
