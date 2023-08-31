// Get the container element for displaying the favorites list
const favoritesListContainer = document.getElementById('favoritesList');

// Initialize an array to store favorite movies
let favorites = [];

// -----------------------------------------------------------------
// Load favorites from local storage when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Retrieve stored favorites from local storage
  const storedFavorites = localStorage.getItem('favorites');
  if (storedFavorites) {
    // Parse the stored JSON data and update the favorites array
    favorites = JSON.parse(storedFavorites);
    // Update the favorites list displayed on the page
    updateFavoritesList();
  }
});

// ------------------------------------------------------------------
// Update the favorites list on the page
function updateFavoritesList() {
  // Clear the existing favorites list content
  favoritesListContainer.innerHTML = '';
  
  // Iterate through each favorite movie and create corresponding HTML elements
  favorites.forEach(movie => {
    const listItem = document.createElement('div');
    listItem.classList.add('favorite-movie');
    listItem.innerHTML = `
      <div class="movie-poster">
        <a href="movie.html?imdbID=${movie.imdbID}">
          <img class="poster" src="${movie.Poster}" alt="${movie.Title}">
        </a>
      </div>
      <div class="movie-details">
        <h2 class="yellow">${movie.Title}</h2><br>
        <p class="white"><strong>Year:</strong> ${movie.Year}</p><br>
        <button class="remove-btn red" data-imdbID="${movie.imdbID}">Delete
        </button>
      </div>
    `;
    
    // Attach a click event listener to the "Remove from Favorites" button
    const removeButton = listItem.querySelector('.remove-btn');
    removeButton.addEventListener('click', () => removeFromFavorites(movie));
    
    // Append the created list item to the favorites list container
    favoritesListContainer.appendChild(listItem);
  });
}

// --------------------------------------------------------------------
// Remove a movie from the favorites
function removeFromFavorites(movie) {
  const imdbID = movie.imdbID;
  
  // Filter out the movie to be removed from the favorites array
  favorites = favorites.filter(item => item.imdbID !== imdbID);
  
  // Save the updated favorites array to local storage
  saveFavoritesToLocalStorage();
  
  // Remove the corresponding HTML element from the favorites list on the page
  const listItemToRemove = favoritesListContainer.querySelector(`[data-imdbID="${imdbID}"]`).closest('.favorite-movie');
  if (listItemToRemove) {
    listItemToRemove.remove();
  }
}

// ------------------------------------------------------------------

// Save favorites to local storage
function saveFavoritesToLocalStorage() {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

// ------------------------------------------------------------------

// Listen for messages to update the favorites list
window.addEventListener('message', function (event) {
  if (event.data === 'updateFavorites') {
    // When a message is received to update favorites, call the updateFavoritesList function
    updateFavoritesList();
  }
});

// ------------------------------------------------------------------

// Initialize the favorites list on page load
updateFavoritesList();
