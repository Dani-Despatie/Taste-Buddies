import { createContext, useState, useEffect } from "react";

export const RecipesContext = createContext();

const RecipesProvider = ({ children }) => {
    const [recipes, setRecipes] = useState(null);

    const getRecipes = async () => {
        console.log("Trying get recipes...");
        try {
            const res = await fetch("/recipes");
            const { data } = await res.json();
            setRecipes(data);
            console.log("get recipes succeeded");
        } catch (err) {
            console.log("get recipes failed");
            console.log(err);
        }
    }

    useEffect(() => {
        getRecipes();
    }, [])

    const refreshRecipes = () => {
        getRecipes();
    }

    return (
        <RecipesContext.Provider value={{ recipes, refreshRecipes }} >
            {children}
        </RecipesContext.Provider>
    )
}

export default RecipesProvider;