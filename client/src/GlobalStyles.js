import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
    :root {
        --dark-background: #1A1C1A;
        --light-background: #DCE0D9;
        --green: #697A21;
        --red: #991B29;

        --header-height: 60px;
    }

    body {
        background-color: var(--light-background);
        font-size: 1.3rem;
    }

    a {
        text-decoration: none;
    }

`

export default GlobalStyles;