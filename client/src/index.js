import ReactDOM from "react-dom/client";
import App from "./App";

// Contexts
import LoggedInUserProvider from "./contexts/LoggedInUserContext";
import RecipesProvider from "./contexts/RecipesContext";


ReactDOM.createRoot(document.getElementById("root")).render(

    <RecipesProvider>
        <LoggedInUserProvider>
            <App />
        </LoggedInUserProvider>
    </RecipesProvider>

);