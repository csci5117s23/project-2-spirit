import fetch from "node-fetch";


/**
 * Because the standard OpenAI library is incompatible with CodeHooks
 * (due to codehooks using some outdated node version or a different obscure runtime that does not support 'URL'
 * as a global), we needed to add this facade in last-minute to allow the functionality to work when deployed.
 *
 * Of course, the library works fine locally, just not on codehooks' exceptionally well-documented runtime.
 *
 * Source: https://codehooks.io/docs/examples/chat-gpt-rest-api-nodejs-example
 * (conveniently their tutorial which seems to ignore the fact the 'openai' package is incompatible came out AFTER we implemented the original version)
 */
export async function createChatCompletion(options) {
    const raw = JSON.stringify({
        "model": options.model,
        "messages": options.messages,
        "stream": false
    });

    console.log("Request body is ", raw)

    var requestOptions = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: raw,
        redirect: 'follow'
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", requestOptions);
    return response.json();

}