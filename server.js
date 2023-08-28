require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://University_Manager:Fs1mi9luLWSeT6JY@cluster0.w7rmmpa.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("ass-5");
    const bookCollection = db.collection("books");

    app.get("/books", async (req, res) => {
      try{
        const cursor = bookCollection.find({});
      const book = await cursor.toArray();

      res.send({ status: true, data: book });
      }catch(e){
        console.log(e.message,26);
      }
    });

    app.post("/books", async (req, res) => {
      try{
        const book = req.body;
      console.log(book);
      book.Publication_date = new Date().toLocaleString();
      const result = await bookCollection.insertOne(book);

      res.send(result);
      }catch(e){
        console.log(e.message);
      }
    });

    app.get("/books/:id", async (req, res) => {
      try{
        const id = req.params.id;
        const result = await bookCollection.findOne({ _id:new ObjectId(id) });
        res.send(result);
      }catch(e){
        console.log(e);
      }
    });
    app.patch("/books/:id", async (req, res) => {
      try{
        const id = req.params.id;
        const book = req.body;
      console.log(id,book);
      const result = await bookCollection.findOneAndUpdate(
        { _id:new ObjectId(id) },
        {
          $set: {
            author: book.author, 
            name: book.name,
            genre: book.genre
          }
        },
      );
      res.send(result);
      }catch(e){
        console.log(e);
      }
    });

    app.delete("/books/:id", async (req, res) => {
      try{
        const id = req.params.id;
        const result = await bookCollection.deleteOne({ _id:new ObjectId(id) });
        console.log(result);
        res.send(result);
      }catch(e){
        console.log('book deletion error',e.message)
      }
    });

    app.post("/comment/:id", async (req, res) => {
      try{
        const bookId = req.params.id;
      const comment = req.body.review;
      console.log(req.body)
      const result = await bookCollection.updateOne(
        { _id:new ObjectId(bookId) },
        { $push: { Reviews: comment } }
      );
      if (result.modifiedCount !== 1) {
        console.error("book not found or comment not added");
        res.json({ error: "book not found or comment not added" });
        return;
      }

      console.log("Comment added successfully");
      res.json({ message: "Comment added successfully" });
      }catch(e){
        console.log(e.message);
      }
    });

    app.get("/comment/:id", async (req, res) => {
      const bookId = req.params.id;

      const result = await bookCollection.findOne(
        { _id: ObjectId(bookId) },
        { projection: { _id: 0, comments: 1 } }
      );

      if (result) {
        res.json(result);
      } else {
        res.status(404).json({ error: "book not found" });
      }
    });

    app.post("/user", async (req, res) => {
      const user = req.body;

      const result = await userCollection.insertOne(user);

      res.send(result);
    });

    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;

      const result = await userCollection.findOne({ email });

      if (result?.email) {
        return res.send({ status: true, data: result });
      }

      res.send({ status: false });
    });
  }catch(e){
    console.log("dekhtechi bishoyta");
  } 
  finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
