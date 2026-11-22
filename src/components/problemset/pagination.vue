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

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    // props intentionally untyped (same as the former class @Prop()): callers pass numbers or numeric strings
    props: {
        total: { default: undefined as any },
        page_cnt: { default: undefined as any },
        current_page: { default: undefined as any },
        onPageChanged: { default: undefined as any as (event: any, arrow?: any) => any }
    },
    data () {
        return {
            total_menu: 0
        };
    },
    computed: {
        pageList (): number[] {
            const { current_page, page_cnt, total, total_menu } = this as any;
            const totalPage = Math.ceil(total / page_cnt);
            const menuLength = Math.min(totalPage, total_menu);
            const list = Array.from(Array(menuLength).keys()).map(function (n) {
                if (current_page < total_menu / 2) {
                    return Math.trunc(n + 1);
                }
                else if (current_page + total_menu / 2 + 1 > totalPage) {
                    return Math.trunc(Math.max(totalPage - menuLength, 0) + 1 + n);
                }
                else {
                    return Math.trunc(current_page + n - total_menu / 2 + 1);
                }
            });
            this.$emit("pageUpdated", list);
            return list;
        }
    },
    created () {
        let width = document.body.clientWidth;
        const container = 1100;
        if (width > 1127) {
            width = container;
        }
        this.total_menu = Math.max(0, Math.trunc(width * 0.7 / 42) - 4);
    },
    methods: {
        page (event: any, arrow?: any): void {
            if (arrow) {
                this.onPageChanged(null, arrow);
            }
            else {
                this.onPageChanged(parseInt(event.target.innerText) - 1);
            }
        }
    }
});
</script>

<style scoped>

</style>
