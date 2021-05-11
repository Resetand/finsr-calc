/**
 * @param {number} num
 * @param {number} min
 * @param {number} max
 * @returns number
 */
export function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
}

/**
 * Приводит к строке вида 'x xxx xxx,xx'
 * @param {string | number} value
 * @returns string
 */
export function formatNumber(value) {
    if (value === undefined) return "";
    return value
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
        .replace(".", ",");
}

/**
 * Расчета месячного аннуитетного платежа
 * @param {number} sum - сумма кредита
 * @param {number} rate - годовая ставка по кредиту в %
 * @param {number} yearsCount - количество лет
 * @returns number
 */
export function calcMonthlyPayment(sum, rate, yearsCount) {
    if (rate === 0) return 0;

    const monthlyRate = rate / 12;
    const monthsCount = yearsCount * 12;

    const annRation = (monthlyRate * (1 + monthlyRate) ** monthsCount) / ((1 + monthlyRate) ** monthsCount - 1);

    return sum * annRation;
}

/**
 * Парсит строку в число, обрабатывая случаи процентов
 * @param {string} value
 */
export function parseNumeric(value) {
    const purified = value.replace(",", ".").replace(" ", "");
    if (/.*%/.test(purified)) {
        // handle percent values
        return parseFloat(purified.replace("%", "")) * 0.01;
    }
    return parseFloat(purified);
}

/**
 * @param {number} a
 * @param {number} b
 * @returns number
 */
export function timesFloat(a, b) {
    return Math.round(a * b * 100) / 100;
}
