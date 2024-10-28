import styled from "styled-components";
import { useEffect, useContext, useState } from "react";
import { LoggedInUserContext } from "../../contexts/LoggedInUserContext";
import { useNavigate, useParams } from "react-router-dom";
import { RecipesContext } from "../../contexts/RecipesContext";
const rootUrl = "https://taste-buddies.onrender.com";
import axios from 'axios';

const EditRecipe = () => {
    const { id } = useParams();
    const { loggedInUser } = useContext(LoggedInUserContext);
    const { recipes, refreshRecipes } = useContext(RecipesContext);
    const [recipe, setRecipe] = useState(null);
    const [status, setStatus] = useState("start");
    const [headers, setHeaders] = useState(null);
    const [steps, setSteps] = useState(null);
    const [ingredients, setIngredients] = useState(null);
    const [tags, setTags] = useState(null);
    const navigate = useNavigate();

    // Finding the recipe
    useEffect(() => {
        if (recipes) {
            const foundRecipe = recipes.find((rec) => {
                return id === rec._id;
            });
            if (foundRecipe) {
                setRecipe(foundRecipe);
            }
        }
    }, [recipes])
    useEffect(() => {
        if (recipe && status === "start") {
            const newHeaders = [];
            const newSteps = [];
            recipe.instructions.forEach((instr) => {
                newHeaders.push(instr.header);
                newSteps.push(instr.steps);
            });
            setHeaders(newHeaders);
            setSteps(newSteps);
            setIngredients(recipe.ingredients);
            setTags(recipe.tags);
            setStatus("idle");
        }
    }, [recipe])

    // HANDLERS -------------------------------------------

    const addIngr = (event) => {
        event.preventDefault();
        setIngredients([...ingredients, ""]);
    };
    const addHeader = (event) => {
        event.preventDefault();
        if (headers === null) {
            setHeaders(["",""]);
        }
        else if (headers.length < 9) {
            setHeaders([...headers, ""]);
            setSteps([...steps, [""]]);
        }
        else {
            console.log("Too many sections");
        }
    };
    const addStep = (event) => {
        event.preventDefault;
        const index = event.target.id.substr(10);
        const newSteps = [...steps];
        newSteps[index].push("");
        setSteps(newSteps);
    }
    const addTag = (event) => {
        event.preventDefault();
        setTags([...tags, ""]);
    };

    const handleIngrChange = (event) => {
        const index = event.target.id.substr(4);
        const newIngredients = [...ingredients];
        newIngredients[index] = event.target.value;
        setIngredients(newIngredients);
    }
    const handleHeaderChange = (event) => {
        const index = event.target.id.substr(6);

        const newHeaders = [...headers];
        newHeaders[index] = event.target.value;
        setHeaders(newHeaders);
    };
    const handleStepChange = (event) => {
        const stepIndex = event.target.id.substr(5);
        const headerIndex = event.target.id[4];

        const newSteps = [...steps];
        newSteps[headerIndex][stepIndex] = event.target.value;
        setSteps(newSteps);
    }
    const handleTagChange = (event) => {
        const index = event.target.id.substr(3);
        const newTag = [...tags];
        newTag[index] = event.target.value;
        setTags(newTag);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setStatus("pending");

        if (!loggedInUser) {
            setStatus("Not logged in");
            return;
        }

        const instructions = [];
        for (let n=0; n<headers.length; n++) {
            instructions.push({header: headers[n], steps: steps[n]});
        }

        const newRecipe = {
            _id: recipe._id,
            name: recipe.name,
            type: event.target.type.value,
            description: event.target.description.value,
            amountMade: event.target.amountMade.value,
            ingredients,
            instructions,
            tags,
        }

        // sending to back end
        try {
            const res = await axios.patch(`${rootUrl}/editRecipe`, newRecipe);

            if (res.status === 200) {
                setStatus("idle");
                refreshRecipes();
                navigate("/my-recipes");
            }
            else {
                setStatus(result.message);
            }
        } catch (err) {
            if (err.status === 400) {
                setStatus("No change was made to the recipe");
            }
            else if (err.status === 404) {
                setStatus("Error: Recipe could not be found");
            }
            else {
                setStatus(err.message);
            }
        }
    }

    // FORM COMPONENT -------------------------------------
    const editForm = () => {

        return (
            <Form onSubmit={handleSubmit} className="recipe-form">
                <h2>{recipe.name}</h2>

                <label htmlFor="type">Type of Food: </label>
                <select name="type" id="type" defaultValue={recipe.type}>
                    <option value="Main Dish">Main Dish</option>
                    <option value="Apetizer">Apetizer</option>
                    <option value="Soup">Soup</option>
                    <option value="Sauce">Sauce</option>
                    <option value="Finger Food">Finger Food</option>
                    <option value="Dessert">Dessert</option>

                    <option value="Misc">Misc</option>
                </select>

                <label htmlFor="description">Description: </label>
                <textarea id="description" defaultValue={recipe.description} />

                <label htmlFor="amountMade">Amount Made/Batch: </label>
                <input id="amountMade" defaultValue={recipe.amountMade} />

                <label htmlFor="ingr0">Ingredients: </label>
                <ul>
                    {ingredients.map((ingr, index) => {
                        const id = `ingr${index}`;
                        return <li key={id}><input key={id} id={id} defaultValue={ingr} onChange={handleIngrChange} /> </li>
                    })}
                </ul>
                <button onClick={addIngr}>+ Input</button>

                <label htmlFor="header0">Instructions: </label>
                <div>
                    {headers.map((header, index) => {
                        const id = `header${index}`;
                        return <ol key={id}>
                            <input key={id} className="header" id={id} hidden={headers.length === 1} defaultValue = {header} placeholder="Section Name (optional)" onChange={handleHeaderChange}/>
                            {steps[index].map((step, stepIndex) => {
                                const stepId = `step${index}${stepIndex}`;
                                return <li className="steps" key={stepId}>
                                    <input key={stepId} id={stepId} defaultValue={step} onChange={handleStepChange}/>
                                </li>
                            })}
                            <button type="button" onClick={addStep} id={`stepButton${index}`} key={index}>+ Step</button>
                            <br/>
                        </ol>
                    })}
                </div>
                <button onClick={addHeader}>+ Input</button>

                <label htmlFor="tags">Tags: </label>
                <ul>
                    {tags.map((tag, index) => {
                        const id = `tag${index}`;
                        return <li key={id}><input key={id} id={id} defaultValue={tag} onChange={handleTagChange} /></li>
                    })}
                </ul>
                <button onClick={addTag}>+ Tag</button>

                <button type="submit" disabled={status === "pending" || !loggedInUser}>Save Changes!</button>

                {status !== "idle" && status !== "pending" && status !== "start" && <p>{status}</p>}
            </Form>
        )
    }

    return (
        <Container className="main">
            {ingredients && headers && editForm()}
        </Container>
    )

}

export default EditRecipe;

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
    input {
        height: 1.5rem;
        font-size: 1rem;
        width: 75%;
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

const Form = styled.form`
    display: flex;
    flex-direction: column;
`;