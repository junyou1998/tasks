// 引入dotenv以讀取外部.env環境設定檔 
require('dotenv').config();

const Express = require("express");
const Mongoclient = require("mongodb").MongoClient;
const cors = require("cors");
const multer = require("multer");
const ObjectId = require("mongodb").ObjectId;
const app = Express();
app.use(cors());
app.use(Express.json());

// 資料庫相關連接資訊 
const CONNECTION_STRING = process.env.CONNECTION_STRING;
const DATABASENAME = "tasksapp";
const COLLECTIONNAME = "taskscollection";
let database;

// 服務啟用與資料庫連接 
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
    const newTask = {
        description: req.body.newTasks,
        createdAt: new Date(),
        updatedAt: new Date(),
        done: false,
    };

    database.collection(COLLECTIONNAME).insertOne(newTask, (err, result) => {
        if (err) {
            res.status(500).json({ error: "Internal server error" });
            return;
        }

        newTask._id = result.insertedId;
        // 回傳新增資訊 
        res.json(newTask);
    });
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
                // 回傳更新資訊 
                res.json(result);
            }
        }
    );
});
