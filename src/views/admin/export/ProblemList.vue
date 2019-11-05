<template>
    <div class="ui container padding">
        <div class="ui grid">
            <div class="row">
                <div class="column" style="z-index: 1700;">
                    <select class="ui search dropdown label selection"  @change="label = select('.label.selection.ui.dropdown').dropdown('get value')">
                        <option :key="lb" v-for="lb in all_label" :value="lb" v-text="lb"></option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="column">
                    <button class="ui primary button" @click="getXLSFile">
                        {{$t("export problem")}}
                    </button>
                </div>
            </div>
            <div class="row">
                <div class="column" v-show="exported_number > 0">
                    Exported: {{exported_number}}
                </div>
            </div>
        </div>
        <table :style="'display:none;vnd.ms-excel.numberformat:@'" id="save">
            <tbody>
                <tr align="center" class="toprow">
                    <td>Problem ID</td>
                    <td>title</td>
                </tr>
                <tr :key="key" v-for="(row,key) in problemList">
                    <td align="center">{{row.problem_id}}</td>
                    <td align="center">{{row.title}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import mixins from "../../../mixin/init";
import { saveAs } from "file-saver";

const $ = require("jquery");
export default {
    name: "ProblemList",
    mixins: [mixins],
    data () {
        return {
            select: $,
            label: [],
            all_label: [],
            problemList: [],
            exported_number: 0
        };
    },
    mounted () {
        this.getLabel();
    },
    methods: {
        async getXLSFile () {
            let page = 0;
            const label = this.label;
            console.log(label);
            const collector = [];
            while (true) {
                const flag = await this.axios.get(`/api/problemset/${page}/none/problem_id/0/?label=${label}`)
                    .then(({ data }) => {
                        if (data.problem.length === 0) {
                            return false;
                        }
                        collector.push(...(data.problem.filter(e => e.label.split(" ").length === 1)));
                        return true;
                    });
                if (!flag) {
                    break;
                }
                this.exported_number = collector.length;
                ++page;
            }
            this.problemList = collector;
            this.$nextTick(() => {
                const doc = document.getElementById("save");
                let XLSContentHTML = "<html xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:x=\"urn:schemas-microsoft-com:office:excel\" xmlns=\"http://www.w3.org/TR/REC-html40\">" + "<head><meta http-equiv='Content-Type' content='application/vnd.ms-excel; charset=utf-8' /></head>";
                XLSContentHTML += "<table border=1>" + doc.innerHTML.replace("<tbody>", "").replace("</tbody>", "");
                XLSContentHTML += "</table></html>";
                // const wopts = { bookType: 'csv', bookSST: false, type: 'binary' };//ods格式
                // const wopts = { bookType: 'ods', bookSST: false, type: 'binary' };//ods格式
                // const wopts = { bookType: 'xlsb', bookSST: false, type: 'binary' };//xlsb格式
                // const wopts = { bookType: 'fods', bookSST: false, type: 'binary' };//fods格式
                // const wopts = { bookType: 'biff2', bookSST: false, type: 'binary' };//xls格式
                // downloadExl(doc);
                const blob = new Blob([XLSContentHTML], { type: "application/vnd.ms-excel;charset=UTF-8;" });
                saveAs(blob, `${label}.xls`);
            });
            // console.log(collector);
        },
        getLabel () {
            const that = this;
            this.axios.get("/api/problem/local/?label=true")
                .then(({ data }) => {
                    const $dropdown = $(".label.selection.ui.dropdown");
                    that.all_label = data.data;
                    const hasLabel = that.label;
                    $dropdown
                        .dropdown({
                            allowAdditions: false
                        })
                        .on("click", function () {
                            that.label = $dropdown.dropdown("get value");
                        });
                    for (let i = 0; i < hasLabel.length; ++i) {
                        $dropdown.dropdown("set selected", hasLabel[i]);
                    }
                });
        }
    }
};
</script>

<style scoped>

</style>
