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
import jquery from "jquery";
import { Component, Prop } from "vue-property-decorator";
import Vue from "vue";
const $: any = jquery;

@Component
export default class Pagination extends Vue {
    @Prop() total!: number;
    @Prop() page_cnt!: number;
    @Prop() current_page!: number;
    $parent: any;
    total_menu = 0;
    created () {
        let width = document.body.clientWidth;
        let container = 1100;
        if (width > 1127) {
            width = container;
        }
        this.total_menu = Math.max(0, Math.trunc(width * 0.7 / 42) - 4);
    }
    get pageList () {
        const { current_page, page_cnt, total, total_menu } = this;
        const list = Array.from(Array(Math.min(Math.ceil(total / page_cnt), total_menu)).keys()).map(function (n) {
            if (current_page < total_menu / 2) {
                return Math.trunc(n + 1);
            }
            else if (current_page + total_menu / 2 + 1 > Math.ceil(total / page_cnt)) {
                return Math.trunc(Math.ceil(total / page_cnt) - total_menu + 1 + n);
            }
            else {
                return Math.trunc(current_page + n - total_menu / 2 + 1);
            }
        });
        this.$emit("pageUpdated", list);
        return list;
    }

    page (event: any, arrow: any) {
        if (arrow) {
            this.$parent.page(null, arrow);
        }
        else {
            this.$parent.page(parseInt(event.target.innerText) - 1);
        }
    }
}
</script>

<style scoped>

</style>
