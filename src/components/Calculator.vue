<template>
    <div class="calc-container">
        <div class="calc-form">
            <div v-if="configuration.length > 1" class="calc-form__row">
                <div class="calc-form__label">
                    Тип услуг
                </div>

                <div class="calc-form__item">
                    <vue-select
                        @input="({ index }) => (offerIndex = index)"
                        :value="configuration[offerIndex]"
                        :clearable="false"
                        :searchable="false"
                        :options="withIndex(configuration)"
                        label="name"
                        class="form-control form-control_select"
                        appendToBody
                    />
                </div>
            </div>
            <div v-if="selectedOffer.categories.length > 1" class="calc-form__row">
                <div class="calc-form__label">
                    {{ selectedOffer.categoriesLabel }}
                </div>

                <div class="calc-form__item">
                    <vue-select
                        @input="({ index }) => (categoryIndex = index)"
                        :value="selectedOffer.categories[categoryIndex]"
                        :clearable="false"
                        :searchable="false"
                        :options="withIndex(selectedOffer.categories)"
                        label="name"
                        class="form-control form-control_select"
                        appendToBody
                    />
                </div>
            </div>

            <div class="calc-form__row">
                <div class="calc-form__label">
                    Сумма кредита руб.
                </div>
                <div class="calc-form__item">
                    <money-input :min="config.sumMin" :max="config.sumMax" v-model="sum" />
                </div>
            </div>

            <div class="calc-form__row" style="margin-top: 40px">
                <div class="calc-form__label">
                    Срок кредита, лет
                </div>
            </div>
            <div class="calc-form__row" style="margin: 35px 5px">
                <div style="width:100%">
                    <slider
                        :interval="config.yearsStep"
                        :min="config.yearsMin"
                        :max="config.yearsMax"
                        height="3px"
                        marks
                        tooltip="always"
                        v-model="years"
                    />
                </div>
            </div>
        </div>

        <div class="summary">
            <h4 class="summary__title">Ваша экономия с нами составит</h4>
            <div class="summary__profit">{{ formatNumber(totalProfit) }} руб.**</div>

            <div class="summary__info">
                <div class="summary__info-row summary__info-row_borderless">
                    <div class="summary__info-col summary__info-col_label"></div>
                    <div class="summary__info-col summary__info-col_header">С нами</div>
                    <div class="summary__info-col summary__info-col_header">
                        При прямом <br />
                        обращении в банк
                    </div>
                </div>
                <div class="summary__info-row">
                    <div class="summary__info-col summary__info-col_label">Ставка</div>
                    <div class="summary__info-col">{{ formatNumber(config.rate * 100) }}%</div>
                    <div class="summary__info-col">{{ formatNumber(config.rateBank * 100) }}%*</div>
                </div>
                <div class="summary__info-row">
                    <div class="summary__info-col summary__info-col_label">Ежемесячный платёж</div>
                    <div class="summary__info-col">{{ formatNumber(Math.floor(monthlyPayment)) }} руб.</div>
                    <div class="summary__info-col">{{ formatNumber(Math.ceil(monthlyPaymentBank)) }} руб.</div>
                </div>
                <div class="summary__info-row">
                    <div class="summary__info-col summary__info-col_label">Страхование</div>
                    <div class="summary__info-col">{{ formatNumber(config.insurance * 100) }}%</div>
                    <div class="summary__info-col">{{ formatNumber(config.insuranceBank * 100) }}%</div>
                </div>
            </div>

            <div class="summary__caption">* среднерыночная ставка. ** с учётом стоимости наших услуг.</div>
        </div>
    </div>
</template>

<script>
import MoneyInput from "./MoneyInput.vue";
import VueSelect from "vue-select";
import Slider from "./Slider";

import { calcMonthlyPayment, clamp, formatNumber } from "../utils/helpers";

