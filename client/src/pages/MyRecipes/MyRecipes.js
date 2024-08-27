import styled from "styled-components";
import { useContext } from "react";
import { LoggedInUserContext } from "../../contexts/LoggedInUserContext";
import { RecipesContext } from "../../contexts/RecipesContext";
import RecipeCard from "../BrowseRecipes/RecipeCard";
import { NavLink } from "react-router-dom";


const MyRecipes = () => {
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
            {!loggedInUser && recipes && <p>Recipes Loading...</p>}

            {loggedInUser && loggedInUser.recipes.length === 0 && <p>You have no recipes!</p>}

            {loggedInUser && recipes && <NavThing to="/create-recipe">Create a new recipe!</NavThing>}

            {loggedInUser && recipes && loggedInUser.recipes.map((recipeId) => {

                const foundRecipe = findRecipe(recipeId);

                if (foundRecipe) {
                    return RecipeCard(foundRecipe, false); // false means no favourite button
                }
                return <p>Recipe {recipeId} could not be found</p>
            })}
        </Container>
    )
};

export default MyRecipes;

const Container = styled.div`
    width: 90%
`;


const NavThing = styled(NavLink)`

`