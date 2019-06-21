<template>
    <div :class="progressBarClass" ref="progressBarElement" v-observe-visibility="visibilityChanged">
        <div class="bar"></div>
    </div>
</template>

<script>
const $ = require("jquery");
require("../../static/js/semantic.min");
function forceUpdate () {
    if (this.prevPercentage !== this.percentage) {
        this.$nextTick(this.$forceUpdate);
    }
}
function mountFunc () {
    if (this.element === null) {
        this.element = $(this.$refs.progressBarElement);
    }
    if (this.prevPercentage !== this.percentage) {
        this.element.progress({
            percent: this.percentage,
            autoSuccess: false
        });
        this.prevPercentage = this.percentage;
    }
}
export default {
    name: "progressBar",
    data () {
        return {
            prevPercentage: 0,
            element: null
        };
    },
    methods: {
        visibilityChanged (isVisible, entry) {
            if (isVisible && this.active) {
                this.element.progress("set active");
            }
            else {
                this.element.progress("remove active");
            }
        }
    },
    props: {
        size: {
            type: String,
            default: ""
        },
        color: {
            type: String,
            default: ""
        },
        active: {
            type: Boolean,
            default: false
        },
        percentage: {
            type: Number,
            default: 0
        }
    },
    updated: mountFunc,
    mounted: mountFunc,
    computed: {
        progressBarClass () {
            let classArray = ["ui", "progress"];
            if (this.size.length > 0) {
                classArray.push(this.size);
            }
            if (this.color.length > 0) {
                classArray.push(this.color);
            }
            if (this.active) {
                classArray.push("active");
            }
            return classArray;
        }
    },
    watch: {
        size: forceUpdate,
        color: forceUpdate,
        active: forceUpdate,
        percentage: forceUpdate
    }
};
</script>

<style scoped>
    .ui.progress {
        margin-bottom: 0!important;
    }
</style>
