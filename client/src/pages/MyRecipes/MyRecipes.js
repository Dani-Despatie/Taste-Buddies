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
            <h2>My Recipes</h2>

            {!loggedInUser && <p>Recipes Loading...</p>}

            {loggedInUser && recipes && <NewRecipeNav to="/create-recipe">Create a new recipe!</NewRecipeNav>}

            {loggedInUser && loggedInUser.recipes.length === 0 && <p>You have no recipes!</p>}

            {loggedInUser && recipes && loggedInUser.recipes.map((recipeId) => {

                const foundRecipe = findRecipe(recipeId);

                if (foundRecipe) {
                    return RecipeCard(foundRecipe);
                }
                return <p>Recipe {recipeId} could not be found</p>
            })}
        </Container>
    )
};

export default MyRecipes;

const Container = styled.div`
    text-align: center;
`;


const NewRecipeNav = styled(NavLink)`
    margin: auto;
    border: 2px solid var(--green);
    padding: 5px 20px;
    color: black;
    background-color: var(--button-green);
`