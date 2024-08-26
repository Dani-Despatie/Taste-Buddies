import styled from "styled-components";
import { useContext } from "react";
import { LoggedInUserContext } from "../../contexts/LoggedInUserContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
    const {loggedInUser, login} = useContext(LoggedInUserContext);
    const [status, setStatus] = useState("idle");
    const navigate = useNavigate();

    const submitHandler = async (event) => {
        event.preventDefault();
        setStatus("processing");
        const result = await login(event.target.email.value, event.target.password.value);
        if (result === 200) {
            setStatus("idle");
            navigate("/");
        }
        else if (result === 401) {
            setStatus("Bad password");
        }
        else if (result === 404) {
            setStatus("User not found");
        }
        else {
            setStatus("Unexpected error");
        }
    };

    return(

        <Container>
            <form onSubmit={submitHandler}>
                
                <label htmlFor="email">Email: </label>
                <input type="email" id="email"/>

                <label htmlFor="password">Password: </label>
                <input type="password" id="password" />

                <button type="submit" disabled={status === "processing"}>Log In</button>

            </form>

            {loggedInUser && <p>Welcome, {loggedInUser.userName}!</p>}
            {status === "Bad password" && <p>Password incorrect</p>}
            {status === "User not found" && <p>Account not found</p>}
            {status === "Unexpected error" && <p>Oops! Something went wrong on our end</p>}

        </Container>

    )

}

const Container = styled.div`
    position: relative;
    top: calc(var(--header-height) + 5px);
`;

export default SignIn;