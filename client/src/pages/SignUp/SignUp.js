import styled from "styled-components";
import {useContext} from "react";
import { LoggedInUserContext } from "../../contexts/LoggedInUserContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const SignUp = () => {

    const [status, setStatus] = useState("idle");
    const { loggedInUser, login } = useContext(LoggedInUserContext);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setStatus("pending");

        const myHeaders = new Headers();
        myHeaders.append("Content-type", "application/json");

        const email = event.target.email.value;
        const userName = event.target.name.value;
        const password = event.target.password.value;

        console.log("Info received");

        try {
            const res = await fetch("/newUser", {
                method: "POST",
                body: JSON.stringify({ userName, email, password }),
                headers: myHeaders
            });
            const result = await res.json();
            console.log("Status = ", res.status);

            if (res.status === 201) {
                setStatus("idle");
                await login(event.target.email.value, event.target.password.value);
                navigate("/");
            }
            else {
                setStatus(result.message);
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Container className="main">


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

`;