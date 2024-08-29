import styled from "styled-components";
import { useEffect, useContext, useState } from "react";
import { LoggedInUserContext } from "../../contexts/LoggedInUserContext";
import { useNavigate, useParams } from "react-router-dom";
import { RecipesContext } from "../../contexts/RecipesContext";
import { Navigate } from "react-router-dom";

const EditRecipe = () => {
    const { id } = useParams();
    const {loggedInUser} = useContext(LoggedInUserContext);
    const {recipes, refreshRecipes} = useContext(RecipesContext);
    const [recipe, setRecipe] = useState(null);
    const [status, setStatus] = useState("start");
    const [instructions, setInstructions] = useState(null);
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
            setInstructions(recipe.instructions);
            setIngredients(recipe.ingredients);
            setTags(recipe.tags);
            setStatus("idle");
        }
    },[recipe])

    // HANDLERS -------------------------------------------

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
    };

    const handleIngrChange = (event) => {
        const index = event.target.id.substr(4);
        const newIngredients = [...instructions];
        newIngredients[index] = event.target.value;
        setIngredients(newIngredients);
    }
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setStatus("pending");

        if (!loggedInUser) {
            setStatus("Not logged in");
            return;
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
        const myHeaders = new Headers();
        myHeaders.append("Content-type", "application/json");
        try {
            const res = await fetch("/editRecipe", {
                method: "PATCH",
                body: JSON.stringify(newRecipe),
                headers: myHeaders
            })
            const result = await res.json();

            if (res.status === 200) {
                setStatus("idle");
                refreshRecipes();
                navigate("/my-recipes");
            }
            else {
                setStatus(result.message);
            }
        } catch (err) {
            console.log(err);
        }
    }

    // FORM COMPONENT -------------------------------------
    const editForm = () => {

        return (
            <Form onSubmit={handleSubmit}>
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
                <input id="description" defaultValue={recipe.description}/>

                <label htmlFor="amountMade">Amount Made/Batch: </label>
                <input id="amountMade" defaultValue={recipe.amountMade}/>

                <label htmlFor="ingr0">Ingredients: </label>
                {ingredients.map((ingr, index) => {
                    const id = `ingr${index}`;
                    return <input key={id} id={id} defaultValue={ingr} onChange={handleIngrChange} />
                })}
                <button onClick={addIngr}>+ Input</button>

                <label htmlFor="instr0">Instructions: </label>
                {instructions.map((instr, index) => {
                    const id = `instr${index}`;
                    return <input key={id} id={id} defaultValue={instr} onChange={handleInstrChange} />
                })}
                <button onClick={addInstr}>+ Input</button>

                <label htmlFor="tags">Tags: </label>
                {tags.map((tag, index) => {
                    const id = `tag${index}`;
                    return <input key={id} id={id} defaultValue={tag} onChange={handleTagChange} />
                })}
                <button onClick={addTag}>+ Tag</button>

                <button type="submit" disabled={status==="pending" || !loggedInUser}>Save Changes!</button>

                {status !== "idle" && status !== "pending" && status !== "start" && <p>{status}</p>}
            </Form>
        )
    }

    return (
        <Container className="main">
            {ingredients && instructions && editForm()}
        </Container>
    )

}

export default EditRecipe;

const Container = styled.div`

`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
`;