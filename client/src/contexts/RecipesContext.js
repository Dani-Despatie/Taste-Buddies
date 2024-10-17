import { createContext, useState, useEffect } from "react";
const rootUrl = "https://taste-buddies.onrender.com"
import axios from 'axios';


export const RecipesContext = createContext();

const RecipesProvider = ({ children }) => {
    const [recipes, setRecipes] = useState(null);

    const getRecipes = async () => {
        try {
            const res = await axios.get(`${rootUrl}/recipes`);
            console.log(res);
            const data = res.data.data;
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