<template>
    <div class="ui container padding">
        <h3 class="ui dividing header">User Broadcast</h3>
        <div class="ui grid">
            <div class="row">
                <mavon-editor v-model="contents"></mavon-editor>
            </div>
            <div class="row">
                <div class="ui buttons">
                    <button @click="test" class="ui blue button">Test</button>
                    <button @click="submit" class="ui green button">Broadcast</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import mixins from "../../mixin/init";
import markdownIt from "../../lib/markdownIt/markdownIt";
import jquery from "jquery";
import { Component, Mixins } from "vue-property-decorator";

const $: any = jquery;

@Component
export default class Broadcast extends Mixins(mixins) {
    $socket: any;
    contents = "";
    get renderContents () {
        return markdownIt.render(this.contents);
    }

    mounted () {
        document.title = `User broadcast -- ${document.title}`;
    }

    submit () {
        this.$socket.emit("msg", {
            user_id: this.$store.getters.user_id,
            nick: this.$store.getters.nick,
            content: this.renderContents
        });
    }

    test () {
        const data = {
            user_id: this.$store.getters.user_id,
            nick: this.$store.getters.nick,
            content: this.renderContents
        };
        $("body")
            .toast({
                class: "info",
                displayTime: 0,
                closeIcon: true,
                message: `From:${data.nick}<br>(${data.user_id}): <br>${data.content}`
            });
        /* $(".item.online_num").attr("data-html", "<div class='header'>From:" + data["user_id"] + "<br>" + data["nick"] + "</div><div class='content'>" + data["content"] + "</div>")
            .popup("show").popup("set position", "bottom center"); */
    }
}
</script>

<style scoped>
</style>
