const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 3000;


const app = express();
app.use(cors());
app.use(express.json())


const uri = "mongodb+srv://missonscic:NVHhHshbPh2ItNqa@cluster0.gzvuhez.mongodb.net/?appName=Cluster0";

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
        await client.connect();
        const database = client.db('petServices');
        const petServices = database.collection('services');

        // post/save  data on database
        app.post('/services', async (req, res) => {
            const data = req.body;
            const date = new Date();
            data.createdAt = date;
            const result = await petServices.insertOne(data)
            res.send(result)
        })

        //get services from db

        app.get('/services', async (req, res) => {
            const result = await petServices.find().toArray();
            res.send(result)
        })

        //get single data from db

        app.get('/services/:id', async (req, res) => {
            const myId = req.params
            console.log(myId)
        })



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Developer')
})
app.listen(port, () => {
    console.log(`server is running ${port}`)
})

