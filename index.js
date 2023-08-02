require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

const cors = require('cors');

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eluedpr.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
  try {
    const featuredProductsCollection = client.db('origin-pc').collection('featuredProducts');
    const wishlistCollection = client.db('origin-pc').collection('wishlist');

    //........>
    app.get('/featured-products', async (req, res) => {
      const cursor = featuredProductsCollection.find({});
      const products = await cursor.toArray();

      res.send({ status: true, data: products });
    });

    app.get('/featured-products/:category', async (req, res) => {
      const category = req.params.category;
      console.log({ category });

      const cursor = featuredProductsCollection.find({ category: category });
      const products = await cursor.toArray();

      res.send({ status: true, data: products });

    });

    app.get('/featured-products/products-details/:id', async (req, res) => {
      const id = req.params.id;
      console.log({ id });

      const cursor = await featuredProductsCollection.findOne({ _id: ObjectId(id) });

      res.send({ status: true, data: cursor });

    });
    //....<<<

    //......>>>

    app.post('/featured-products', async (req, res) => {
      const products = req.body;

      const result = await featuredProductsCollection.insertOne(products);

      res.send(result);
    });

    //...<<<<

  } finally {
  }
};

run().catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
