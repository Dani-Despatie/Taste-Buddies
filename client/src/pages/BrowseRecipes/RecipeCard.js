import styled from "styled-components";

import { NavLink } from "react-router-dom";

const RecipeCard = (recipe) => {
    const link = `/recipe/${recipe._id}`;

    return (

        <RecipeContainer key={recipe._id} className="recipe-card">
            <CardNav to={link}>
                <img src={recipe.src} alt={recipe.name}/>
                <div className="text">
                    <h3>{recipe.name}</h3>
                    <p>{recipe.description}</p>
                    <p>Category: {recipe.type}</p>
                </div>
            </CardNav>
        </RecipeContainer>

    )
};

export default RecipeCard;

const RecipeContainer = styled.div`
    border: 2px solid var(--green);
    width: 70%;
    margin: auto;
    margin-top: 15px;
    padding: 0 20px;
    text-align: left;
    box-shadow: var(--shadow);

    @media (max-width: 600px) {
        width: auto;
    }
`;

const CardNav = styled(NavLink)`
    color: black;
    display: flex;
    align-items: center;

    img {
        width: 200px;
        height: 200px;
        margin: 5px 10px
    }

    @media (max-width: 800px) {
        flex-direction: column;
    }

`;