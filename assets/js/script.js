const movieSearchBox = document.getElementById('movie-search-box');
const movieContainer = document.getElementById('movie-container');
const resultTitle = document.getElementById('result-title');
const movieDetailContainer = document.getElementById('movie-detail');
const displayFavoriteButton = document.querySelector(".favorite");
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
    resultTitle.innerHTML = "Movies";
    let searchTerm = (movieSearchBox.value).trim();
    if (searchTerm.length > 0) {
        loadMovies(searchTerm);
    }
    else {
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
            displayMovieDetails(movieDetails);
        });
    });
}

function displayMovieDetails(details) {
    movieDetailContainer.style.display = "flex";
    movieDetailContainer.innerHTML = `
    <div class="movie-detail-poster">
            <img src="${details.Poster != 'N/A' ? details.Poster : posterNotFound}"
                alt="Movie">
        </div>
        <div class="movie-detail-info">
            <h1 class="movie-detail-title">${details.Title}</h1>
            <div class="movie-detail-info-row">
                <div class="movie-detail-imdb">
                    <i class="fa-brands fa-imdb"></i> ${details.imdbRating != "N/A" ? details.imdbRating : "No Explanation"}
                </div>
                <i class="${isFavoriteMovie(details.imdbID) ? 'fa-solid' : 'fa-regular'} fa-heart movie-detail-favorite"></i>
            </div>
            <div class="movie-detail-year"><span>Year</span>${details.Year != "N/A" ? details.Year : "No Explanation"}</div>
            <div class="movie-detail-genre"><span>Genre</span>${details.Genre != "N/A" ? details.Genre : "No Explanation"}</div>
            <div class="movie-detail-runtime"><span>Runtime</span>${details.Runtime != "N/A" ? details.Runtime : "No Explanation"}</div>
            <div class="movie-detail-actors"><span>Actors</span>${details.Actors != "N/A" ? details.Actors : "No Explanation"}</div>
            <div class="movie-detail-writer"><span>Writer</span>${details.Writer != "N/A" ? details.Writer : "No Explanation"}</div>
            <div class="movie-detail-director"><span>Director</span>${details.Director != "N/A" ? details.Director : "No Explanation"}</div>
            <div class="movie-detail-country"><span>Country</span>${details.Country != "N/A" ? details.Country : "No Explanation"}</div>
            <p class="movie-detail-plot">${details.Plot != "N/A" ? details.Plot : "No Explanation"}</p>
        </div>
    `;
    window.scrollTo(0, movieDetailContainer.offsetTop);
    addFavorite(details.imdbID);
}

function addFavorite(movieID) {
    const addFavoriteButton = document.querySelector(".movie-detail-favorite");
    addFavoriteButton.addEventListener("click", function () {
        if(isFavoriteMovie(movieID)){
            localStorage.removeItem(movieID);
            addFavoriteButton.classList.replace("fa-solid", "fa-regular");
            document.getElementById(movieID).style.display = "none";

        }
        else{
            localStorage.setItem(movieID, movieID);
            addFavoriteButton.classList.replace("fa-regular", "fa-solid");
            document.getElementById(movieID).style.display = "block";
        }
    }
    );
}

function isFavoriteMovie(movieID) {
    for (var i = 0, len = localStorage.length; i < len; ++i) {
        if (movieID == localStorage.key(i)) {
            return true;
        }
    }
    return false;
}

displayFavoriteButton.addEventListener("click", async function () {
    movieContainer.innerHTML = "";
    resultTitle.innerHTML = "Favorite Movies";
    let movies = [];
    for (var i = 0, len = localStorage.length; i < len; ++i) {
        const result = await fetch(`http://www.omdbapi.com/?i=${localStorage.key(i)}&apikey=${APIKEY}`);
        const movie = await result.json();
        movies.push(movie);
    }
    displayMovieList(movies);
    movieDetailContainer.style.display = "none";
});

