import {getPantry} from "@/modules/Data";

const base_url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

const authHeader = (authToken) => ({'Authorization': 'Bearer ' + authToken})
const fullUrl = (relativePath) => `${base_url}${relativePath}`

/**
 * Convert the user's pantry object into a list of ingredients
 * which can be processed by the wizard.
 * @param pantry User's pantry yup
 *
 * TODO: This should be made server-authoritative. Currently the wizard backend endpoint just takes a list of ingredients,
 * but it should really grab this from the user's data directly on request to prevent the endpoint from being a
 * general-purpose API, since you should only be able to request within the context of the application.
 */
function pantryToIngredients(pantry) {
    return pantry.map((item) => {
        const name = item.name
        const quantity = item.quantity
        return `${quantity} ${name}`
    })
}

export async function getCategories(authToken) {
    const pantry = await getPantry(authToken)
    const ingredients = pantryToIngredients(pantry)
    console.log("User's ingredients are ", ingredients)
    const response = await fetch(fullUrl("/wizard/categories?") + new URLSearchParams({
        ingredients: ingredients
    }), {
        'headers': {'Authorization': 'Bearer ' + authToken}
    })
    const json = await response.json()
    console.log("Response is ", json)
    return json
}

export async function getRecipes(authToken, recipePrompt) {
    const pantry = await getPantry(authToken)
    const ingredients = pantryToIngredients(pantry)
    console.log("User's ingredients are ", ingredients)
    const response = await fetch(fullUrl("/wizard/recipe?") + new URLSearchParams({
        ingredients: ingredients,
        recipe: recipePrompt
    }), {
        'headers': {'Authorization': 'Bearer ' + authToken}
    })
    const json = await response.json()
    console.log("Response is ", json)
    return json
}