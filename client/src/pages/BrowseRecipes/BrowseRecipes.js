import styled from "styled-components";
import { LoggedInUserContext } from "../../contexts/LoggedInUserContext";
import { useContext } from "react";

const BrowseRecipes = () => {
    const loggedInUser = useContext(LoggedInUserContext);

    return (
        <Container>
            <p>Wowie big browse</p>

        </Container>
    )
}

const Container = styled.div`
    position: relative;
    top: calc(var(--header-height) + 5px);
`;

export default BrowseRecipes;