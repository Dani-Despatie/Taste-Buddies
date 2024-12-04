import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {useState} from "react";
import axios from 'axios';

const rootUrl = "https://taste-buddies.onrender.com";


const ForgotPassword = () => {

    const [status, setStatus] = useState("start");
    const [email, setEmail] = useState("");

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }
    const handleEmailSubmit = async (event) => {
        event.preventDefault();
        setStatus("processing");

        // Sending to backend (to get email code)
        try {
            const res = await axios.patch(`${rootUrl}/forgotPassword`, email);

            if (res.status === 201) {
                setStatus("change password");
            }
            else {
                setStatus(res.message);
                console.log(res);
            }
        } catch (err) {
            setStatus(err.message);
        }
    }

    return (
        <Container className="main">
            
            {status=="start" && <form onSubmit={handleEmailSubmit}>
                <h2>Forgot Password</h2>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" onChange={handleEmailChange} disabled={status != "start"} />
                <button type="submit">Submit</button>
            </form>}

            <p>{status}</p>
        </Container>
    )
};

const Container = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    
    form {
        display: flex;
        align-items: center;
        flex-direction: column;

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

`

export default ForgotPassword;