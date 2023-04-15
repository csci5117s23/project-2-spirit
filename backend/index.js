
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

// Use Crudlify to create a REST API for any collection
crudlify(app, {pantry: PantryYup})

// bind to serverless runtime
export default app.init();
