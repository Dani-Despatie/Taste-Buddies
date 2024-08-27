const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const numSaltRounds = 10;
const uuid = require("uuid");
require("dotenv").config();
const { MONGO_URI } = process.env;

// Names of the Database and Collections (lower risk of typos)
const DB = "TasteBuddies";
const users = "users";

// GET Endpoints

const getUsers = async (req, res) => {
    const client = new MongoClient(MONGO_URI);

    try {
        await client.connect();
        const db = client.db(DB);

        const allUsers = await db.collection(users).find().toArray();
        if (!allUsers || allUsers.length === 0) {
            res.status(404).json({ status: 404, message: "User list not found" });
        }
        else {
            res.status(200).json({ status: 200, data: allUsers });
        }
    } catch (err) {
        console.log(err);
        res.status(502).json({ status: 502, message: err.message });
    } finally {
        client.close();
    }
};

const getUser = async (req, res) => {
    const client = new MongoClient(MONGO_URI);
    const id = req.params.id;

    try {
        client.connect();
        const db = client.db(DB);

        const foundUser = await db.collection(users).findOne({ _id: id });
        if (!foundUser) {
            res.status(404).json({ status: 404, message: `User with id ${id} not found` });
        }
        else {
            // removing password from the returned data, because it feels more secure
            const userData = {
                _id: foundUser._id,
                userName: foundUser.userName,
                email: foundUser.email,
                recipes: foundUser.recipes,
                favourites: foundUser.favourites
            }
            res.status(200).json({ status: 200, data: userData });
        }
    } catch (err) {
        console.log(err);
        res.status(502).json({ status: 502, message: err.message });
    } finally {
        client.close();
    }
};

// POST Endpoints

const newUser = async (req, res) => {
    const { userName, email, password } = req.body;
    const client = new MongoClient(MONGO_URI);

    if (!userName || !email || !password) {
        res.status(400).json({ status: 400, message: "Information is missing" });
    }

    try {
        await client.connect();
        const db = client.db(DB);

        // Validating if email is already associated with a user
        const allUsers = await db.collection(users).find().toArray();

        if (!allUsers || allUsers.length === 0) {
            res.status(404).json({ status: 404, message: "User list not found" });
            return;
        }
        const userExists = allUsers.findIndex((user) => {
            return user.email === email;
        })
        if (userExists !== -1) {
            res.status(400).json({ status: 400, message: `User with email ${email} already exists` });
            return;
        }

        // Getting _id
        const _id = uuid.v4();
        // Encrypting password
        const encryptedPassword = await bcrypt.hash(password, numSaltRounds);

        // Adding user to database
        const newUser = {
            _id,
            userName,
            email,
            password: encryptedPassword,
            recipes: [],
            favourites: []
        }
        await db.collection(users).insertOne(newUser);
        res.status(201).json({ status: 201, message: "User created successfully" });
    } catch (err) {
        console.log(err);
        res.status(502).json({ status: 502, message: err.message });
    } finally {
        client.close();
    }
};

// PATCH Endpoints

const annotateRecipe = async (req, res) => {

};

const addFavourite = async (req, res) => {

};

const login = async (req, res) => {
    // Basic validation of inputs:
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ status: 400, message: "Email or password is blank" });
        return;
    }

    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db(DB);

        // Finding and validating the user exists
        const foundUser = await db.collection(users).findOne({ email: email });
        if (!foundUser) {
            res.status(404).json({ status: 404, message: "User not found" });
            return;
        }

        // Validating password
        const isValid = await bcrypt.compare(password, foundUser.password);
        if (isValid) {
            // Removing password from user data for security(?)
            const userData = {
                _id: foundUser._id,
                userName: foundUser.userName,
                email: foundUser.email,
                recipes: foundUser.recipes,
                favourites: foundUser.favourites
            }
            res.status(200).json({ status: 200, data: userData });
        }

        else {
            res.status(401).json({ status: 401, message: "Password is incorrect" });
        }
    } catch (err) {
        console.log(err);
        res.status(502).json({ status: 502, message: err.message });
    } finally {
        client.close();
    }

};



// Exporting Functions: 
module.exports = {
    getUsers,
    getUser,
    newUser,
    annotateRecipe,
    addFavourite,
    login
}