const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const numSaltRounds = 10;
const uuid = require("uuid");
require("dotenv").config();
const { MONGO_URI, EMAIL_ADDRESS, EMAIL_PASSWORD } = process.env;
const nodemailer = require("nodemailer");

// Names of the Database and Collections (lower risk of typos)
const DB = "TasteBuddies";
const users = "users";
const recipes = "recipes";

// Setup for emailing users
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: EMAIL_ADDRESS,
        pass: EMAIL_PASSWORD
    }
})



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
            return;
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

        if (allUsers === null) {
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
    const { _id, favId } = req.body;

    if (!favId || !_id) {
        res.status(400).json({ status: 400, message: "Information missing" });
        return;
    }

    const client = new MongoClient(MONGO_URI);
    try {

        await client.connect();
        const db = client.db(DB);

        const user = await db.collection(users).findOne({ _id });
        if (!user) {
            res.status(404).json({ status: 404, message: "User not found" });
            return;
        }

        // Checking if the user already has this recipe in their favourites
        if (user.favourites.includes(favId)) {
            res.status(400).json({ status: 400, message: "Already in favourites" });
            return;
        }

        // Checking that the favId actually points to a real recipe
        const recipe = await db.collection(recipes).findOne({ _id: favId });
        if (!recipe) {
            res.status(404).json({ status: 404, message: "Recipe does not exist" });
            return;
        }

        await db.collection(users).updateOne({ _id }, { $push: { favourites: favId } });

        // Compiling final user data to send to front end (makes front end user easier to update)
        user.favourites.push(favId);
        const newUser = {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            recipes: user.recipes,
            favourites: user.favourites
        }
        res.status(200).json({ status: 200, message: "Recipe added to favourites successfully", data: newUser });
    } catch (err) {
        console.log(err);
        res.status(502).json({ status: 502, message: err.message });
    } finally {
        client.close();
    }

};

const removeFavourite = async (req, res) => {
    const { _id, favId } = req.body;

    if (!_id || !favId) {
        res.status(400).json({ status: 400, message: "Information missing" });
        return;
    }

    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db(DB);

        const user = await db.collection(users).findOne({ _id });
        if (!user) {
            res.status(404).json({ status: 404, message: "User not found" });
            return;
        }

        // Checking that the recipe is in favourites currently
        const index = user.favourites.findIndex((id) => {
            return id === favId;
        });
        if (index === -1) {
            res.status(404).json({ status: 404, message: "Recipe was not found in favourites" });
            return;
        }

        const result = await db.collection(users).updateOne({ _id }, { $pull: { favourites: favId } });
        if (result.modifiedCount === 0) {
            res.status(500).json({ status: 500, message: "Something went wrong removing the favourite" });
            return;
        }
        // removing the recipe from favourites and sending to front end (makes front end updates easier)
        user.favourites.splice(index, 1);
        const newUser = {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            recipes: user.recipes,
            favourites: user.favourites
        }
        res.status(200).json({ status: 200, message: "Favourite removed successfully", data: newUser });
    } catch (err) {
        console.log(err);
        res.status(502).json({ status: 502, message: err.message });
    } finally {
        client.close()
    }
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

