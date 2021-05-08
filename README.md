# finsr-calc

Мини-приложение на vue для отображения кредитного калькулятора

Исходный код лежит https://github.com/Resetand/finsr-calc

## Конфигурирование и использование

Чтобы отобразить калькулятор нужно вставить в разметку элемент с классом "vue-credit-calc" и описать конфигурацию
`<div class='vue-credit-calc'>...</div>`

Конфигурация калькулятора описывается с помощью html разметки и настраиваемых атрибутов из которых формируются правила расчета

Разметка состоит из элементов-слотов услуг `x-offer` и опциональных слотов с вложенными категориями `x-category`

Категории будут наследовать конфигурацию из родительского слота услуги, и могут перетирать родительские правила расчета

! Если услуга всего одна, то компонент с выбором услуг показываться не будет, то же самое и для категорий.
Таким образом можно показывать только нужное предложение на страницах с продуктом (ипотека, залог и тд)

Пример калькулятора с двумя услугами (Потребительский кредит, Ипотека) и категориями в Ипотеке (Квартира, Коммерческая недвижимость)

```html
<div class="vue-credit-calc">
    <x-offer
        data-name="Потребительский кредит"
        data-commission="10%"
        data-sum-min="500000"
        data-sum-max="5000000"
        data-years-min="1"
        data-years-max="5"
        data-rate="12,5%"
        data-rate-bank="19%"
        data-insurance="0"
        data-insurance-bank="9%"
    ></x-offer>
    <x-offer
        data-name="Ипотека"
        data-commission="2%"
        data-categories-label="Вид недвижимости"
        data-years-min="5"
        data-years-max="30"
        data-years-step="5"
        data-sum-min="1000000"
        data-sum-max="100000000"
    >
        <x-category
            data-name="Квартира"
            data-rate="9,2%"
            data-rate-bank="11,75%"
            data-insurance="0,5%"
            data-insurance-bank="0,8%"
        ></x-category>

        <x-category
            data-name="Коммерческая недвижимость"
            data-rate="8,2%"
            data-rate-bank="11,5%"
            data-insurance="0,65%"
            data-insurance-bank="1%"
        ></x-category>
    </x-offer>
</div>
```

Калькулятор только для потребительского кредита

```html
<div class="vue-credit-calc">
    <x-offer
        data-name="Потребительский кредит (можно не писать тк не будет отображаться)"
        data-commission="10%"
        data-sum-min="500000"
        data-sum-max="5000000"
        data-years-min="1"
        data-years-max="5"
        data-rate="12,5%"
        data-rate-bank="19%"
        data-insurance="0"
        data-insurance-bank="9%"
    ></x-offer>
</div>
```

API атрибутов

-   data-name - отображаемое название, [текст]
-   data-commission - наша комиссия, [процент]
-   data-rate - ставка у нас, [процент]
-   data-rate-bank - ставка в банке, [процент]
-   data-insurance - страховка у нас, [процент]
-   data-insurance-bank - страховка в банке, [процент]
-   data-years-min - минимальное количество лет, [число]
-   data-years-max - максимальное количество лет, [число]
-   data-years-step - шаг слайдера выбора лет, [число] !! Должно делится без остатка на data-years-min/max
-   data-sum-min - минимальная сумма кредита, [число]
-   data-sum-max - максимальная сумма кредита, [число]
-   data-categories-label - подпись для категорий (если они есть), [текст]

! Допустимый формат для [процент]: 12,4% или 12.4% или 0,124 или 0.124

## Разработка

Я не придумал более консистентного и автоматизированного способа интегрировать приложение на vue
с modx, поэтому если знаете как - действуйте

На данный момент для внесения правок нужно

1. Клонировать репозиторий `git clone https://github.com/Resetand/finsr-calc.git`
2. Установить пакеты `npm i`
3. Развернуть локальный сервер `npm run serve`
4. Внести правки в код и, при необходимости, в документацию
5. Не забыть запушить изменения, чтобы репозиторий оставался актуальным
6. Сделать сборку проекта `npm run build`
7. Заменить содержимое файла в админки `assets/tamplate/js/credit-calc-vue/finsr-calc.js` на получившийся bundle (`dist/finsr-calc.js`)
8. При необходимости актуализировать файл с докой `assets/tamplate/js/credit-calc-vue/README.md`
9. PROFIT

Если нужна помощь - t.me/resetand
