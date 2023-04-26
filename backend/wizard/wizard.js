import {Configuration, OpenAIApi} from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration);

const OPENAI_MODEL = "gpt-3.5-turbo"
const RETRY_DELAY_MILLIS = 2500


function buildPrompt(promptContent) {
    return `
        From now on, every response must be entirely in JSON format with no plaintext content.
        All responses must be syntactically valid JSON which can be directly decoded using JSON.parse() in Javascript.
        If there is an error or you are unable to fulfill a request, respond with a JSON response containing the "error" key
        with the value being the error message or reason you are unable to fulfill the request.
        
        ${promptContent}
    `
}

const antiHarmContext = `If the recipe prompt or ingredients are offensive, not food, or potentially dangerous to the user, you should instead generate an error explaining to the user why you are unable to generate this recipe with additional context in a full sentence to inform and educate them.`


/**
 * Generate a wizard response to a given prompt object.
 * Available prompt objects are available in {Prompts}.
 *
 * This function handles all appropriate error handling, including possible application-level (OpenAI) or network-level errors.
 * The only error handling required for using this function is to check for the "error" property in the object, or the "response" object.
 *
 * @param prompt The prompt object, representing a type of instruction the Wizard can respond to. This should be an invocation of one of the exported functions in {Prompts}
 * @param message A string message, representing additional user instructions.
 * @param attempts? The current number of attempts, if applicable
 * @returns {Promise<{error: string}|any>} The wizard's response to this prompt. This will contain the "error" property if there was an error in handling the request.
 */
export async function generateWizardResponse({prompt}, message, attempts = 0) {
    try {
        const completion = await openai.createChatCompletion({
            messages: [{
                role: "system", content: buildPrompt(prompt)
            }, {
                role: "user", content: JSON.stringify(message)
            }], model: OPENAI_MODEL
        })
        const response = completion.data.choices[0].message;
        if (!response) {
            return {response: {error: "Unable to reach Wizard at this time."}}
        }
        const content = response.content
        try {
            return {response: JSON.parse(content)}
        } catch (error) {
            return {response: {error: `Unable to parse Wizard response: ${error}`}}
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 429) {
                attempts++
                console.warn("Retrying wizard request due to 429 (rate-limit): ", prompt, message, attempts)
                await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MILLIS * attempts));
                return generateWizardResponse({prompt}, message, attempts)
            }

            if (error.response.status > 500 && error.response.status < 600 && attempts < 3) {
                attempts++;

                console.warn('Retrying wizard request due to 5xx (OpenAI error): ', prompt, message, attempts);
                await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MILLIS * attempts));

                return generateWizardResponse(prompt, message, attempts);
            }

            return {response: {error: `Unhandled error in network response (code ${error.response.status})`}}
        } else {
            return {response: {error: `OpenAI error: ${error}`}}
        }
    }
}


export class Prompts {
    static recommendCategories() {
        const data = `
            The user will give you a JSON object of the following form:
            {
                ingredients: string[],
            }
            
            Based on these ingredients, you should suggest some categories of recipe the user might want to try.
            These categories should be generic enough to cover multiple different recipes such that an Assistant
            could generate multiple full recipes based on this recommended category alone.
            
            Please respond with a JSON object of the form:
            {
                categories: {
                    name: string,
                    description: string
                }
            }
            
            If it is not possible to suggest some categories of recipe the user might want to try, you should
            instead respond with a JSON object of the following form:
            {
                error: string,
                context: string
            }        
            
            Where the error is "Not enough ingredients to suggest categories" and context is some additional context
            a developer can use to debug why you are unable to generate categories from these ingredients.
            
            ${antiHarmContext}
        `
        return {prompt: data}
    }

    static recommendRecipe() {
        const data = `
            The user will give you a JSON object of the following form:
            {
                recipe: string,
                ingredients: string[] | string | null
            }
            
            Based on these ingredients and a recipe prompt, please respond with a recipe that uses as many of the
            ingredients the user provides as possible (to the extent that makes sense in the recipe) in addition to
            common spices, cooking oils, or other household items. The ingredients should contain kitchen-measurable quantities
            wherever appropriate.
            
            Please respond with a JSON object of the following form:
            {
                recipes: Recipe[]                            
            }
            
            Where "Recipe" is a JSON object of the form:
            {
                name: string,
                ingredients: string[],
                steps: string[],
                ingredientsInPantry: number,
                totalIngredients: number
            }
            
            where totalIngredients is the total number of ingredients in the recipe and ingredientsInPantry is the number
            of ingredients in the recipe the user currently has in their ingredients array. If ingredients are empty, simply
            generate a recipe based on the recipe field prompt regardless of the ingredients the user has. The recipes do
            not necessarily need to use the entire amount of an ingredient the user has.
            
            If the ingredients are provided and it is not possible to suggest some recipes based on the user's ingredients, 
            you should instead respond with a JSON object of the following form:
            {
                error: string,
                context: string
            }        
            
            Where the error is "Not enough ingredients to suggest recipes for prompt" and context is some additional context
            a developer can use to debug why you are unable to generate categories from these ingredients. If the user provides
            invalid ingredients, no ingredients, or an invalid data type for the ingredients, just ignore the ingredients.
            
            ${antiHarmContext}
        `
        return {prompt: data}
    }
}