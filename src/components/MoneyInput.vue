<template>
    <div class="numeric-input-group">
        <vue-numeric
            @blur="submitInputChange"
            @keyup.enter.native="submitInputChange"
            :minus="false"
            :precision="0"
            :min="min"
            :max="max"
            :placeholder="placeholder"
            v-model="inputValue"
            separator="space"
            class="form-control"
        />
        <div v-if="showSlider" class="numeric-input-group__slider">
            <slider @change="setValue" :marks="sliderMarks" :min="min" :max="max" :value="value" silent height="3px" tooltip="none" />
        </div>
    </div>
</template>

<script>
import VueNumeric from "vue-numeric";
import Slider from "./Slider.vue";
import { clamp, formatNumber } from "../utils/helpers";

export default {
    name: "MoneyInput",

    components: { Slider, VueNumeric },

    data() {
        return {
            inputValue: this.value,
        };
    },

    computed: {
        sliderMarks() {
            return {
                [this.min]: formatNumber(this.min),
                [this.max]: formatNumber(this.max),
            };
        },
    },

    methods: {
        submitInputChange() {
            this.setValue(clamp(this.inputValue, this.min, this.max));
        },

        setValue(value) {
            this.$emit("input", value);
        },
    },

    watch: {
        value() {
            this.inputValue = this.value;
        },
    },

    props: {
        value: Number,

        min: {
            type: Number,
            default: 0,
        },

        max: {
            type: Number,
            default: 100000000,
        },

        placeholder: {
            type: String,
            default: "100 000 000",
        },

        showSlider: {
            type: Boolean,
            default: true,
        },
    },
};
</script>

<style lang="scss">
.numeric-input-group .vue-slider-mark {
    & .vue-slider-mark-label {
        margin-top: 6px;
    }
    &:last-child .vue-slider-mark-label {
        transform: translateX(-100%);
    }

    &:first-child .vue-slider-mark-label {
        transform: translateX(-4px);
    }
}
</style>

<style lang="scss" scoped>
.form-control {
    font-size: 21px;
    padding: 12px 0;
    color: #000;
    width: 100%;
    z-index: 0;
}

.numeric-input-group {
    position: relative;
    &__slider {
        position: absolute;
        bottom: -7px;
        z-index: 20;
        left: 0;
        right: 0;
    }
}
</style>
