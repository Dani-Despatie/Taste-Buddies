import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { LoggedInUserContext } from "./contexts/LoggedInUserContext";


const Header = () => {
    const { loggedInUser } = useContext(LoggedInUserContext);

    return (
        <HeaderContainer>
            <NavLink to="/">
                <Logo src='https://res.cloudinary.com/dfszibmt6/image/upload/v1725377869/mx55bradgm9zz1wg8fqc.png' alt="Logo" />
            </NavLink>
            {loggedInUser && <p className="user-name">Logged in as {loggedInUser.userName}</p>}
        </HeaderContainer>
    )
}

const HeaderContainer = styled.div`
    background-color: var(--dark-background);
    width: 100%;
    height: calc(var(--header-height) - 5px);
    left: 0px;
    top: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    color: var(--light-background);
    border-bottom: 5px solid var(--green);
    z-index: 2;

    .user-name {
        position: absolute;
        right: 30px;
    }

    @media (max-width: 600px) {
        .user-name {
            visibility: hidden;
        }
    }
`



const Logo = styled.img`
    margin-right: 150px;
    max-width: 100%;
    transition: scale 0.2s;

    &:hover {
        scale: 1.02;
    }
`;

export default Header;