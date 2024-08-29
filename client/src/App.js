import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import GlobalStyles from "./GlobalStyles";

// Component Imports
import Header from "./Header";
import SideBar from "./SideBar"
// import Footer from "./Footer";
// // Page Imports
import Main from "./pages/Main/Main";
import BrowseRecipes from "./pages/BrowseRecipes/BrowseRecipes";
import Recipe from "./pages/Recipe/Recipe";
import EditRecipe from "./pages/EditRecipe/EditRecipe";
import MyRecipes from "./pages/MyRecipes/MyRecipes";
import Favourites from "./pages/Favourites/Favourites";
import CreateRecipe from "./pages/CreateRecipe/CreateRecipe";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";

const App = () => {

    return (
        <Router>
            <GlobalStyles />
            <Header />
            <SideBar />

            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/browse" element={<BrowseRecipes />} />
                <Route path="/recipe/:id" element={<Recipe />} />
                <Route path="/edit-recipe/:id" element={<EditRecipe/>} />
                <Route path="/my-recipes" element={<MyRecipes />} />
                <Route path="/favourites" element={<Favourites />} />
                <Route path="/create-recipe" element={<CreateRecipe />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
            </Routes>

            {/* <Footer/> */}
        </Router>
    );
};

export default App;