import Vue from "vue";
import { Component } from "vue-property-decorator";
import PromiseWorker from "promise-worker";
import Worker from "@/worker/markdown.web.worker";

@Component
export default class MarkdownWorkerMixin extends Vue {
    originalWorker = new Worker();
    worker_!: PromiseWorker;

    created () {
        this.worker_ = new PromiseWorker(this.originalWorker);
    }

    beforeDestroy () {
        this.originalWorker.terminate();
    }

    async renderAsync (content: string) {
        return this.worker_.postMessage({
            type: "render",
            content
        });
    }

    async renderRawAsync (content: string) {
        return this.worker_.postMessage({
            type: "renderRaw",
            content
        });
    }
}
