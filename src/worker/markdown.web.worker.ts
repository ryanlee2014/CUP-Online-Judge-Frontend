import registerPromiseWorker from "promise-worker/register";
import MarkdownIt from "@/lib/markdownIt/markdownIt";

registerPromiseWorker((message) => {
    console.log("hallo", message);
    if (message.type === "render") {
        return MarkdownIt.render(message.content);
    }
    else if (message.type === "renderRaw") {
        return MarkdownIt.renderRaw(message.content);
    }
});

// export default {} as typeof Worker & {new (): Worker};
