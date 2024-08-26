import styled from "styled-components";
import { LoggedInUserContext } from "../../contexts/LoggedInUserContext";
import { useContext } from "react";


const Main = () => {
    const {loggedInUser} = useContext(LoggedInUserContext);
    
    return (
        <Container>
            {loggedInUser && <p>Welcome, {loggedInUser.userName}!</p>}
            {!loggedInUser && <p>Welcome!</p>}
        </Container>
    )
}

export default Main;

const Container = styled.div`
    position: relative;
    top: calc(var(--header-height) + 5px);
`;