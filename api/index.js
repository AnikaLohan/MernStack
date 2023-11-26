var Express= require("express");
var MongoClient= require("mongodb").MongoClient;
var cors=require("cors");
const multer=require("multer");

var app=Express();
app.use(cors());

var CONNECTION_STRING="mongodb+srv://dummyuser:Dummy123@cluster0.0tdimje.mongodb.net/?retryWrites=true&w=majority";


var DATABASENAME="Project_IT";
var database;

app.listen(5080,()=>{
    MongoClient.connect(CONNECTION_STRING, (error, client)=>{
        database=client.db(DATABASENAME);
        console.log("Connected!.");
    });
})
/*
app.get('/ToDo/GetNotes',(request,response)=>{
    database.collection("todoapp").find({}).toArray((error, result)=>{
        response.send(result);
    });
})
*/
app.get('/api/todoapp/GetNotes', (request, response) => {
    database.collection("todoapp").find({}).toArray((error, result) => {
        if (error) {
            console.error("Error fetching data:", error);
            response.status(500).send("Internal Server Error");
        } else {
            if (result.length === 0) {
                console.log("No documents found in the collection.");
            }
            response.send(result);
        }
    });
});


app.post('/api/todoapp/AddNotes', multer().none(), (request,response)=>{
    database.collection("todoapp").count({}, function(error, numofDocs){
        database.collection("todoapp").insertOne({
            id:(numofDocs+1).toString(),
            description:request.body.newNotes
        });
        response.json("Added Successfully");
    })

})



app.delete('/api/todoapp/DeleteNotes',(request, response)=>{
    database.collection("todoapp").deleteOne({
        id:request.query.id
    });
    response.json("Deleted Successfully");
})




