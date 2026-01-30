import { shallowMount } from "@vue/test-utils";
import AwardEdit from "@/views/admin/award/edit.vue";

jest.mock("@/mixin/init", () => {
    const Vue = require("vue");
    class MockInit extends Vue {}
    return { __esModule: true, default: MockInit };
});

describe("AwardEdit", () => {
    it("loads award info on mount", async () => {
        const get = jest.fn().mockResolvedValue({
            data: {
                data: [
                    { award_id: 7, user_id: "u7", award: "Silver", year: 2023 }
                ]
            }
        });
        const wrapper = shallowMount(AwardEdit, {
            stubs: {
                "award-editor": { template: "<div></div>" }
            },
            mocks: {
                axios: { get, post: jest.fn() },
                $t: (key: string) => key,
                $route: { params: { award_id: "7" } }
            }
        });

        await get.mock.results[0].value;
        expect(get).toHaveBeenCalledWith("/api/admin/award/get/7");
        expect((wrapper.vm as any).awardInfo).toEqual({
            award_id: 7,
            user_id: "u7",
            award: "Silver",
            year: 2023
        });
    });

    it("posts updated award data and routes back", async () => {
        const post = jest.fn().mockResolvedValue({ data: {} });
        const wrapper = shallowMount(AwardEdit, {
            stubs: {
                "award-editor": { template: "<div></div>" }
            },
            mocks: {
                axios: { get: jest.fn().mockResolvedValue({ data: { data: [] } }), post },
                $t: (key: string) => key,
                $route: { params: { award_id: "9" } }
            }
        });

        const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
        const routerBack = jest.fn();
        (wrapper.vm as any).routerBack = routerBack;

        const payload = { awardId: 9, userId: "u9", award: "Bronze", year: 2022 };
        (wrapper.vm as any).edit(payload);
        await post.mock.results[0].value;

        expect(post).toHaveBeenCalledWith("/api/admin/award/edit/9", payload);
        expect(alertSpy).toHaveBeenCalledWith("success");
        expect(routerBack).toHaveBeenCalled();

        alertSpy.mockRestore();
    });
});
