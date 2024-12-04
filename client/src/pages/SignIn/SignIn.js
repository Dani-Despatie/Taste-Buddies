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

    const forgotPasswordHandler = (event) => {
        event.preventDefault;
        navigate("/forgotPassword");
    }

    return(

        <Container className="main">
            <h2>Sign In!</h2>

            <form onSubmit={submitHandler}>
                
                <label htmlFor="email">Email: </label>
                <input type="email" id="email"/>

                <label htmlFor="password">Password: </label>
                <input type="password" id="password" />

                <div className="buttonContainer"> 
                    <button type="submit" disabled={status === "processing"}>Log In</button>
                    <button type="button" onClick={forgotPasswordHandler} >Forgot Password</button>
                </div>

            </form>

            {loggedInUser && <p>Welcome, {loggedInUser.userName}!</p>}
            {status === "Bad password" && <p>Password incorrect</p>}
            {status === "User not found" && <p>Account not found</p>}
            {status === "Unexpected error" && <p>Oops! Something went wrong on our end</p>}

        </Container>

    )

}

const Container = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
        
    form {
        display: flex;
        flex-direction: column;
        align-items: center;

        border: 2px solid var(--green);
        width: 80%;
        max-width: 800px;
    }

    input {
        font-family: inherit;
        font-size: 1rem;
        width: 40%;
        text-align: center;
        padding: 3px;
    }
    button {
        width: fit-content;
        background-color: var(--button-green);
        border: 2px solid var(--green);
        border-radius: 5px;
        padding: 3px 15px;
        margin: 10px;
        font-family: inherit;
        font-size: 1rem;
    }
    button:hover {
        scale: 1.03;
    }

    .buttonContainer {
        margin: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
`;

export default SignIn;