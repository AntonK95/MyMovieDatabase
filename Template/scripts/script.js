'use strict';

import { setupCarousel } from "./carousel.js";
import { fetchTrailerAPI } from "./APIhandler.js";
import { myTopMovies } from "./APIhandler.js";
import { searchMoviesAPI } from "./APIhandler.js";
import { fetchDetailedMovieInfo } from "./APIhandler.js"; 

window.addEventListener('load', async () => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    console.log(favorites.length);
    console.log('load');
    loadTrailer();
    myTopMovies();
    showtopMovies();
    searchMovies();
    preventDefault();
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

function preventDefault() {
    const form = document.querySelector('form');
    form.addEventListener('submit', (event) => {
    event.preventDefault();
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
            moviesGrid.style.display = 'none';
            moviesContainer.style.display = 'none';
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
            const displayMovieSearch = createMovieCard(movie.imdbID ? movie : {...movie, imdbID: "" });
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
    
    // Lägg till imdbID i dataset för varje kort
    const imdbID = movie.imdbID || "";
    if (imdbID) {
        movieBox.dataset.imdbID = imdbID;
        movieBox.dataset.movie = JSON.stringify(movie);

        
    } else {
        console.error('ImdbID is missing for movie:', movie);
    }


    // console.log('Movie addded ', movie);

    const posterImg = document.createElement('img');
    posterImg.classList.add('poster__img');
    posterImg.src = movie.Poster;
    posterImg.alt = movie.Title;

    const movieTitle = document.createElement('h3');
    movieTitle.classList.add('movie__title');
    movieTitle.textContent = movie.Title;

    movieBox.addEventListener('click', () => showMovieDetails(imdbID));
    
    
    // Skapa en favoritknapp
    const favoriteBtn = document.createElement('button');
    favoriteBtn.classList.add('favoriteBtn');
    // favoriteBtn.textContent = 'Add to favorites';

    // Kontrollera om filmen redan finns i favoritlistan
    const isFavorite = isMovieInFavorites(movie);

    // Uppdatera knappens text och funktion baserat på om filmen finns i listan eller inte
    updateFavoriteButton(favoriteBtn, isFavorite);

    favoriteBtn.addEventListener('click', () => handleFavoriteButtonClick(movie, favoriteBtn));

    movieBox.appendChild(favoriteBtn);

    movieBox.appendChild(posterImg);
    movieBox.appendChild(movieTitle);

    return movieBox;
}

// Gemensam funktion för att hantera klick på favoritknapp
function handleFavoriteButtonClick(movie, button) {
    event.stopPropagation(); // Förhindra att klicket propagerar till överliggande element
    toggleFavoriteStatus(movie, button);
}

function removeFromFavorites(movie) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    const updatedFavorites = favorites.filter((fav) => fav.imdbID !== movie.imdbID);

    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
}

// Funktion för att kontrollera om filmen redan finns i favoritlistan
function isMovieInFavorites(movie) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.some((fav) => fav.imdbID === movie.imdbID);
}



const favBtn = document.getElementById('favBtn');
favBtn.addEventListener('click', showFavoritesOverlay);

function showFavoritesOverlay() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    const overlay = document.createElement('div');
    overlay.classList.add('favorite__overlay');

    const overlayContent = document.createElement('div');
    overlayContent.classList.add('favorite__overlay-content');

    const closeBtn = document.createElement('button');
    closeBtn.classList.add('closeBtn');
    closeBtn.textContent = 'X';
    closeBtn.addEventListener('click', () => document.body.removeChild(overlay));

    overlayContent.appendChild(closeBtn);

    const favoritesList = document.createElement('ul');
    favoritesList.classList.add('favorites__list');

    favorites.forEach((favorite) => {
        const movieBox = createMovieCard(favorite);

        favoritesList.appendChild(movieBox);
    });

    overlayContent.appendChild(favoritesList);
    overlay.appendChild(overlayContent);

    document.body.appendChild(overlay);
}


// Funktion för att lägga till eller ta bort filmen från favoritlistan
function toggleFavoriteStatus(movie, button) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const isFavorite = isMovieInFavorites(movie);

    if(isFavorite) {
        // Ta bort från listan
        const updatedFavorites = favorites.filter((fav) => fav.imdbID !== movie.imdbID);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } else {
        // Lägg till i listan
        favorites.push(movie);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    // Uppdatera knappens text
    updateFavoriteButton(button, !isFavorite);
}

// Funktion för att uppdatera knappens text om filmen finns i listan eller inte
function updateFavoriteButton(button, isFavorite) {
    button.textContent = isFavorite ? 'Remove from favorites' : 'Add to favorites';
}

async function showMovieDetails(imdbID) {

    try {
        // Gör ett nytt API-anrop för att hämta detaljerad information baserat på imdbID
        const detailedMovieInfo = await fetchDetailedMovieInfo(imdbID);
        
        // Visa information i overlay
        showOverlayWithDetails(detailedMovieInfo);

    } catch (error) {
        console.error('Något gick fel vid hämtning av detaljerat information', error);
    }
}

async function showOverlayWithDetails(movieDetails) {
    // Skapa overlay-element
    
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    // Skapa innehållet för overlay
    const overlayContent = document.createElement('section');
    overlayContent.classList.add('overlay-content');

    const backBtn = document.createElement('button');
    backBtn.classList.add('backBtn');
    backBtn.textContent = 'X';

    overlayContent.appendChild(backBtn);

    const posterImg = document.createElement('img');
    posterImg.classList.add('detailed__poster-img');
    posterImg.src = movieDetails.Poster;
    posterImg.alt = movieDetails.Title;

    const movieTitle = document.createElement('h2');
    movieTitle.classList.add('detailed__movie-title');
    movieTitle.textContent = movieDetails.Title;

    const moviePlot = document.createElement('p');
    moviePlot.classList.add('plot');
    moviePlot.textContent = movieDetails.Plot;

    const additionalInfo = document.createElement('section');
    additionalInfo.classList.add('additional__info');

    const actorsList = document.createElement('section');
    const actors = document.createElement('ul');
    const actorsLabel = document.createElement('span');
    actorsLabel.textContent = 'Actors: ';
    actors.classList.add('actors');
    actors.textContent = movieDetails.Actors;

    actorsList.appendChild(actorsLabel);
    actorsList.appendChild(actors);

    const madeYear = document.createElement('section');
    const year = document.createElement('p');
    const yearLabel = document.createElement('span');
    yearLabel.textContent = 'Year: ';
    year.classList.add('year');
    year.textContent = movieDetails.Year;

    madeYear.appendChild(yearLabel);
    madeYear.appendChild(year);

    const runtime = document.createElement('p');
    runtime.classList.add('runtime');
    runtime.textContent = movieDetails.Runtime;
    
    additionalInfo.appendChild(actorsList);
    additionalInfo.appendChild(madeYear);
    additionalInfo.appendChild(runtime);

    overlayContent.appendChild(posterImg);
    overlayContent.appendChild(movieTitle);
    overlayContent.appendChild(moviePlot);
    overlayContent.appendChild(additionalInfo);

    overlay.appendChild(overlayContent);

    document.body.appendChild(overlay);
    
    // EventListener för att stänga overlay vid klick utanför.
    overlay.addEventListener('click', (event) => {
        if(!overlayContent.contains(event.target) || event.target === backBtn) {
            document.body.removeChild(overlay);
        }
    });
}
