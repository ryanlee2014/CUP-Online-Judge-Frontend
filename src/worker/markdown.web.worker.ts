import registerPromiseWorker from "promise-worker/register";
import MarkdownIt from "@/lib/markdownIt/markdownIt";

registerPromiseWorker((message) => {
    if (message.type === "render") {
        return MarkdownIt.render(message.content);
    }
    else if (message.type === "renderRaw") {
        return MarkdownIt.renderRaw(message.content);
    }
    else if (message.type === "renderPlain") {
        return MarkdownIt.renderPlain(message.content);
    }
    else {
        return "[undefined method]";
    }
});

export default {} as typeof Worker & {new (): Worker};
