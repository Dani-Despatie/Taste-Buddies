import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";


const Header = () => {
    return (
        <HeaderContainer>
            <NavLink to="/">
                <Logo src='https://res.cloudinary.com/dfszibmt6/image/upload/v1725377869/mx55bradgm9zz1wg8fqc.png' alt="Logo"/>
            </NavLink>
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

    NavLink

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