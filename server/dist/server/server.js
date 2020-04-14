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
//
// express app config
//
var expressApp = express();
var dragonRouter = express.Router();
var port = 7753;
var host = "127.0.0.1";
expressApp.use(cors());
//
// Variable to store dragon state
//
var dx = [];
var dy = [];
var dz = [];
/*dx[0] = 9
dx[1] = 4
dx[2] = 7*/
//
//GET Stats
//
dragonRouter.get("/GetStats", function (req, res) {
    res.status(200).json({ "x": dx, "y": dy, "z": dz });
});
//
//SET Stats
//
dragonRouter.post("/SetStats", bodyParser.json(), function (req, res) {
    var _a = req.body, id = _a.id, x = _a.x, y = _a.y, z = _a.z;
    dx[id] = x;
    dy[id] = y;
    dz[id] = z;
    console.log("id=" + id + " x=" + x + " y=" + y + " z=" + z);
    res.status(200).json({ "id": id, "x": dx, "y": dy, "z": dz });
});
//
// attach the door REST router
//
expressApp.use("/api/dragons", dragonRouter);
//
// start up the express app
//
expressApp.listen(port, host);
console.log("listening http://" + host + ":" + port);
