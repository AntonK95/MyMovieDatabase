'use strict';

import { setupCarousel } from "./carousel.js";
import { fetchTrailerAPI } from "./APIhandler.js";
import { myTopMovies } from "./APIhandler.js";

window.addEventListener('load', async () => {
    console.log('load');
    //Förslagsvis anropar ni era funktioner som skall sätta lyssnare, rendera objekt osv. härifrån
    // setupCarousel();
    // fetchTrailerAPI();
    myTopMovies();
    showtopMovies();
    try {
        const allTrailers = await fetchTrailerAPI();

        const randomTrailers = getRandomTrailers(allTrailers, 5);

        carouselItems(randomTrailers);
    } catch (error) {
        console.error('Något gick fel vid hämtning av trailer', error);
    }
});


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


