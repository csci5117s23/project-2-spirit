
/*
* Auto generated Codehooks (c) example
* Install: npm i codehooks-js codehooks-crudlify
*/
import {app} from 'codehooks-js'
import {crudlify} from 'codehooks-crudlify'
import { date, object, string} from 'yup';
import {generateWizardResponse, Prompts} from "./wizard/wizard";

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

app.get('/wizard/categories', async (req, res) => {
  if(!req.query.ingredients) {
    res.json({error: "No ingredients prompt provided."})
  } else {
    const response = await generateWizardResponse(Prompts.recommendCategories(), {
      ingredients: req.query.ingredients,
    })
    res.json(response)
  }
})

app.get('/wizard/recipe', async (req, res) => {
  if(!req.query.recipe) {
    res.json({error: "No recipe prompt provided"})
  } else if(!req.query.ingredients) {
    res.json({error: "No ingredients prompt provided."})
  } else {
    const response = await generateWizardResponse(Prompts.recommendRecipe(), {
      ingredients: req.query.ingredients,
      recipe: req.query.recipe,
    })
    res.json(response)
  }
})

// Use Crudlify to create a REST API for any collection
crudlify(app, {pantry: PantryYup})

// bind to serverless runtime
export default app.init();
