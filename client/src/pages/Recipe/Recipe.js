import styled from "styled-components";
import { useEffect, useContext, useState } from "react";
import { LoggedInUserContext } from "../../contexts/LoggedInUserContext";
import { RecipesContext } from "../../contexts/RecipesContext";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const Recipe = () => {
    const { id } = useParams();
    const { loggedInUser, addFavourite, removeFavourite } = useContext(LoggedInUserContext);
    const { recipes } = useContext(RecipesContext);
    const [recipe, setRecipe] = useState(null);
    const [isFavourite, setIsFavourite] = useState(false);
    const [isUserMade, setIsUserMade] = useState(false);
    const [status, setStatus] = useState("idle");
    const navigate = useNavigate();

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
    }, [recipe]);

    // Determining if the recipe was made by the user (can't favourite/unfavourite the recipe)
    useEffect(() => {
        if (loggedInUser && recipe) {
            const isUsers = loggedInUser.recipes.includes(recipe._id);
            setIsUserMade(isUsers);
        }
    }, [recipe]);

    // HANDLER FUNCTIONS --------------------------
    // Favourite handler
    const favourite = async () => {
        setStatus("pending");
        setIsFavourite(true);
        await addFavourite(recipe._id);
        setStatus("idle");
    }

    // Unfavourite handler
    const unfavourite = async () => {
        setStatus("pending");
        setIsFavourite(false);
        await removeFavourite(recipe._id);
        setStatus("idle");
    }

    const toggleEdit = () => {
        navigate(`/edit-recipe/${id}`);
    }


    // Recipe page component ------------------------
    const recipeMenu = () => {
        return (
            <>
                <div className="intro">
                    <div className="title">
                        <h2>{recipe.name}</h2>
                        <p>Made by {recipe.authorName}</p>

                        {isFavourite && <button className="remove" onClick={unfavourite} disabled={status !== "idle"}>Remove from Favourites</button>}
                        {loggedInUser && !isFavourite && !isUserMade && <button className="add" onClick={favourite} disabled={status !== "idle"}>Add to Favourites!</button>}
                        {!loggedInUser && <button disabled className="add">Log in to Favourite!</button>}
                        {loggedInUser && isUserMade && <button className="edit" onClick={toggleEdit} disabled={status !== "idle"}>Edit Recipe</button>}

                    </div>
                    <img src={recipe.src} alt={recipe.name} />
                </div>

                <div className="recipe-content">
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
                    <ol>
                        {recipe.instructions.map((instr) => {
                            return <li key={instr}>{instr}</li>
                        })}
                    </ol>

                    <h3>Tags: </h3>
                    <ul>
                        {recipe.tags.map((tag) => {
                            return <li key={tag}>{tag}</li>
                        })}
                    </ul>
                </div>
            </>
        )
    };


    return (
        <Container className="main">
            {!recipe && <p>Loading recipe...</p>}
            {recipe && recipeMenu()}
        </Container>
    )
}

export default Recipe;

const Container = styled.div`
    .intro {
        display: flex;
        max-width: 900px;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 20px;
    }
    .recipe-content {
        border-top: 2px solid var(--green);
    }

    img {
        max-width: 250px;
        border-radius: 10px;
        box-shadow: var(--shadow);
    }

    ul {
        list-style-type: circle;
    }
    
    @media (max-width: 600px) {
        .intro {
            flex-direction: column;
            text-align: center;
        }
    }
`;