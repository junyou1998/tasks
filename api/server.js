var Express = require("express");
var Mongoclient = require("mongodb").MongoClient;
var cors = require("cors");
const multer = require("multer");
var ObjectId = require("mongodb").ObjectId;
var app = Express();
app.use(cors());
app.use(Express.json());

var CONNECTION_STRING = "mongodb://localhost:27017";
var DATABASENAME = "tasksapp";
var COLLECTIONNAME = "taskscollection"
var database;

app.listen(5038, () => {
    console.log("server is running on port 5038");
    Mongoclient.connect(CONNECTION_STRING, (err, client) => {
        database = client.db(DATABASENAME);
        console.log("Mongo DB is Connected!");
    });
});

// 查詢所有事項 按日期由新到舊排列
app.get("/api/tasks", (req, res) => {
    database
        .collection(COLLECTIONNAME)
        .find({})
        .sort({ createdAt: -1 })
        .toArray((err, result) => {
            res.send(result);
        });
});
// 新增事項
app.post("/api/tasks", multer().none(), (req, res) => {
    database.collection(COLLECTIONNAME).count({}, (err, numOfDocs) => {
        database.collection(COLLECTIONNAME).insertOne({
            description: req.body.newTasks,
            createdAt: new Date(),
            updatedAt: new Date(),
            done: false,
        });
    });
    res.json("added successfully!!");
});
// 刪除事項
app.delete("/api/tasks/:id", (req, res) => {
    database.collection(COLLECTIONNAME).deleteOne({
        _id: new ObjectId(req.params.id),
    });
    res.json("Delete successfully!!");
});
// 更新事項 包含完成與否
app.patch("/api/tasks/:id", (req, res) => {
    database.collection(COLLECTIONNAME).updateOne(
        {
            _id: new ObjectId(req.params.id),
        },
        {
            $set: { description: req.body.updateTask, done: req.body.doneStatus },
        },
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
            }
        }
    );

    res.json("Update successfully!!" + req.params.id);
});
