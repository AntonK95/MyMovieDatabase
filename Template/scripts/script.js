'use strict';

import { setupCarousel } from "./carousel.js";
import { fetchTrailerAPI } from "./APIhandler.js";
import { myTopMovies } from "./APIhandler.js";

window.addEventListener('load', () => {
    console.log('load');
    //Förslagsvis anropar ni era funktioner som skall sätta lyssnare, rendera objekt osv. härifrån
    setupCarousel();
    fetchTrailerAPI();
    myTopMovies();
    showtopMovies();
});



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


