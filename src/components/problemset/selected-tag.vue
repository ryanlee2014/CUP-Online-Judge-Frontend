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

<script>
    export default {
        name: "selected-tag",
        props: {
            data: String,
            color: Object,
            show_tag: Boolean,
            dim: Boolean,
            label: String
        },
        data: function () {
            return {};
        },
        computed: {
            datas: function () {
                var color = this.color;
                var search = this.data;
                var label = this.label;
                if (label === search && label.length > 0) {
                    search = search + "(搜索结果)";
                    label = label + "(标签)";
                }
                return {
                    search: search ? [search] : [],
                    color: color,
                    label: label ? [label] : [],
                }
            }
        },
        methods: {
            remove: function () {
                this.$parent.remove(...arguments);
            },
            labelColor: function(label) {
                var datas = this.datas;
                if(datas && datas.color && datas.color[label]) {
                    return datas.color[label];
                }
                else {
                    return "";
                }
            }
        }
    }
</script>

<style scoped>

</style>
