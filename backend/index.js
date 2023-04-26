
/*
* Auto generated Codehooks (c) example
* Install: npm i codehooks-js codehooks-crudlify
*/
import {app} from 'codehooks-js'
import {crudlify} from 'codehooks-crudlify'
import { array, date, number, object, string} from 'yup';
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

app.get('/wizard/categories', async (req, res) => {
  if(!req.query.ingredients) {
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
    const { authorization } = req.headers;
    if (authorization) {
      const token = authorization.replace('Bearer ','');
      const token_parsed = jwtDecode(token);
      req.user_token = token_parsed;
    }
    next();
  } catch (error) {
    next(error);
  } 
}
app.use(userAuth)

app.get('/scan', async (req, res) => {
  const response = await fetch("https://api.barcodelookup.com/v3/products", {
    "mode" : "cors",
    "method" : "GET",
    "headers": {
        "formatted": "y",
        "barcode": req.query.content,
        "key": process.env.BARCODE_LOOKUP_KEY,
  }});
  res.json(response);
})

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
