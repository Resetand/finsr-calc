import { parseNumeric } from "./helpers";

const OFFER_SLOT_CLASS_NAME = "credit-calc-offer";
const CATEGORY_SLOT_CLASS_NAME = "credit-calc-category";

const NAME_ATTR = "data-name";
const RATE_ATTR = "data-rate";
const RATE_BANK_ATTR = "data-rate-bank";
const INSURANCE_ATTR = "data-insurance";
const INSURANCE_BANK_ATTR = "data-insurance-bank";
const YEARS_MIN_ATTR = "data-years-min";
const YEARS_MAX_ATTR = "data-years-max";
const YEARS_STEP_ATTR = "data-years-step";
const SUM_MIN_ATTR = "data-sum-min";
const SUM_MAX_ATTR = "data-sum-max";
const COMMISSION_ATTR = "data-commission";
const OFFER_CATEGORIES_LABEL = "data-categories-label";

const DEFAULT_NAME = "<default>";

/**
 * Парсит вложенные в рутовый компонент элементы и их аргументы
 * для отрисовки калькулятора
 * @see README.md
 * @param {HTMLElement} root
 */
export const parseConfiguration = (root) => {
    const offerSlots = Array.from(root.getElementsByClassName(OFFER_SLOT_CLASS_NAME));

    return offerSlots.map((element) => {
        const offerConfig = parseAttributes(element);
        const offerCategorySlots = Array.from(element.getElementsByClassName(CATEGORY_SLOT_CLASS_NAME));
        const offerCategories = offerCategorySlots.map((typeEl) => mergeConfigs(offerConfig, parseAttributes(typeEl, false)));

        if (offerCategories.length === 0) {
            // default category
            offerCategories.push(offerConfig);
        }
        return {
            name: offerConfig.name,
            categoriesLabel: offerConfig.categoriesLabel,
            categories: offerCategories,
        };
    });
};

const mergeConfigs = (source, config) => {
    const filteredConfig = Object.entries(config).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined) {
            acc[key] = value;
        }
        return acc;
    }, {});
    return Object.assign({}, source, filteredConfig);
};

/**
 * @param {HTMLElement} element
 */
const parseAttributes = (element, useDefaults = true) => {
    const name = element.getAttribute(NAME_ATTR) || (useDefaults ? DEFAULT_NAME : undefined);
    const categoriesLabel = element.getAttribute(OFFER_CATEGORIES_LABEL) || (useDefaults ? "Категория" : undefined);

    const rate = getNumericAttr(element, RATE_ATTR, useDefaults ? 0 : undefined);
    const rateBank = getNumericAttr(element, RATE_BANK_ATTR, useDefaults ? 0 : undefined);
    const insurance = getNumericAttr(element, INSURANCE_ATTR, useDefaults ? 0 : undefined);
    const insuranceBank = getNumericAttr(element, INSURANCE_BANK_ATTR, useDefaults ? 0 : undefined);
    const yearsMin = getNumericAttr(element, YEARS_MIN_ATTR, useDefaults ? 1 : undefined);
    const yearsMax = getNumericAttr(element, YEARS_MAX_ATTR, useDefaults ? 10 : undefined);
    const yearsStep = getNumericAttr(element, YEARS_STEP_ATTR, useDefaults ? 1 : undefined);
    const sumMin = getNumericAttr(element, SUM_MIN_ATTR, useDefaults ? 0 : undefined);
    const sumMax = getNumericAttr(element, SUM_MAX_ATTR, useDefaults ? 10000000 : undefined);
    const commission = getNumericAttr(element, COMMISSION_ATTR, useDefaults ? 0 : undefined);

    return {
        name,
        rate,
        rateBank,
        insurance,
        insuranceBank,
        yearsMin,
        yearsMax,
        yearsStep,
        sumMin,
        sumMax,
        commission,
        categoriesLabel,
    };
};

/**
 * Парсит в возвращает числовой аттрибут
 * @param {HTMLElement} element
 * @param {string} attrName
 * @param {any} fallback
 */
const getNumericAttr = (element, attrName, fallback = undefined) => {
    const value = element.getAttribute(attrName);

    if (value === null || value === "") {
        return fallback;
    }

    const result = parseNumeric(value);
    return isNaN(result) ? fallback : result;
};
