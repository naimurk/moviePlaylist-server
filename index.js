const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config();
app.use(express.json())
app.use(cors());





const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.50l1tkw.mongodb.net/?retryWrites=true&w=majority`;

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
    const userCollection = client.db("moviePlalist").collection("user")
    const playListCollection = client.db("moviePlalist").collection("playlist");

    // Create an index on 'name' and 'description'
    // const indexKeys = { name: 1, description: 1 };
    // const indexOptions = { name: "nameDescription" };
    // const indexResult = await playListCollection.createIndex(indexKeys, indexOptions);

    // // Search API
    // app.get("/search/:text", async (req, res) => {
    //   const searchText = req.params.text;
    //   try {
    //     const searchResult = await playListCollection.find({
    //       $or: [
    //         { name: { $regex: searchText, $options: "i" } },
    //         { description: { $regex: searchText, $options: "i" } },
    //       ],
    //     }).toArray();
    //     res.send(searchResult);
    //   } catch (error) {
    //     res.status(500).send("An error occurred while searching.");
    //   }
    // });
    // h




    // add playList Api
   app.post("/addPlayList",async(req,res)=> {
    try {
      const data = req.body;
      const result = await playListCollection.insertOne(data)
      res.send(result)
    } catch (error) {
      res.send(error.message)
    }
   })

  //  added Playlist by user Email
   app.get("/addedPlayList/:email", async(req,res)=> {
    try {
      const email = req.params.email;
      const query = {
        email:email
      }
      const result = await playListCollection.find(query).toArray();
      res.send(result)
    } catch (error) {
      res.send(error.message)
    }
   })

  //  update a Movie in Specific playlist
  app.patch("/update-movie/:id",async(req,res)=> {
    try {
      const id =req.params.id;
      const body = req.body;
      const {newSongArray}=body;
      const query = {
        _id : new ObjectId(id)
      }
      const updateDoc = {
        $set: {
          song: newSongArray
        }
      }

      const result = await playListCollection.updateOne(query,updateDoc)
      res.send(result)

    } catch (error) {
      res.send(error.message)
    }
  })

  // update playlistName 
  app.patch("/update-playlistName/:id", async(req,res)=> {
    try {
      const id = req.params.id;
      const body = req.body;
      // console.log(body);
      const query = {
        _id: new ObjectId(id)
      }
      const updateDoc = {
        $set: {
          playListName: body?.updatePlaylistName
        }
      }

      const result = await playListCollection.updateOne(query,updateDoc)
      res.send(result)
    } catch (error) {
      res.send(error.message)
    }
  })

  // get All song 
  app.get("/getAllSong", async(req,res)=> {
    try {
      const result = await playListCollection.find().toArray();
      res.send(result)
    } catch (error) {
      res.send(error.message)
    }
  })

  // specific Delete a PlayList
  app.delete("/delete/:id",async(req,res)=> {
    try {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id)
      }
      const result = await playListCollection.deleteOne(query)
      res.send(result)  
    } catch (error) {
      res.send(error.message)
    }
  })


  // movieBanner specific Movie
  app.get("/movieBanner",async(req,res)=>{
    try {
      const playListId= req.query.playListId;
      const id = req.query.id;
      const query = {
        _id: new ObjectId(playListId)
      }
      const result = await playListCollection.findOne(query)
      res.send(result)
    } catch (error) {
      res.send(error.message)
    }
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




app.get('/', (req, res) => {
  res.send('Summer is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});