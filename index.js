const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        // await client.connect();
        const database = client.db('petServices');
        const petServices = database.collection('services');
        const orderCollection = database.collection('orders');

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
            const { category } = req.query;

            let query = {};  // initially empty

            if (category) {
                query.category = category;
            }

            const result = await petServices.find(query).limit(6).toArray();
            res.send(result);
        });



        //get single data from db

        app.get('/services/:id', async (req, res) => {
            const id = req.params
            // console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await petServices.findOne(query)
            res.send(result)
        })
        // get data for email 
        app.get('/my-services', async (req, res) => {
            const { email } = req.query
            // 1st email database er email 
            const query = { email: email }
            const result = await petServices.find(query).toArray();
            res.send(result)
        })
        // put or update data from mongodb 
        app.put('/update/:id', async (req, res) => {
            const id = req.params;
            const data = req.body;
            const query = { _id: new ObjectId(id) }

            const update = {
                $set: data
            }
            const result = await petServices.updateOne(query, update)
            res.send(result)

        })
        // delete data from mongodb 

        app.delete('/delete/:id', async (req, res) => {

            const id = req.params;
            const query = { _id: new ObjectId(id) };

            const result = await petServices.deleteOne(query);

            res.send(result);
        }
        );

        // orders related api 
        app.post('/orders', async (req, res) => {
            const data = req.body
            const result = await orderCollection.insertOne(data);
            res.send(result)
        })
        app.get('/orders', async (req, res) => {
            const result = await orderCollection.find().toArray()
            res.send(result)
        })



        // await client.db("admin").command({ ping: 1 });
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

