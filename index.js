const express = require("express");
const app = express();
var cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bb25naq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// ? Connection setup

async function run() {
  try {
    await client.connect();

    //   //////////////////////////////////////////////////////////////////////////////////////
    const userCollection = client.db("FeriBD").collection("users");
    const bannerCollection = client.db("FeriBD").collection("banners");
    const productCollection = client.db("FeriBD").collection("products");

    //   ? User data api

    app.get("/getAllUsers", async (req, res) => {
      const result = await (await userCollection.find().toArray()).reverse();
      res.send(result);
    });

    app.post("/addUser", async (req, res) => {
      const data = req.body;
      const email = data.email;
      const find = { email: email };
      const filter = await userCollection.findOne(find);
      if (filter === null) {
        const result = await userCollection.insertOne(data);
        res.send(result);
      }
    });

    // app.put("/updateUser", async (req, res) => {
    //   const email = req.body.email;
    //   const data = req.body;
    //   const find = { email: email };
    //   const filter = await userCollection.findOne(find);
    //   if (filter) {
    //     res.status(403).send("Email already exist");
    //   }
    //   if (!filter) {
    //     const option = { upsert: true };
    //     const updateDoc = {
    //       $set: data,
    //     };
    //     const result = await userCollection.updateOne(
    //       filter,
    //       option,
    //       updateDoc
    //     );
    //     res.send(result);
    //   }
    // });

    app.put("/changeRole/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const data = req.body;
      const option = { upsert: true };
      const updateDoc = {
        $set: data,
      };
      const result = await userCollection.updateOne(filter, updateDoc, option);
      res.send(result);
    });

    app.delete("/deleteUser/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(filter);
      res.send(result);
    });

    //   ? Banner data api

    app.get("/getAllBanners", async (req, res) => {
      const result = await (await bannerCollection.find().toArray()).reverse();
      res.send(result);
    });

    app.get("/getCheckedBanners", async (req, res) => {
      const find = await bannerCollection.find().toArray();
      const result = find.filter((c) => c.checked === true);
      res.send(result);
    });

    app.post("/addBanner", async (req, res) => {
      const data = req.body;
      const result = await bannerCollection.insertOne(data);
      res.send(result);
    });

    app.put("/updateBanner/:id", async (req, res) => {
      const data = req.body;
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: data,
      };
      const result = await bannerCollection.updateOne(
        filter,
        updateDoc,
        option
      );
      res.send(result);
    });

    app.delete("/deleteBanner/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await bannerCollection.deleteOne(filter);
      res.send(result);
    });

    //   ? Product data api

    app.get("/getAllProducts", async (req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result);
    });

    app.get("/getSingleProduct/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await productCollection.findOne(filter);
      res.send(result);
    });

    app.post("/addProduct", async (req, res) => {
      const data = req.body;
      const result = await productCollection.insertOne(data);
      res.send(result);
    });

    app.put("/updateData/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const data = req.body;
      const option = { upsert: true };
      const updateDoc = {
        $set: data,
      };
      const result = await productCollection.updateOne(
        filter,
        updateDoc,
        option
      );
      res.send(result);
    });

    app.delete("/deleteProduct/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(filter);
      res.send(result);
    });

    // //////////////////////////////////////////////////////////////////////////////
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
