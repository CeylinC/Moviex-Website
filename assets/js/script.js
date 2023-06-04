const movieSearchBox = document.getElementById('movie-search-box');
const movieContainer = document.getElementById('movie-container');
const resultTitle = document.getElementById('result-title');
const posterNotFound = "assets/img/img-not-found.jpg";
let searchListMovies;


const APIKEY = "d45c60a3";

async function loadMovies(searchTerm) {
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=${APIKEY}`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    console.log(data.Search);
    if (data.Response == "True") {
        displayMovieList(data.Search);
    }
    else {
        alert("Sorry, Not Found Movie :(");
    }
}

function findMovies() {
    movieContainer.innerHTML = "";
    resultTitle.style.display = "none";
    let searchTerm = (movieSearchBox.value).trim();
    if (searchTerm.length > 0) {
        loadMovies(searchTerm);
    }
    else{
        alert("Please, Enter the Movie Name");
    }
}

function displayMovieList(movies) {
    resultTitle.style.display = "block";
    for (let i = 0; i < movies.length; i++) {
        let movie = `
        <div class="movie" id=${movies[i].imdbID}>
            <a class="movie-img">
                <img src="${movies[i].Poster != "N/A" ? movies[i].Poster : posterNotFound}"
                    alt="Movie">
            </a>
            <div class="movie-info">
                <div class="movie-title">${movies[i].Title}</div>
                <div class="movie-year">${movies[i].Year}</div>
            </div>
        </div>
        `;
        
        movieContainer.insertAdjacentHTML("beforeend", movie);
    }
    window.scrollTo(0, movieContainer.parentElement.offsetTop);
    loadMovieDetails();
}

function loadMovieDetails() {
    searchListMovies = movieContainer.querySelectorAll('.movie');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            console.log(movie.id);
            movieSearchBox.value = "";
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.id}&apikey=${APIKEY}`);
            const movieDetails = await result.json();
            console.log(movieDetails);
            //displayMovieDetails(movieDetails);
        });
    });
}

function displayMovieDetails(details) {
    resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    `;
}

// window.addEventListener('click', (event) => {
//     if(event.target.className != "form-control"){
//         searchList.classList.add('hide-search-list');
//     }
// });