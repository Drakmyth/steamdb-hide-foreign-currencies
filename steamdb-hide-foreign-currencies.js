// ==UserScript==
// @name         SteamDB Hide Foreign Currencies
// @namespace    https://github.com/Drakmyth/steamdb-hide-foreign-currencies
// @version      0.2
// @author       Drakmyth
// @description  A Tampermonkey userscript to hide foreign currency information on SteamDB
// @homepage     https://github.com/Drakmyth/steamdb-hide-foreign-currencies
// @updateURL    https://github.com/Drakmyth/steamdb-hide-foreign-currencies/raw/master/steamdb-hide-foreign-currencies.user.js
// @downloadURL  https://github.com/Drakmyth/steamdb-hide-foreign-currencies/raw/master/steamdb-hide-foreign-currencies.user.js
// @supportURL   https://github.com/Drakmyth/steamdb-hide-foreign-currencies/issues
// @license      MIT
// @match        https://steamdb.info/app/*
// @match        https://steamdb.info/bundle/*
// @match        https://steamdb.info/sub/*
// @run-at       document-body
// @grant        none
// ==/UserScript==

(function () {
    `use strict`;

    const toggleButtonId = `tmnky-hide-foreign-currencies`;
    let hideForeignCurrencies = true;

    function doesToggleButtonExist() {
        const controlContainer = getControlContainer();
        return controlContainer.querySelector(`button#${toggleButtonId}`);
    }

    function getCurrentStateButtonText() {
        return `${hideForeignCurrencies ? `Show` : `Hide`} Foreign Currencies`;
    }

    function addToggleButton() {
        const toggleButton = createToggleButton(getCurrentStateButtonText(), toggleShowForeignCurrencies)

        const controlContainer = getControlContainer();
        controlContainer.insertBefore(toggleButton, controlContainer.firstChild);
    }

    function getControlContainer() {
        return document.getElementById('js-currency-selector').parentElement;
    }

    function createToggleButton(text, onClick) {
        const toggleButton = document.createElement(`button`);
        toggleButton.className = `btn btn-outline`;
        toggleButton.id = toggleButtonId;
        toggleButton.onclick = onClick;
        toggleButton.textContent = text;

        return toggleButton;
    }

    function toggleShowForeignCurrencies(event) {
        hideForeignCurrencies = !hideForeignCurrencies;
        event.target.textContent = getCurrentStateButtonText();
        onBodyChange();
    }

    function isCurrentCurrency(row) {
        return !hideForeignCurrencies || row.classList.contains(`table-prices-current`);
    }

    function onBodyChange(mut) {
        const priceRows = document.querySelectorAll(`.table-prices>tbody>tr`);

        for (let row of priceRows) {
            row.style.display = isCurrentCurrency(row) ? null : `none`;
        }
    }

    function onDOMContentLoaded() {
        if (!doesToggleButtonExist()) {
            addToggleButton();
        }
    }

    document.addEventListener(`DOMContentLoaded`, onDOMContentLoaded, false);
    const mo = new MutationObserver(onBodyChange);
    mo.observe(document.body, { childList: true, subtree: true });
})();
