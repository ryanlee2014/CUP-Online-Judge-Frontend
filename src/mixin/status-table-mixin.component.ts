import Vue, { defineComponent } from "vue";
import { Component } from "vue-property-decorator";
import dayjs from "dayjs";
import utils, { IIPPayload } from "@/lib/util";
import jquery from "jquery";
import * as _ from "lodash-es";
const $: any = jquery;

/**
 * Options-API mixin (Vue 3 compatible). Class components keep using the `StatusTableMixin` class below.
 * Props intentionally have no runtime type (same as the former class @Prop definitions).
 */
export const statusTableMixin = defineComponent({
    props: {
        problem_list: { default: () => [] as any[] },
        answer_icon: { default: () => [] as any[] },
        answer_class: { default: () => [] as any },
        target: { default: () => ({}) as any },
        language_name: { default: () => [] as any[] },
        result: { default: () => [] as any[] },
        self: { default: "" as any },
        isadmin: { default: false as any },
        contestId: { default: 0 as any },
        end: { default: undefined as any },
        finish: { default: undefined as any }
    },
    data () {
        return {
            user: {} as any,
            dayjs
        };
    },
    computed: {
        problem_lists (): any[] {
            const problemList: any = this.problem_list;
            _.forEach(problemList, (i: any) => {
                this.user[i.user_id] = this.user[i.user_id] || i;
            });
            const doc = document.createElement("div");
            let temp;
            for (const i in problemList) {
                doc.innerHTML = problemList[i].nick;
                temp = problemList[i];
                temp.nick = doc.innerText;
            }
            return problemList;
        }
    },
    updated () {
        $(".list-complete-item").popup({
            on: "hover",
            hoverable: true,
            positon: "top center"
        });
    },
    methods: {
        memory_parse (_memory: string): string {
            const unit = ["KB", "MB", "GB"];
            let cnt = 0;
            let memory = parseInt(_memory);
            if (isNaN(memory)) {
                return _memory;
            }
            while (memory > 1024) {
                memory /= 1024;
                ++cnt;
            }
            return memory.toString().substring(0, 5) + unit[cnt];
        },
        time_parse (_time: string): string {
            const unit = ["ms", "s"];
            let cnt = 0;
            let time = parseInt(_time);
            if (isNaN(time)) {
                return _time;
            }
            while (time > 1000) {
                ++cnt;
                time /= 1000;
            }
            return time.toString().substring(0, 5) + unit[cnt];
        },
        detect_place (ip: string): string {
            if (typeof (ip as unknown as any) !== "string" || ip.length < 7) {
                return "未知";
            }
            const tmp: IIPPayload = {
                intranet_ip: ip,
                place: "",
                $this: this as any,
                toString: function () {
                    return this.intranet_ip + " " + this.place;
                }
            };
            utils.detectIP(tmp);
            return tmp.place as string;
        },
        infoRoute (result: string): string {
            if (parseInt(result) === 11) {
                return "compile";
            }
            return "runtime";
        }
    }
});

@Component({ mixins: [statusTableMixin] })
export class StatusTableMixin extends Vue {
    problem_list!: any[];
    answer_icon!: any[];
    answer_class!: any;
    target!: any;
    language_name!: any[];
    result!: any[];
    self!: string;
    isadmin!: boolean;
    contestId!: number;
    end!: boolean;
    finish!: boolean;
    user!: any;
    dayjs!: typeof dayjs;
    problem_lists!: any[];
    memory_parse!: (_memory: string) => string;
    time_parse!: (_time: string) => string;
    detect_place!: (ip: string) => string;
    infoRoute!: (result: string) => string;
}
