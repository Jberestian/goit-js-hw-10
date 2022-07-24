import '../css/styles.css';
import '../css/common.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
// import createCountryCard from '../templates/country-card.hbs';
// import createCountryCards from '../templates/contry-cards.hbs';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('#search-box'),
  coutryList: document.querySelector('.country-list'),
  counrtyDivEl: document.querySelector('.country-info'),
};

const searchCountries = value => {
  const searchQueryEl = refs.inputEl.value.trim().toLowerCase();
  refs.counrtyDivEl.innerHTML = '';
  refs.coutryList.innerHTML = '';

  if (searchQueryEl.length > 0) {
    fetchCountries(searchQueryEl)
      .then(data => {
        console.log(data);

        if (data.length > 10) {
          console.log('data1 :', data);
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (data.length >= 2 && data.length <= 10) {
          console.log('data2 :', data);
          createCountryCards(data);
        } else {
          createCountryCard(data);
          console.log('data3 :', data);
        }
      })
      .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  }
};

refs.inputEl.addEventListener(
  'input',
  debounce(searchCountries, DEBOUNCE_DELAY)
);

const createCountryCard = countries => {
  const countryMarkup = countries
    .map(country => {
      return `
    <div class="counrty__img-wrapper">
        <img class="country-list__img" src="${
          country.flags.svg
        }" alt="flag of ${country.name.common}" height = 30 width = 50>
        <p class="country-list__wrapper-text">${country.name.common}</p>
    </div>
    <p class="country-list__text"><b>Capital</b> : ${country.capital}</p>
    <p class="country-list__text"><b>Population</b> : ${country.population}</p>
    <p class="country-list__text"><b>Languages</b> : ${Object.values(
      country.languages
    )}</p>`;
    })
    .join('');
  return (refs.counrtyDivEl.innerHTML = countryMarkup);
};

const createCountryCards = countries => {
  const countriesMarkup = countries
    .map(country => {
      return `
      <li class="country-list__item"><img class="country-list__img" cla src="${country.flags.svg}" alt="${country.name.common}" width=50 height=30> <p class="country-list__text">${country.name.common} </p></li>`;
    })
    .join('');
  return (refs.coutryList.innerHTML = countriesMarkup);
};
