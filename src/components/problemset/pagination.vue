<template>
    <div class="ui pagination menu" style="box-shadow: none;">
        <a :class="'icon item '+(current_page?'':'disabled')" @click="current_page&&page($event,-current_page)">
            <i class="angle double left icon"></i>
        </a>
        <a :class="'icon item '+(current_page?'':'disabled')" @click="current_page&&page($event,-1)">
            <i class="left chevron icon"></i>
        </a>
        <div :key="i" v-for="i in pageList">
            <a :class="(current_page+1 == i?'active':'')+' item page'" @click="page($event)">
                {{i}}
            </a>
        </div>
        <a :class="'icon item '+(current_page+1==Math.ceil(total/page_cnt)?'disabled':'')"
           @click="(current_page+1<Math.ceil(total/page_cnt))&&page($event,1)">
            <i class="right chevron icon"></i>
        </a>
        <a :class="'icon item '+(current_page+1==Math.ceil(total/page_cnt)?'disabled':'')"
           @click="(current_page+1<Math.ceil(total/page_cnt))&&page($event,Math.ceil(total/page_cnt)-1-current_page)">
            <i class="angle double right icon"></i>
        </a>
    </div>
</template>

<script>
const $ = require("jquery");
export default {
    name: "pagination",
    props: {
        total: Number,
        page_cnt: Number,
        current_page: Number
    },
    data: function () {
        let width = document.body.clientWidth;
        let container = 1100;
        if (width > 1127) {
            width = container;
        }
        return {
            total_menu: Math.max(0, parseInt(container * 0.7 / 42) - 4)
        };
    },
    computed: {
        pageList () {
            const { current_page, page_cnt, total, total_menu } = this;
            const list = Array.from(Array(Math.min(Math.ceil(total / page_cnt), total_menu)).keys()).map(function (n) {
                if (current_page < total_menu / 2) {
                    return parseInt(n + 1);
                }
                else if (current_page + total_menu / 2 + 1 > Math.ceil(total / page_cnt)) {
                    return parseInt(Math.ceil(total / page_cnt) - total_menu + 1 + n);
                }
                else {
                    return parseInt(current_page + n - total_menu / 2 + 1);
                }
            });
            this.$emit("pageUpdated", list);
            return list;
        }
    },
    methods: {
        page: function (event, arrow) {
            if (arrow) {
                this.$parent.page(null, arrow);
            }
            else {
                this.$parent.page(parseInt(event.target.innerText) - 1);
            }
        }
    }
};
</script>

<style scoped>

</style>
