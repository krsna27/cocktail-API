document.addEventListener('DOMContentLoaded', () => {
    const backToMainButton = document.getElementById('backToMain');
    const favoritesContainer = document.getElementById('favoritesContainer');
    const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.close');
    const modalImage = document.getElementById('modalImage');
    const modalName = document.getElementById('modalName');
    const modalIngredients = document.getElementById('modalIngredients');
    const modalInstructions = document.getElementById('modalInstructions');

    // Navigate back to the main page
    backToMainButton.addEventListener('click', () => {
        window.location.href = 'index.html'; // Navigate back to main page
    });

    // Display favorites
    function displayFavorites() {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favoritesContainer.innerHTML = ''; // Clear the container
        if (favorites.length > 0) {
            favorites.forEach(cocktail => {
                const cocktailBox = document.createElement('div');
                cocktailBox.classList.add('cocktailBox');
                cocktailBox.innerHTML = `
                    <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
                    <h3>${cocktail.strDrink}</h3>
                    <button class="removeFavorite" data-id="${cocktail.idDrink}">Remove</button>
                `;
                cocktailBox.addEventListener('click', () => {
                    openModal(cocktail);
                });
                favoritesContainer.appendChild(cocktailBox);
            });

            // Add event listeners to remove buttons
            document.querySelectorAll('.removeFavorite').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent triggering the modal open
                    const id = e.target.dataset.id;
                    removeFavorite(id);
                });
            });
        } else {
            favoritesContainer.innerHTML = '<p>No favorites saved</p>';
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
    }

    // Close modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore background scroll
    });

    // Remove favorite
    function removeFavorite(id) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites = favorites.filter(cocktail => cocktail.idDrink !== id);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites(); // Refresh the list
    }

    displayFavorites(); // Call the function to display favorites
});
