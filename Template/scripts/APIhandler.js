
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


async function renderMovies() {
    
}

