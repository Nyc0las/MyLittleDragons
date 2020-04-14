"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cors = require("cors");
var bodyParser = __importStar(require("body-parser"));
//import { SetDragonsCoord } from "../src/dragons"
//
// express app config
//
var expressApp = express();
var dragonRouter = express.Router();
var port = 7753;
var host = "90.92.115.216";
var fs = require('fs');
var https = require('https');
var http = require('http');
var app = express();
http.globalAgent.maxSockets = 20;
var options = {
    timeout: 300
};
expressApp.use(cors());
//
// Variable to store dragon state
//
var dstate = [];
var dcolor = [];
var dx = [];
var dy = [];
var dz = [];
var data = [[]];
// CONTAIN ALL THE PLAYERS VALUES
// data[][0] = userid (can be in more than one place, depending on the number of dragons)
// data[][1] = id (the dragon's id)
// data[][2] = color
// data[][3] = x
// data[][4] = y
// data[][5] = z
// data[][6] = state
// data[][7] = energy
// data[][8] = food
// data[][9] = life
// data[][10] = name
// data[][11] = mood
//
//GET Number of dragons by userID
//
/*dragonRouter.post("/GetDragonsNumber", bodyParser.json(), function (req: express.Request, res: express.Response) {
    let { userid } = req.body;

    let nb = 0
    for (let i = 0; i < data.length; i++) {
        if (data[i][0] == userid) {
            nb += 1
        }
    }
        res.status(200).json({ "nb": nb })
});*/
//
//GET Dragon by ID
//
dragonRouter.post("/GetUserDragons", bodyParser.json(), function (req, res) {
    var userid = req.body.userid;
    var userExist = false;
    for (var i = 0; i < data.length; i++) {
        if (data[i][0] == userid) {
            userExist = true;
            res.status(200).json({ "userid": data[i][0], "id": data[i][1], "color": data[i][2], "x": data[i][3], "y": data[i][4], "z": data[i][5], "state": data[i][6], "energy": data[i][7], "food": data[i][8], "life": data[i][9], "name": data[i][10], "mood": data[i][11] });
            console.log("ASKED FOR DATA: userid=" + data[i][0] + " dragonID" + data[i][1] + " color" + data[i][2] + " x" + data[i][3] + " y" + data[i][4] + " z" + data[i][5] + " state" + data[i][6] + " energy" + data[i][7] + " food" + data[i][8] + " life" + data[i][9] + " name" + data[i][10] + " mood" + data[i][11]);
            break;
        }
    }
    if (!userExist) {
        res.status(200).json({ "userid": "1111111111" }).end();
    }
});
//
//SET Stats by ID
//
dragonRouter.post("/SetStats", bodyParser.json(), function (req, res) {
    var _a = req.body, userid = _a.userid, id = _a.id, color = _a.color, x = _a.x, y = _a.y, z = _a.z, state = _a.state, energy = _a.energy, food = _a.food, life = _a.life, name = _a.name, mood = _a.mood;
    var userExist = false;
    for (var i = 0; i < data.length; i++) {
        if (data[i][0] == userid) {
            userExist = true;
            data[i] = [userid, id, color, x, y, z, state, energy, food, life, name, mood];
            break;
        }
    }
    if (!userExist) {
        data.push([userid, id, color, x, y, z, state, energy, food, life, name, mood]);
    }
    console.log("id=" + id + " color=" + color + " x=" + x + " y=" + y + " z=" + z + " state=" + state + " energy=" + energy + " food=" + food + " life=" + life + " name=" + name + " mood=" + mood);
    //console.log(data)
    /*dcolor[id] = color
    dx[id] = x;
    dy[id] = y;
    dz[id] = z;
    dstate[id] = state;
    console.log("id=" + id + " color= " + color + " x=" + x + " y=" + y + " z=" + z + " state= " + state)*/
    //res.status(200).json({ "id": id, "color": dcolor, "x": dx, "y": dy, "z": dz, "state": dstate })
});
//
//GET Stats
//
dragonRouter.get("/GetStats", function (req, res) {
    res.status(200).json({ "color": dcolor, "x": dx, "y": dy, "z": dz, "state": dstate });
});
//
//SET Stats
//
dragonRouter.post("/SetStats", bodyParser.json(), function (req, res) {
    var _a = req.body, id = _a.id, color = _a.color, x = _a.x, y = _a.y, z = _a.z, state = _a.state;
    dcolor[id] = color;
    dx[id] = x;
    dy[id] = y;
    dz[id] = z;
    dstate[id] = state;
    console.log("id=" + id + " color= " + color + " x=" + x + " y=" + y + " z=" + z + " state= " + state);
    res.status(200).json({ "id": id, "color": dcolor, "x": dx, "y": dy, "z": dz, "state": dstate });
});
//
// attach the door REST router
//
expressApp.use("/api/dragons", dragonRouter);
//
// start up the express app
//
//expressApp.listen(port, host);
http.createServer(options, expressApp).listen(7753);
https.createServer(options, expressApp).listen(443);
/*https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}, expressApp).listen(port);*/
console.log("listening http://" + host + ":" + port);
