<template>
    <div class="ui container padding" style="min-height:400px">
        <h2 class="ui dividing header">Upload Problem</h2>
        <div class="ui grid">
            <div class="row">
                <div class="ui center aligned segment" style="min-height:400px">
                    <div class="ui main container">
                        <form action="/api/upload/user" class="ui form" enctype="multipart/form-data" method="post">
                            <h3>Import Problem(RPK):</h3>
                            <div class="field">
                                <a @click="selectFile" class="ui button">{{fileStatus}}</a>
                                <input @change="fileChange" id="file" name="fps" style="display:none" type="file">
                            </div>
                            <div class="two field">
                                <div class="ui left input" style="width: auto;"><input id="vcode" name="captcha"
                                                                                       placeholder="验证码" type="text"><img
                                        alt="click to change" height="40px" id="vcode_graph"
                                        onclick="this.src='/api/captcha?from=upload&random='+Math.random()"
                                        src="/api/captcha?from=upload"></div>
                            </div>
                            <div class="field">
                                <input class="ui blue button" type="submit" value="Import">
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import mixins from "../../mixin/init";

export default {
    name: "upload",
    mixins: [mixins],
    data: function () {
        return {
            fileStatus: "选择文件"
        };
    },
    mounted () {
        document.title = `Upload problem -- ${document.title}`;
    },
    methods: {
        selectFile: function () {
            $("#file").click();
        },
        fileChange: function ($event) {
            this.fileStatus = $event.target.files[0].name;
        }
    }
};
</script>

<style scoped>

</style>
