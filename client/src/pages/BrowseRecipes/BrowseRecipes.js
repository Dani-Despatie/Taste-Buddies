import styled from "styled-components";
import { LoggedInUserContext } from "../../contexts/LoggedInUserContext";
import { RecipesContext } from "../../contexts/RecipesContext";
import { useContext, useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";

const BrowseRecipes = () => {
    const { loggedInUser } = useContext(LoggedInUserContext);
    const { recipes } = useContext(RecipesContext);
    const [filter, setFilter] = useState(null);
    const [search, setSearch] = useState(null);
    const [filteredRecipes, setFilteredRecipes] = useState(null);

    // HANDLERS ---------------------------------------------------
    // Handles the changing of recipe type filter
    const handleFilterChange = (event) => {
        if (event.target.value === "Any") setFilter(null);
        else setFilter(event.target.value);
    };

    // Handles submission of the search bar contents
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (event.target.search.value === "")
            setSearch(null);
        else
            setSearch(event.target.search.value);
    };
    // ------------------------------------------------------------
    // Filtering based on filters AND searched string
    useEffect(() => {
        if (!recipes) {
            return;
        }
        // Filtering based on recipe type
        let filterMatches = [];
        if (!filter) {
            filterMatches = recipes;
        }
        else {
            recipes.forEach((recipe) => {
                if (recipe.type === filter) {
                    filterMatches.push(recipe);
                }
            })
        }
        // Filtering again, based on search string
        let searchMatches = [];
        if (!search) {
            searchMatches = filterMatches;
        }
        else {
            filterMatches.forEach((recipe) => {
                const name = recipe.name.toLowerCase();
                if (name.includes(search.toLowerCase())) {
                    searchMatches.push(recipe);
                }
            })
        }

        setFilteredRecipes(searchMatches);
    }, [recipes, filter, search])

    return (
        <Container className="main">

            <FilterForm onSubmit={handleSearchSubmit}>
                <label htmlFor="search">Search By Name: </label>
                <input id='search' />
                <button type='submit' >Search</button> <br />
                <label htmlFor="filter">Looking through recipes of type:  </label>
                <select name="filter" id="filter" onChange={handleFilterChange}>
                    <option value="Any">Any</option>
                    <option value="Main Dish">Main Dish</option>
                    <option value="Apetizer">Apetizer</option>
                    <option value="Soup">Soup</option>
                    <option value="Sauce">Sauce</option>
                    <option value="Finger Food">Finger Food</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Misc">Misc</option>
                </select>
            </FilterForm>

            {filteredRecipes && filteredRecipes.map((recipe) => {
                return RecipeCard(recipe);
            })}

            {filteredRecipes && filteredRecipes.length === 0 && <p>No {filter} recipes found</p>}
        </Container>
    )
}

const Container = styled.div`
    text-align: center;
`;

const FilterForm = styled.form`
    select, button {
        background-color: var(--button-green);
        border: 2px solid var(--green);
        border-radius: 5px;
        box-shadow: var(--shadow);

        font-family: inherit;
        font-size: 1rem;
        padding: 5px;
        margin-left: 15px;
    }
    select:hover, button:hover {
        scale: 1.03;
    }

    input {
        line-height: 1.5rem;
        font-family: inherit;
        font-size: inherit;
        margin: 10px;
    }
    input:hover {
        outline: 1px solid var(--green);
    }
    input:focus {
        outline: 2px solid var(--green);
    }
    

`;

export default BrowseRecipes;