import styled from "styled-components";
import { LoggedInUserContext } from "../../contexts/LoggedInUserContext";
import { useContext } from "react";


const Main = () => {
    const {loggedInUser} = useContext(LoggedInUserContext);
    
    return (
        <Container className = "main">
            {loggedInUser && <p>Welcome to main page, {loggedInUser.userName}!</p>}
            {!loggedInUser && <p>Welcome to main page!</p>}
        </Container>
    )
}

export default Main;

const Container = styled.div`
  
`;