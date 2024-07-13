document.addEventListener('DOMContentLoaded', () => {
    const searchBox = document.getElementById('searchBox');
    const resultsContainer = document.getElementById('resultsContainer');
    const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.close');
    const modalImage = document.getElementById('modalImage');
    const modalName = document.getElementById('modalName');
    const modalIngredients = document.getElementById('modalIngredients');
    const modalInstructions = document.getElementById('modalInstructions');
    const saveToFavorites = document.getElementById('saveToFavorites');
    const favoritesButton = document.getElementById('favoritesButton');

    // Search box event listener
    searchBox.addEventListener('input', () => {
        const query = searchBox.value;
        if (query.length === 1) {
            fetchCocktails(query);
        }
    });

    // Fetch cocktails from API
    async function fetchCocktails(query) {
        try {
            const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${query}`);
            const data = await response.json();
            displayResults(data.drinks);
        } catch (error) {
            console.error('Error fetching cocktails:', error);
        }
    }

    // Display search results
    function displayResults(cocktails) {
        resultsContainer.innerHTML = '';
        if (cocktails) {
            cocktails.forEach(cocktail => {
                const cocktailBox = document.createElement('div');
                cocktailBox.classList.add('cocktailBox');
                cocktailBox.innerHTML = `
                    <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
                    <h3>${cocktail.strDrink}</h3>
                `;
                cocktailBox.addEventListener('click', () => {
                    openModal(cocktail);
                });
                resultsContainer.appendChild(cocktailBox);
            });
        } else {
            resultsContainer.innerHTML = '<p>No cocktails found</p>';
        }
    }

    // Open modal with cocktail details
    function openModal(cocktail) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scroll
        modalImage.src = cocktail.strDrinkThumb;
        modalName.textContent = cocktail.strDrink;
        modalIngredients.innerHTML = '';
        for (let i = 1; i <= 15; i++) {
            const ingredient = cocktail[`strIngredient${i}`];
            const measure = cocktail[`strMeasure${i}`];
            if (ingredient) {
                const li = document.createElement('li');
                li.textContent = `${ingredient} - ${measure || ""}`;
                modalIngredients.appendChild(li);
            }
        }
        modalInstructions.textContent = cocktail.strInstructions;
        saveToFavorites.onclick = () => saveFavorite(cocktail);
    }

    // Close modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore background scroll
    });

    // Save cocktail to favorites
    function saveFavorite(cocktail) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (!favorites.some(fav => fav.idDrink === cocktail.idDrink)) {
            favorites.push(cocktail);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            alert('Cocktail saved to favorites!');
        } else {
            alert('Cocktail is already in favorites!');
        }
    }

    // Show favorites and navigate to favorites page
    favoritesButton.addEventListener('click', () => {
        window.location.href = 'fav.html'; // Navigate to favorites page
    });
});

