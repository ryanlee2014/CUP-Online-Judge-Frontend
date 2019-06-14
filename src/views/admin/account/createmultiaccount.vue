<template>
    <div class="ui container padding">
        <div class="ui form">
            <div class="field">
                <div class="two fields">
                    <div class="field">
                        <label>{{$t("prefix")}}</label>
                        <input type="text" v-model="prefix">
                    </div>
                    <div class="field">
                        <label>{{$t("number")}}</label>
                        <input type="text" v-model="generateNumber">
                    </div>
                </div>
            </div>
            <div class="field">
                <div class="two fields">
                    <div class="field">
                        <label>{{$t("name")}}</label>
                        <textarea v-model="nameListText"></textarea>
                    </div>
                    <div class="field">
                        <label>{{$t("nick")}}</label>
                        <textarea v-model="nickListText"></textarea>
                    </div>
                </div>
            </div>
            <div class="field">
                <div class="fields">
                    <div class="field">
                        <a class="ui primary button" @click="generate">
                            {{$t("generate")}}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import mixins from "../../../mixin/init";

export default {
    name: "createmultiaccount",
    mixins: [mixins],
    data () {
        return {
            nameListText: "",
            nickListText: "",
            prefix: "",
            generateNumber: 0
        };
    },
    methods: {
        generate () {
            // TODO
        }
    }
};
</script>

<style scoped>

</style>
