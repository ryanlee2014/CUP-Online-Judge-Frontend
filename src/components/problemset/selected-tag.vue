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
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class SelectedTag extends Vue {
    @Prop() data!: string;
    @Prop() color!: any;
    @Prop() show_tag!: boolean;
    @Prop() dim!: boolean;
    @Prop() label!: string;

    $parent: any;

    get datas () {
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
    remove () {
        this.$parent.remove(...arguments);
    }
    labelColor (label: any) {
        const datas: any = this.datas;
        if (datas && datas.color && datas.color[label]) {
            return datas.color[label];
        }
        else {
            return "";
        }
    }
}
</script>

<style scoped>

</style>
