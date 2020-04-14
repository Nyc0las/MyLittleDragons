"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importDefault(require("../node_modules/decentraland-ecs-utils/index"));
var game_1 = require("./game");
var Stats = /** @class */ (function () {
    function Stats(name) {
        /*this.drago.addComponent(new GLTFShape("assets/models/DragoYellow/DragoGrey.gltf"))
        this.drago.addComponent(new Transform({
            position: new Vector3(0, 0, 0),
            scale: new Vector3(1,1,1)
        }))*/
        if (name === void 0) { name = "Drago"; }
        var rand = Math.floor(Math.random() * 10);
        this.name = name + rand;
    }
    Stats.prototype.Create = function () {
    };
    Stats.prototype.Test = function () {
        log("TEST");
        /*this.flySpeed = 2
        log("FLYSPEED: "+this.flySpeed)*/
    };
    Stats = __decorate([
        Component('Stats')
    ], Stats);
    return Stats;
}());
exports.Stats = Stats;
var DragonBehavior = /** @class */ (function () {
    function DragonBehavior() {
        //DATAS
        this.state = "idle";
    }
    DragonBehavior.prototype.GetState = function () {
        return this.state;
    };
    DragonBehavior = __decorate([
        Component('DragonBehavior')
    ], DragonBehavior);
    return DragonBehavior;
}());
exports.DragonBehavior = DragonBehavior;
var LerpData = /** @class */ (function () {
    function LerpData() {
        /*origin: Vector3 = new Vector3(5, 0.2, 5)
        target: Vector3 = new Vector3(Math.floor(Math.random() * 20), 0.2, Math.floor(Math.random() * 20))*/
        this.fraction = 0;
    }
    LerpData = __decorate([
        Component('lerpData')
    ], LerpData);
    return LerpData;
}());
exports.LerpData = LerpData;
var Dragon = /** @class */ (function (_super) {
    __extends(Dragon, _super);
    function Dragon(id, state) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.state = state;
        //getFromServer(this);
        var rand = Math.floor(Math.random() * 20);
        _this.addComponent(new GLTFShape("assets/models/DragoYellow/DragoYellow.gltf"));
        _this.addComponent(new Transform({
            position: new Vector3(rand, 0.2, rand),
            scale: new Vector3(2, 2, 2)
        }));
        _this.addComponent(new Stats);
        //this.addComponent(DragonUpdate)
        //engine.addSystem(DragonUpdate)
        //Animations ---------------------------------------------------------------------------------
        var animator = new Animator();
        _this.addComponent(animator);
        _this.clipIdle = new AnimationState("Idle");
        _this.clipRun = new AnimationState("Run");
        _this.clipSleepDown = new AnimationState("SleepDown");
        _this.clipSleepUp = new AnimationState("SleepUp");
        _this.clipSleep = new AnimationState("Sleep");
        _this.clipWalk = new AnimationState("Walk");
        _this.clipDig = new AnimationState("Dig");
        _this.clipLook = new AnimationState("Look");
        _this.clipFlyUp = new AnimationState("FlyUp");
        _this.clipFlyIdle = new AnimationState("FlyIdle");
        _this.clipFlyDown = new AnimationState("FlyDown");
        _this.clipAttackHead = new AnimationState("AttackHead");
        _this.clipTurnRight = new AnimationState("TurnRight");
        _this.clipFlyLand = new AnimationState("FlyLand");
        _this.clipSmell = new AnimationState("Smell");
        _this.clipSmellHimself = new AnimationState("SmellHimself");
        _this.clipJump = new AnimationState("Jump");
        _this.clipHappy = new AnimationState("Happy");
        _this.clipAfraid = new AnimationState("Afraid");
        _this.clipHatch = new AnimationState("Hatch");
        _this.clipSad = new AnimationState("Sad");
        _this.clipScratch = new AnimationState("Scratch");
        animator.addClip(_this.clipIdle);
        animator.addClip(_this.clipRun);
        animator.addClip(_this.clipSleepDown);
        animator.addClip(_this.clipSleepUp);
        animator.addClip(_this.clipSleep);
        animator.addClip(_this.clipWalk);
        animator.addClip(_this.clipDig);
        animator.addClip(_this.clipLook);
        animator.addClip(_this.clipFlyUp);
        animator.addClip(_this.clipFlyIdle);
        animator.addClip(_this.clipFlyDown);
        animator.addClip(_this.clipAttackHead);
        animator.addClip(_this.clipTurnRight);
        animator.addClip(_this.clipFlyLand);
        animator.addClip(_this.clipSmell);
        animator.addClip(_this.clipSmellHimself);
        animator.addClip(_this.clipJump);
        animator.addClip(_this.clipHappy);
        animator.addClip(_this.clipAfraid);
        animator.addClip(_this.clipHatch);
        animator.addClip(_this.clipSad);
        animator.addClip(_this.clipScratch);
        //this.clipIdle.play()
        //To manage the dragon's states -----------------------------------------------------------------
        var currentState = "idle";
        //const currentObjective: 
        _this.addComponent(new LerpData());
        _this.waitingTime = Math.floor(Math.random() * 400); //Between 1 and 4s
        //let timeRemaining = rand2
        _this.originPosition = _this.getComponent(Transform).position;
        _this.targetPosition = new Vector3(Math.floor(Math.random() * 20) + 1, 0.2, Math.floor(Math.random() * 20) + 1);
        _this.ChangeState();
        _this.addComponent(new index_1.default.Interval(20, function () {
            if (_this.state == "idle" || _this.state == "dig" || _this.state == "look" || _this.state == "smell" || _this.state == "happy") {
                _this.waitingTime--;
                if (_this.waitingTime <= 0) {
                    _this.ChangeState();
                    _this.waitingTime = Math.floor(Math.random() * 400);
                }
            }
            else if (_this.state == "run") {
                var transform = _this.getComponent(Transform);
                var lerp = _this.getComponent(LerpData);
                if (lerp.fraction < 1) {
                    transform.lookAt(_this.originPosition);
                    lerp.fraction += 0.01;
                    //log("POSITION " + this.getComponent(Transform).position)
                    //sendToServer(this);
                    if (lerp.fraction < 1)
                        transform.position = Vector3.Lerp(_this.originPosition, _this.targetPosition, lerp.fraction);
                    else
                        transform.position = _this.targetPosition;
                }
                else {
                    lerp.fraction = 0;
                    _this.ChangeState();
                    game_1.sendToServer(_this); //Save DATAs to server
                }
            }
        }));
        engine.addEntity(_this);
        return _this;
    }
    Dragon.prototype.ChangeState = function () {
        //log("CHANGING STATE")
        var newRand = Math.floor(Math.random() * 80);
        if (newRand <= 0) {
            this.state = "idle";
            this.ChangeAnim(this.state);
        }
        else if (newRand > 0 && newRand <= 1) {
            this.state = "idle";
            this.ChangeAnim(this.state);
        }
        else if (newRand > 1 && newRand <= 2) {
            this.state = "dig";
            this.ChangeAnim(this.state);
        }
        else if (newRand > 2 && newRand <= 3) {
            this.state = "look";
            this.ChangeAnim(this.state);
        }
        else if (newRand > 3 && newRand <= 4) {
            this.state = "smell";
            this.ChangeAnim(this.state);
        }
        else {
            this.originPosition = this.getComponent(Transform).position;
            this.targetPosition = new Vector3(Math.floor(Math.random() * 20) + 1, 0.2, Math.floor(Math.random() * 20) + 1);
            this.state = "run";
            this.Run();
        }
    };
    Dragon.prototype.Idle = function () {
        //log("IDLE")
        this.state = "idle";
        this.ChangeAnim("idle");
    };
    Dragon.prototype.Run = function () {
        //log("RUN")
        this.state = "run";
        this.ChangeAnim("run");
    };
    Dragon.prototype.ChangeAnim = function (animName) {
        this.clipIdle.stop();
        this.clipRun.stop();
        this.clipSleepDown.stop();
        this.clipSleepUp.stop();
        this.clipSleep.stop();
        this.clipWalk.stop();
        this.clipDig.stop();
        this.clipLook.stop();
        this.clipFlyUp.stop();
        this.clipFlyIdle.stop();
        this.clipFlyDown.stop();
        this.clipAttackHead.stop();
        this.clipTurnRight.stop();
        this.clipFlyLand.stop();
        this.clipSmell.stop();
        this.clipSmellHimself.stop();
        this.clipJump.stop();
        this.clipHappy.stop();
        this.clipAfraid.stop();
        this.clipHatch.stop();
        this.clipSad.stop();
        this.clipScratch.stop();
        if (animName == "idle")
            this.clipIdle.play();
        else if (animName == "run")
            this.clipRun.play();
        else if (animName == "sleepDown")
            this.clipSleepDown.play();
        else if (animName == "sleepUp")
            this.clipSleepUp.play();
        else if (animName == "sleep")
            this.clipSleep.play();
        else if (animName == "walk")
            this.clipWalk.play();
        else if (animName == "dig")
            this.clipDig.play();
        else if (animName == "look")
            this.clipLook.play();
        else if (animName == "flyUp")
            this.clipFlyUp.play();
        else if (animName == "flyIdle")
            this.clipFlyIdle.play();
        else if (animName == "flyDown")
            this.clipFlyDown.play();
        else if (animName == "attackHead")
            this.clipAttackHead.play();
        else if (animName == "turnRight")
            this.clipTurnRight.play();
        else if (animName == "flyLand")
            this.clipFlyLand.play();
        else if (animName == "smell")
            this.clipSmell.play();
        else if (animName == "smellHimself")
            this.clipSmellHimself.play();
        else if (animName == "jump")
            this.clipJump.play();
        else if (animName == "happy")
            this.clipHappy.play();
        else if (animName == "afraid")
            this.clipAfraid.play();
        else if (animName == "hatch")
            this.clipHatch.play();
        else if (animName == "sad")
            this.clipSad.play();
        else if (animName == "scratch")
            this.clipScratch.play();
    };
    return Dragon;
}(Entity));
exports.Dragon = Dragon;
var dragonID = 0;
var allDragons = [new Dragon(dragonID, "idle")];
function LoadAllDragons() {
}
exports.LoadAllDragons = LoadAllDragons;
function CreateDragon() {
    dragonID += 1;
    allDragons.push(new Dragon(dragonID, "idle"));
}
exports.CreateDragon = CreateDragon;
function GetDragons() {
    return allDragons;
}
exports.GetDragons = GetDragons;
function loadDragons() {
    game_1.getFromServer();
}
exports.loadDragons = loadDragons;
function SetDragonsCoord(nb, x, y, z) {
}
exports.SetDragonsCoord = SetDragonsCoord;
CreateDragon();
//log(GetDragons()[3].id)
