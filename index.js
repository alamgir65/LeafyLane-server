const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// leafylaneDBUser
// sy0C9KEAbJYSwI4f

const uri = "mongodb+srv://leafylaneDBUser:sy0C9KEAbJYSwI4f@alamgir.ilrz28i.mongodb.net/?appName=alamgir";
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@alamgir.ilrz28i.mongodb.net/?appName=alamgir`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


app.get('/', (req, res) => {
    res.send('Hello World!');
});


const run = async () => {
    try{
        await client.connect();

        const db = client.db("leafyLaneDB");
        const plantsCollection = db.collection("plants");

        app.get('/plants', async (req, res) => {
            const cursor = plantsCollection.find();
            const results = await cursor.toArray();
            res.send(results);
        })

        app.post('/plants', async(req, res) => {
            const newPlant = req.body;
            const result = await plantsCollection.insertOne(newPlant);
            res.send(result);
        })















        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally{

    }
}

run().catch(console.dir);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});