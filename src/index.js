import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
var _ = require('lodash');

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('#search-box');
const countryInfo = document.querySelector('.country-info');
const counrtyList = document.querySelector('.country-list');

searchBox.addEventListener('input', _.debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
  const searchValue = event.target.value;
  function clear() {
    countryInfo.innerHTML = '';
    counrtyList.innerHTML = '';
  }

  if (searchValue === '') {
    clear();
    return;
  }

  fetchCountries(searchValue.trim())
    .then(countries => {
      if (countries.length > 10) {
        clear();
        Notify.info('Too many matches found. Please enter a more specific name.');
        return;
      }
      if ((countries.length < 10) & (countries.length > 2)) {
        clear();
        appendListOfCountries(countries);
        return;
      }
      if (countries.length === 1) {
        clear();
        appendCountryMarkup(countries);
        return;
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      return;
    });
}

function appendCountryMarkup(countries) {
  const markup = countries.map(country => {
    return `<h2 class="country-name"><span class="flag-wrapper">
            <img src="${country.flags.svg}" alt="Country flag" width="50"></span> 
            ${country.name.official}</h2>
            <p class="country-capital"><span class="capital">Capital:</span> ${country.capital}</p>
            <p class="country-population"><span class="population">Population:</span> ${
              country.population
            }</p>
            <p class="country-languages"><span class="language">Languages:</span> ${Object.values(
              country.languages,
            )}</p>`;
  });

  countryInfo.innerHTML = markup;
}

function appendListOfCountries(countries) {
  const markup = countries
    .map(
      country => `<li class="country-item">
                <img src="${country.flags.svg}" alt="Country flag"  width="50" class="country-flag"><p class="country-name">${country.name.official}</p>
                </li>`,
    )
    .join('');
  counrtyList.innerHTML = markup;
}
