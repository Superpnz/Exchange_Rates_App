import { roundFiveDigits } from "./helpers.js";

const firstSelect = document.querySelector("[data-first-select]");
const secondSelect = document.querySelector("[data-second-select]");

const swapBtn = document.querySelector("[data-swap-btn]");
const comparisonInfo = document.querySelector("[data-comparison-info]");

const firstInput = document.querySelector("[data-first-input]");
const secondInput = document.querySelector("[data-second-input]");

const BASE_URL = "https://open.er-api.com/v6/latest";
const FIRST_DEFAULT_CURRENCY = "USD";
const SECOND_DEFAULT_CURRENCY = "RUB";

let rates = {};

// слушатель событий изменения валют
firstSelect.addEventListener("change", () => updateExchangeRates());
secondSelect.addEventListener("change", () => renderInfo());

// событие input конвертирует из первой валюты во вторую и наоборот
firstInput.addEventListener("input",  () => {
    secondInput.value = roundFiveDigits(firstInput.value * rates[secondSelect.value]);
})

secondInput.addEventListener("input",  () => {
    firstInput.value = roundFiveDigits(secondInput.value / rates[secondSelect.value])
})

// событие кнопки, меняет выбранные валюты местами и обновляет курсы
swapBtn.addEventListener("click", () => {
    const temp = firstSelect.value;
    firstSelect.value = secondSelect.value;
    secondSelect.value = temp;

    updateExchangeRates();
})

// updateExchangeRates - функция получения актуального курса валют с сервера для базовой валюты
const updateExchangeRates = async () => {
    try {
        const response = await fetch(`${BASE_URL}/${firstSelect.value}`);
        const data = await response.json();

        rates = data.rates;
        renderInfo();
    } catch (error) {
        console.error(error.message);
    }
}

// renderInfo - обычная функция отображает текущий курс обмена между выбранными валютами
const renderInfo = () => {
    comparisonInfo.textContent = `1 ${firstSelect.value} = ${rates[secondSelect.value]} ${secondSelect.value}`;

    firstInput.value = rates[firstSelect.value];
    secondInput.value = rates[secondSelect.value];
}

// populateSelects - асинхронная функция заполняет оба выпадающих списка доступными валютами
const populateSelects = () => {
    firstSelect.innerHTML = "";
    secondSelect.innerHTML = "";

    for (const currency of Object.keys(rates)) {
        firstSelect.innerHTML += `
            <option value="${currency}" ${currency === FIRST_DEFAULT_CURRENCY ? "selected" : ""}>${currency}</option>
        `
        secondSelect.innerHTML += `
            <option value="${currency}" ${currency === SECOND_DEFAULT_CURRENCY ? "selected" : ""}>${currency}</option>
        `
    }
}

// getInitialRates - асинхронная функция для получения курсов валют из api и заполняем выпадающие списки
const getInitialRates = async () => {
    try {
        const response = await fetch(`${BASE_URL}/${FIRST_DEFAULT_CURRENCY}`);
        const data = await response.json();

        rates = data.rates;
        populateSelects();
        renderInfo();
    } catch (error) {
        console.error(error.message);
    }
}

getInitialRates();