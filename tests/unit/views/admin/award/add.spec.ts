import { shallowMount } from "@vue/test-utils";
import AwardAdd from "@/views/admin/award/add.vue";

jest.mock("@/mixin/init", () => {
    const Vue = require("vue");
    class MockInit extends Vue {}
    return { __esModule: true, default: MockInit };
});

describe("AwardAdd", () => {
    it("posts award data and routes back", async () => {
        const post = jest.fn().mockResolvedValue({ data: {} });
        const wrapper = shallowMount(AwardAdd, {
            stubs: {
                "award-editor": { template: "<div></div>" }
            },
            mocks: {
                axios: { post },
                $t: (key: string) => key
            }
        });

        const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
        const routerBack = jest.fn();
        (wrapper.vm as any).routerBack = routerBack;

        const payload = { awardId: 1, userId: "u1", award: "Gold", year: 2024 };
        (wrapper.vm as any).add(payload);
        await post.mock.results[0].value;

        expect(post).toHaveBeenCalledWith("/api/admin/award/add", payload);
        expect(alertSpy).toHaveBeenCalledWith("success");
        expect(routerBack).toHaveBeenCalled();

        alertSpy.mockRestore();
    });
});
