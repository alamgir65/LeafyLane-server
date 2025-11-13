const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
const { ObjectId } = require('mongodb');

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
    try {
        await client.connect();

        const db = client.db("leafyLaneDB");
        const propertiesCollection = db.collection("properties");
        const usersCollection = db.collection('users');
        const ratingsCollection = db.collection('ratings');

        // USERS APIs
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const email = req.body.email;
            const query = { email: email }
            const existingUser = await usersCollection.findOne(query);

            if (existingUser) {
                res.send({ message: 'user already exits. do not need to insert again' })
            }
            else {
                const result = await usersCollection.insertOne(newUser);
                res.send(result);
            }
        })


        // Rating & review's all api's are start here

        app.post('/ratings', async(req, res) => {
            const newRating = req.body;
            const result = await ratingsCollection.insertOne(newRating);
            res.send(result);
        })
        


        // all properties api's are here

        app.get('/properties', async (req, res) => {
            const email = req.query.email;
            const query = {};
            if (email) {
                query.email = email;
            }
            console.log(query);
            const cursor = propertiesCollection.find(query);
            const results = await cursor.toArray();
            res.send(results);
        })

        app.patch('/properties/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const updatedProperty = req.body;
                const query = { _id: new ObjectId(id) };

                const update = {
                    $set: {
                        title: updatedProperty.title,
                        price: updatedProperty.price,
                        category: updatedProperty.category,
                        description: updatedProperty.description,
                        location: updatedProperty.location,
                        image: updatedProperty.image
                    }
                };

                const result = await propertiesCollection.updateOne(query, update);
                res.send(result);
            } catch (error) {
                res.status(500).send({ error: 'Failed to update property' });
            }
        });

        app.get('/latest-properties', async (req, res) => {
            const cursor = propertiesCollection.find().sort({ created_at: -1 }).limit(6);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/properties', async (req, res) => {
            const newProperty = req.body;
            const result = await propertiesCollection.insertOne(newProperty);
            res.send(result);
        })

        app.get('/properties/:id', async (req, res) => {
            console.log('property calling');
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await propertiesCollection.findOne(query);
            res.send(result);
        })

        app.delete('/properties/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await propertiesCollection.deleteOne(query);
            res.send(result);
        })



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {

    }
}

run().catch(console.dir);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});