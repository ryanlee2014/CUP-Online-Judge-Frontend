<template>
    <div
            id="total_control"
            style="max-width:1300px;position:relative;margin:auto;height: 540px;border-radius: 10px">
        <leftPanel :accepted="accepted" :description="description" :hint="hint" :input="input" :isadmin="isadmin" :iseditor="iseditor"
                   :memory="memory"
                   :normal_problem="normal_problem" :original_id="original_id" :output="output" :problem_id="problem_id" :sampleinput="sampleinput"
                   :sampleoutput="sampleoutput"
                   :source="source" :spj="spj" :submit="submit" :switch_screen="switch_screen"
                   :time="time"
                   :title="title" :uploader="uploader"></leftPanel>
        <rightPanel :append="append" :do_submit="do_submit" :lang_list="lang_list"
                    :pre_test_run="pre_test_run" :prepend="prepend" :source_code="source_code"></rightPanel>

    </div>
</template>

<script>
import leftPanel from "./sidePage/leftPanel"
import rightPanel from "./sidePage/rightPanel"

export default {
  name: "sideProblemView.vue",
  components: {
    leftPanel,
    rightPanel
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    source_code: {
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
    },
    do_submit: {
      type: Function,
      default: () => {
      }
    },
    pre_test_run: {
      type: Function,
      default: () => {
      }
    },
    prepend: {
      type: Object,
      default: () => {
        return {}
      }
    },
    append: {
      type: Object,
      default: () => {
        return {}
      }
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

    #total_control {
        min-height: -moz-available; /* WebKit-based browsers will ignore this. */
        min-height: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */
        min-height: fill-available;
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
