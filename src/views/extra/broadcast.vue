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

<script>
    import mixins from '../../mixin/init'
    import markdownIt from '../../lib/markdownIt/markdownIt'

    const $ = require("jquery");
    export default {
        name: "broadcast",
        mixins: [mixins],
        data() {
            return {
                contents: ""
            }
        },
        computed: {
            renderContents() {
                return markdownIt.render(this.contents);
            }
        },
        mounted() {
            document.title = `User broadcase -- ${document.title}`;
        },
        methods: {
            submit() {
                this.$socket.emit("msg", {
                    user_id: this.$store.getters.user_id,
                    nick: this.$store.getters.nick,
                    content: this.renderContents
                });
            },
            test() {
                const data = {
                    user_id: this.$store.getters.user_id,
                    nick: this.$store.getters.nick,
                    content: this.renderContents
                };
                $(".item.online_num").attr("data-html", "<div class='header'>From:" + data['user_id'] + "<br>" + data['nick'] + "</div><div class='content'>" + data['content'] + "</div>")
                    .popup("show").popup("set position", "bottom center");
            }
        }
    }
</script>

<style scoped>

</style>
