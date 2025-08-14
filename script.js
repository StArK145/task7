const API_URL = 'https://exercisedb.p.rapidapi.com/exercises';
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '88a54fdec9msh52506f23579c540p1094e5jsnb90a9504097e',
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
      }
    };

    let allExercises = [];
    let filteredExercises = [];
    let favorites = new Set();

    // Load favorites from memory
    function loadFavorites() {
      // In a real app, you'd load from localStorage, but using memory here
      favorites = new Set();
    }

    function saveFavorites() {
      // In a real app, you'd save to localStorage
      updateStats();
    }

    function toggleFavorite(exerciseId) {
      if (favorites.has(exerciseId)) {
        favorites.delete(exerciseId);
      } else {
        favorites.add(exerciseId);
      }
      saveFavorites();
      updateFavoriteButtons();
    }

    function updateFavoriteButtons() {
      document.querySelectorAll('.favorite-btn').forEach(btn => {
        const exerciseId = btn.dataset.exerciseId;
        if (favorites.has(exerciseId)) {
          btn.classList.add('favorited');
          btn.textContent = '⭐';
        } else {
          btn.classList.remove('favorited');
          btn.textContent = '☆';
        }
      });
    }

    function updateStats() {
      document.getElementById('total-exercises').textContent = allExercises.length;
      document.getElementById('filtered-exercises').textContent = filteredExercises.length;
      document.getElementById('favorites-count').textContent = favorites.size;
      document.getElementById('stats-bar').style.display = 'block';
    }

    function populateFilters() {
      const bodyParts = [...new Set(allExercises.map(ex => ex.bodyPart))].sort();
      const targets = [...new Set(allExercises.map(ex => ex.target))].sort();

      const bodyPartSelect = document.getElementById('body-part-filter');
      const targetSelect = document.getElementById('target-filter');

      bodyPartSelect.innerHTML = '<option value="">All Body Parts</option>';
      targetSelect.innerHTML = '<option value="">All Targets</option>';

      bodyParts.forEach(bodyPart => {
        const option = document.createElement('option');
        option.value = bodyPart;
        option.textContent = bodyPart.charAt(0).toUpperCase() + bodyPart.slice(1);
        bodyPartSelect.appendChild(option);
      });

      targets.forEach(target => {
        const option = document.createElement('option');
        option.value = target;
        option.textContent = target.charAt(0).toUpperCase() + target.slice(1);
        targetSelect.appendChild(option);
      });
    }

    function filterExercises() {
      const searchTerm = document.getElementById('search-input').value.toLowerCase();
      const bodyPartFilter = document.getElementById('body-part-filter').value;
      const targetFilter = document.getElementById('target-filter').value;

      filteredExercises = allExercises.filter(exercise => {
        const matchesSearch = exercise.name.toLowerCase().includes(searchTerm) ||
                            exercise.target.toLowerCase().includes(searchTerm) ||
                            exercise.bodyPart.toLowerCase().includes(searchTerm);
        const matchesBodyPart = !bodyPartFilter || exercise.bodyPart === bodyPartFilter;
        const matchesTarget = !targetFilter || exercise.target === targetFilter;

        return matchesSearch && matchesBodyPart && matchesTarget;
      });

      renderExercises();
      updateStats();
    }

    function renderExercises() {
      const container = document.getElementById('exercise-container');

      if (filteredExercises.length === 0) {
        container.innerHTML = `
          <div class="no-results">
            <div class="no-results-icon">🤔</div>
            <h3>No exercises found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        `;
        return;
      }

      container.innerHTML = '';
      
      // Show first 20 exercises for performance
      const exercisesToShow = filteredExercises.slice(0, 20);
      
      exercisesToShow.forEach((exercise, index) => {
        const card = document.createElement('div');
        card.className = 'exercise-card';
        card.style.animationDelay = `${index * 0.05}s`;
        
        card.innerHTML = `
          <div class="exercise-header">
            <h3 class="exercise-name">${exercise.name}</h3>
            <button 
              class="favorite-btn" 
              data-exercise-id="${exercise.id}"
              onclick="toggleFavorite('${exercise.id}')"
              title="Add to favorites"
            >☆</button>
          </div>
          <div class="exercise-meta">
            <span class="meta-tag target">🎯 ${exercise.target}</span>
            <span class="meta-tag body-part">💪 ${exercise.bodyPart}</span>
            <span class="meta-tag equipment">🏋️ ${exercise.equipment}</span>
          </div>
          <div class="exercise-image-container">
            <img 
              src="${exercise.gifUrl}" 
              alt="${exercise.name}"
              class="exercise-image"
              loading="lazy"
              onerror="this.src='data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"200\" height=\"200\" viewBox=\"0 0 200 200\"><rect width=\"200\" height=\"200\" fill=\"%23f3f4f6\"/><text x=\"100\" y=\"100\" font-family=\"Arial\" font-size=\"16\" fill=\"%236b7280\" text-anchor=\"middle\" dy=\".3em\"></svg
            >
            <div class="image-overlay">GIF</div>
          </div>
        `;
        
        container.appendChild(card);
      });

      // Update favorite buttons after rendering
      setTimeout(() => {
        updateFavoriteButtons();
      }, 100);

      if (filteredExercises.length > 20) {
        const loadMoreBtn = document.createElement('div');
        loadMoreBtn.style.textAlign = 'center';
        loadMoreBtn.style.marginTop = '2rem';
        loadMoreBtn.innerHTML = `
          <button class="reload-btn" onclick="loadMoreExercises()">
            Load More (${filteredExercises.length - 20} remaining)
          </button>
        `;
        container.appendChild(loadMoreBtn);
      }
    }

    function loadMoreExercises() {
      // This is a placeholder - in a real app you'd implement pagination
      alert('Load more functionality would be implemented here!');
    }

    async function fetchExercises() {
      const container = document.getElementById('exercise-container');
      const reloadBtn = document.querySelector('.reload-btn');
      const reloadIcon = document.getElementById('reload-icon');

      // Show loading state
      container.innerHTML = `
        <div class="loading">
          <div class="loading-spinner"></div>
          <div class="loading-text">Loading awesome exercises...</div>
        </div>
      `;

      reloadIcon.style.animation = 'spin 1s linear infinite';
      
      try {
        const res = await fetch(API_URL, options);
        if (!res.ok) {
          throw new Error(`Failed to fetch exercises (${res.status})`);
        }
        
        const data = await res.json();
        allExercises = data;
        filteredExercises = [...allExercises];
        
        populateFilters();
        renderExercises();
        updateStats();
        
      } catch (error) {
        console.error('Error fetching exercises:', error);
        container.innerHTML = `
          <div class="error">
            <div class="error-icon">⚠️</div>
            <h3>Oops! Something went wrong</h3>
            <p>Unable to load exercises: ${error.message}</p>
            <button class="reload-btn" onclick="fetchExercises()" style="margin-top: 1rem;">
              Try Again
            </button>
          </div>
        `;
      } finally {
        reloadIcon.style.animation = '';
      }
    }

    // Event listeners
    document.getElementById('search-input').addEventListener('input', filterExercises);
    document.getElementById('body-part-filter').addEventListener('change', filterExercises);
    document.getElementById('target-filter').addEventListener('change', filterExercises);

    // Initialize
    loadFavorites();
    fetchExercises();