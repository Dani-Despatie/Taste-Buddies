import { createContext } from "react";
import { useState, useEffect } from "react";

export const LoggedInUserContext = createContext();

const LoggedInUserProvider = ({ children }) => {

    const [loggedInUser, setLoggedInUser] = useState(null);

    // Login function
    const login = async (email, password) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-type", "application/json");

        try {
            const res = await fetch("/login", {
                method: "PATCH",
                body: JSON.stringify({ email, password }),
                headers: myHeaders
            });

            if (res.status === 200) {
                const user = await res.json();
                setLoggedInUser(user.data);
                setToken({ email, date: Date.now() });
            }
            return res.status;
        } catch (err) {
            console.log(err);
        }
    }
    // Logout function
    const logout = () => {
        setLoggedInUser(null);
        setToken(null);
    }

    // Auto login function
    const autoLogin = async () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-type", "application/json");
        const token = getToken();
        if (token && token.email) {
            try {
                const res = await fetch("/autoLogin", {
                    method: "PATCH",
                    body: JSON.stringify({ token }),
                    headers: myHeaders
                });

                if (res.status === 200) {
                    const user = await res.json();
                    setLoggedInUser(user.data);
                }
                if (res.status === 401) {
                    setToken(null);
                    const result = await res.json();
                    console.log(result.message);
                }
                return res.status;
            } catch (err) {
                console.log(err);
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
            const res = await fetch(`/user/${id}`);
            const { data } = await res.json();
            setLoggedInUser(data);
        } catch (err) {
            console.log(err);
        }
    }

    // Adding a favourite
    const addFavourite = async (recipeId) => {
        if (!loggedInUser) {
            return null;
        }
        const myHeaders = new Headers();
        myHeaders.append("Content-type", "application/json");
        try {
            const res = await fetch("/addFavourite", {
                method: "PATCH",
                body: JSON.stringify({ _id: loggedInUser._id, favId: recipeId }),
                headers: myHeaders
            });
            const result = await res.json();
            setLoggedInUser(result.data);
        } catch (err) {
            console.log(err);
        }
    }

    const removeFavourite = async (recipeId) => {
        if (!loggedInUser) {
            return null;
        }
        const myHeaders = new Headers();
        myHeaders.append("Content-type", "application/json");
        try {
            const res = await fetch("/removeFavourite", {
                method: "PATCH",
                body: JSON.stringify({ _id: loggedInUser._id, favId: recipeId }),
                headers: myHeaders
            })
            const result = await res.json();
            setLoggedInUser(result.data);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <LoggedInUserContext.Provider value={{ loggedInUser, login, logout, refreshUser, addFavourite, removeFavourite }} >
            {children}
        </LoggedInUserContext.Provider>
    )

};

export default LoggedInUserProvider;