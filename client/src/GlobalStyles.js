import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
    :root {
        --dark-background: #1A1C1A;
        --light-background: #DCE0D9;
        --green: #697A21;
        --red: #991B29;

        --header-height: 60px;
    }

    #root {
        min-width: 100vw;
        min-height: 100vh;
    }

    body {
        background-color: var(--light-background);
        font-size: 1.3rem;
        margin: 0px;
    }

    .main {
        position: relative;
        top: calc(var(--header-height) + 5px);
        padding: 10px;

        @media (max-width: 600px) {
            top: calc(var(--header-height) + 55px);
        }
    }

    a {
        text-decoration: none;
    }

    

`

export default GlobalStyles;