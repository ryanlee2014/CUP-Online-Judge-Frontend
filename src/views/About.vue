<template>
    <div class="ui container">
        <h2 class="ui dividing header">关于</h2>
        <div class="ui basic segment">
            <h3 class="ui dividing header">版权声明</h3>
            <div class="ui segment">
                <h4>Software:</h4>
                <p>
                    CUPOJ,CUP Online Judge,CUP Virtual Judge,CUP Online Judge Packer,CUP Online Judge Semantic UI,CUP
                    Online Judge docker-judger,CUP Online Judge Judger,CUP Online Judge Next Generation Frontend
                </p>
                <p>
                    ©️2016-{{dayjs().format("YYYY")}} Ryan Lee <a
                        href="mailto:gxlhybh@gmail.com">gxlhybh@gmail.com</a><br>
                    This program is free software; you can redistribute it and/or modify it under the GPL or Apache
                    Licence.
                </p>
                <h4>Problem:</h4>
                <p>
                    Local Problem,HDOJ,POJ,UVa Online Judge,etc.<br>
                    <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh">CC BY-NC-ND 4.0</a>
                </p>
            </div>
            <h3 class="ui dividing header">开放源代码声明</h3>
            <div class="ui segment">
                <router-link to="/opensource">开放源代码声明</router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import mixins from '../mixin/init'

    const dayjs = require("dayjs");
    export default {
        name: "about",
        mixins: [mixins],
        data() {
            return {
                dayjs
            }
        }
    }
</script>

<style scoped>

</style>
