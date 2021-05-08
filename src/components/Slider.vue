<template>
    <vue-slider :duration="0.2" v-bind="$props" v-on="$listeners">
        <template v-slot:dot>
            <svg viewBox="0 0 151 191" fill="currentColor">
                <path
                    d="M0 92.261C0 84.824 2.73038 77.6867 7.72635 72.1777C26.5436 51.428 73.3026 0 74.5 0C75.8679 0 113.517 40.9082 142.795 72.0159C148.057 77.6077 151 84.9861 151 92.6649V163C151 179.569 137.569 193 121 193H30C13.4315 193 0 179.569 0 163V92.261Z"
                />
            </svg>
        </template>
    </vue-slider>
</template>

<script>
import VueSlider from "vue-slider-component";

export default {
    name: "Calculator",
    extends: VueSlider,
    components: { VueSlider },
};
</script>

<style lang="scss">
$themeColor: #ffdd02;
$bgColor: $themeColor;

$dotBgColor: $themeColor;
$dotShadowFocus: none;
$dotShadow: none;
$tooltipBgColor: transparent;
$railBorderRadius: 1px;
$tooltipPadding: 0px 5px;
$tooltipFontSize: 20px;

@import "~vue-slider-component/lib/theme/default.scss";

.vue-slider-dot-tooltip-text {
    text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.38);
}

.vue-slider-mark-step {
    background: $themeColor;
    border-radius: 0;
    height: 300%;

    width: 1px;
    margin-top: -100%;
    margin-left: 2px;
}

.vue-slider {
    box-sizing: content-box !important;
}

.vue-slider-dot {
    color: $themeColor;
    margin-top: -2px;

    cursor: pointer;
    & svg {
        width: 12px;
    }
}

.vue-slider-mark-label {
    opacity: 0.6;
}
</style>
