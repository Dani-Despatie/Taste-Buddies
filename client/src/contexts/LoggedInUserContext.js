import { createContext } from "react";
import { useState, useEffect } from "react";
import axios from 'axios';
const rootUrl = "https://taste-buddies.onrender.com";

export const LoggedInUserContext = createContext();

const LoggedInUserProvider = ({ children }) => {

    const [loggedInUser, setLoggedInUser] = useState(null);

    // Login function
    const login = async (email, password) => {

        try {
            const res = await axios.patch(`${rootUrl}/login`, { email, password });

            if (res.status === 200) {
                const user = res.data.data;
                setLoggedInUser(user);
                setToken({ email, date: Date.now() });
            }
            return res.status;
        } catch (err) {
            if (err.status === 401 || err.status === 404) {
                console.log(err.message);
                return err.status;
            }
            else console.log(err.message);
        }
    }
    // Logout function
    const logout = () => {
        setLoggedInUser(null);
        setToken(null);
    }

    // Auto login function
    const autoLogin = async () => {
        const token = getToken();
        if (token && token.email) {
            try {
                const res = await axios.patch(`${rootUrl}/autoLogin`, { token });
                if (res.status === 200) {
                    const user = res.data.data;
                    setLoggedInUser(user);
                }
                if (res.status === 401) {
                    setToken(null);
                    console.log(res.message);
                }
                return res.status;
            } catch (err) {
                if (err.status === 401) {
                    setToken(null);
                    console.log("Login token expired");
                }
                else console.log(err.message);
            }
        }
    }

    // Token handlers
    const setToken = (userToken) => {
        localStorage.setItem('token', JSON.stringify(userToken));
    }
    const getToken = () => {
        const tokenString = localStorage.getItem("token");
        const token = JSON.parse(tokenString);
        return token;
    }

    // Attempting auto login on site startup
    useEffect(() => {
        autoLogin();
    }, [])

    // Refresh user state (for after changes to favourites adding a recipe)
    const refreshUser = async () => {
        if (!loggedInUser) {
            return null;
        }

        const id = loggedInUser._id;
        try {
            const res = await axios.get(`${rootUrl}/user/${id}`);
            const { data } = res.data;
            setLoggedInUser(data);
        } catch (err) {
            if (err.status === 404) {
                console.log("User not found");
            }
            else console.log(err.message);
        }
    }

    // Adding a favourite
    const addFavourite = async (recipeId) => {
        if (!loggedInUser) {
            return null;
        }

        try {
            const res = await axios.patch("/addFavourite",{ _id: loggedInUser._id, favId: recipeId });
            const result = res.data.data;
            setLoggedInUser(result);
        } catch (err) {
            if (err.status === 400) 
                console.log("Bad request/information missing");
            else if (err.status === 404) 
                console.log("User or recipe was not found");
            else console.log(err.message);
        }
    }

    const removeFavourite = async (recipeId) => {
        if (!loggedInUser) {
            return null;
        }
        try {
            const res = await axios.patch("/removeFavourite", { _id: loggedInUser._id, favId: recipeId })
            const result = res.data.data;
            setLoggedInUser(result);
        } catch (err) {
            if (err.status === 404) 
                console.log("User or recipe was not found");
            else if (err.status === 500) 
                console.log("Error 500: Something went wrong removing the recipe");
            else console.log(err.message);
        }
    };

    return (
        <LoggedInUserContext.Provider value={{ loggedInUser, login, logout, refreshUser, addFavourite, removeFavourite }} >
            {children}
        </LoggedInUserContext.Provider>
    )

};

export default LoggedInUserProvider;