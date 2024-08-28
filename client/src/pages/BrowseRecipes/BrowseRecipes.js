import styled from "styled-components";
import { LoggedInUserContext } from "../../contexts/LoggedInUserContext";
import { RecipesContext } from "../../contexts/RecipesContext";
import { useContext, useState } from "react";
import RecipeCard from "./RecipeCard";

const BrowseRecipes = () => {
    const {loggedInUser} = useContext(LoggedInUserContext);
    const {recipes} = useContext(RecipesContext);
    const [filter, setFilter] = useState(null);

    const handleSubmit = () => {

    };

    return (
        <Container className="main">

            <form onSubmit={handleSubmit}>
                
            </form>

            {recipes && loggedInUser && recipes.map((recipe) => {
                return RecipeCard(recipe); 
            })}
        </Container>
    )
}

const Container = styled.div`
    width: 90%;
    text-align: center;
`;

const FilterForm = styled.form`

`;

export default BrowseRecipes;