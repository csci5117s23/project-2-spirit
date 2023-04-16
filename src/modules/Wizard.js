import {getPantry} from "@/modules/Data";

const base_url= process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

const authHeader = (authToken) => ({'Authorization': 'Bearer ' + authToken})

export async function getCategories(authToken) {
    const pantry = await getPantry(authToken)
}