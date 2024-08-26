import { createContext, useState, useEffect } from "react";

export const RecipesContext = createContext();

const RecipesProvider = ({children}) => {
    const [recipes, setRecipes] = useState(null);

    useEffect(() => {
        const getRecipes = async () => {
            try {
                const res = await fetch("/recipes");
                const { data } = await res.json();
                setRecipes(data);
            } catch(err) {
                console.log(err);
            }
        }
        getRecipes();
    },[])

    return (
        <RecipesContext.Provider value={{ recipes }} >
            {children}
        </RecipesContext.Provider>
    )
}

export default RecipesProvider;