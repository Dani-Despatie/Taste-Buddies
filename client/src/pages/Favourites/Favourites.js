import styled from "styled-components";
import { useContext } from "react";
import { LoggedInUserContext } from "../../contexts/LoggedInUserContext";
import { RecipesContext } from "../../contexts/RecipesContext";
import RecipeCard from "../BrowseRecipes/RecipeCard";
import { NavLink } from "react-router-dom";

const Favourites = () => {
    const { loggedInUser } = useContext(LoggedInUserContext);
    const { recipes } = useContext(RecipesContext);

    const findRecipe = (recipeId) => {
        const foundRecipe = recipes.find((recipe) => {
            return recipe._id === recipeId;
        })
        return foundRecipe;
    }

    return (
        <Container className="main">
            {!recipes && <p>Recipes Loading...</p>}
            
            {loggedInUser && loggedInUser.favourites.length === 0 && <p>You have no favourites!</p>}

            {loggedInUser && recipes && loggedInUser.favourites.map((recipeId) => {
                const foundRecipe = findRecipe(recipeId);

                if (foundRecipe) {
                    return RecipeCard(foundRecipe, true);
                }
            })}
        </Container>
    )

};

export default Favourites;

const Container = styled.div`
`;