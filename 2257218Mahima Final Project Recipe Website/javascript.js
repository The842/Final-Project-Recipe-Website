// Javascript for the carousel
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.image-carousel-inner');
    const images = document.querySelectorAll('.image-carousel img');
    let currentIndex = 0;

    function showNextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        carousel.style.transform = `translateX(${-currentIndex * 200}px)`;
    }

    setInterval(showNextImage, 3000);

    carousel.style.transform = 'translateX(0)';
});


// Fetch all recipes from json file in the recipes.html
document.addEventListener('DOMContentLoaded', () => {
    const recipeList = document.querySelector('.recipe-list');

    fetch('recipes.json')
        .then(response => response.json())
        .then(data => {
            data.forEach((recipe, index) => {
                recipe.id = index;
                const recipeItem = document.createElement('div');
                recipeItem.classList.add('recipe-item');

                const recipeImage = document.createElement('img');
                recipeImage.src = recipe.image;
                recipeImage.alt = recipe.name;

                const recipeName = document.createElement('h3');
                recipeName.textContent = recipe.name;

                const recipeCuisine = document.createElement('p');
                recipeCuisine.textContent = `Cuisine: ${recipe.cuisine}`;

                const recipeMealType = document.createElement('p');
                recipeMealType.textContent = `Meal Type: ${recipe.mealType}`;

                const viewRecipeButton = document.createElement('button');
                viewRecipeButton.textContent = 'View Recipe';
                viewRecipeButton.addEventListener('click', () => {
                    window.location.href = `eachrecipe.html?id=${index}`;
                });

                recipeItem.appendChild(recipeImage);
                recipeItem.appendChild(recipeName);
                recipeItem.appendChild(recipeCuisine);
                recipeItem.appendChild(recipeMealType);
                recipeItem.appendChild(viewRecipeButton);

                recipeList.appendChild(recipeItem);
            });
        })
        .catch(error => console.error('Error fetching recipes:', error));
});

    //Function to display the recipes
    function displayRecipe() {
        const params = new URLSearchParams(window.location.search);
        const recipeId = params.get('id');

        fetch('recipes.json')
            .then(response => response.json())
            .then(data => {
                const recipe = data[recipeId];
                recipe.id = recipeId;
                document.getElementById('recipe-name').textContent = recipe.name;
                document.getElementById('recipe-image').src = recipe.image;
                document.getElementById('recipe-image').alt = recipe.name;

                const ingredientsList = document.getElementById('recipe-ingredients');
                recipe.ingredients.forEach(ingredient => {
                    const li = document.createElement('li');
                    li.textContent = ingredient;
                    ingredientsList.appendChild(li);
                });

                document.getElementById('recipe-instructions').textContent = recipe.instructions;

                const favoriteButton = document.getElementById('favorite-button');
                const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
                if (favorites.some(fav => fav.id === recipe.id)) {
                    favoriteButton.classList.add('active');
                }

                favoriteButton.addEventListener('click', () => {
                    handleFavorite(recipe, favoriteButton);
                });
            })
            .catch(error => console.error('Error fetching recipe:', error));
    }

    if (window.location.pathname.endsWith('eachrecipe.html')) {
        displayRecipe();
    }

    document.addEventListener('DOMContentLoaded', () => {
        // Function to handle favorite button click
        function handleFavorite(recipe, button) {
            let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
            // Check if the recipe is already in favorites
            if (favorites.some(fav => fav.id === recipe.id)) {
                // Remove from favorites
                favorites = favorites.filter(fav => fav.id !== recipe.id);
                button.classList.remove('active');
            } else {
                // Add to favorites
                favorites.push(recipe);
                button.classList.add('active');
            }
    
            // Update favorites in localStorage
            localStorage.setItem('favorites', JSON.stringify(favorites));
    
            // Re-render favorite recipes if on favorite page
            if (window.location.pathname.endsWith('favorite.html')) {
                displayFavoriteRecipes();
            }
        }
    
        // Function to fetch and render recipe details on the details page
        function fetchRecipeDetails() {
            const params = new URLSearchParams(window.location.search);
            const recipeId = params.get('id');
    
            fetch('recipes.json')
                .then(response => response.json())
                .then(recipes => {
                    const recipe = recipes.find(r => r.id === recipeId);
                    if (!recipe) {
                        console.error('Recipe not found.');
                        return;
                    }
    
                    document.getElementById('recipe-name').textContent = recipe.name;
                    document.getElementById('recipe-image').src = recipe.image;
                    document.getElementById('recipe-image').alt = recipe.name;
    
                    const ingredientsList = document.getElementById('recipe-ingredients');
                    if (ingredientsList) {
                        recipe.ingredients.forEach(ingredient => {
                            const listItem = document.createElement('li');
                            listItem.textContent = ingredient;
                            ingredientsList.appendChild(listItem);
                        });
                    }
    
                    document.getElementById('recipe-instructions').textContent = recipe.instructions;
    
                    const favoriteButton = document.getElementById('favorite-button');
                    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
                    if (favorites.some(fav => fav.id === recipe.id)) {
                        favoriteButton.classList.add('active');
                        favoriteButton.textContent = '❤ Unfavorite';
                    }
    
                    favoriteButton.addEventListener('click', () => {
                        handleFavorite(recipe, favoriteButton);
                        favoriteButton.textContent = favoriteButton.classList.contains('active') ? '❤ Unfavorite' : '❤ Add to Favorite';
                    });
                })
                .catch(error => console.error('Error fetching recipe details:', error));
        }
    
        // Function to display favorite recipes
        function displayFavoriteRecipes() {
            const favoriteList = document.querySelector('.favorite-list');
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
            if (!favoriteList) {
                console.error('Element with class "favorite-list" not found.');
                return;
            }
    
            // Clear the favorite list container
            favoriteList.innerHTML = '';
    
            if (favorites.length === 0) {
                favoriteList.innerHTML = '<p>You have no favorite recipes yet.</p>';
                return;
            }
    
            // Render each favorite recipe
            favorites.forEach(recipe => {
                const recipeItem = document.createElement('div');
                recipeItem.classList.add('recipe-item');
    
                const recipeImage = document.createElement('img');
                recipeImage.src = recipe.image;
                recipeImage.alt = recipe.name;
    
                const recipeName = document.createElement('h3');
                recipeName.textContent = recipe.name;
    
                const recipeCuisine = document.createElement('p');
                recipeCuisine.textContent = `Cuisine: ${recipe.cuisine}`;
    
                const recipeMealType = document.createElement('p');
                recipeMealType.textContent = `Meal Type: ${recipe.mealType}`;
    
                const viewRecipeButton = document.createElement('button');
                viewRecipeButton.textContent = 'View Recipe';
                viewRecipeButton.addEventListener('click', () => {
                    window.location.href = `eachrecipe.html?id=${recipe.id}`;
                });
    
                const favoriteButton = document.createElement('button');
                favoriteButton.textContent = 'Unfavorite'; // Change text to Unfavorite
                favoriteButton.addEventListener('click', () => {
                    handleFavorite(recipe, favoriteButton);
                    // Update the button text on favorite page after unfavoriting
                    if (window.location.pathname.endsWith('favorite.html')) {
                        favoriteButton.textContent = 'Favorite';
                    }
                });
    
                recipeItem.appendChild(recipeImage);
                recipeItem.appendChild(recipeName);
                recipeItem.appendChild(recipeCuisine);
                recipeItem.appendChild(recipeMealType);
                recipeItem.appendChild(viewRecipeButton);
                recipeItem.appendChild(favoriteButton);
    
                favoriteList.appendChild(recipeItem);
            });
        }
    
        // Check the current page and initialize the appropriate functionality
        if (window.location.pathname.endsWith('favorite.html')) {
            displayFavoriteRecipes();
        } else if (window.location.pathname.endsWith('eachrecipe.html')) {
            fetchRecipeDetails();
        } else if (document.querySelector('.recipe-list')) {
            fetchAndRenderRecipes();
        }
    });    
    
    // For Load more button
    document.addEventListener('DOMContentLoaded', () => {
        const recipeList = document.querySelector('.recipe-list');
        const loadMoreButton = document.getElementById('load-more');
        let recipesLoaded = false;
    
        function fetchMoreRecipes() {
            if (recipesLoaded) {
                loadMoreButton.disabled = true;
                loadMoreButton.textContent = 'No more recipes to load';
                return;
            }
    
            fetch('more-recipes.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.length === 0) {
                        recipesLoaded = true;
                        loadMoreButton.disabled = true;
                        loadMoreButton.textContent = 'No more recipes to load';
                    } else {
                        data.forEach(recipe => {
                            const recipeItem = document.createElement('div');
                            recipeItem.classList.add('recipe-item');
    
                            const recipeImage = document.createElement('img');
                            recipeImage.src = recipe.image;
                            recipeImage.alt = recipe.name;
    
                            const recipeName = document.createElement('h3');
                            recipeName.textContent = recipe.name;
    
                            const recipeCuisine = document.createElement('p');
                            recipeCuisine.textContent = `Cuisine: ${recipe.cuisine}`;
    
                            const recipeMealType = document.createElement('p');
                            recipeMealType.textContent = `Meal Type: ${recipe.mealType}`;
    
                            const viewRecipeButton = document.createElement('button');
                            viewRecipeButton.textContent = 'View Recipe';
                            viewRecipeButton.addEventListener('click', () => {
                                window.location.href = `eachrecipe.html?id=${recipe.id}`;
                            });
    
                            recipeItem.appendChild(recipeImage);
                            recipeItem.appendChild(recipeName);
                            recipeItem.appendChild(recipeCuisine);
                            recipeItem.appendChild(recipeMealType);
                            recipeItem.appendChild(viewRecipeButton);
    
                            recipeList.appendChild(recipeItem);
                        });
    
                        if (data.length < 6) {
                            recipesLoaded = true;
                            loadMoreButton.disabled = true;
                            loadMoreButton.textContent = 'No more recipes to load';
                        }
                    }
                })
                .catch(error => {
                    console.error('Error fetching more recipes:', error);
                    loadMoreButton.disabled = true;
                    loadMoreButton.textContent = 'Error loading recipes';
                });
        }
    
        if (loadMoreButton) {
            loadMoreButton.addEventListener('click', fetchMoreRecipes);
        }
    });
    
    // For Modal in home page
    $(function() {
        // Initialize the modal
        $("#welcome-modal").dialog({
            autoOpen: true,
            modal: true,
            width: 600,
            show: {
                effect: "fade",
                duration: 500
            },
            hide: {
                effect: "fade",
                duration: 500
            }
        });
    
        // Handle the submit button click
        $("#submit-button").click(function() {
            window.location.href = "signIn.html";
        });
    
        // Handle the close button click
        $("#close-button").click(function() {
            $("#welcome-modal").dialog("close");
        });
    });
    
    //For videos
    document.addEventListener('DOMContentLoaded', () => {
        // Ensure jQuery is loaded
        if (typeof $ === 'undefined') {
            console.error('jQuery is not loaded.');
        } else {
            console.log('jQuery is loaded.');
        }


        // Fetch videos
        fetch('videos.json')
            .then(response => response.json())
            .then(videos => {
                const videosSection = document.getElementById('videos-section');
                if (!videosSection) {
                    console.error('Element with ID "videos-section" not found.');
                    return;
                }
                videos.forEach(video => {
                    const videoContainer = document.createElement('div');
                    videoContainer.classList.add('video-container');
    
                    const videoTitle = document.createElement('h2');
                    videoTitle.textContent = video.name;
    
                    const iframe = document.createElement('iframe');
                    iframe.width = "500";
                    iframe.height = "300";
                    iframe.src = `https://www.youtube.com/embed/${video.videoId}`;
                    iframe.frameborder = "0";
                    iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
                    iframe.allowFullscreen = true;
    
                    videoContainer.appendChild(videoTitle);
                    videoContainer.appendChild(iframe);
                    videosSection.appendChild(videoContainer);
                });
            })
            .catch(error => console.error('Error fetching videos:', error));
    });
    

    //Sign In form
    document.addEventListener('DOMContentLoaded', () => {
        // Function to set a cookie
        function setCookie(name, value, days) {
            const d = new Date();
            d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = "expires=" + d.toUTCString();
            document.cookie = name + "=" + value + ";" + expires + ";path=/";
        }
    
        // Function to get a cookie by name
        function getCookie(name) {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }
    
        // Populate form fields with cookies if they exist
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const passwordField = document.getElementById('password');
        const phoneField = document.getElementById('phone');
        const addressField = document.getElementById('address');
    
        if (nameField) nameField.value = getCookie('name') || '';
        if (emailField) emailField.value = getCookie('email') || '';
        if (passwordField) passwordField.value = getCookie('password') || '';
        if (phoneField) phoneField.value = getCookie('phone') || '';
        if (addressField) addressField.value = getCookie('address') || '';
    
        // Handle Sign-In Form Submission
        const signInForm = document.getElementById('sign-in-form');
    
        if (signInForm) {
            signInForm.addEventListener('submit', (e) => {
                e.preventDefault();
    
                // Validate form fields
                const name = document.getElementById('name').value.trim();
                const email = document.getElementById('email').value.trim();
                const password = document.getElementById('password').value.trim();
                const phone = document.getElementById('phone').value.trim();
                const address = document.getElementById('address').value.trim();
    
                if (!name || !email || !password || !phone || !address) {
                    alert('Please fill in all fields.');
                    return;
                }
    
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(email)) {
                    alert('Please enter a valid email address.');
                    return;
                }
    
                const phonePattern = /^\d{10}$/; // Example pattern for a 10-digit phone number
                if (!phonePattern.test(phone)) {
                    alert('Please enter a valid 10-digit phone number.');
                    return;
                }
    
                // Set cookies
                setCookie('name', name, 365);
                setCookie('email', email, 365);
                setCookie('password', password, 365);
                setCookie('phone', phone, 365);
                setCookie('address', address, 365);
    
                alert('Sign-in information saved!');
                signInForm.reset();
            });
        }
    });


    //Home page some recipe
    fetch('recipe.json')
    .then(response => {
        console.log('Fetching homerecipe.json...');
        return response.json();
    })
    .then(data => {
        console.log(data); // Log the fetched data to check if it's correct
        const recipe = data.find(r => r.id === recipeId);
        if (!recipe) {
            console.error('Recipe not found.');
            return;
        }

        document.getElementById('recipe-name').textContent = recipe.name;
        document.getElementById('recipe-image').src = recipe.image;
        document.getElementById('recipe-image').alt = recipe.name;

        const ingredientsList = document.getElementById('recipe-ingredients');
        ingredientsList.innerHTML = ''; // Clear any existing content
        recipe.ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = ingredient;
            ingredientsList.appendChild(li);
        });

        document.getElementById('recipe-instructions').textContent = recipe.instructions;
    })
    .catch(error => console.error('Error fetching recipe:', error));

    
    
    
    
    
    

    