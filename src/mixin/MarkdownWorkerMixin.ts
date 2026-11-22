import Vue, { defineComponent } from "vue";
import { Component } from "vue-property-decorator";
import PromiseWorker from "promise-worker";
import Worker from "@/worker/markdown.web.worker";
import { MarkdownDebug } from "@/module/Decorator/method";

type RenderFn = (content: string) => Promise<any>;

/**
 * Applies the former @MarkdownDebug decorator to a plain function (same runtime behaviour:
 * worker in production, synchronous markdownIt fallback otherwise).
 */
function withMarkdownDebug (propertyName: string, method: (this: any, content: string) => Promise<any>): RenderFn {
    const descriptor: PropertyDescriptor = { value: method };
    MarkdownDebug({ constructor: { name: "MarkdownWorkerMixin" } }, propertyName, descriptor);
    return descriptor.value;
}

const renderAsync = withMarkdownDebug("renderAsync", async function (content: string) {
    return this.worker_.postMessage({
        type: "render",
        content
    });
});

const renderPlainAsync = withMarkdownDebug("renderPlainAsync", async function (content: string) {
    return this.worker_.postMessage({
        type: "renderPlain",
        content
    });
});

const renderRawAsync = withMarkdownDebug("renderRawAsync", async function (content: string) {
    return this.worker_.postMessage({
        type: "renderRaw",
        content
    });
});

/**
 * Options-API mixin (Vue 3 compatible). Class components keep using the default export below.
 * The worker objects are kept off reactive data.
 */
export const markdownWorkerMixin = defineComponent({
    created () {
        const self = this as any;
        self.originalWorker = new Worker();
        self.worker_ = new PromiseWorker(self.originalWorker);
    },
    beforeDestroy () {
        (this as any).originalWorker.terminate();
    },
    methods: {
        renderAsync (content: string): Promise<any> {
            return renderAsync.call(this, content);
        },
        renderPlainAsync (content: string): Promise<any> {
            return renderPlainAsync.call(this, content);
        },
        renderRawAsync (content: string): Promise<any> {
            return renderRawAsync.call(this, content);
        }
    }
});

@Component({ mixins: [markdownWorkerMixin] })
export default class MarkdownWorkerMixin extends Vue {
    originalWorker!: any;
    worker_!: PromiseWorker;
    renderAsync!: RenderFn;
    renderPlainAsync!: RenderFn;
    renderRawAsync!: RenderFn;
}
