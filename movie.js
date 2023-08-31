//OMDB API key
const API_KEY = '12cf06fb';


const movieDetailsContainer = document.getElementById('movieDetailsPage');// Get the container element for displaying movie details

// -----------------------------------------------------------------
// This function fetches movie details using IMDb ID
async function fetchMovieDetails(imdbID) {
  try {
    // Send a GET request to OMDB API using IMDb ID and API Key
    const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`);
    const data = await response.json(); // Parse the response as JSON

    // Check if the response indicates success
    if (data.Response === 'True') {
      displayMovieDetails(data); // Display the movie details on the page
    } else {
      movieDetailsContainer.innerHTML = '<p>Movie details not available.</p>'; //If response indicates failure, display an error message
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
// ------------------------------------------------------------------

// This function displays movie details on the page
function displayMovieDetails(movie) {
  // Populate the movie details HTML structure with fetched data
  movieDetailsContainer.innerHTML = `
    <div class="movie-box">
      <div class="movie-poster">
        <img src="${movie.Poster}" alt="${movie.Title}">
      </div>
      <div class="movie-details">
        <h2 class="yellow">${movie.Title}</h2><br>
        <p class="white"><strong>Year:</strong> ${movie.Year}</p><br>
        <p class="white"><strong>Released:</strong> ${movie.Released} &nbsp &nbsp <strong>Runtime:</strong> ${movie.Runtime}</p><br>
        <p class="white"><strong>IMDB:</strong> ${movie.imdbRating}</p><br>
        <p class="white"><strong>Genre:</strong> ${movie.Genre}</p><br>
        <p class="white"><strong>Writer:</strong> ${movie.Writer}</p><br>
        <p class="white"><strong>Actors:</strong> ${movie.Actors}</p><br>
        <p class="white"><strong>Director:</strong> ${movie.Director}</p><br>
        <p class="white"><strong>Plot:</strong> ${movie.Plot}</p>
      </div>
    </div>
  `;
}
// ----------------------------------------------------------------

// Get the IMDb ID from the URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const imdbID = urlParams.get('imdbID');

if (imdbID) {
  // If IMDb ID is available in the URL, fetch and display the movie details
  fetchMovieDetails(imdbID);
} else {
  // If IMDb ID is not available, display an error message
  movieDetailsContainer.innerHTML = '<p>Invalid movie details.</p>';
}
