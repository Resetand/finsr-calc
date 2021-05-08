import Vue from "vue";
import Calculator from "./components/Calculator.vue";
import { parseConfiguration } from "./utils/configuration-parser";

Vue.config.productionTip = false;

const root = document.getElementById("credit-calc");
const configuration = parseConfiguration(root);

new Vue({ render: (h) => h(Calculator, { props: { configuration } }) }).$mount(root);
