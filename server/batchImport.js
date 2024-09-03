const { MongoClient } = require("mongodb");
require("dotenv").config();
const uuid = require("uuid");
const { MONGO_URI } = process.env;


const DB = "TasteBuddies";
const recipes = "recipes";
const users = "users";

