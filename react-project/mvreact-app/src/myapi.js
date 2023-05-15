var express = require("express");
var app = express();
//for the templates
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const path = require("path");

//Mongo
const MongoClient = require("mongodb").MongoClient;

//env parameters
require("dotenv").config();

//user id and password
var user = process.env.MONGO_USERID
var pw  = process.env.MONGO_PW

//creating connection script to mongodb
const uri =  `mongodb+srv://${process.env.MONGO_USERID}:${process.env.MONGO_PW}@cluster0.gm1qmfb.mongodb.net/?retryWrites=true&w=majority`; // my mongodb link 

// routes
app.get("/", function (_req, res) {
   //main page
    res.sendFile(path.join(__dirname + "/index.html"));
  });

//printing the information from the database
app.get("/api/movies", function(req, res) {
    //creating connection object
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    //res.send("Movies");

    async function connectAndFetch() {
        try {
            await client.connect();
            const collection = client.db("sample_mflix").collection("movies");

          
            var result = await collection
            .find() //empty to show all contents
            .limit(10)
            .toArray()

            res.send(result);

        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
            console.log("Connection closed to Mongodb");
        }
        }
        connectAndFetch();
    
});
  
//GET
    app.get("/api/:id", function (req, res) {
        res.send("Get movie by ID: " + req.params.id);
      });
    //POST
    app.post("/api/add", function(req, res) {
        
        res.send("Add movie: " + req.body.title + " (" + req.body.year + ")");
    });
//PUT
    //modify information of movie by id number, see how to read id
    app.put("/api/modify/:id", function(req, res){
        res.send("Modify movie by " + req.params.id);
    });

//DELETE
    app.delete("/api/delete/:id", function(req, res) {
        res.send("Remove the movie by " + req.params.id);
      });

//For the errors
    app.get("*", function (req, res) {
        res.status(404).send("Can't find the requested page :(");
      });
      

//web server
    var PORT = process.env.PORT || 8080;
    app.listen(PORT, function(){
        console.log("Example app listening port %d", PORT);

    });