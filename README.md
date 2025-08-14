# 💪 FitnessPro - Exercise Database

FitnessPro is a responsive and interactive web app that allows users to search, filter, and explore a database of fitness exercises fetched from the **ExerciseDB API**. Users can filter exercises by **body part** or **target muscle**, search by keywords, and mark their favorites.

---

## 🌐 Live Demo

🔗 https://stark145.github.io/task7/

---

## 📂 Project Structure

stark145-task7/
├── index.html # Main HTML file
├── script.js # JavaScript logic for fetching, filtering, and rendering exercises
└── style.css # Styling for the UI



---

## ✨ Features

- 🔍 **Search** exercises by name, target muscle, or body part.
- 🏷 **Filter** by body part or target.
- ⭐ **Favorite** exercises (stored temporarily in memory).
- 📊 **Stats Bar** showing total, filtered, and favorite exercises.
- 🎯 **Category tags** for target muscle, body part, and equipment.
- 🖼 **GIF Previews** for each exercise.
- 📱 **Responsive Design** for mobile and desktop.
- 🔄 **Reload** button to fetch fresh data from the API.

---

## 🚀 How It Works

1. The app fetches exercise data from the **ExerciseDB API** (via RapidAPI).
2. Data is stored in `allExercises` and filtered based on user inputs.
3. The UI dynamically updates as users search, filter, or add favorites.
4. Only the first 20 exercises are displayed initially for performance.
5. A **Load More** button (placeholder) hints at pagination for future improvements.

---

## 🛠️ Technologies Used

- **HTML5**
- **CSS3** (modern responsive design with gradients and animations)
- **JavaScript (ES6+)**
- **ExerciseDB API** (via RapidAPI)