const { MongoClient } = require("mongodb");
require("dotenv").config();
const uuid = require("uuid");
const { MONGO_URI, CLOUDINARY_URL } = process.env;
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    secure: true
});

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

    let { name, authorName, type, description, amountMade, ingredients, instructions, src, tags } = req.body;

    // Validation that all required fields were filled
    if (!name || !authorName || !type || !description || !amountMade || !ingredients || !instructions || !tags) {
        res.status(400).json({ status: 400, message: "Not all required information was provided" });
        return
    }

    // Applying the default image if no image link was given by the user
    if (!src) {
        switch (type) {
            case "Main Dish":
                src = "https://res.cloudinary.com/dfszibmt6/image/upload/v1725042179/main-dish.png";
                break;
            case "Apetizer":
                src = "https://res.cloudinary.com/dfszibmt6/image/upload/v1725042176/appetizer.png";
                break;
            case "Soup":
                src = "https://res.cloudinary.com/dfszibmt6/image/upload/v1725042181/soup.png";
                break;
            case "Sauce":
                src = "https://res.cloudinary.com/dfszibmt6/image/upload/v1725042180/sauce.png";
                break;
            case "Finger Food":
                src = "https://res.cloudinary.com/dfszibmt6/image/upload/v1725042178/finger-food.png";
                break;
            case "Dessert":
                src = "https://res.cloudinary.com/dfszibmt6/image/upload/v1725042177/dessert.png";
                break;
            default:
                src = "https://res.cloudinary.com/dfszibmt6/image/upload/v1725042180/misc.png"
        }
    }

    // Validation of ingredients list (shouldn't have blank spaces)
    const filteredIngredients = [];
    ingredients.forEach((ingr) => {
        if (ingr.length > 0) {
            filteredIngredients.push(ingr);
        }
    });

    // Validation of instructions list (steps shouldn't have blank spaces)
    const filteredInstructions = [];
    instructions.forEach((instr) => {
        const filteredSteps = [];
        instr.steps.forEach((step) => {
            if (step.length > 0) {
                filteredSteps.push(step);
            }
        });
        if (filteredSteps.length > 0) {
            filteredInstructions.push({header: instr.header, steps: filteredSteps});
        }
    });
    // Validation of tags list
    const filteredTags = [];
    tags.forEach((tag) => {
        if (tag.length > 0) {
            filteredTags.push(tag);
        }
    });

    if (filteredIngredients.length === 0 || filteredInstructions.length === 0) {
        res.status(400).json({status: 400, message: "Ingredients and Instructions cannot be left blank"});
        return;
    }

    // Creating the new recipe object
    const newRecipe = {
        _id: uuid.v4(),
        name,
        authorName,
        date: Date.now(),
        type,
        description,
        amountMade,
        ingredients: filteredIngredients,
        instructions: filteredInstructions,
        tags,
        src,
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
    let { _id, name, type, description, amountMade, ingredients, instructions, src, tags } = req.body;
    if (!_id || !name || !type || !description || !amountMade || !ingredients || !instructions || !tags) {
        res.status(400).json({ status: 400, message: "Information missing" });
        return;
    }

    // If no uploaded image link is provided
    if (!src) {
        switch (type) {
            case "Main Dish":
                src = "https://res.cloudinary.com/dfszibmt6/image/upload/v1725042179/main-dish.png";
                break;
            case "Apetizer":
                src = "https://res.cloudinary.com/dfszibmt6/image/upload/v1725042176/appetizer.png";
                break;
            case "Soup":
                src = "https://res.cloudinary.com/dfszibmt6/image/upload/v1725042181/soup.png";
                break;
            case "Sauce":
                src = "https://res.cloudinary.com/dfszibmt6/image/upload/v1725042180/sauce.png";
                break;
            case "Finger Food":
                src = "https://res.cloudinary.com/dfszibmt6/image/upload/v1725042178/finger-food.png";
                break;
            case "Dessert":
                src = "https://res.cloudinary.com/dfszibmt6/image/upload/v1725042177/dessert.png";
                break;
            default:
                src = "https://res.cloudinary.com/dfszibmt6/image/upload/v1725042180/misc.png"
        }
    }

    // Removing empty spaces from arrays
    const filteredIngredients = [];
    ingredients.forEach((ingr) => {
        if (ingr.length > 0)
            filteredIngredients.push(ingr);
    });

    const filteredInstructions = [];
    instructions.forEach((instr) => {
        const filteredSteps = [];
        instr.steps.forEach((step) => {
            if (step.length > 0) {
                filteredSteps.push(step);
            }
        });
        if (filteredSteps.length > 0) {
            filteredInstructions.push({header: instr.header, steps: filteredSteps});
        }
    });

    const filteredTags = [];
    tags.forEach((tag) => {
        if (tag.length > 0)
            filteredTags.push(tag);
    });

    if (filteredIngredients.length === 0 || filteredInstructions.length === 0) {
        res.status(400).json({status: 400, message: "Ingredients and Instructions cannot be left blank"});
        return;
    }

    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db(DB);

        // Finding the original recipe (for it's authorName, date, and ratings values)
        const originalRecipe = await db.collection(recipes).findOne({ _id });
        if (!originalRecipe) {
            res.status(404).json({ status: 404, message: "Original recipe not found in database" });
            return;
        }

        // Creating the new recipe object
        const recipe = {
            _id,
            name,
            authorName: originalRecipe.authorName,
            date: originalRecipe.date,
            type,
            description,
            amountMade,
            ingredients: filteredIngredients,
            instructions: filteredInstructions,
            tags: filteredTags,
            src,
            ratings: originalRecipe.ratings
        }

        const result = await db.collection(recipes).replaceOne({ _id }, recipe);
        if (result.modifiedCount === 0) {
            res.status(400).json({ status: 400, message: "No change was made to the recipe" });
            return;
        }

        res.status(200).json({ status: 200, message: "Recipe changed successfully", data: recipe });
    } catch (err) {
        console.log(err);
        res.status(502).json({ status: 502, message: err.message });
    } finally {
        client.close();
    }

};

// Exporting functions:
module.exports = {
    getRecipes,
    getRecipe,
    newRecipe,
    editRecipe,
}