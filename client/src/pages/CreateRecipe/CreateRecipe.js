import styled from "styled-components";
import { LoggedInUserContext } from "../../contexts/LoggedInUserContext";
import { RecipesContext } from "../../contexts/RecipesContext";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

const CreateRecipe = () => {
    const {loggedInUser, refreshUser} = useContext(LoggedInUserContext);
    const { refreshRecipes } = useContext(RecipesContext);
    const [ingredients, setIngredients] = useState([""]);
    const [instructions, setInstructions] = useState([""]);
    const [status, setStatus] = useState("idle");
    const navigate = useNavigate();

    // Handler functions for adding inputs for ingredients and instructions
    const addIngr = (event) => {
        event.preventDefault();
        setIngredients([...ingredients, ""]);
    };
    const addInstr = (event) => {
        event.preventDefault();
        setInstructions([...instructions, ""]);
    }

    // Final submit handler
    const handleSubmit = async (event) => {
        event.preventDefault();
        setStatus("pending");

        if (!loggedInUser) {
            setStatus("Not logged in");
        }

        const recipe = {
            name: event.target.name.value,
            authorName: loggedInUser.userName,
            type: event.target.type.value,
            description: event.target.description.value,
            amountMade: event.target.amountMade.value,
            ingredients,
            instructions,
            tags: []
        }

        // Sending to backend
        const myHeaders = new Headers();
        myHeaders.append("Content-type", "application/json");
        try {
            const res = await fetch("/recipe", {
                method: "POST",
                body: JSON.stringify(recipe),
                headers: myHeaders
            })
            const result = await res.json();

            if (res.status === 201) {
                setStatus("idle");
                refreshUser();
                refreshRecipes();
                navigate("/my-recipes");
            }
            else {
                setStatus(result.message);
            }
        } catch (err) {
            console.log(err);
        }
    };

    // Handlers for ingredient or instruction content changing (updates the arrays)
    const handleIngrChange = (event) => {
        // Getting the index of the input which triggered the event
        const index = event.target.id.substr(4);
        // Replacing the ingredient changed
        const newIngredients = [...ingredients];
        newIngredients[index] = event.target.value;
        setIngredients(newIngredients);
    };
    const handleInstrChange = (event) => {
        const index = event.target.id.substr(5);

        const newInstructions = [...instructions];
        newInstructions[index] = event.target.value;
        setInstructions(newInstructions);
    };

    return (
        <Container className="main">
            
            <h2>Create a new recipe</h2>
            <CreationForm onSubmit={handleSubmit}>
                <label htmlFor="name">Recipe Name: </label>
                <input id="name"/>

                <label htmlFor="type">Type of Food: </label>
                <select name="type" id="type">
                    <option value="Main Dish">Main Dish</option>
                    <option value="Apetizer">Apetizer</option>
                    <option value="Soup">Soup</option>
                    <option value="Sauce">Sauce</option>
                    <option value="Finger Food">Finger Food</option>
                    <option value="Dessert">Dessert</option>

                    <option value="Misc">Misc</option>
                </select>

                <label htmlFor="description">Description: </label>
                <input type="text" id="description" />

                <label htmlFor="amountMade">Amount Made /Batch: </label>
                <input type="text" id="amountMade"/>

                <label htmlFor="ingr0">Ingredients: </label>
                {ingredients.map((ingr, index) => {
                    const id = `ingr${index}`;
                    return <input key={id} id={id} placeholder={id} onChange={handleIngrChange} />
                })}
                <button type="button" onClick={addIngr}>+ Input</button>
                
                <label htmlFor="instr0">Instructions: </label>
                {instructions.map((instr, index) => {
                    const id = `instr${index}`;
                    return <input key={id} id={id} placeholder={id} onChange={handleInstrChange} />
                })}
                <button type="button" onClick={addInstr}>+ Input</button>

                <label htmlFor="tags">Tags: </label>
                
                
                <button type="submit" disabled={status==="pending" || !loggedInUser}>Create!</button>

                {status !== "idle" && <p>{status}</p>}
            </CreationForm>

        </Container>
    )
};
export default CreateRecipe;

const Container = styled.div`
    
`;

const CreationForm = styled.form`
    display: flex;
    flex-direction: column;
`;