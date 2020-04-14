import express = require('express');
import cors = require('cors');
import * as bodyParser from "body-parser";
//import { SetDragonsCoord } from "../src/dragons"

//
// express app config
//
const expressApp = express();
const dragonRouter = express.Router();
const port = 80;
const host = "ec2-34-223-224-128.us-west-2.compute.amazonaws.com";

var fs = require('fs')
var https = require('https')
var http = require('http')
var app = express()
http.globalAgent.maxSockets = 20;
const options = {
    timeout: 300
};
expressApp.use(cors());

//
// Variable to store dragon state
//

let dstate: string[] = []
let dcolor: number[] = []
let dx: number[] = []
let dy: number[] = []
let dz: number[] = []


let data: any[][] = [[]]
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
dragonRouter.post("/GetUserDragons", bodyParser.json(), function (req: express.Request, res: express.Response) {
    let { userid } = req.body;

    let userExist = false
    for (let i = 0; i < data.length; i++) {
        if (data[i][0] == userid) {
            userExist = true
            res.status(200).json({ "userid": data[i][0], "id": data[i][1], "color": data[i][2], "x": data[i][3], "y": data[i][4], "z": data[i][5], "state": data[i][6], "energy": data[i][7], "food": data[i][8], "life": data[i][9], "name": data[i][10], "mood": data[i][11] })
            console.log("ASKED FOR DATA: userid=" + data[i][0] + " dragonID"+ data[i][1] + " color"+ data[i][2] + " x"+ data[i][3] + " y"+ data[i][4] + " z"+ data[i][5] + " state"+ data[i][6] + " energy"+ data[i][7] + " food"+ data[i][8] + " life"+ data[i][9] + " name"+data[i][10] + " mood"+ data[i][11])
            break
        }
    }
    if (!userExist) {
            res.status(200).json({ "userid": "1111111111" }).end()
    }
});

//
//SET Stats by ID
//
dragonRouter.post("/SetStats", bodyParser.json(), function (req: express.Request, res: express.Response) {
    let { userid, id, color, x, y, z, state, energy, food, life, name, mood } = req.body;
    let userExist = false
    for (let i = 0; i < data.length; i++) {
        if (data[i][0] == userid)
        {
            userExist = true
            data[i] = [userid, id, color, x, y, z, state, energy, food, life, name, mood]
            break
        }
    }
    if (!userExist) {
        data.push([userid, id, color, x, y, z, state, energy, food, life, name, mood])
    }

    console.log("id=" + id + " color=" + color + " x=" + x + " y=" + y + " z=" + z + " state=" + state + " energy="+ energy + " food="+food + " life="+life + " name="+name + " mood="+mood)
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
dragonRouter.get("/GetStats", function (req: express.Request, res: express.Response) {
    res.status(200).json({ "color": dcolor, "x": dx, "y": dy, "z": dz, "state": dstate })
});

//
//SET Stats
//
dragonRouter.post("/SetStats", bodyParser.json(), function (req: express.Request, res: express.Response)
{
    let { id, color, x, y, z, state } = req.body;
    dcolor[id] = color
    dx[id] = x;
    dy[id] = y;
    dz[id] = z;
    dstate[id] = state;
    console.log("id="+ id + " color= "+ color + " x=" + x + " y=" + y + " z=" + z + " state= "+ state)

    res.status(200).json({ "id": id, "color": dcolor, "x": dx, "y": dy, "z": dz, "state": dstate })
});

//
// attach the door REST router
//
expressApp.use("/api/dragons", dragonRouter);

//
// start up the express app
//
//expressApp.listen(port, host);
http.createServer(options, expressApp).listen(port)
//https.createServer(options, expressApp).listen(443)

/*https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}, expressApp).listen(port);*/

console.log(`listening http://${host}:${port}`);
