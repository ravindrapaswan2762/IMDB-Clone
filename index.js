//OMDB API key
const API_KEY = '12cf06fb';

// Get the search input and main content elements
const searchInput = document.getElementById('searchInput');
const mainContent = document.getElementById('mainContent');

// Initialize an array to store favorite movies
let favorites = [];

// Listen for input events with a debounce to control API requests
searchInput.addEventListener('input', debounce(searchMovies, 300));

// Function to search for movies based on user input
async function searchMovies() {
  const query = searchInput.value;
  if (query === '') {
    mainContent.innerHTML = ''; // Clear the main content area
    return;
  }

  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
    console.log(response);
    const data = await response.json();
    console.log(data);
    if (data.Response === 'True') {
      displayMovies(data.Search); // Display search results
    } else {
      mainContent.innerHTML = '<p>No results found.</p>';
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }

}

// Debounce function to limit the frequency of function calls
function debounce(func, delay) {
  let timer;
  return function() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, arguments);
    }, delay);
  };
}

// Function to display a list of movies
function displayMovies(movies) {
  mainContent.innerHTML = ''; // Clear the main content area
  movies.forEach(movie => {
    const movieElem = createMovieElement(movie);
    mainContent.appendChild(movieElem); // Append each movie element
  });
}

// Function to create a movie element with appropriate content and buttons
function createMovieElement(movie) {
  const movieElem = document.createElement('div');
  movieElem.classList.add('movie'); // Apply styling to the movie element
  
  // Check if the movie's IMDb ID is already in favorites
  const isFavorite = favorites.includes(movie.imdbID);
  
  // Create the HTML structure for the movie element
  movieElem.innerHTML = `
    <a href="movie.html?imdbID=${movie.imdbID}">
      <img src="${movie.Poster}" alt="${movie.Title}">
    </a>
    <div class="movieText">
      <h2 class="white">${movie.Title}</h2>
      <p class="white">${movie.Year}</p>
      <button class="fav-btn ${isFavorite ? 'favorite' : ''}" data-imdbID="${movie.imdbID}">
        ${isFavorite ? 'In Favorites' : 'Add to Favorites'}
      </button>
    </div>
  `;

  // Configure the favorite button based on its status
  const favButton = movieElem.querySelector('.fav-btn');
  if (!isFavorite) {
    favButton.addEventListener('click', () => addToFavorites(movie));
    favButton.style.backgroundColor = 'rgb(245, 197, 24)'; // Set background color for non-favorites
    favButton.style.color = 'black';
  } else {
    favButton.addEventListener('click', () => removeFromFavorites(movie));
    favButton.style.backgroundColor = 'green'; // Set background color for favorites
  }

  return movieElem;
}

// ------------------------------------------------------------------
// When the page loads, load saved favorites from local storage
window.addEventListener('load', () => {
  const storedFavorites = localStorage.getItem('favorites');
  if (storedFavorites) {
    favorites = JSON.parse(storedFavorites);
    updateMovieButtons(); // Update favorite buttons accordingly
  }

  // Call searchMovies() to display searched movies initially
  searchMovies();
});

// Function to add a movie to favorites
function addToFavorites(movie) {
  const imdbID = movie.imdbID;
  const isAlreadyInFavorites = favorites.some(item => item.imdbID === imdbID);

  if (!isAlreadyInFavorites) {
    favorites.push(movie);
    updateMovieButtons();
    saveFavoritesToLocalStorage();
  }
}

// Function to remove a movie from favorites
function removeFromFavorites(movie) {
  const imdbID = movie.imdbID;
  favorites = favorites.filter(item => item.imdbID !== imdbID);
  updateMovieButtons();
  saveFavoritesToLocalStorage();
}

// Function to save favorites to local storage
function saveFavoritesToLocalStorage() {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Function to update the appearance and state of favorite buttons
function updateMovieButtons() {
  const favButtons = document.querySelectorAll('.fav-btn');
  favButtons.forEach(button => {
    const imdbID = button.getAttribute('data-imdbID');
    const isFavorite = favorites.some(item => item.imdbID === imdbID);

    if (!isFavorite) {
      button.style.backgroundColor = 'rgb(245, 197, 24)'; // Set background color for non-favorites
      button.textContent = 'Add to Favorites';
      button.style.color = 'black';
    } else {
      button.style.backgroundColor = 'green'; // Set background color for favorites
      button.textContent = 'In Favorites';
    }
  });
}

// ---------------------------------------------------
// Call searchMovies() initially to display searched movies
searchMovies();
