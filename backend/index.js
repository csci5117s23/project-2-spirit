/*
* Auto generated Codehooks (c) example
* Install: npm i codehooks-js codehooks-crudlify
*/
import {app} from 'codehooks-js'
import {crudlify} from 'codehooks-crudlify'
import {array, date, number, object, string} from 'yup';
import {generateWizardResponse, Prompts} from "./wizard/wizard";
import jwtDecode from 'jwt-decode';
import fetch from "node-fetch";

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

const WIZARD_RATE_LIMIT_PER_MIN = 20

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
    console.log("Checking rate limit for req ", req)
    const db = await Datastore.open()
    const ip = req.headers['x-real-ip']
    // increment times IP has visited
    const count = await db.incr('IP_count_' + ip, 1, {ttl: 60 * 1000})
    console.log("Rate limit count is ", count)
    if ((count?.val ?? 0) > WIZARD_RATE_LIMIT_PER_MIN) {
        res.json({ response: {error: "Rate limit reached", context: "You've sent too many requests to the Recipe Wizard recently. Please wait one minute."}})
    } else {
        console.log("Req ", req, " passed rate limit")
        next()
    }
})

app.get('/wizard/categories', async (req, res) => {
    console.log("Wizard categories with req ", req)
    if (!req.query.ingredients) {
        console.log("Missing ingredients")
        res.json({response: {error: "No ingredients prompt provided."}})
    } else {
        console.log("Ingredients are ", req.query.ingredients?.split(",") ?? [])
        const response = await generateWizardResponse(Prompts.recommendCategories(), {
            ingredients: req.query.ingredients?.split(",") ?? "",
        })
        console.log("Response to category suggestions is ", response)
        res.json(response)
    }
})

app.get('/wizard/recipe', async (req, res) => {
    if (!req.query.recipe) {
        res.json({response: {error: "No recipe prompt provided"}})
    } else {
        const message = {
            ingredients: req.query.ingredients?.split(",") ?? "",
            recipe: req.query.recipe,
        }
        console.log("Ingredients are ", message.ingredients)
        console.log("User is requesting with message ", message)
        const response = await generateWizardResponse(Prompts.recommendRecipe(), message)
        console.log("GPT response is ", response)
        res.json(response)
    }
})

const userAuth = async (req, res, next) => {
    try {
        console.log("Checking auth for req ", req)
        const {authorization} = req.headers;
        if (authorization) {
            const token = authorization.replace('Bearer ', '');
            console.log("Authorization is ", token)
            const token_parsed = jwtDecode(token);
            console.log("Parsed token is ", token_parsed)
            req.user_token = token_parsed;
        }
        next();
    } catch (error) {
        console.log("User auth failed for req ", req)
        next(error);
    }
}
app.use(userAuth)

app.get('/scan', async (req, res) => {
  const url = "https://api.barcodelookup.com/v3/products?&key=" + process.env.BARCODE_LOOKUP_KEY + "&barcode=" + req.query.content;
  const response = await fetch(url, {
    "method" : "GET",
  });
  const json = await response.json();
  res.json(json);
})

app.use('/pantry', (req, res, next) => {
    if (req.method === "POST") {
        req.body.userId = req.user_token.sub
    } else if (req.method === "GET") {
        req.query.userId = req.user_token.sub
    }
    next();
})

app.use('/pantry/:id', async (req, res, next) => {
  const id = req.params.ID;
  const userId = req.user_token.sub
  const conn = await Datastore.open();
  try {
      const doc = await conn.getOne('pantry', id)
      if (doc.userId != userId) {
          res.status(403).end();
          return
      }
  } catch (e) {
      console.log(e);
      res.status(404).end(e);
      return;
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

app.use('/recipeBook/:id', async (req, res, next) => {
    const id = req.params.ID;
    const userId = req.user_token.sub
    const conn = await Datastore.open();
    try {
        const doc = await conn.getOne('recipeBook', id)
        if (doc.userId != userId) {
            res.status(403).end();
            return
        }
    } catch (e) {
        console.log(e);
        res.status(404).end(e);
        return;
    }
    next();
})

// Use Crudlify to create a REST API for any collection
crudlify(app, {pantry: PantryYup, recipeBook: RecipeBookYup})

// bind to serverless runtime
export default app.init();
