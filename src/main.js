import Vue from "vue";
import Calculator from "./components/Calculator.vue";
import { parseConfiguration } from "./utils/configuration-parser";

Vue.config.productionTip = false;

// добавляем возможность использовать множество калькуляторов на странице
Array.from(document.querySelectorAll(".vue-credit-calc")).forEach((root) => {
    const configuration = parseConfiguration(root);
    if (configuration.length > 0) {
        new Vue({ render: (h) => h(Calculator, { props: { configuration } }) }).$mount(root);
    }
});
