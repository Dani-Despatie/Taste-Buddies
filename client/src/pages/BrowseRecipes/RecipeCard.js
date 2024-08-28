import styled from "styled-components";

import { NavLink } from "react-router-dom";

const RecipeCard = (recipe) => {
    const link = `/recipe/${recipe._id}`;

    return (

        <RecipeContainer key={recipe._id}>
            <CardNav to={link}>
                <h3>{recipe.name}</h3>
                <p>{recipe.description}</p>
                <p>Category: {recipe.type}</p>
            </CardNav>
        </RecipeContainer>

    )
};

export default RecipeCard;

const RecipeContainer = styled.div`
    border: 2px solid var(--red);
    width: 70%;
    margin: auto;
    margin-top: 15px;
    padding: 0 20px;
    text-align: left;

    @media (max-width: 600px) {
    }
`;

const CardNav = styled(NavLink)`
    color: black;

`;