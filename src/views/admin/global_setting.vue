<template>
    <div class="ui container">
        <h2 class="ui dividing header">Global Setting</h2>
        <div class="ui grid">
            <div class="row">
                <div class="ui form">
                    <div class="field">
                        <div class="two fields">
                            <div class="field">
                                <div class='ui toggle checkbox'>
                                    <input type='checkbox'>
                                    <label>竞赛模式</label>
                                </div>
                            </div>
                            <div class="field">
                                <div class='ui toggle checkbox'>
                                    <input type='checkbox'>
                                    <label>关闭访问</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import mixins from "../../mixin/init";
export default {
    name: "global_setting",
    mixins: [mixins],
    data () {
        return {};
    },
    mounted () {

    },
    methods: {
        initData () {

        }
    }
};
</script>

<style scoped>

</style>
