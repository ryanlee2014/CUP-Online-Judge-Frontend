import { draftKey, loadDraft, saveDraft, removeDraft, pruneDrafts, DRAFT_PREFIX, DRAFT_MAX_AGE, DRAFT_MAX_ENTRIES } from "@/util/codeDraft";

describe("codeDraft", () => {
    beforeEach(() => localStorage.clear());

    it("builds a key per problem / contest problem / topic problem", () => {
        expect(draftKey({ problem_id: "1000" })).toBe(`${DRAFT_PREFIX}p:1000`);
        expect(draftKey({ contest_id: "1234", num: "2" })).toBe(`${DRAFT_PREFIX}c:1234:2`);
        expect(draftKey({ topic_id: "7", num: "0" })).toBe(`${DRAFT_PREFIX}t:7:0`);
        expect(draftKey({ problem_id: "abc" })).toBeNull();
        expect(draftKey({})).toBeNull();
    });

    it("saves, loads and removes a draft", () => {
        const key = draftKey({ problem_id: "1000" })!;
        saveDraft(key, "int main(){}", 1, 1000);
        expect(loadDraft(key, 2000)).toEqual({ code: "int main(){}", language: 1, t: 1000 });
        removeDraft(key);
        expect(loadDraft(key)).toBeNull();
    });

    it("blank code removes the draft", () => {
        const key = draftKey({ problem_id: "1000" })!;
        saveDraft(key, "x", 0, 1);
        saveDraft(key, "   \n", 0, 2);
        expect(localStorage.getItem(key)).toBeNull();
    });

    it("ignores expired and malformed drafts", () => {
        const key = draftKey({ problem_id: "1" })!;
        saveDraft(key, "code", 0, 0);
        expect(loadDraft(key, DRAFT_MAX_AGE + 1)).toBeNull();
        localStorage.setItem(key, "{not json");
        expect(loadDraft(key)).toBeNull();
    });

    it("keeps only the newest entries and leaves other keys alone", () => {
        localStorage.setItem("submitConfig", "{}");
        const now = 10 ** 9;
        for (let i = 0; i < DRAFT_MAX_ENTRIES + 5; ++i) {
            localStorage.setItem(`${DRAFT_PREFIX}p:${i}`, JSON.stringify({ code: "c", language: 0, t: now - (DRAFT_MAX_ENTRIES + 5 - i) }));
        }
        pruneDrafts(now);
        expect(localStorage.getItem(`${DRAFT_PREFIX}p:0`)).toBeNull();
        expect(localStorage.getItem(`${DRAFT_PREFIX}p:${DRAFT_MAX_ENTRIES + 4}`)).not.toBeNull();
        expect(localStorage.getItem("submitConfig")).toBe("{}");
        let count = 0;
        for (let i = 0; i < localStorage.length; ++i) {
            if (localStorage.key(i)!.startsWith(DRAFT_PREFIX)) count++;
        }
        expect(count).toBe(DRAFT_MAX_ENTRIES);
    });
});
