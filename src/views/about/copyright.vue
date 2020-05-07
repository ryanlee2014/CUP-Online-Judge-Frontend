<template>
    <div class="ui container">
        <h2 class="ui dividing header">著作权声明(Chinese Only)</h2>
        <div class="ui basic segment">
            <h3 class="ui dividing header">您提交的代码</h3>
            <div class="ui segment">
                您在本平台提交的代码的著作权均为您本人所有。但是当您提交您的代码到本平台后，您的代码将会被认为遵循<a href="http://ahaasler.github.io/mit-license-material-theme/" target="_blank">MIT License</a>相关的内容授权给本平台。同时，您的代码也适用于<a href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh" target="_blank">署名-非商业性使用-禁止演绎 4.0 国际 (CC BY-NC-ND 4.0)</a>
            </div>
            <h3 class="ui dividing header">您提交的题解</h3>
            <div class="ui segment">
                您在本平台提交的题解遵循<a href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh" target="_blank">署名-非商业性使用-禁止演绎 4.0 国际 (CC BY-NC-ND 4.0)</a>进行发布。
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import mixins from "../../mixin/init";
import { Component, Mixins } from "vue-property-decorator";

@Component
export default class CopyRight extends Mixins(mixins) {
    mounted () {
        document.title = `Copyright -- ${document.title}`;
    }
}
</script>

<style scoped>

</style>
