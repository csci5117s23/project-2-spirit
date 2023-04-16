
/*
* Auto generated Codehooks (c) example
* Install: npm i codehooks-js codehooks-crudlify
*/
import {app} from 'codehooks-js'
import {crudlify} from 'codehooks-crudlify'
import { date, object, string} from 'yup';

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

app.use('/pantry', (req, res, next) => {
  if (req.method === "POST") {
      req.body.userId = req.user_token.sub
  } else if (req.method === "GET") {
      req.query.userId = req.user_token.sub
  }
  next();
})

// Use Crudlify to create a REST API for any collection
crudlify(app, {pantry: PantryYup})

// bind to serverless runtime
export default app.init();
