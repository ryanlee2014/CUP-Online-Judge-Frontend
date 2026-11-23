import zh from "@/locales/zh-cn.json";
import en from "@/locales/en.json";
import ja from "@/locales/ja.json";
import { relativeParts, relativeTime } from "@/util/pixelArena";

function keys (o: any, prefix = ""): string[] {
    return Object.keys(o).flatMap(k => (o[k] && typeof o[k] === "object" ? keys(o[k], `${prefix}${k}.`) : [`${prefix}${k}`])).sort();
}

describe("new-interface locale strings", () => {
    it("zh-cn, en and ja define the same pa.* keys", () => {
        const base = keys((zh as any).pa);
        expect(base.length).toBeGreaterThan(50);
        expect(keys((en as any).pa)).toEqual(base);
        expect(keys((ja as any).pa)).toEqual(base);
    });

    it("keeps the same placeholders in every language", () => {
        const holders = (s: string) => (s.match(/\{\w+\}/g) || []).sort().join(",");
        const flat = (o: any, p = ""): Record<string, string> => Object.keys(o).reduce((acc: any, k) => {
            if (o[k] && typeof o[k] === "object") {
                Object.assign(acc, flat(o[k], `${p}${k}.`));
            }
            else {
                acc[`${p}${k}`] = String(o[k]);
            }
            return acc;
        }, {});
        const z = flat((zh as any).pa);
        const e = flat((en as any).pa);
        const j = flat((ja as any).pa);
        Object.keys(z).forEach(k => {
            expect([k, holders(e[k])]).toEqual([k, holders(z[k])]);
            expect([k, holders(j[k])]).toEqual([k, holders(z[k])]);
        });
    });

    it("splits relative time into a locale-neutral key", () => {
        const now = Date.parse("2026-11-22T18:00:00Z");
        expect(relativeParts("2026-11-22T17:59:30Z", now)).toEqual({ key: "justNow" });
        expect(relativeParts("2026-11-22T17:30:00Z", now)).toEqual({ key: "minutes", n: 30 });
        expect(relativeParts("2026-11-18T18:00:00Z", now)).toEqual({ key: "days", n: 4 });
        expect(relativeTime("2026-11-22T17:30:00Z", now)).toBe("30 分钟前");
    });
});
