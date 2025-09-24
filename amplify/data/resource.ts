import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any unauthenticated user can "create", "read", "update", 
and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Item: a
    .model({
      barcode: a.string(),
      itemName: a.string().required(),
      itemImageUrl: a.url().required(),
      itemPrice: a.float().required(),
      units: a.string().required(),
      category: a.string().required(),
      description: a.string(),
      storeName: a.string().required(),
      storeId: a.id().required(),
      isDiscount: a.boolean(),
      discountedPrice: a.float(),
      priceHistory: a.hasMany("PriceHistory", "itemId"),
    })
    .secondaryIndexes((index) => [
      index("barcode"),
      index("itemName"),
    ])
    .authorization((allow) => [allow.guest()]),
  PriceHistory: a.
    model({
      itemId: a.id().required(),
      itemName: a.string().required(),
      price: a.float().required(),
      discountedPrice: a.float(),
      changedAt: a.string().required(),
      item: a.belongsTo("Item", "itemId"),
    })
    .authorization((allow) => [allow.guest()]),
  StoreLocation: a
    .customType({
      streetName: a.string().required(),
      optionalSecondaryStreetDetails: a.string(),
      city: a.string().required(),
      state: a.string().required(),
      zipCode: a.string().required(),
    }),
  Store: a
    .model({
      storeName: a.string().required(),
      storeLocations: a.ref("StoreLocation").array().required(),
      isBigChain: a.boolean().required(),
      storeLogoUrl: a.url().required(),
    })
    .authorization((allow) => [allow.guest()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
