<template>
    <div class="ui container padding" style="min-height:400px">
        <h2 class="ui dividing header">Upload Problem</h2>
        <div class="ui grid">
            <div class="row">
                <div class="ui center aligned segment" style="min-height:400px">
                    <div class="ui main container">
                        <form action="/api/upload/user" method="post" class="ui form" enctype="multipart/form-data">
                            <h3>Import Problem(RPK):</h3>
                            <div class="field">
                                <a class="ui button" @click="selectFile">{{fileStatus}}</a>
                                <input style="display:none" type="file" name="fps" id="file" @change="fileChange">
                            </div>
                            <div class="two field">
                                <div class="ui left input" style="width: auto;"><input name="captcha" type="text" placeholder="验证码" id="vcode"><img alt="click to change" id="vcode_graph" src="/api/captcha?from=upload" onclick="this.src='/api/captcha?from=upload&random='+Math.random()" height="40px"></div>
                            </div>
                            <div class="field">
                                <input type="submit" class="ui blue button" value="Import">
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "upload",
        data:function(){
            return {
                fileStatus:"选择文件"
            };
        },
        methods:{
            selectFile:function(){
                $("#file").click();
            },
            fileChange:function($event) {
                this.fileStatus = $event.target.files[0].name;
            }
        }
    }
</script>

<style scoped>

</style>
