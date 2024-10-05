const express = require("express");
const morgan = require("morgan");

const PORT = 8000;
const app = express();

// require handler functions here
const { getUsers, getUser, newUser, annotateRecipe, addFavourite, removeFavourite, login, autoLogin } = require("./handlers/userHandlers");
const { getRecipes, getRecipe, newRecipe, editRecipe } = require("./handlers/recipeHandlers");


app.use(express.json());
app.use(morgan("tiny"));

// GETS
app.get("https://taste-buddies.onrender.com/recipes", getRecipes);
app.get("https://taste-buddies.onrender.com/recipe/:id", getRecipe);
app.get("https://taste-buddies.onrender.com//users", getUsers);
app.get("https://taste-buddies.onrender.com//user/:id", getUser);

// POSTS
app.post("https://taste-buddies.onrender.com/recipe", newRecipe);
app.post("https://taste-buddies.onrender.com/newUser", newUser);

// PATCHES
app.patch("https://taste-buddies.onrender.com/editRecipe", editRecipe);
app.patch("https://taste-buddies.onrender.com/login", login);
app.patch("https://taste-buddies.onrender.com/autoLogin", autoLogin)
app.patch("https://taste-buddies.onrender.com/annotateRecipe", annotateRecipe);
app.patch("https://taste-buddies.onrender.com/addFavourite", addFavourite);
app.patch("https://taste-buddies.onrender.com/removeFavourite", removeFavourite);

// DELETES


// Catch-All for anything else
app.use("*", (req, res) => {
    res.status(404).json({ status: 404, message: "Endpoint not found" });
});

app.listen(PORT, () => {
    console.log("Server listening on port ", PORT);
})