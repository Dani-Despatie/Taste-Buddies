import styled from "styled-components";
import { LoggedInUserContext } from "../../contexts/LoggedInUserContext";
import { RecipesContext } from "../../contexts/RecipesContext";
import { useContext, useEffect, useState } from "react";
import RecipeCard from "../BrowseRecipes/RecipeCard";


const Main = () => {
    const { loggedInUser } = useContext(LoggedInUserContext);
    const { recipes } = useContext(RecipesContext);
    const [recRecipes, setRecRecipes] = useState(null);

    useEffect(() => {
        if (recipes) {
            const length = recipes.length;

            // This will select random indexes as recommended recipes
            let a = Math.floor(Math.random()*length);
            let b = Math.floor(Math.random()*length);
            // Trying again if indexes are the same
            while (a === b) {
                b = Math.floor(Math.random()*length);
            }

            // Finding and setting the recommended recipes
            setRecRecipes([recipes[a], recipes[b]]);
        }
    }, [recipes]);


    return (
        <Container className="main">
            <div className="intro">
                <img src='https://res.cloudinary.com/dfszibmt6/image/upload/v1725377665/wia2jykrpfy5s5enjren.png' alt="Pepper" />
                <div className="about">
                    <h2>Welcome to Taste Buddies!</h2>
                    <p>Where we're committed to a simple and readable experience in learning and sharing new recipes.</p>
                </div>
            </div>
            <p>Don't know where to start?</p>
            <h2>Recommended Recipes:</h2>
            <div className="recommendeds">
                {recRecipes && RecipeCard(recRecipes[0])}
                {recRecipes && RecipeCard(recRecipes[1])}
            </div>

        </Container>
    )
}

export default Main;

const Container = styled.div`
    img {
        max-width: 400px;
    }

    .intro {
        display: flex;
        align-items: center;
    }
    .about {
        text-align: center;
    }

    .recommendeds {
        display: inline-block;
    }
    
    @media (max-width: 1030px) {
        flex-direction: column;

        .intro {
            flex-direction: column;
        }
    }
`;