export default {
    name: "Calculator",

    components: { MoneyInput, Slider, VueSelect },

    data() {
        return {
            offerIndex: 0,
            categoryIndex: 0,
            sum: 0,
            years: 0,
        };
    },

    methods: {
        formatNumber,

        clampValues() {
            const { sumMin, sumMax, yearsMin, yearsMax } = this.config;
            this.sum = clamp(this.sum, sumMin, sumMax);
            this.years = clamp(this.years - (this.years % this.config.yearsStep), yearsMin, yearsMax);
        },

        withIndex(items) {
            return items.map((x, index) => ({ ...x, index }));
        },

        caclCurrentMonthlyPayment(rate) {
            return calcMonthlyPayment(this.sum, rate, this.years);
        },
    },

    computed: {
        selectedOffer() {
            return this.configuration[this.offerIndex];
        },

        /**
         * Если категорий нет - родительская кофигурация будет единственной дефотной категорией
         * @see utils/configuration-parser
         */
        config() {
            return this.configuration[this.offerIndex].categories[this.categoryIndex];
        },

        monthlyPayment() {
            return this.caclCurrentMonthlyPayment(this.config.rate);
        },

        monthlyPaymentBank() {
            return this.caclCurrentMonthlyPayment(this.config.rateBank);
        },

        totalProfit() {
            const { insuranceBank, insurance, commission } = this.config;

            const paymentDiff = this.monthlyPaymentBank - this.monthlyPayment;
            const months = this.years * 12;

            const paymentTotal = paymentDiff * months;
            const insuranceTotal = (insuranceBank - insurance) * this.sum * this.years;
            const commissionTotal = commission * this.sum;

            return Math.ceil(paymentTotal + insuranceTotal - commissionTotal);
        },
    },

    mounted() {
        this.clampValues();
    },

    watch: {
        offerIndex() {
            this.categoryIndex = 0;
            this.clampValues();
        },
        categoryIndex() {
            this.clampValues();
        },
    },

    props: {
        configuration: Array,
    },
};
</script>

<style lang="scss" scoped>
$small-scren: 767px;

.calc-container {
    font-family: opensans-regular, Arial, sans-serif;
}

.summary {
    max-width: 780px;
    margin: 0 auto;
    font-family: opensans-light, Arial, sans-serif;

    &__caption {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
        text-align: center;
        padding-top: 15px;

        text-align: center;
    }

    &__info {
        width: 100%;
        margin-top: 30px;
        &-col {
            text-align: right;
            flex: 1;
            font-size: 22px;
            padding: 0 5px;

            &_label {
                text-align: left;
                flex: 0.6;
                min-width: 110px;
                font-family: opensans-regular, Arial, sans-serif;
                font-size: 16px;
            }

            &_header {
                font-family: opensans-bold, Arial, sans-serif;
                font-size: 16px;
                align-self: flex-end;
            }

            @media screen and (max-width: $small-scren) {
                & {
                    font-size: 18px;
                }
                &_label {
                    font-size: 15px;
                }
                &_header {
                    font-size: 15px;
                }
            }
        }

        &-row {
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            padding: 15px 0;
            display: flex;
            align-items: center;

            &_borderless {
                border: none;
            }

            &:last-child {
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            }
        }
    }

    &__profit {
        font-size: 45px;
        text-align: center;
        font-weight: normal;
        padding-top: 5px;
        letter-spacing: 0.01em;
        white-space: nowrap;
        @media screen and (max-width: $small-scren) {
            font-size: 37px;
        }
    }

    &__title {
        font-size: 27px;
        padding-top: 20px;
        text-align: center;
        font-weight: normal;
        @media screen and (max-width: $small-scren) {
            font-size: 20px;
        }
    }
}

.form-control {
    width: 100%;
    z-index: unset;
    &_select {
        padding: 0;
    }
}

.calc-form {
    max-width: 580px;
    margin: 30px auto;

    &__label {
        flex: 0.35;
        font-size: 17px;
        color: #fff;
        text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.38);
    }

    &__row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 15px;
    }

    &__item {
        flex: 0.65;
    }

    @media screen and (max-width: $small-scren) {
        &__label {
            margin-bottom: 7px;
        }
        &__row {
            flex-direction: column;
            align-items: flex-start;
        }
        &__item {
            width: 100%;
        }
    }
}
</style>

<style lang="scss">
$vs-state-active-bg: #ffdd02;
$vs-state-active-color: #000;
$vs-controls-size: 0.78;

@import "vue-select/src/scss/vue-select.scss";

.vs__dropdown-toggle {
    border: none;
    font-size: 21px;
    vertical-align: middle;
    text-align: center;
    padding: 7px 0;
    @media screen and (max-width: 500px) {
        font-size: 19px;
    }
}

.vs__dropdown-option {
    font-size: 20px;
    text-align: center;
    padding: 10px 0;
    white-space: normal;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    @media screen and (max-width: 500px) {
        font-size: 17px;
    }
}

.vs__selected {
    width: 100%;
    color: #000;
    justify-content: center;
    margin-right: -20px;
}
</style>
