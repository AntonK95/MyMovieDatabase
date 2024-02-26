'use strict';

import { setupCarousel } from "./carousel.js";
import { fetchTrailerAPI } from "./APIhandler.js";
import { myTopMovies } from "./APIhandler.js";
import { searchMoviesAPI } from "./APIhandler.js";

window.addEventListener('load', async () => {
    console.log('load');
    //Förslagsvis anropar ni era funktioner som skall sätta lyssnare, rendera objekt osv. härifrån
    // setupCarousel();
    // fetchTrailerAPI();
    loadTrailer();
    myTopMovies();
    showtopMovies();
    searchMovies();
});


async function loadTrailer() {
    try {
        const allTrailers = await fetchTrailerAPI();

        const randomTrailers = getRandomTrailers(allTrailers, 5);

        carouselItems(randomTrailers);
    } catch (error) {
        console.error('Något gick fel vid hämtning av trailer', error);
    }
}

// Funktion för att slumpa fem filmer från listan
function getRandomTrailers(trailers, count) {
    const shuffledTrailers = trailers.sort(() => Math.random() - 0.5);
    return shuffledTrailers.slice(0, count);
}

// Skapa HTML element för varje trailer och lägg till dem i karusellen
function carouselItems(trailers) {
    const slidesContainer = document.querySelector('[data-slides]');

    trailers.forEach((trailer, index) => {
        const slide = document.createElement('div');
        slide.classList.add('carousel__slide');
        if(index === 0){
            slide.dataset.active = true // Markera första sliden som aktiv
        }

        const trailerLink = document.createElement('iframe');
        trailerLink.src = trailer.trailer_link;
        trailerLink.width = '420';
        trailerLink.height = '315';
        trailerLink.frameborder = "0";

        slide.appendChild(trailerLink);

        // Lägg till data-carousel och data-slides attribut för att matcha setupCarousel-funktionen
        slide.dataset.carousel = 'true';
        slide.dataset.slides = 'true';

        slidesContainer.appendChild(slide);
    });

    setupCarousel();
}

async function showtopMovies() {

    const topMoviesData = await myTopMovies();

    const moviesGrid = document.getElementById('popularCardContainer');
    
   

    topMoviesData.forEach(movie => {
        // Skapa ny container/hållare för varje film
        const movieBox = document.createElement('article');
        movieBox.classList.add('movie__container');

        // Skapa en bildtagg för varje poster
        const posterImg = document.createElement('img');
        posterImg.classList.add('poster__img');
        posterImg.src = movie.poster;
        posterImg.alt = movie.title;
        
        // Skapa en rubriktagg för titeln
        const movieTitle = document.createElement('h3');
        movieTitle.classList.add('movie__title');
        movieTitle.textContent = movie.title;
        
        // Lägg till poster och titel i movieBox:en
        movieBox.appendChild(posterImg);
        movieBox.appendChild(movieTitle);

        // Lägg till movieBox i moviesGrid för att kunna visas på sidan
        moviesGrid.appendChild(movieBox);

    });
}

async function searchMovies() {
    const apiKey = '567f8027';
    const carouselSection = document.getElementById('carouselSection');
    const popularMoviesSection = document.getElementById('popularMoviesSection');
    const moviesGrid = document.getElementById('popularCardContainer');
    const moviesContainer = document.getElementById('moviesContainer');

    // Lyssnare för 'input' händelse på sökfältet
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', async () => {
        const searchResults = await searchMoviesAPI(apiKey, searchInput.value);
        displaySearchResults(searchResults);
        console.log(searchResults);
        
        if(searchInput.value.trim() === '') {
            // Så länge som searchInput är lika med en tom sträng så visa nedan
            carouselSection.style.display = 'block';
            popularMoviesSection.style.display = 'block';
            // Dölj nedan
            moviesGrid.style.displa = 'none';
            moviesContainer.style.displa = 'none';
        } else {
            carouselSection.style.display = 'none';
            popularMoviesSection.style.display = 'none';
            // Visa nedan
            moviesGrid.style.display = '';
            moviesContainer.style.display = '';

            await searchMovies(apiKey, searchInput.value);
        }
    
    });
}

function displaySearchResults(results) {
    const moviesContainer = document.getElementById('moviesContainer');
    moviesContainer.innerHTML = ''; // Rensa tidigare resultat

    if(results) {
        results.forEach(movie => {
            // Skapa filmkort och lägg till i behållaren
            const displayMovieSearch = createMovieCard(movie);
            moviesContainer.appendChild(displayMovieSearch);
        });
    } else {
        moviesContainer.innerHTML = 'Kan inte hitta det du sökte efter.';
    }
}

// Funktion för att skapa ett filmkort baserat på filmdata
function createMovieCard(movie) {
    const movieBox = document.createElement('article');
    movieBox.classList.add('movie__container');

    const posterImg = document.createElement('img');
    posterImg.classList.add('poster__img');
    posterImg.src = movie.Poster;
    posterImg.alt = movie.Title;

    const movieTitle = document.createElement('h3');
    movieTitle.classList.add('movie__title');
    movieTitle.textContent = movie.Title;

    movieBox.appendChild(posterImg);
    movieBox.appendChild(movieTitle);

    return movieBox;
}

