const { MongoClient } = require("mongodb");
require("dotenv").config();
const uuid = require("uuid");
const { MONGO_URI } = process.env;

// Names of the Database and Collections (lower risk of typos)
const DB = "TasteBuddies";
const recipes = "recipes";
const users = "users";


// GET Endpoints

const getRecipes = async (req, res) => {
    const client = new MongoClient(MONGO_URI);

    try {
        await client.connect();
        const db = client.db(DB);

        const allRecipes = await db.collection(recipes).find().toArray();

        if (!allRecipes || !allRecipes.length) {
            res.status(404).json({ status: 404, message: "Recipe list not found" });
        }
        else {
            res.status(200).json({ status: 200, data: allRecipes });
        }

    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
};

const getRecipe = async (req, res) => {
    const client = new MongoClient(MONGO_URI);
    const _id = req.params.id;

    if (!_id || _id === ":id") {
        res.status(400).json({ status: 400, message: "No ID given to search" });
        return;
    }

    try {
        await client.connect();
        const db = client.db(DB);

        const recipe = await db.collection(recipes).findOne({ _id });

        if (!recipe) {
            res.status(404).json({ status: 404, message: `Recipe with id ${_id} not found` });
        }
        else {
            res.status(200).json({ status: 200, data: recipe });
        }
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
};

// POST Endpoints

const newRecipe = async (req, res) => {
    const client = new MongoClient(MONGO_URI);

    const { name, authorName, type, description, amountMade, ingredients, instructions, tags } = req.body;

    // Validation that all required fields were filled
    if (!name || !authorName || !type || !description || !amountMade || !ingredients || !instructions || !tags) {
        res.status(400).json({ status: 400, message: "Not all required information was provided" });
        return
    }

    // Validation of ingredients list (shouldn't have blank spaces)

    // Validation of instructions list

    // Creating the new recipe object
    const newRecipe = {
        _id: uuid.v4(),
        name,
        authorName,
        date: Date.now(),
        type,
        description,
        amountMade,
        ingredients,
        instructions,
        tags,
        ratings: []
    }

    try {
        await client.connect();
        const db = client.db(DB);


        // Checking if author already has a recipe by the same name
        const allUsers = await db.collection(users).find().toArray();
        const author = allUsers.find((user) => {
            return user.userName === authorName;
        })
        const foundRecipe = author.recipes.find((recipe) => {
            return recipe.name === name;
        })
        if (foundRecipe) {
            res.status(400).json({ status: 400, message: `User already has a recipe called ${name}` });
            return;
        }

        // Adding the recipe to the database
        await db.collection(recipes).insertOne(newRecipe);

        // Adding the recipe id to the user's recipes array
        await db.collection(users).updateOne({ _id: author._id }, { $push: { recipes: newRecipe._id } });

        res.status(201).json({ status: 201, message: "Recipe added successfully", data: { id: newRecipe } });


    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
};

// PATCH Endpoints

const editRecipe = async (req, res) => {

};

// Exporting functions:
module.exports = {
    getRecipes,
    getRecipe,
    newRecipe,
    editRecipe,
}