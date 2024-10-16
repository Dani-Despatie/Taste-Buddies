import { createContext, useState, useEffect } from "react";

export const RecipesContext = createContext();

const RecipesProvider = ({ children }) => {
    const [recipes, setRecipes] = useState(null);

    const getRecipes = async () => {
        console.log("Trying get recipes...");
        try {
            const res = await fetch("/recipes");
            console.log(res);
            const { data } = await res.json();
            console.log(data);
            setRecipes(data);
        } catch (err) {
            console.error(err);
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