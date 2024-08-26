import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { LoggedInUserContext } from "./contexts/LoggedInUserContext";
import { useContext } from "react";

const SideBar = () => {
    const {loggedInUser, login, logout} = useContext(LoggedInUserContext);

    return (

        <Container>

            {!loggedInUser && <NavButton to="/sign-up">Sign Up</NavButton>}
            {!loggedInUser && <NavButton to="/sign-in">Sign In</NavButton>}

            {loggedInUser && <NavButton to="/" onClick={logout}>Log Out</NavButton>}
            <NavButton to="/browse">Browse Recipes</NavButton>

        </Container>

    )

};

const Container = styled.div`
    background-color: var(--dark-background);
    display: flex;
    position: fixed;
    right: 5px;
    top: var(--header-height);
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: calc(100% - var(--header-height) + 5px);

    @media (max-width: 600px) {
        flex-direction: row;
        width: 100%;
        height: fit-content;
        top: var(--header-height);
        right: 0px;
        border-bottom: 5px solid var(--green);
    }
`;

const NavButton = styled(NavLink)`
    border: none;
    background-color: inherit;
    color: var(--light-background);
    border-radius: 5px;
    margin: 10px 10px;
    padding: 0 10px;
    font-size: 1rem;
    font-weight:bold;
    cursor: pointer;

    &:hover {
        scale: 1.02;
    }
`;


export default SideBar;