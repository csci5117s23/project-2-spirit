const base_url= process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function addPantry(authToken, values) {
    const result = await fetch(base_url+"/pantry",{
        'method':'POST',
        'headers': {'Authorization': 'Bearer ' + authToken,
        'Content-Type': 'application/json'},
        'body': JSON.stringify(values)
    })
    return await result.json();
}