const autoLogin = async (req, res) => {
    const { token } = req.body;
    const email = token.email;
    const time = Date.now() - token.date;
    if (!email) {
        res.status(400).json({ status: 400, message: "Email not given" });
        return;
    }
    if (!time || time < 0) {
        res.status(400).json({ status: 400, message: "Invalid time in token" });
        return;
    }

    if (time > 86400000) {
        res.status(401).json({ status: 401, message: "Login token expired" });
        return;
    }

    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db(DB);

        // Finding the user
        const foundUser = await db.collection(users).findOne({ email: email });
        if (!foundUser) {
            res.status(404).json({ status: 404, message: "User not found" });
            return;
        }

        // if user is found
        const userData = {
            _id: foundUser._id,
            userName: foundUser.userName,
            email: foundUser.email,
            recipes: foundUser.recipes,
            favourites: foundUser.favourites
        }
        res.status(200).json({ status: 200, data: userData });

    } catch (err) {
        console.log(err);
        res.status(502).json({ status: 502, message: err.message });
    } finally {
        client.close();
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const client = new MongoClient(MONGO_URI);

    // Validating we have the information needed to proceed
    if (!EMAIL_ADDRESS || !EMAIL_PASSWORD) {
        res.status(500).json({ status: 500, message: "Email verification was not setup properly, please contact administrator." });
        return;
    }
    if (!email) {
        res.status(400).json({ status: 400, message: "Email is missing" });
        return;
    }

    try {
        await client.connect();
        const db = client.db(DB);

        // Validating the user exists
        const user = await db.collection(users).findOne({ email: email });
        if (!user) {
            res.status(404).json({ status: 404, message: "User not found" });
            return;
        }

        // Create short code (8 digits?)
        const code = {
            number: Math.floor(Math.random()*100000000),
            time: Date.now()
        }

        // Append the reset code to the user object(!?)
        user.passwordRequest = code;
        const result = await db.collection(users).updateOne( {_id: user._id}, {$set: {passwordResetCode: code}});
        if (!result || result.modifiedCount === 0) {
            res.status(400).json({ status: 400, message: "Error occurred while saving recovery code." })
            return;
        }

        // Send user email
        const info = await transporter.sendMail({
            from: `Taste Buddies`,
            to: email,
            subject: "Taste Buddies Password Reset",
            text: `An attempt was made to change your Taste Buddies Password! If this was you, please input this code on the webpage: ${code.number}. If this was not you, please disregard this email. Toodles!`,
            html: `<h2>An attempt was made to change your Taste Buddies Password!</h2> <p>If this was you, please input this code on the webpage within the text 2 hours: ${code.number}.</p><p>If this was not you, please disregard this email.</p><p>Toodles!</p>`
        });
        if (!info.accepted) {
            res.status(400).json({ status: 400, message: "Email not sent due to error" });
            return;
        }
        
        res.status(200).json({ status: 200, message: "Email sent" });
    } catch (err) {
        console.log(err);
        res.status(502).json({ status: 502, message: err.message });
    } finally {
        client.close();
    }
}

const changePassword = async (req, res) => {
    const { email, newPassword, codeInput } = req.body;
    const client = new MongoClient(MONGO_URI);
    
    if (!EMAIL_ADDRESS || !EMAIL_PASSWORD) {
        res.status(500).json({ status: 500, message: "Email verification was not setup properly, please contact administrator." });
        return;
    }

    if (!newPassword || !codeInput || !email) {
        res.status(400).json({ status: 400, message: "Information missing" });
        return;
    }

    try {
        await client.connect();
        const db = client.db(DB);

        // Getting the user object
        const user = await db.collection(users).findOne({ email: email });
        if (!user) {
            res.status(404).json({ status: 404, message: "User not found" });
            return;
        }

        // Validating the reset code
        if (!user.passwordResetCode || user.passwordResetCode.time - Date.now() > 8640000) {
            res.status(404).json({ status: 404, message: "No valid reset code" });
            return;
        }
        if (user.passwordResetCode.number !== codeInput) {
            res.status(400).json({ status: 400, message: "Incorrect reset code" });
            return;
        }

        // Encrypting new Password
        const encNewPassword = await bcrypt.hash(newPassword, numSaltRounds);

        // Updating user in database
        const result = await db.collection(users).updateOne(
            { _id: user._id },
            { $set: { password: encNewPassword, passwordResetCode: null } }
        );

        if (result.modifiedCount !== 1) {
            res.status(400).json({ status: 400, message: "Problem resetting password" });
            return;
        }

        res.status(200).json({ status: 200, message: "Password changed!" });


    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 500, message: "Unknown error" });
    } finally {
        client.close();
    }
}



// Exporting Functions: 
module.exports = {
    getUsers,
    getUser,
    newUser,
    annotateRecipe,
    addFavourite,
    removeFavourite,
    login,
    autoLogin,
    forgotPassword,
    changePassword,
}