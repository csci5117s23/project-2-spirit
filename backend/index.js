/*
* Auto generated Codehooks (c) example
* Install: npm i codehooks-js codehooks-crudlify
*/
import {app} from 'codehooks-js'
import {crudlify} from 'codehooks-crudlify'
import {array, date, number, object, string} from 'yup';
import {generateWizardResponse, Prompts} from "./wizard/wizard";
import jwtDecode from 'jwt-decode';

// test route for https://<PROJECTID>.api.codehooks.io/dev/
app.get('/', (req, res) => {
    res.send('CRUD server ready')
})

const PantryYup = object({
    name: string().required(),
    group: string().required(),
    quantity: string(),
    expiration: date(),
    image: string(),
    userId: string().required(),
    createdOn: date().default(() => new Date()),
});

const RecipeBookYup = object({
    name: string().required(),
    ingredients: array().of(string()).required(),
    steps: array().of(string()).required(),
    userId: string().required(),
    createdOn: date().default(() => new Date()),
});

const WIZARD_RATE_LIMIT_PER_MIN = 69_420 // TODO: Lower this after the demo to avoid going broke from exorbitantly priced OpenAI calls

function shouldRateLimit(path) {
    return path.includes("/wizard")
}

// Wizard-specific middleware for rate limiting.
// Adapted from codehooks example https://codehooks.io/docs/examples/
app.use(async (req, res, next) => {
    if (!shouldRateLimit(req.path)) {
        console.log("Path ", req.path, " is exempt from rate limit")
        return next()
    }
    const db = await Datastore.open()
    const ip = req.headers['x-real-ip']
    // increment times IP has visited
    const count = await db.incr('IP_count_' + ip, 1, {ttl: 60 * 1000})
    console.log("Rate limit count is ", count)
    if ((count?.val ?? 0) > WIZARD_RATE_LIMIT_PER_MIN) {
        res.json({ response: {error: "Rate limit reached", context: "You've sent too many requests to the Recipe Wizard recently. Please wait one minute."}})
    } else {
        next()
    }
})

app.get('/wizard/categories', async (req, res) => {
    if (!req.query.ingredients) {
        res.json({error: "No ingredients prompt provided."})
    } else {
        const response = await generateWizardResponse(Prompts.recommendCategories(), {
            ingredients: req.query.ingredients,
        })
        console.log("Response to category suggestions is ", response)
        res.json(response)
    }
})

app.get('/wizard/recipe', async (req, res) => {
    if (!req.query.recipe) {
        res.json({error: "No recipe prompt provided"})
    } else {
        const message = {
            ingredients: req.query.ingredients ?? [],
            recipe: req.query.recipe,
        }
        console.log("User is requesting with message ", message)
        const response = await generateWizardResponse(Prompts.recommendRecipe(), message)
        console.log("GPT response is ", response)
        res.json(response)
    }
})

const userAuth = async (req, res, next) => {
    try {
        const {authorization} = req.headers;
        if (authorization) {
            const token = authorization.replace('Bearer ', '');
            const token_parsed = jwtDecode(token);
            req.user_token = token_parsed;
        }
        next();
    } catch (error) {
        next(error);
    }
}
app.use(userAuth)

app.use('/pantry', (req, res, next) => {
    if (req.method === "POST") {
        req.body.userId = req.user_token.sub
    } else if (req.method === "GET") {
        req.query.userId = req.user_token.sub
    }
    next();
})

app.use('/recipeBook', (req, res, next) => {
    if (req.method === "POST") {
        req.body.userId = req.user_token.sub
    } else if (req.method === "GET") {
        req.query.userId = req.user_token.sub
    }
    next();
})

// Use Crudlify to create a REST API for any collection
crudlify(app, {pantry: PantryYup, recipeBook: RecipeBookYup})

// bind to serverless runtime
export default app.init();
