<template>
    <div>
        <div class="ui labels">
            <a :key="label" v-for="label in datas.search" :class="'ui label '+labelColor(label)">{{label}}<i class="delete icon"
                                                                                                @click="remove('search',$event)"></i></a>
            <a :key="label" v-for="label in datas.label" :class="'ui label '+labelColor(label)">{{label}}<i class="delete icon"
                                                                                               @click="remove('label',$event)"></i></a>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        data: { default: undefined as any as string },
        color: { default: undefined as any },
        show_tag: { default: undefined as any as boolean },
        dim: { default: undefined as any as boolean },
        label: { default: undefined as any as string }
    },
    computed: {
        datas (): { search: string[], color: any, label: string[] } {
            const color = this.color;
            let search = this.data;
            let label = this.label;
            if (label === search && label.length > 0) {
                search = search + "(搜索结果)";
                label = label + "(标签)";
            }
            return {
                search: search ? [search] : [],
                color: color,
                label: label ? [label] : []
            };
        }
    },
    methods: {
        remove (...args: any[]): void {
            (this.$parent as any).remove(...args);
        },
        labelColor (label: any): string {
            const datas: any = this.datas;
            if (datas && datas.color && datas.color[label]) {
                return datas.color[label];
            }
            else {
                return "";
            }
        }
    }
});
</script>

<style scoped>

</style>
