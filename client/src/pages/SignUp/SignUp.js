import styled from "styled-components";
import {useContext} from "react";
import { LoggedInUserContext } from "../../contexts/LoggedInUserContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
const rootUrl = "https://taste-buddies.onrender.com";


const SignUp = () => {

    const [status, setStatus] = useState("idle");
    const { loggedInUser, login } = useContext(LoggedInUserContext);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setStatus("pending");

        const email = event.target.email.value;
        const userName = event.target.name.value;
        const password = event.target.password.value;

        try {
            const res = await axios.post(`${rootUrl}/newUser`, {userName, email, password});

            if (res.status === 201) {
                setStatus("idle");
                await login(email, password);
                navigate("/");
            }
            else {
                setStatus(res.status);
            }
        } catch (err) {
            if (err.status === 404) {
                setStatus("Error: database of users not found.");
            }
            else if (err.status === 400) {
                setStatus(`User with email ${email} already exists`);
            }
        }
    }

    return (
        <Container className="main">
            <h2>Sign Up!</h2>

            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name: </label>
                <input type="text" id="name" required/>

                <label htmlFor="email">Email: </label>
                <input type="email" id="email" required/>

                <label htmlFor="password">Password: </label>
                <input type="password" id="password" required />

                <button type="submit" disabled={status === "pending" || loggedInUser} >Create Account!</button>
            </form>

            {status !== "idle" && status !== "pending" && <p>{status}</p>}

        </Container>
    )
};

export default SignUp;

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
        margin: 20px;
        font-family: inherit;
        font-size: 1rem;
    }
    button:hover {
        scale: 1.03;
    }
`;