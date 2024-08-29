import styled from "styled-components";
import { LoggedInUserContext } from "../../contexts/LoggedInUserContext";
import { RecipesContext } from "../../contexts/RecipesContext";
import { useContext, useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";

const BrowseRecipes = () => {
    const {loggedInUser} = useContext(LoggedInUserContext);
    const {recipes} = useContext(RecipesContext);
    const [filter, setFilter] = useState(null);
    const [filteredRecipes, setFilteredRecipes] = useState(null);

    const handleChange = (event) => {
        if (event.target.value === "Any") setFilter(null);
        else setFilter(event.target.value);
    };

    // Making the displayed recipes change based on filter
    useEffect(() => {
        if (filter == null) {
            setFilteredRecipes(recipes);
        }
        else {
            const newRecipeArray = [];
            recipes.forEach((recipe) => {
                if (recipe.type === filter) {
                    newRecipeArray.push(recipe);
                }
            })
            setFilteredRecipes(newRecipeArray);
        }
    },[recipes, filter]);

    return (
        <Container className="main">

            <form>
                <label htmlFor="filter">Looking through recipes of type:  </label>
                <select name="filter" id="filter" onChange={handleChange}>
                    <option value="Any">Any</option>
                    <option value="Main Dish">Main Dish</option>
                    <option value="Apetizer">Apetizer</option>
                    <option value="Soup">Soup</option>
                    <option value="Sauce">Sauce</option>
                    <option value="Finger Food">Finger Food</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Misc">Misc</option>
                </select>
            </form>

            {filteredRecipes && loggedInUser && filteredRecipes.map((recipe) => {
                return RecipeCard(recipe); 
            })}

            {filteredRecipes && filteredRecipes.length === 0 && <p>No {filter} recipes found</p>}
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