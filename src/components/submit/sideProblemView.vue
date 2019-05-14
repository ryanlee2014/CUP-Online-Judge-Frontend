<template>
    <div
         style="max-width:1300px;position:relative;margin:auto;height: 540px;border-radius: 10px"
         id="total_control">
        <leftPanel :title="title" :time="time" :memory="memory" :spj="spj" :submit="submit" :accepted="accepted" :original_id="original_id"
        :iseditor="iseditor" :isadmin="isadmin" :description="description" :input="input" :output="output" :sampleinput="sampleinput"
        :sampleoutput="sampleoutput" :hint="hint" :uploader="uploader" :switch_screen="switch_screen" :normal_problem="normal_problem"
        :source="source" :problem_id="problem_id"></leftPanel>
        <rightPanel :lang_list="lang_list"></rightPanel>

    </div>
</template>

<script>
    import leftPanel from './sidePage/leftPanel'
    import rightPanel from './sidePage/rightPanel'
    export default {
        name: "sideProblemView.vue",
        components:{
            leftPanel,
            rightPanel
        },
        props: {
            title: {
                type: String,
                default: ""
            },
            time: {
                type: String,
                default: ""
            },
            memory: {
                type: String,
                default: ""
            },
            spj: {
                type: Boolean,
                default: false
            },
            submit: {
                type: String,
                default: "0"
            },
            accepted: {
                type: String,
                default: "0"
            },
            original_id: {
                type: Number,
                default: 0
            },
            iseditor: {
                type: Boolean,
                default: false
            },
            isadmin: {
                type: Boolean,
                default: false
            },
            description: {
                type: String,
                default: ""
            },
            input: {
                type: String,
                default: ""
            },
            output: {
                type: String,
                default: ""
            },
            sampleinput: {
                type: String,
                default: ""
            },
            sampleoutput: {
                type: String,
                default: ""
            },
            hint: {
                type: String,
                default: ""
            },
            uploader: {
                type: String,
                default: "Administrator"
            },
            switch_screen: {
                type: Function,
                default: () => () => undefined
            },
            normal_problem: {
                type: Boolean,
                default: true
            },
            source: {
                type: String,
                default: ""
            },
            problem_id: {
                type: Number,
                default: 0
            },
            lang_list: {
                type: Array,
                default: () => []
            }
        }
    }
</script>

<style scoped>
    .ui.modal {
        top: 3%;
    }

    script {
        display: none;
    }

    .not-compile {
        display: none;
    }

    .sample_input {
        color: #ad1457;
    }

    .sample_output {
        color: #ad1457;
    }

    .following.bar.title.light.fixed {
        top: 40px;
        transition: top 0.4s;
    }

    .following.bar.title {
        top: 60px;
        transition: top 0.4s;
    }

    .ui.vertical.center.aligned.grid {
        padding-top: 1em;
        padding-bottom: 2em;
    }

    .row.no.padding {
        padding-top: 0em;
        padding-bottom: 0em;
    }

    .main.submit.layout img {
        display: block;
        margin-left: auto;
        margin-right: auto;
    }
</style>
