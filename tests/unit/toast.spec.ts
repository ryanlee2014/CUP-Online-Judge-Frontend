import { toast } from "@/util/toast";

describe("toast", () => {
    beforeEach(() => {
        jest.useFakeTimers();
        document.body.innerHTML = "";
    });
    afterEach(() => jest.useRealTimers());

    it("renders text safely and auto-closes", () => {
        toast("<b>hi</b>", { duration: 1000 });
        const el = document.querySelector(".cupoj-toast .msg")!;
        expect(el.textContent).toBe("<b>hi</b>");
        expect(el.querySelector("b")).toBeNull();
        jest.advanceTimersByTime(1000 + 200);
        expect(document.querySelector(".cupoj-toast")).toBeNull();
    });

    it("runs the action and closes", () => {
        const onClick = jest.fn();
        toast("restored", { duration: 0, action: { label: "清空", onClick } });
        (document.querySelector(".cupoj-toast .action") as HTMLButtonElement).click();
        expect(onClick).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(200);
        expect(document.querySelector(".cupoj-toast")).toBeNull();
    });
});
