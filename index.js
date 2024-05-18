const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors({
    origin: [

        // 'http://localhost:5173',
        'https://tuli-kitchen16may24.web.app',
        'https://tuli-kitchen16may24.firebaseapp.com'

    ],
    // credentials: true
}));

app.use(express.json());


//--------mongo db connection part start---------

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.owte0be.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const recipeCollection = client.db('tuliDB').collection('recipes');
        const reviewCollection = client.db('tuliDB').collection('reviews');

        //recipe related api
        app.get('/recipes', async (req, res) => {
            const cursor = recipeCollection.find();
            const result = await cursor.toArray();
            // console.log(result);
            res.send(result);
        })

        app.get('/recipes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await recipeCollection.findOne(query);
            res.send(result);
        })

        app.get('/homerecipes', async (req, res) => {
            const cursor = recipeCollection.find().limit(3);
            const result = await cursor.toArray();
            // console.log(result);
            res.send(result);
        })

        // add a new  menu = recipe
        app.post('/recipes', async (req, res) => {
            const newRecipe = req.body;
            // console.log(newRecipe);
            const result = await recipeCollection.insertOne(newRecipe);
            res.send(result);
        })

        // review related api
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            // console.log(review);
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });

        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find();
            const result = await cursor.toArray();
            // console.log(result);
            res.send(result);

        })







        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

//---------mongodb connection part end-------


app.get('/', (req, res) => {
    res.send('tuli kitchen is running')
})

app.listen(port, () => {
    console.log(`tuli kitchen is running on port ${port}`)
})