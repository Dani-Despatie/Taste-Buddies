import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";


const Header = () => {
    return (
        <HeaderContainer>
            <NavLink to="/">I'm a logo</NavLink>
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
`



const Logo = styled.img`
    max-width: 200px;
`;



const Burger = styled.div`
    background-color: var(--red);
    width: fit-content;
    padding: 5px 10px;
    margin: 0px 10px;
    border-radius: 5px;
`;

export default Header;