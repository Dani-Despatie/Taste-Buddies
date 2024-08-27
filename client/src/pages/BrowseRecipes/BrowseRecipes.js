import styled from "styled-components";
import { LoggedInUserContext } from "../../contexts/LoggedInUserContext";
import { RecipesContext } from "../../contexts/RecipesContext";
import { useContext } from "react";
import RecipeCard from "./RecipeCard";

const BrowseRecipes = () => {
    const loggedInUser = useContext(LoggedInUserContext);
    const {recipes} = useContext(RecipesContext);

    return (
        <Container className="main">
            {recipes && recipes.map((recipe) => {
                return RecipeCard(recipe, true); // true means we include a favourite button
            })}
        </Container>
    )
}

const Container = styled.div`
    width: 90%;
`;

export default BrowseRecipes;