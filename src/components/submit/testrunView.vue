<template>
    <div class="ui modal" style="background-color: #ffffff" id="test_run_modal">
        <i class="close icon"></i>
        <div class="header">测试运行</div>
        <div class="content">
            <div class="ui grid" style="height:70%;margin:auto;">
                <div class="row">
                    <div class="ui message" style="width: 100%; padding: 1rem">
                        <div class="header">
                            使用说明
                        </div>
                        在测试输入框中输入测试数据后，点击执行，会根据输入的测试数据运行，得出输出结果。
                    </div>
                </div>
                <div class="row">
                    <div class="ten wide column" style="margin: auto">
                        <div class="ui header" style="margin: auto">测试输入</div>
                    </div>
                    <div class="six wide right aligned column">
                        <div class="ui basic button" @click="test_run_sampleinput = sampleinput">复制样例输入</div>
                    </div>
                </div>
                <div class="row" style="padding: 1rem">
                    <textarea style="width:100%;resize: none;border-radius:10px;font-family:SF Mono,Monaco,monospace;" cols=40
                              rows=7
                              id="input_text" v-model="test_run_sampleinput"></textarea>
                </div>
                <div class="row">
                    <div class="ten wide column" style="margin: auto">
                        <div class="ui header" style="margin: auto">测试结果</div>
                    </div>
                    <div class="six wide right aligned column">
                        <div class="ui basic button" style="opacity: 0"></div>
                    </div>
                </div>
                <div class="row" style="padding: 1rem">
                    <textarea style="width:100%;resize: none;border-radius:10px;font-family:SF Mono,Monaco,monospace" cols="40" rows="7" id="out" name="out"
                              :placeholder="'SHOULD BE:\n'+sampleoutput">
                        </textarea>
                </div>
                <div class="row" style="padding: 1rem">
                    <a :class="'ui basic button ' + (submitDisabled ? ' disabled': '')" @click.prevent="test_run" >执行</a>
                </div>
                <div class="row" style="padding:1rem;margin: auto;text-align:right;">
                    <div class="ui teal progress result" style="width: 100%" data-value="0" data-total="3" id="progress">
                        <div class="bar">
                            <div class="progress"></div>
                        </div>
                        <div class="label progess_text" id="progess_text"></div>
                    </div>
                    <div class="ui warning message" :class="'ui warning message '+(hide_warning?'hidden':'')">
                        <i class="close icon"></i>
                        <div class="header compile">
                        </div>
                    </div>
                    <!--<div id="result" class="ui blue button right" style="text-align: right">状态</div>-->
                    &nbsp;
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "testrunView",
    props: {
        value: {
            type: String,
            default: ""
        },
        sampleinput: {
            type: String,
            default: ""
        },
        hide_warning: {
            type: Boolean,
            default: true
        },
        test_run: {
            type: Function,
            default: () => {}
        },
        submitDisabled: {
            type: Boolean,
            default: false
        },
        sampleoutput: {
            type: String,
            default: ""
        }
    },
    data () {
        return {
            test_run_sampleinput: ""
        };
    },
    watch: {
        test_run_sampleinput: function (val) {
            this.$emit("input", val);
        },
        value: function (val) {
            this.test_run_sampleinput = val;
        }
    }
};
</script>

<style scoped>

</style>
