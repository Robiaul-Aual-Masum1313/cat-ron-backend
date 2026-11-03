import express from 'express'
import cors from 'cors'
import "dotenv/config";
import { MongoClient, ObjectId } from 'mongodb';
const app = express()
const PORT = 8000


const client = new MongoClient(process.env.MONGODB_CLIENT);


export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
app.use(cors());
app.use(express.json());
const mongoClient = await connectToMongoDB();
const db = mongoClient.db("cat-ron");
const bookCollection = db.collection("books");
const borrowCollection = db.collection("borrows");
app.get('/', (req,res) => {
    res.send('Server running properly')
})
app.get('/books', async (req,res) => {
  const result = await bookCollection.find().toArray()
  res.send(result)
})
app.post('/books', async (req,res) => {
    const data = req.body
    const result = await bookCollection.insertOne(data)
    res.send(result)
})
app.get('/books/:id', async (req,res) => {
  const {id}  = await req.params
  const result = await bookCollection.findOne({
    _id: new ObjectId(id)
  })
  res.send(result)
})
app.patch('/books/:id', async (req,res) => {
  const {id} = await  req.params
  const data = req.body
  const result = await bookCollection.updateOne({
    _id: new ObjectId(id)
  },
  {
    $set: data
  }
)
  res.send(result)
})
app.delete('/books/:id', async (req,res) => {
  const {id} = await  req.params
  const result = await bookCollection.deleteOne({
    _id: new ObjectId(id)
  })
  res.send(result)
})

app.get('/mybooks/:id' , async (req,res) => {
  const {id} = await req.params
  const result = await bookCollection.find({
    email: id
  }).toArray()
  res.send(result)
})
app.post('/borrows' , async (req,res) => {
  const data = req.body
  const {BookID} = data
  console.log(BookID);
  const result1 = await bookCollection.updateOne({
    _id: new ObjectId(BookID)
  },{
    $inc:{ availableCopies: -1 }
  })
  const result = await borrowCollection.insertOne(data)
  res.send(result)
})
app.get('/borrows/:id' ,async (req,res) => {
  const {id} = await req.params
  const result = await borrowCollection.find({
    UserEmail: id
  }).sort({ BorrowDate: -1 }).toArray()
  res.send(result)
})
app.delete('/borrows/:id' , async (req,res) => {
  const {id} = await req.params

  const result = await borrowCollection.deleteOne({
    _id: new ObjectId(id)
  })
  res.send(result)
})
app.patch('/borrows/:id' ,async (req,res) => {
    const {id} = await req.params
  const result = await bookCollection.updateOne({
    _id: new ObjectId(id)
  },
  {
    $inc:{ availableCopies: 1 }
  }
)
res.send(result)
})
// server url http://localhost:8000/
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
    
})

export default app