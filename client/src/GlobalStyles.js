import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
    :root {
        --dark-background: #1A1C1A;
        --light-background: #EBEFE8;
        --button-green: #DEE5D8;
        --green: #697A21;
        --red: #991B29;

        --shadow: 2px 2px 4px #909090;

        --header-height: 90px;
    }

    #root {
        min-width: 100%;
        min-height: 100vh;
    }

    body {
        font-family: "Nunito", sans-serif;
        background-color: var(--light-background);
        font-size: 1.3rem;
        margin: 0px;
    }

    .main {
        position: relative;
        top: calc(var(--header-height) + 5px);
        padding: 10px 30px;
        width: calc(75% - 40px);
        margin-left: calc(10% - 50px);
        padding-bottom: 40px;

        @media (max-width: 600px) {
            top: calc(var(--header-height) + 55px);
            width: auto;
        }
    }
    
    .intro button {
        transition: scale 0.05s;
    }
    .intro button:hover {
        scale: 1.03;
    }

    .recipe-card {
        transition: scale 0.05s;
    }
    .recipe-card:hover {
        scale: 1.01;
    }

    .add, .remove, .edit {
        padding: 10px;
        border: none;
        border-radius: 5px;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        box-shadow: var(--shadow);
    }
    .add {
        background-color: #64E589;
    }
    .remove {
        background-color: #FF835E;
    }
    .edit {
        background-color: #F9FFAD;
    }

    a {
        text-decoration: none;
    }

    input:hover {
        outline: 1px solid var(--green);
    }    
    input:focus {
        outline: 2px solid var(--green);
    }
    

`

export default GlobalStyles;