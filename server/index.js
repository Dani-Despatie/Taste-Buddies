const express = require("express");
const morgan = require("morgan");
const cors = require('cors');

const PORT = process.env.PORT || 8000;
const app = express();
app.use(cors());
const { MONGO_URI, CLOUDINARY_URL } = process.env;

// require handler functions here
const { getUsers, getUser, newUser, annotateRecipe, addFavourite, removeFavourite, login, autoLogin, forgotPassword, changePassword } = require("./handlers/userHandlers");
const { getRecipes, getRecipe, newRecipe, editRecipe } = require("./handlers/recipeHandlers");


app.use(express.json());
app.use(morgan("tiny"));

// GETS
app.get("/recipes", getRecipes);
app.get("/recipe/:id", getRecipe);
app.get("/users", getUsers);
app.get("/user/:id", getUser);

// POSTS
app.post("/recipe", newRecipe);
app.post("/newUser", newUser);

// PATCHES
app.patch("/editRecipe", editRecipe);
app.patch("/login", login);
app.patch("/autoLogin", autoLogin)
app.patch("/annotateRecipe", annotateRecipe);
app.patch("/addFavourite", addFavourite);
app.patch("/removeFavourite", removeFavourite);
app.patch("/forgotPassword", forgotPassword);
app.patch("/changePassword", changePassword);


// DELETES

// Catch-All for anything else
app.use("*", (req, res) => {
    res.status(404).json({ status: 404, message: "Endpoint not found" });
});

app.listen(PORT, () => {
    console.log("Server listening on port ", PORT);
})