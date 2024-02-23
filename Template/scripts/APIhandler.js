/* Trailer carousel */
async function fetchTrailerAPI(){
    try {
        const response = await fetch('https://santosnr6.github.io/Data/movies.json');

        const movieTrailers = await response.json();
        
        if(!response.ok) {
            throw new Error('Kan inte hämta trailer..');
        }
        // movieTrailers.forEach(movie => {
        //     console.log('Random trailer')
        //     console.log(movie);
        // });

        return movieTrailers;

    } catch (error) {
        console.log('Ojsan! Något gick fel, kan inte hämta trailer...', error);
        return [];
    }
}

export { fetchTrailerAPI };

/* Top 20 Movies */

async function myTopMovies() {
    try {
        const response = await fetch('https://santosnr6.github.io/Data/movies.json');

        if(!response.ok) {
            throw new Error('Kan inte hämta data från API..');
        }

        const topMoviesData = await response.json();
        // topMoviesData.forEach(movie => {
        //     console.log(movie);
        // });
        return topMoviesData;


    } catch (error) {
        console.log('Ojsan, något gick fel. Kan inte hämta data från API', error);
        return [];
    }
}

export { myTopMovies };

/* Movie search */

async function searchMoviesAPI(apiKey, searchQuery) {
    const apiUrl = `http://www.omdbapi.com/?apikey=${apiKey}&s=${searchQuery}`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('Kan inte hämta data från API..');
        }

        const searchData = await response.json();
        console.log(searchQuery.value);
        console.log('searchMoviesAPI()');
        return searchData.Search;
        
    } catch (error) {
        console.error('Ojsan, något gick fel. Kan inte hämta data från API', error);
        return [];
    }
}

export { searchMoviesAPI };
