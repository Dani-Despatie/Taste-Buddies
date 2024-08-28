import styled from "styled-components";
import { useEffect, useContext, useState } from "react";
import { LoggedInUserContext } from "../../contexts/LoggedInUserContext";
import { RecipesContext } from "../../contexts/RecipesContext";
import { useParams } from "react-router-dom";


const Recipe = () => {
    const { id } = useParams();
    const { loggedInUser, refreshUser, addFavourite, removeFavourite } = useContext(LoggedInUserContext);
    const { recipes } = useContext(RecipesContext);
    const [recipe, setRecipe] = useState(null);
    const [isFavourite, setIsFavourite] = useState(false);
    const [isUserMade, setIsUserMade] = useState(false);
    const [status, setStatus] = useState("idle");

    // Finding the recipe from the provided ID
    useEffect(() => {
        if (recipes) {
            const foundRecipe = recipes.find((rec) => {
                return id === rec._id;
            });
            if (foundRecipe) {
                setRecipe(foundRecipe);
            }
        }
    }, [recipes])

    // Determining if it is in the user's favourites 
    useEffect(() => {
        if (loggedInUser && recipe) {
            const isFav = loggedInUser.favourites.includes(recipe._id);
            setIsFavourite(isFav);
        }
    },[loggedInUser, recipe]);

    // Determining if the recipe was made by the user (can't favourite/unfavourite the recipe)
    useEffect(() => {
        if (loggedInUser && recipe) {
            const isUsers = loggedInUser.recipes.includes(recipe._id);
            setIsUserMade(isUsers);
        }
    },[loggedInUser, recipe]);

    // HANDLER FUNCTIONS --------------------------
    // Favourite handler
    const favourite = async () => {
        setStatus("pending");
        setIsFavourite(true);
        await addFavourite(recipe._id);
        setStatus("idle");
    }

    // Unfavourite handler
    const unfavourite = async() => {
        setStatus("pending");
        setIsFavourite(false);
        await removeFavourite(recipe._id);
        setStatus("idle");
    }


    // Recipe page component ----------------------
    const Recipe = () => {
        return (
            <>
                <h2>{recipe.name}</h2>
                <p>Made by {recipe.authorName}</p>

                {isFavourite && <button className="remove" onClick={unfavourite} disabled={status !== "idle"}>Remove from Favourites</button>}
                {loggedInUser && !isFavourite && !isUserMade && <button className="add" onClick={favourite} disabled={status !== "idle"}>Add to Favourites!</button>}
                {!loggedInUser && <button disabled>Log in to Favourite!</button>}

                <h3>Description: </h3>
                <p>{recipe.description}</p>

                <p>Amount made: {recipe.amountMade}</p>

                <h3>Ingredients:</h3>
                <ul>
                    {recipe.ingredients.map((ingr) => {
                        return <li key={ingr}>{ingr}</li>
                    })}
                </ul>

                <h3>Instructions: </h3>
                <ul>
                    {recipe.instructions.map((instr) => {
                        return <li key={instr}>{instr}</li>
                    })}
                </ul>
            </>
        )
    };

    return (
        <Container className="main">
            {!recipe && <p>Loading recipe...</p>}
            {recipe && Recipe()}
        </Container>
    )
}

export default Recipe;

const Container = styled.div`
    
`;