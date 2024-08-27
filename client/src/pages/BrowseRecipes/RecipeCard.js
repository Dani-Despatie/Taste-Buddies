import styled from "styled-components";
import { useContext } from "react";
import { LoggedInUserContext } from "../../contexts/LoggedInUserContext";

const RecipeCard = (recipe, favouritable) => {
    const {loggedInUser} = useContext(LoggedInUserContext);

    const handleFavourite = (event) => {
        
    };

    return (

        <RecipeContainer key={recipe._id}>
            <h3>{recipe.name}</h3>
            <p>{recipe.description}</p>
            <p>Category: {recipe.type}</p>
            <p>Tags:</p>
            <ul>
                {recipe.tags.map((tag) => {
                    return <li key={tag}>{tag}</li>
                })}
            </ul>

            {loggedInUser && favouritable && <FavButton onClick={handleFavourite}>Add to Favourites!</FavButton>}

        </RecipeContainer>

    )
};

export default RecipeCard;

const RecipeContainer = styled.div`
    border: 2px solid var(--red);
    width: 90%;
    margin: auto;
    margin-top: 15px;
    padding: 0 20px;

    @media (max-width: 600px) {
    }
`;

const FavButton = styled.button`

`;