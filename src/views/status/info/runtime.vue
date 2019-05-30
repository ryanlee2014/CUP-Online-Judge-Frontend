<template>
    <div class="ui container">
        <h2 class="ui dividing header">Runtime Information</h2>
        <div class="ui segment same_width">
            <div></div>
            <div class="ui container" v-show="!diffmode">
                <h3 class="ui dividing header">运行结果</h3>
                <div class="row" v-html="info">

                </div>
            </div>
            <div class="ui container">
                <div class="ui grid" v-show="diffmode">
                    <div class="row">
                        <div class="eight wide column">
                            <h3 class="ui header">
                                标准输出
                            </h3>
                        </div>
                        <div class="eight wide column">
                            <h3 class="ui header">
                                用户输出
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
            <div class="margin">
                <div id="container" style="min-width:100%;height:600px;border:1px solid #ccc" v-show="diffmode"></div>
            </div>
        </div>
    </div>
</template>

<script>
import mixins from "../../../mixin/init"
import * as monaco from "monaco-editor"

const _ = require("lodash")
export default {
  name: "runtime",
  mixins: [mixins],
  data () {
    return {
      info: "",
      solution_id: this.$route.params.solution_id,
      diffEditor: null,
      diffmode: false
    }
  },
  mounted () {
    document.title = `${this.solution_id} Runtime Information -- ${document.title}`
    this.axios.get(`/api/status/runtime_info/${this.solution_id}`)
      .then(({ data }) => {
        if (data.status === "OK") {
          let text = data.data.info
          this.initContext(text)
        } else {
          this.info = "您无权访问"
        }
      })
  },
  methods: {
    initContext (text) {
      let left_idx = 0; let right_idx = 0
      let left = []
      let right = []
      let cnt = 10
      while (left_idx !== -1 && right_idx !== -1) {
        left_idx = text.indexOf("------测试输出前100行-----", left_idx + 1)
        right_idx = text.indexOf("------用户输出前100行-----", right_idx + 1)
        if (!(left_idx !== -1 && right_idx !== -1)) {
          break
        }
        left.push(text.substring(left_idx, right_idx) + "\n")
        --cnt
        if (cnt <= 0) {
          break
        }
      }
      left_idx = 0
      cnt = 10
      // eslint-disable-next-line no-constant-condition
      while (true) {
        left_idx = text.indexOf("------用户输出前100行-----", left_idx + 1)
        right_idx = text.indexOf("------测试输出(左)与用户输出(右)前200行的区别-----", right_idx + 1)
        if (!(left_idx !== -1 && right_idx !== -1)) {
          break
        }
        right.push(text.substring(left_idx, right_idx) + "\n")
        --cnt
        if (cnt <= 0) {
          break
        }
      }
      let files = text.match(/[0-9A-Za-z]+\.out/g)
      let left_array = left; let right_array = right
      left = ""
      right = ""
      let idx = 0
      _.forEach(left_array, function (data) {
        left += files[idx++] + "\n" + data
      })
      idx = 0
      _.forEach(right_array, function (data) {
        right += files[idx++] + "\n" + data
      })
      if (text && text.length && left && left.length) {
        this.diffmode = true
        left = left.split("------测试输出前100行-----").join("")
        right = right.split("------用户输出前100行-----").join("")
        let originalModel = monaco.editor.createModel(left, "plain/text")
        let modifiedModel = monaco.editor.createModel(right, "plain/text")
        this.$forceUpdate()
        this.$nextTick(() => {
          const diffEditor = this.diffEditor = monaco.editor.createDiffEditor(document.getElementById("container"))
          diffEditor.setModel({
            original: originalModel,
            modified: modifiedModel
          })
        })
      } else {
        this.info = text.split("\n").join("<br>").split(" ").join("&nbsp;")
      }
    }
  },
  beforeDestroy () {
    if (this.diffEditor) {
      this.diffEditor.dispose()
    }
  }
}
</script>

<style scoped>
    .margin {
        margin-top: 1em;
        margin-bottom: 1em;
    }
</style>
