const base_url= process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function getPantry(authToken) {
    const result = await fetch(base_url+"/pantry",{
        'method':'GET',
        'headers': {'Authorization': 'Bearer ' + authToken}
    })
    return await result.json();
}

export async function getPantryById(authToken, id) {
    const result = await fetch(base_url+"/pantry/"+id,{
        'method':'GET',
        'headers': {'Authorization': 'Bearer ' + authToken}
    })
    if(result.status == 403){
        return 403;
    }
    return await result.json();
}

export async function addPantry(authToken, values) {
    const result = await fetch(base_url+"/pantry",{
        'method':'POST',
        'headers': {'Authorization': 'Bearer ' + authToken,
        'Content-Type': 'application/json'},
        'body': JSON.stringify(values)
    })
    return await result.json();
}

export async function updatePantry(authToken, pantry){
    const result = await fetch(base_url+"/pantry/"+pantry._id,{
        'method':'PUT',
        'headers': {'Authorization': 'Bearer ' + authToken,
        'Content-Type': 'application/json'},
        'body': JSON.stringify(pantry)
    })
    return await result.json();
}

export async function deletePantry(authToken, pantry){
    const result = await fetch(base_url+"/pantry/"+pantry._id,{
        'method':'DELETE',
        'headers': {'Authorization': 'Bearer ' + authToken},
    })
    return await result.json();
}

export async function getRecipeBook(authToken) {
    const result = await fetch(base_url+"/recipeBook",{
        'method':'GET',
        'headers': {'Authorization': 'Bearer ' + authToken}
    })
    return await result.json();
}

export async function getRecipeById(authToken, id) {
    const result = await fetch(base_url+"/recipeBook/"+id,{
        'method':'GET',
        'headers': {'Authorization': 'Bearer ' + authToken}
    })
    if(result.status == 403){
        return 403;
    }
    return await result.json();
}

export async function addRecipeToBook(authToken, recipe) {
    const result = await fetch(base_url+"/recipeBook",{
        'method':'POST',
        'headers': {'Authorization': 'Bearer ' + authToken,
        'Content-Type': 'application/json'},
        'body': JSON.stringify(recipe)
    })
    return await result.json();
}

export async function updateRecipeBook(authToken, recipe){
    const result = await fetch(base_url+"/recipeBook/"+recipe._id,{
        'method':'PUT',
        'headers': {'Authorization': 'Bearer ' + authToken,
        'Content-Type': 'application/json'},
        'body': JSON.stringify(recipe)
    })
    return await result.json();
}

export async function deleteRecipe(authToken, recipe){
    const result = await fetch(base_url+"/recipeBook/"+recipe._id,{
        'method':'DELETE',
        'headers': {'Authorization': 'Bearer ' + authToken},
    })
    return await result.json();
}
