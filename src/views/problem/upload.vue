<template>
    <div class="ui container padding" style="min-height:400px">
        <h2 class="ui dividing header">{{$t("upload problem")}}</h2>
        <div class="ui grid">
            <div class="row">
                <div class="ui center aligned segment" style="min-height:400px">
                    <div class="ui main container">
                        <form ref="upload_form" class="ui form">
                            <h3>{{$t("import problem")}}</h3>
                            <div class="field">
                                <a @click="selectFile" class="ui button">{{fileStatus}}</a>
                                <input @change="fileChange" ref="file" id="file" name="fps" style="display:none" type="file">
                            </div>
                            <div class="two field">
                                <div class="ui left input" style="width: auto;"><input id="vcode" name="captcha"
                                                                                       :placeholder="$t('captcha')" type="text"><img
                                        alt="click to change" height="40px" id="vcode_graph" class="captcha"
                                        onclick="this.src='/api/captcha?from=upload&random='+Math.random()"
                                        :src="`/api/captcha?from=upload&random=${captchaHash}`"></div>
                            </div>
                            <div class="field">
                                <a @click="uploadFile" class="ui primary button">{{$t("submit")}}</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<i18n>
    {
        "zh-cn": {
            "import problem": "导入题目RPK文件"
        },
        "en": {
            "import problem": "Import Problem RPK File"
        },
        "ja": {
            "import problem": "インポートファイル"
        }
    }
</i18n>
<script lang="ts">
import mixins from "../../mixin/init";
import { Component, Mixins } from "vue-property-decorator";
import CaptchaMixin from "@/mixin/CaptchaMixin";

@Component
export default class ProblemUpload extends Mixins(mixins, CaptchaMixin) {
    fileStatus = "选择文件";

    mounted () {
        document.title = `Upload problem -- ${document.title}`;
    }

    fileChange (event: any) {
        this.fileStatus = event.target.files[0].name;
    }

    selectFile () {
        (this.$refs.file as HTMLElement).click();
    }

    uploadFile () {
        const data = new FormData((this.$refs as any).upload_form as any);
        const config = {
            onUploadProgress: function (progressEvent: any) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                console.log(percentCompleted);
            }
        };
        this.axios.post("/api/upload/user", data, config)
            .then(({ data }) => {
                alert("上传成功");
            });
    }
}
</script>

<style scoped>

</style>
