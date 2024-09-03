import styled from "styled-components";
import { LoggedInUserContext } from "../../contexts/LoggedInUserContext";
import { RecipesContext } from "../../contexts/RecipesContext";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

const CreateRecipe = () => {
    const { loggedInUser, refreshUser } = useContext(LoggedInUserContext);
    const { refreshRecipes } = useContext(RecipesContext);
    const [ingredients, setIngredients] = useState([""]);
    const [instructions, setInstructions] = useState([""]);
    const [tags, setTags] = useState([""]);
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
    };
    const addTag = (event) => {
        event.preventDefault();
        setTags([...tags, ""]);
    }

    // Final submit handler
    const handleSubmit = async (event) => {
        event.preventDefault();
        setStatus("pending");

        if (!loggedInUser) {
            setStatus("Not logged in");
            return;
        }

        const recipe = {
            name: event.target.name.value,
            authorName: loggedInUser.userName,
            type: event.target.type.value,
            description: event.target.description.value,
            amountMade: event.target.amountMade.value,
            ingredients,
            instructions,
            tags
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
    const handleTagChange = (event) => {
        const index = event.target.id.substr(3);

        const newTag = [...tags];
        newTag[index] = event.target.value;
        setTags(newTag);
    }

    return (
        <Container className="main">


            <CreationForm onSubmit={handleSubmit} className='recipe-form'>
                <h2>Create a new recipe</h2>
                <label htmlFor="name">Recipe Name: </label>
                <input id="name" />

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
                <textarea type="text" id="description" />

                <label htmlFor="amountMade">Amount Made /Batch: </label>
                <input type="text" id="amountMade" />

                <label htmlFor="ingr0">Ingredients: </label>
                <ul>
                    {ingredients.map((ingr, index) => {
                        const id = `ingr${index}`;
                        return (
                            <li>
                                <input key={id} id={id} onChange={handleIngrChange} />
                            </li>
                        )
                    })}
                </ul>
                <button type="button" onClick={addIngr}>+ Input</button>

                <label htmlFor="instr0">Instructions: </label>
                <ol>
                {instructions.map((instr, index) => {
                    const id = `instr${index}`;
                    return (
                        <li>
                            <input key={id} id={id} onChange={handleInstrChange} />
                        </li>
                    )
                })}
                </ol>
                <button type="button" onClick={addInstr}>+ Input</button>

                <label htmlFor="tags">Tags: </label>
                <ul>
                {tags.map((tag, index) => {
                    const id = `tag${index}`;
                    return (
                        <li>
                            <input key={id} id={id} onChange={handleTagChange} />
                        </li>
                    )
                })}
                </ul>
                <button type="button" onClick={addTag}>+ Tag</button>

                <button type="submit" disabled={status === "pending" || !loggedInUser} className="submit">Create!</button>

                {status !== "idle" && <p className="status-message">{status}</p>}
            </CreationForm>

        </Container>
    )
};
export default CreateRecipe;

const Container = styled.div`

    #description {
        max-width: 65%;
        height: 6rem;
        font-family: inherit;
        margin-left: 55px;
    }
    #description:hover {
        outline: 1px solid var(--green);
    }
    #description:focus {
        outline: 2px solid var(--green);
    }
    #name {
        margin-left: 55px;
        width: 30%;
    }
    input {
        height: 1.5rem;
        font-size: 1rem;
        width: 75%;
    }
    input:hover {
        outline: 1px solid var(--green);
    }
    input:focus {
        outline: 2px solid var(--green);
    }

    select {
        max-width: 30%;
        height: 2rem;
        font-size: 1rem;
        font-family: inherit;
        margin-left: 55px;
        background-color: var(--button-green);
        border: 1px solid var(--green);
        border-radius: 5px;
        box-shadow: var(--shadow);
    }
    select:focus {
        outline: 2px solid var(--green);
    }

    #amountMade {
        max-width: 30%;
        margin-left: 55px;
    }

    button {
        width: 200px;
        margin-left: 55px;
        font-family: inherit;
        font-size: 1rem;
        background-color: var(--button-green);
        border: 1px solid var(--green);
        border-radius: 5px;
        box-shadow: var(--shadow);
    }
    button:focus {
        outline: 2px solid var(--green);
    }

    .submit {
        margin-top: 20px;
    }

    ul, ol {
        margin: 10px;
    }
    ul {
        list-style-type: circle;
    }
    ol {
        font-size: 0.8em;
    }
    li {
        margin: 5px;
    }

    .status-message {
        color: var(--red);
        width: fit-content;
        padding: 10px;
        border: 2px solid var(--red);
    }

`;

const CreationForm = styled.form`
    display: flex;
    flex-direction: column;
`;