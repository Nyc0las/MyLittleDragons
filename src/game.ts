import { BuildMap } from "./map";
import { CreateEgg, CreateDragon, LoadDragon, Dragon, GetDragons } from "./dragons";
import { getUserData, UserData } from '@decentraland/Identity'
import utils from "../node_modules/decentraland-ecs-utils/index"

import { createChannel } from '../node_modules/decentraland-builder-scripts/channel'
import { createInventory } from '../node_modules/decentraland-builder-scripts/inventory'
import Script1 from "c1da72b5-fbda-4ba5-ad96-a921a3ef0d3b/src/item"
import Script2 from "68986c60-c95c-41ab-adf0-d0e02f5b5440/src/item"

// Data
let dragonName = "Dragonou"
let dragonMood = "Happy"

///// Get user ID
let userid: string// = ""+Math.floor(Math.random() * 500)


const idNum = Math.floor(Math.random() * 500)
let id: UserData = {
    userId: idNum.toString(),
    displayName: 'a',
    publicKey: '123',
    hasConnectedWeb3: true
}
userid = id.userId;
//get actual id
export function getUser() {
    executeTask(async () => {
        try
        {
            id = await getUserData()
            if (id)
            {
                log('ID: ', id.userId)
                userid = id.userId;
            }
        }
        catch
        {
            log('failed to reach user ID')
            id = {
                userId: idNum.toString(),
                displayName: 'a',
                publicKey: '123',
                hasConnectedWeb3: true
            }
            log('ID: ', id.userId)
            userid = id.userId;
        }
    })
}
getUser()

const ambiance: Entity = new Entity()
let SFX_Ambiance = new AudioSource(new AudioClip("sounds/Forest.mp3"))
ambiance.addComponent(SFX_Ambiance)
engine.addEntity(ambiance)
SFX_Ambiance.loop = true 
SFX_Ambiance.playing = true  

const timer = new Entity('timer')
engine.addEntity(timer)
let waitingTime = 600;
timer.addComponent(new utils.Interval(100, (): void =>
{
    waitingTime--
    //log("WAITING "+waitingTime)
    if(waitingTime<=0)
    {
        log("SAVING")
        waitingTime = 600

        let dragons: Dragon[]
        dragons = GetDragons()
        sendToServer(dragons[0])
	}
}))

///// Connect to the REST API

const apiUrl = "https://cors-anywhere.herokuapp.com/http://ec2-34-223-224-128.us-west-2.compute.amazonaws.com:80"

const headers = {
    Accept: "application/json",
    "Content-Type": "application/json"
};

// SEND DATA TO SERVER
export function sendToServer(drag: Dragon) {
    //log("SEND DATA TO SERVER")
    let id = drag.id
    let color = drag.color
    let x = drag.targetPosition.x
    let y = drag.targetPosition.y
    let z = drag.targetPosition.z
    let state = drag.state
    let energy = drag.energy
    let food = drag.food
    let life = drag.health
    let mood = drag.mood

    let url = `${apiUrl}/api/dragons/SetStats`
    let method = "POST";
    let headers = { "Content-Type": "application/json" }
    let body = JSON.stringify({ "userid": userid, "id": id, "color": color, "x": x, "y": y, "z": z, "state": state, "energy": energy, "food": food, "life": life, "name": dragonName, "mood": mood })

    executeTask(async () => {
        try {
            let response = await fetch(url, {
                headers: headers,
                method: method,
                body: body
            })
        }
        catch {
            log("error sending data change")
        }
        finally {
            log("finally nothing")
        }
    })
    //getUserInfo()
}

// GET ALL STATS FROM SERVER
/*export function getFromServer() {

    let url = `${apiUrl}/api/dragons/GetStats`

    executeTask(async () => {
        try {
            let response = await fetch(url)
            let json = await response.json()

            //return json;
            //log("JSON " + json)
            //log("GOT data from server " + json.x[0])
            LoadDragons(json.color, json.state, json.x, json.y, json.z)
        } catch {
            log("ERROR getting data")
        }

    })
}*/

// GET STATS FROM USER ID
export function getUserInfo() {
    //log("START GETUSERINFO")


    let url = `${apiUrl}/api/dragons/GetUserDragons`
    let method = "POST";
    let headers = { "Content-Type": "application/json" }
    let body = JSON.stringify({ "userid": userid })

    executeTask(async () => {
        try {
            let response = await fetch(url, {
                headers: headers,
                method: method,
                body: body
            })
            let json = await response.json()

            if (json.userid == "1111111111")
                CreateEgg()
            else
            {
                RemoveIndicatorArrow()
                LoadDragon(json.color, json.x, json.y, json.z, json.state, json.energy, json.food, json.life, json.name, json.mood)
            }

            //log("USERID=" + userid+"/"+json.userid + " DragonID=" + json.id + " Color=" + json.color + " x=" + json.x + " y=" + json.y + " z=" + json.z + " state=" + json.state + " energy=" + json.energy + " food=" + json.food + " life=" + json.life + " name=" + json.name +" mood=" + json.mood)
        } catch {
            log("error sending data change")
        }
    })
}

// Start the scene with the door's state matching the server
//getFromServer()
getUserInfo()

BuildMap();

/*let data: any[][] = [[]]
data[0][0] = ["blabla"]
data[0][1] = 2
data.push([9, 8])
log("DATA LE?GTH " + data.length)

for (let i = 0; i < data.length; i++)
{
    log("DATA" + data[i])
    log("DATA IS "+data[i][0])
}*/

//const dragon = new Dragon;
//engine.addEntity(dragon.drago);

export function GetFoodPos(): Vector3
{
    return woodenCrate.getComponent(Transform).position
}

export function RemoveIndicatorArrow()
{
    engine.removeEntity(indicatorArrow)
}


// UI MANAGEMENT //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// create canvas
const canvas = new UICanvas()
canvas.visible = true 
// create container inside canvas
const rect = new UIContainerRect(canvas)
rect.adaptHeight = true
rect.adaptWidth = true
rect.hAlign = 'right'
rect.vAlign = 'center'
rect.opacity = 1.0

let backgroundUITexture = new Texture("assets/ui/Background_Slim.png")
const backgroundImgScreen = new UIImage(rect, backgroundUITexture)
backgroundImgScreen.hAlign = 'left'
backgroundImgScreen.positionX = -150
backgroundImgScreen.positionY = 300
backgroundImgScreen.vAlign = 'top'
backgroundImgScreen.sourceLeft = 0
backgroundImgScreen.sourceTop = 0
backgroundImgScreen.sourceWidth = 346
backgroundImgScreen.sourceHeight = 583
backgroundImgScreen.width = 207
backgroundImgScreen.height = 350

// Create points
let pointHealthTexture : Texture[] = []
const pointHealthImgScreen : UIImage[] = []
let pointEnergyTexture : Texture[] = []
const pointEnergyImgScreen : UIImage[] = []
let pointHungerTexture : Texture[] = []
const pointHungerImgScreen : UIImage[] = []
let pointMoodTexture : Texture[] = []
const pointMoodImgScreen : UIImage[] = []

for(let i=0;i<20;i++)
{
    pointHealthTexture[i] = new Texture("assets/ui/UI_Point.png")
    pointHealthImgScreen[i] = new UIImage(rect, pointHealthTexture[i])

    pointHealthImgScreen[i].hAlign = 'left'
    pointHealthImgScreen[i].positionX = -123+i*8
    pointHealthImgScreen[i].positionY = 218
    pointHealthImgScreen[i].vAlign = 'top'
    pointHealthImgScreen[i].sourceLeft = 0
    pointHealthImgScreen[i].sourceTop = 0
    pointHealthImgScreen[i].sourceWidth = 22
    pointHealthImgScreen[i].sourceHeight = 48
    pointHealthImgScreen[i].width = 6
    pointHealthImgScreen[i].height = 12

    pointEnergyTexture[i] = new Texture("assets/ui/UI_Point.png")
    pointEnergyImgScreen[i] = new UIImage(rect, pointHealthTexture[i])

    pointEnergyImgScreen[i].hAlign = 'left'
    pointEnergyImgScreen[i].positionX = -123+i*8
    pointEnergyImgScreen[i].positionY = 179
    pointEnergyImgScreen[i].vAlign = 'top'
    pointEnergyImgScreen[i].sourceLeft = 0
    pointEnergyImgScreen[i].sourceTop = 0
    pointEnergyImgScreen[i].sourceWidth = 22
    pointEnergyImgScreen[i].sourceHeight = 48
    pointEnergyImgScreen[i].width = 6
    pointEnergyImgScreen[i].height = 12

    pointHungerTexture[i] = new Texture("assets/ui/UI_Point.png")
    pointHungerImgScreen[i] = new UIImage(rect, pointHealthTexture[i])

    pointHungerImgScreen[i].hAlign = 'left'
    pointHungerImgScreen[i].positionX = -123+i*8
    pointHungerImgScreen[i].positionY = 139
    pointHungerImgScreen[i].vAlign = 'top'
    pointHungerImgScreen[i].sourceLeft = 0
    pointHungerImgScreen[i].sourceTop = 0
    pointHungerImgScreen[i].sourceWidth = 22
    pointHungerImgScreen[i].sourceHeight = 48
    pointHungerImgScreen[i].width = 6
    pointHungerImgScreen[i].height = 12

    pointMoodTexture[i] = new Texture("assets/ui/UI_Point.png")
    pointMoodImgScreen[i] = new UIImage(rect, pointHealthTexture[i])

    pointMoodImgScreen[i].hAlign = 'left'
    pointMoodImgScreen[i].positionX = -123+i*8
    pointMoodImgScreen[i].positionY = 99
    pointMoodImgScreen[i].vAlign = 'top'
    pointMoodImgScreen[i].sourceLeft = 0
    pointMoodImgScreen[i].sourceTop = 0
    pointMoodImgScreen[i].sourceWidth = 22
    pointMoodImgScreen[i].sourceHeight = 48
    pointMoodImgScreen[i].width = 6
    pointMoodImgScreen[i].height = 12
}

const moodTxt = new UIText(rect)
moodTxt.outlineColor = new Color4(0.7, 1, 0.8, 1)
moodTxt.value = dragonMood
moodTxt.fontSize = 12
moodTxt.width = 500
moodTxt.height = 205
moodTxt.positionX = -55
moodTxt.positionY = 232
moodTxt.color = new Color4(0.7, 1, 0.8, 1)
moodTxt.textWrapping = true

const nameTxt = new UIText(rect)
nameTxt.outlineColor = new Color4(0.7, 1, 0.8, 1)
backgroundImgScreen.hAlign = 'left'
nameTxt.value = dragonName
nameTxt.fontSize = 18
nameTxt.width = 500
nameTxt.height = 205
nameTxt.positionX = -105
nameTxt.positionY = 371
nameTxt.color = new Color4(0.7, 0, 0.8, 1)
nameTxt.textWrapping = true

const clickableImage = new UIImage(rect, new Texture('assets/ui/Button_Edit.png'))
clickableImage.name = 'clickable-image'
clickableImage.width = '70px'
clickableImage.height = '18px'
clickableImage.sourceWidth = 140
clickableImage.sourceHeight = 70
clickableImage.width = 30
clickableImage.height = 15
clickableImage.positionX = -175
clickableImage.positionY = 278
clickableImage.isPointerBlocker = true
clickableImage.onClick = new OnClick(() => {
  ShowInput()
})

const textInput = new UIInputText(rect)
textInput.width = '100%'
textInput.height = '15px'
textInput.vAlign = 'bottom'
textInput.hAlign = 'center'
textInput.fontSize = 10
textInput.placeholder = 'Type new name'
textInput.placeholderColor = Color4.Gray()
textInput.positionY = '200px'
textInput.positionX = -102
textInput.positionY = 295
textInput.isPointerBlocker = true
textInput.visible = false
 

textInput.onTextSubmit = new OnTextSubmit(x => {
  //const text = new UIText(textInput)
  SetDragonName(x.text)
  HideInput()
  /*text.value = '<USER-ID> ' + x.text
  text.width = '100%'
  text.height = '20px'
  text.vAlign = 'top'
  text.hAlign = 'left'*/
})

function ShowInput()
{
    textInput.visible = true
    nameTxt.visible = false
}

function HideInput()
{
    textInput.visible = false
    nameTxt.visible = true

}

export function SetDragonName(n: string)
{
    dragonName = n
    nameTxt.value = dragonName
}

export function SetDragonMood(n: string)
{
    moodTxt.value = n
}

export function UpdateUI(health: number, energy: number, hunger: number, mood: number)
{
    for(let h=0;h<20;h++)
    {
        pointHealthImgScreen[h].visible = false
        pointEnergyImgScreen[h].visible = false
        pointHungerImgScreen[h].visible = false
        pointMoodImgScreen[h].visible = false
	}

    for(let i=0;i<health;i++)
    {
        pointHealthImgScreen[i].visible = true
	}

    for(let j=0;j<energy;j++)
    {
        pointEnergyImgScreen[j].visible = true
	}

    for(let k=0;k<hunger;k++)
    {
        pointHungerImgScreen[k].visible = true
	}

    for(let l=0;l<mood;l++)
    {
        pointMoodImgScreen[l].visible = true
	}
}

UpdateUI(0,0,0,0)


//////////////////////////////////////////////////////////////////////////////

const buttonCall1 = new UIImage(rect, new Texture('assets/ui/Button_Call.png'))
buttonCall1.name = 'clickable-image'
buttonCall1.width = '70px'
buttonCall1.height = '18px'
buttonCall1.sourceWidth = 70
buttonCall1.sourceHeight = 70
buttonCall1.width = 40
buttonCall1.height = 40
buttonCall1.positionX = -165
buttonCall1.positionY = 70
buttonCall1.visible = false
buttonCall1.isPointerBlocker = true
buttonCall1.onClick = new OnClick(() => {
  CallDragon()
})

const buttonCall2 = new UIImage(rect, new Texture('assets/ui/Button_Fly.png'))
buttonCall2.name = 'clickable-image'
buttonCall2.width = '70px'
buttonCall2.height = '18px'
buttonCall2.sourceWidth = 70
buttonCall2.sourceHeight = 70
buttonCall2.width = 40
buttonCall2.height = 40
buttonCall2.positionX = -120
buttonCall2.positionY = 70
buttonCall2.visible = false
buttonCall2.isPointerBlocker = true
buttonCall2.onClick = new OnClick(() => {
  FlyDragon()
})

const buttonCall3 = new UIImage(rect, new Texture('assets/ui/Button_Land.png'))
buttonCall3.name = 'clickable-image'
buttonCall3.width = '70px'
buttonCall3.height = '18px'
buttonCall3.sourceWidth = 70
buttonCall3.sourceHeight = 70
buttonCall3.width = 40
buttonCall3.height = 40
buttonCall3.positionX = -75
buttonCall3.positionY = 70
buttonCall3.visible = false
buttonCall3.isPointerBlocker = true
buttonCall3.onClick = new OnClick(() => {
  LandDragon()
})

export function ShowButtons()
{
  buttonCall1.visible = true
  buttonCall2.visible = true
  buttonCall3.visible = true
}

/*const buttonCall4 = new UIImage(rect, new Texture('assets/ui/Button_Play.png'))
buttonCall4.name = 'clickable-image'
buttonCall4.width = '70px'
buttonCall4.height = '18px'
buttonCall4.sourceWidth = 70
buttonCall4.sourceHeight = 70
buttonCall4.width = 40
buttonCall4.height = 40
buttonCall4.positionX = -30
buttonCall4.positionY = 70
buttonCall4.isPointerBlocker = true
buttonCall4.onClick = new OnClick(() => {
  PlayDragon()
})

const buttonCall5 = new UIImage(rect, new Texture('assets/ui/Button_Eat.png'))
buttonCall5.name = 'clickable-image'
buttonCall5.width = '70px'
buttonCall5.height = '18px'
buttonCall5.sourceWidth = 70
buttonCall5.sourceHeight = 70
buttonCall5.width = 40
buttonCall5.height = 40
buttonCall5.positionX = -165
buttonCall5.positionY = 20
buttonCall5.isPointerBlocker = true
buttonCall5.onClick = new OnClick(() => {
  EatDragon()
})

const buttonCall6 = new UIImage(rect, new Texture('assets/ui/Button_Wash.png'))
buttonCall6.name = 'clickable-image'
buttonCall6.width = '70px'
buttonCall6.height = '18px'
buttonCall6.sourceWidth = 70
buttonCall6.sourceHeight = 70
buttonCall6.width = 40
buttonCall6.height = 40
buttonCall6.positionX = -120
buttonCall6.positionY = 20
buttonCall6.isPointerBlocker = true
buttonCall6.onClick = new OnClick(() => {
  WashDragon()
})*/

function CallDragon()
{
    let dragons: Dragon[]
    dragons = GetDragons()

    if(dragons[0].mood > 0)
    {
        dragons[0].CallDragon()
        dragons[0].Sound_HappyMiaule()
    }
    else
    {
        dragons[0].Sound_SadRale()    
	}
    //log("the dragon is: "+dragons[0].id)
}

function FlyDragon()
{
    let dragons: Dragon[]
    dragons = GetDragons()
    if(dragons[0].mood > 0)
    {
        dragons[0].Fly()
        dragons[0].Sound_NormalMiaule1()
	}
    else
    {
        dragons[0].Sound_SadRale()    
	}
}

function LandDragon()
{
    let dragons: Dragon[]
    dragons = GetDragons()
    if(dragons[0].mood > 0)
    {
        dragons[0].Land()
        dragons[0].Sound_NormalMiaule2()
	}
    else
    {
        dragons[0].Sound_SadRale()    
	}
}

function PlayDragon()
{

}

function EatDragon()
{

}

function WashDragon()
{

}

/*const buttonCall = new UIImage(rect, new Texture('assets/ui/Button_Call.png'))
buttonCall.name = 'clickable-image'
buttonCall.width = '70px'
buttonCall.height = '18px'
buttonCall.sourceWidth = 70
buttonCall.sourceHeight = 70
buttonCall.width = 40
buttonCall.height = 40
buttonCall.positionX = -75
buttonCall.positionY = 20
buttonCall.isPointerBlocker = true
buttonCall.onClick = new OnClick(() => {
  
})

const buttonCall = new UIImage(rect, new Texture('assets/ui/Button_Call.png'))
buttonCall.name = 'clickable-image'
buttonCall.width = '70px'
buttonCall.height = '18px'
buttonCall.sourceWidth = 70
buttonCall.sourceHeight = 70
buttonCall.width = 40
buttonCall.height = 40
buttonCall.positionX = -30
buttonCall.positionY = 20
buttonCall.isPointerBlocker = true
buttonCall.onClick = new OnClick(() => {
  
})*/

/*let actionsUITexture = new Texture("assets/ui/UI_Background_Simple.png")
const actionsImgScreen = new UIImage(rect, actionsUITexture)
actionsImgScreen.hAlign = 'left'
actionsImgScreen.positionX = -110
actionsImgScreen.positionY = 0
actionsImgScreen.vAlign = 'top'
actionsImgScreen.sourceLeft = 0
actionsImgScreen.sourceTop = 0
actionsImgScreen.sourceWidth = 542
actionsImgScreen.sourceHeight = 688
actionsImgScreen.width = 135
actionsImgScreen.height = 344

const buttonCall = new UIImage(rect, new Texture('assets/ui/UI_Button_Call.png'))
buttonCall.name = 'clickable-image'
buttonCall.width = '70px'
buttonCall.height = '18px'
buttonCall.sourceWidth = 290
buttonCall.sourceHeight = 93
buttonCall.width = 100
buttonCall.height = 30
buttonCall.positionX = -90
buttonCall.positionY = -20
buttonCall.isPointerBlocker = true
buttonCall.onClick = new OnClick(() => {
  
})

const buttonCall = new UIImage(rect, new Texture('assets/ui/UI_Button_Feed.png'))
buttonCall.name = 'clickable-image'
buttonCall.width = '70px'
buttonCall.height = '18px'
buttonCall.sourceWidth = 290
buttonCall.sourceHeight = 93
buttonCall.width = 100
buttonCall.height = 30
buttonCall.positionX = -90
buttonCall.positionY = -60
buttonCall.isPointerBlocker = true
buttonCall.onClick = new OnClick(() => {
  
})

const buttonCall = new UIImage(rect, new Texture('assets/ui/UI_Button_Fly.png'))
buttonCall.name = 'clickable-image'
buttonCall.width = '70px'
buttonCall.height = '18px'
buttonCall.sourceWidth = 290
buttonCall.sourceHeight = 93
buttonCall.width = 100
buttonCall.height = 30
buttonCall.positionX = -90
buttonCall.positionY = -100
buttonCall.isPointerBlocker = true
buttonCall.onClick = new OnClick(() => {
  
})

const buttonCall = new UIImage(rect, new Texture('assets/ui/UI_Button_Land.png'))
buttonCall.name = 'clickable-image'
buttonCall.width = '70px'
buttonCall.height = '18px'
buttonCall.sourceWidth = 290
buttonCall.sourceHeight = 93
buttonCall.width = 100
buttonCall.height = 30
buttonCall.positionX = -90
buttonCall.positionY = -140
buttonCall.isPointerBlocker = true
buttonCall.onClick = new OnClick(() => {
  
})

const buttonCall = new UIImage(rect, new Texture('assets/ui/UI_Button_Play.png'))
buttonCall.name = 'clickable-image'
buttonCall.width = '70px'
buttonCall.height = '18px'
buttonCall.sourceWidth = 290
buttonCall.sourceHeight = 93
buttonCall.width = 100
buttonCall.height = 30
buttonCall.positionX = -90
buttonCall.positionY = -180
buttonCall.isPointerBlocker = true
buttonCall.onClick = new OnClick(() => {
  
})

const buttonCall = new UIImage(rect, new Texture('assets/ui/UI_Button_Scratch.png'))
buttonCall.name = 'clickable-image'
buttonCall.width = '70px'
buttonCall.height = '18px'
buttonCall.sourceWidth = 290
buttonCall.sourceHeight = 93
buttonCall.width = 100
buttonCall.height = 30
buttonCall.positionX = -90
buttonCall.positionY = -220
buttonCall.isPointerBlocker = true
buttonCall.onClick = new OnClick(() => {
  
})

const buttonCall = new UIImage(rect, new Texture('assets/ui/UI_Button_Wash.png'))
buttonCall.name = 'clickable-image'
buttonCall.width = '70px'
buttonCall.height = '18px'
buttonCall.sourceWidth = 290
buttonCall.sourceHeight = 93
buttonCall.width = 100
buttonCall.height = 30
buttonCall.positionX = -90
buttonCall.positionY = -260
buttonCall.isPointerBlocker = true
buttonCall.onClick = new OnClick(() => {
  
})
*/

//Adding 3D text countdown
/*const dragonUI = new Entity()
const dragonText3D = new TextShape(dragonName)
dragonText3D.fontSize = 5
dragonText3D.color = Color3.White()
GetDragons[0].entity.addComponent(dragonText3D)
GetDragons[0].entity.addComponent(new Transform({
position : new Vector3 (0,0,0),
    rotation: Quaternion.Euler(0,180,0)
}))
GetDragons[0].entity.addComponent(new Billboard())*/

//engine.addEntity(dragonUI)


// BUILD WORLD ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const _scene = new Entity('_scene')
engine.addEntity(_scene)
const transform = new Transform({
  position: new Vector3(0, 0, 0),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
_scene.addComponentOrReplace(transform)

const entity = new Entity('entity')
engine.addEntity(entity)
entity.setParent(_scene)
const gltfShape = new GLTFShape("models/FloorBaseGrass_01/FloorBaseGrass_01.glb")
gltfShape.withCollisions = true
gltfShape.visible = true
entity.addComponentOrReplace(gltfShape)
const transform2 = new Transform({
  position: new Vector3(8, 0, 8),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
entity.addComponentOrReplace(transform2)

const entity2 = new Entity('entity2')
engine.addEntity(entity2)
entity2.setParent(_scene)
entity2.addComponentOrReplace(gltfShape)
const transform3 = new Transform({
  position: new Vector3(24, 0, 8),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
entity2.addComponentOrReplace(transform3)

const entity3 = new Entity('entity3')
engine.addEntity(entity3)
entity3.setParent(_scene)
entity3.addComponentOrReplace(gltfShape)
const transform4 = new Transform({
  position: new Vector3(8, 0, 24),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
entity3.addComponentOrReplace(transform4)

const entity4 = new Entity('entity4')
engine.addEntity(entity4)
entity4.setParent(_scene)
entity4.addComponentOrReplace(gltfShape)
const transform5 = new Transform({
  position: new Vector3(24, 0, 24),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
entity4.addComponentOrReplace(transform5)

const entity5 = new Entity('entity5')
engine.addEntity(entity5)
entity5.setParent(_scene)
entity5.addComponentOrReplace(gltfShape)
const transform6 = new Transform({
  position: new Vector3(40, 0, 8),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
entity5.addComponentOrReplace(transform6)

const entity6 = new Entity('entity6')
engine.addEntity(entity6)
entity6.setParent(_scene)
entity6.addComponentOrReplace(gltfShape)
const transform7 = new Transform({
  position: new Vector3(40, 0, 24),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
entity6.addComponentOrReplace(transform7)

const largePond = new Entity('largePond')
engine.addEntity(largePond)
largePond.setParent(_scene)
const transform8 = new Transform({
  position: new Vector3(22.5, 0, 5),
  rotation: new Quaternion(0, -1, 0, 1),
  scale: new Vector3(1, 1, 1)
})
largePond.addComponentOrReplace(transform8)
const gltfShape2 = new GLTFShape("models/Pond_02/Pond_02.glb")
gltfShape2.withCollisions = true
gltfShape2.visible = true
largePond.addComponentOrReplace(gltfShape2)

const pond = new Entity('pond')
engine.addEntity(pond)
pond.setParent(_scene)
const transform9 = new Transform({
  position: new Vector3(40, 0, 15),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
pond.addComponentOrReplace(transform9)
const gltfShape3 = new GLTFShape("models/Pond_01/Pond_01.glb")
gltfShape3.withCollisions = true
gltfShape3.visible = true
pond.addComponentOrReplace(gltfShape3)

const woodenCrate = new Entity('woodenCrate')
engine.addEntity(woodenCrate)
woodenCrate.setParent(_scene)
const transform10 = new Transform({
  position: new Vector3(28, 0, 2.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
woodenCrate.addComponentOrReplace(transform10)
const gltfShape4 = new GLTFShape("models/VegetablesBox_01/VegetablesBox_01.glb")
gltfShape4.withCollisions = true
gltfShape4.visible = true
woodenCrate.addComponentOrReplace(gltfShape4)

const soccerBall = new Entity('soccerBall')
engine.addEntity(soccerBall)
soccerBall.setParent(_scene)
const transform11 = new Transform({
  position: new Vector3(12, 0, 9.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
soccerBall.addComponentOrReplace(transform11)
const gltfShape5 = new GLTFShape("models/PlaygroundBall_01/PlaygroundBall_01.glb")
gltfShape5.withCollisions = true
gltfShape5.visible = true
soccerBall.addComponentOrReplace(gltfShape5)

const smallRoundBrickGrassBed = new Entity('smallRoundBrickGrassBed')
engine.addEntity(smallRoundBrickGrassBed)
smallRoundBrickGrassBed.setParent(_scene)
const transform12 = new Transform({
  position: new Vector3(8.078312873840332, 0, 4.580322742462158),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
smallRoundBrickGrassBed.addComponentOrReplace(transform12)
const gltfShape6 = new GLTFShape("models/GrassPatchSmall_01/GrassPatchSmall_01.glb")
gltfShape6.withCollisions = true
gltfShape6.visible = true
smallRoundBrickGrassBed.addComponentOrReplace(gltfShape6)

const squareSignpost = new Entity('squareSignpost')
engine.addEntity(squareSignpost)
squareSignpost.setParent(_scene)
const transform13 = new Transform({
  position: new Vector3(6.0368804931640625, 0, 5.052581787109375),
  rotation: new Quaternion(2.4290429473464983e-15, -0.3515019416809082, 4.190228963807385e-8, 0.9361871480941772),
  scale: new Vector3(0.9999985694885254, 1, 0.9999985694885254)
})
squareSignpost.addComponentOrReplace(transform13)

const squareSignpostBis = new Entity('squareSignpostBis')
engine.addEntity(squareSignpostBis)
squareSignpostBis.setParent(_scene)
const transform13bis = new Transform({
  position: new Vector3(2, 0, 17),
  rotation: new Quaternion(0,-1,0,1),
  scale: new Vector3(0.9999985694885254, 1, 0.9999985694885254)
})
squareSignpostBis.addComponentOrReplace(transform13bis)

const indicatorArrow = new Entity('indicatorArrow')
engine.addEntity(indicatorArrow)
indicatorArrow.setParent(_scene)
const transform14 = new Transform({
  position: new Vector3(8.010180473327637, 2.1269025802612305, 4.550172328948975),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(2.190855026245117, 2.190855026245117, 2.190855026245117)
})
indicatorArrow.addComponentOrReplace(transform14)

const bluePinkMysticalMushroomTree = new Entity('bluePinkMysticalMushroomTree')
engine.addEntity(bluePinkMysticalMushroomTree)
bluePinkMysticalMushroomTree.setParent(_scene)
const transform15 = new Transform({
  position: new Vector3(29.5, 0, 29),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
bluePinkMysticalMushroomTree.addComponentOrReplace(transform15)
const gltfShape7 = new GLTFShape("models/Tree_02/Tree_02.glb")
gltfShape7.withCollisions = true
gltfShape7.visible = true
bluePinkMysticalMushroomTree.addComponentOrReplace(gltfShape7)

const blueWeepingWillowTree = new Entity('blueWeepingWillowTree')
engine.addEntity(blueWeepingWillowTree)
blueWeepingWillowTree.setParent(_scene)
const transform16 = new Transform({
  position: new Vector3(27.5, 0, 24.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
blueWeepingWillowTree.addComponentOrReplace(transform16)
const gltfShape8 = new GLTFShape("models/Tree_Leafs_02/Tree_Leafs_02.glb")
gltfShape8.withCollisions = true
gltfShape8.visible = true
blueWeepingWillowTree.addComponentOrReplace(gltfShape8)

const sweetGeranium = new Entity('sweetGeranium')
engine.addEntity(sweetGeranium)
sweetGeranium.setParent(_scene)
const transform17 = new Transform({
  position: new Vector3(15, 0, 15),
  rotation: new Quaternion(-1.1059513315930347e-15, -0.5555702447891235, 6.622912707143769e-8, 0.8314695954322815),
  scale: new Vector3(0.9999995231628418, 1, 0.9999995231628418)
})
sweetGeranium.addComponentOrReplace(transform17)
const gltfShape9 = new GLTFShape("models/Bush_Fantasy_04/Bush_Fantasy_04.glb")
gltfShape9.withCollisions = true
gltfShape9.visible = true
sweetGeranium.addComponentOrReplace(gltfShape9)

const mediumLuxuriousFenceModule = new Entity('mediumLuxuriousFenceModule')
engine.addEntity(mediumLuxuriousFenceModule)
mediumLuxuriousFenceModule.setParent(_scene)
const transform18 = new Transform({
  position: new Vector3(0.8544340133666992, 0, 7.435207366943359),
  rotation: new Quaternion(-4.477151037873741e-15, -0.7063404321670532, 8.420234109962621e-8, 0.7078723907470703),
  scale: new Vector3(1.6930793523788452, 1.6930615901947021, 1.6930793523788452)
})
mediumLuxuriousFenceModule.addComponentOrReplace(transform18)
const gltfShape10 = new GLTFShape("models/Fence_Stone_3M/Fence_Stone_3M.glb")
gltfShape10.withCollisions = true
gltfShape10.visible = true
mediumLuxuriousFenceModule.addComponentOrReplace(gltfShape10)

const mysticalMushroomTree = new Entity('mysticalMushroomTree')
engine.addEntity(mysticalMushroomTree)
mysticalMushroomTree.setParent(_scene)
const transform19 = new Transform({
  position: new Vector3(32, 0, 7.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
mysticalMushroomTree.addComponentOrReplace(transform19)
const gltfShape11 = new GLTFShape("models/Tree_03/Tree_03.glb")
gltfShape11.withCollisions = true
gltfShape11.visible = true
mysticalMushroomTree.addComponentOrReplace(gltfShape11)

const purpleWeepingWillowTree = new Entity('purpleWeepingWillowTree')
engine.addEntity(purpleWeepingWillowTree)
purpleWeepingWillowTree.setParent(_scene)
const transform20 = new Transform({
  position: new Vector3(5, 0, 27),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
purpleWeepingWillowTree.addComponentOrReplace(transform20)
const gltfShape12 = new GLTFShape("models/Tree_Leafs_01/Tree_Leafs_01.glb")
gltfShape12.withCollisions = true
gltfShape12.visible = true
purpleWeepingWillowTree.addComponentOrReplace(gltfShape12)

const pinkAcaciaTree = new Entity('pinkAcaciaTree')
engine.addEntity(pinkAcaciaTree)
pinkAcaciaTree.setParent(_scene)
const transform21 = new Transform({
  position: new Vector3(31, 0, 5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
pinkAcaciaTree.addComponentOrReplace(transform21)
const gltfShape13 = new GLTFShape("models/Tree_Forest_Pink_01/Tree_Forest_Pink_01.glb")
gltfShape13.withCollisions = true
gltfShape13.visible = true
pinkAcaciaTree.addComponentOrReplace(gltfShape13)

const redLeafShrub = new Entity('redLeafShrub')
engine.addEntity(redLeafShrub)
redLeafShrub.setParent(_scene)
const transform22 = new Transform({
  position: new Vector3(35, 0, 20),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
redLeafShrub.addComponentOrReplace(transform22)
const gltfShape14 = new GLTFShape("models/Vegetation_08/Vegetation_08.glb")
gltfShape14.withCollisions = true
gltfShape14.visible = true
redLeafShrub.addComponentOrReplace(gltfShape14)

const moonTemplePond = new Entity('moonTemplePond')
engine.addEntity(moonTemplePond)
moonTemplePond.setParent(_scene)
const transform23 = new Transform({
  position: new Vector3(16.5, 0, 28),
  rotation: new Quaternion(6.721179331408561e-15, 1, -1.1920928244535389e-7, -3.725290298461914e-8),
  scale: new Vector3(1, 1, 1)
})
moonTemplePond.addComponentOrReplace(transform23)
const gltfShape15 = new GLTFShape("models/TempleMoon_01/TempleMoon_01.glb")
gltfShape15.withCollisions = true
gltfShape15.visible = true
moonTemplePond.addComponentOrReplace(gltfShape15)

const ritualPedestal = new Entity('ritualPedestal')
engine.addEntity(ritualPedestal)
ritualPedestal.setParent(_scene)
const transform24 = new Transform({
  position: new Vector3(1.5, 0, 30),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
ritualPedestal.addComponentOrReplace(transform24)
const gltfShape16 = new GLTFShape("models/Pedestal_01/Pedestal_01.glb")
gltfShape16.withCollisions = true
gltfShape16.visible = true
ritualPedestal.addComponentOrReplace(gltfShape16)

const ritualPedestal2 = new Entity('ritualPedestal2')
engine.addEntity(ritualPedestal2)
ritualPedestal2.setParent(_scene)
ritualPedestal2.addComponentOrReplace(gltfShape16)
const transform25 = new Transform({
  position: new Vector3(1.5, 0, 1.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
ritualPedestal2.addComponentOrReplace(transform25)

const ritualPedestal3 = new Entity('ritualPedestal3')
engine.addEntity(ritualPedestal3)
ritualPedestal3.setParent(_scene)
ritualPedestal3.addComponentOrReplace(gltfShape16)
const transform26 = new Transform({
  position: new Vector3(45, 0, 1.499997615814209),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
ritualPedestal3.addComponentOrReplace(transform26)

const ritualPedestal4 = new Entity('ritualPedestal4')
engine.addEntity(ritualPedestal4)
ritualPedestal4.setParent(_scene)
ritualPedestal4.addComponentOrReplace(gltfShape16)
const transform27 = new Transform({
  position: new Vector3(45, 0, 30),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
ritualPedestal4.addComponentOrReplace(transform27)

const clusteredBlueAcaciaTree = new Entity('clusteredBlueAcaciaTree')
engine.addEntity(clusteredBlueAcaciaTree)
clusteredBlueAcaciaTree.setParent(_scene)
const transform28 = new Transform({
  position: new Vector3(38, 0, 9),
  rotation: new Quaternion(-1.7142345960156728e-15, -1, 1.1920928244535389e-7, -5.21540641784668e-8),
  scale: new Vector3(1, 1, 1)
})
clusteredBlueAcaciaTree.addComponentOrReplace(transform28)
const gltfShape17 = new GLTFShape("models/Tree_Forest_Blue_03/Tree_Forest_Blue_03.glb")
gltfShape17.withCollisions = true
gltfShape17.visible = true
clusteredBlueAcaciaTree.addComponentOrReplace(gltfShape17)

const pinkAcaciaTree2 = new Entity('pinkAcaciaTree2')
engine.addEntity(pinkAcaciaTree2)
pinkAcaciaTree2.setParent(_scene)
const transform29 = new Transform({
  position: new Vector3(43, 0, 25),
  rotation: new Quaternion(2.4232153606693887e-15, -0.7730104923248291, 9.215001028906045e-8, 0.6343932747840881),
  scale: new Vector3(1.000002384185791, 1, 1.000002384185791)
})
pinkAcaciaTree2.addComponentOrReplace(transform29)
pinkAcaciaTree2.addComponentOrReplace(gltfShape13)

const shelfStone = new Entity('shelfStone')
engine.addEntity(shelfStone)
shelfStone.setParent(_scene)
const transform30 = new Transform({
  position: new Vector3(40, 0, 25.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
shelfStone.addComponentOrReplace(transform30)
const gltfShape18 = new GLTFShape("models/Stone_01/Stone_01.glb")
gltfShape18.withCollisions = true
gltfShape18.visible = true
shelfStone.addComponentOrReplace(gltfShape18)

const sweetGeranium2 = new Entity('sweetGeranium2')
engine.addEntity(sweetGeranium2)
sweetGeranium2.setParent(_scene)
const transform31 = new Transform({
  position: new Vector3(27.5, 0, 30.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
sweetGeranium2.addComponentOrReplace(transform31)
sweetGeranium2.addComponentOrReplace(gltfShape9)

const wildChives = new Entity('wildChives')
engine.addEntity(wildChives)
wildChives.setParent(_scene)
const transform32 = new Transform({
  position: new Vector3(35.5, 0, 27),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
wildChives.addComponentOrReplace(transform32)
const gltfShape19 = new GLTFShape("models/Vegetation_07/Vegetation_07.glb")
gltfShape19.withCollisions = true
gltfShape19.visible = true
wildChives.addComponentOrReplace(gltfShape19)

const wildLongMushrooms = new Entity('wildLongMushrooms')
engine.addEntity(wildLongMushrooms)
wildLongMushrooms.setParent(_scene)
const transform33 = new Transform({
  position: new Vector3(14, 0, 24.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
wildLongMushrooms.addComponentOrReplace(transform33)
const gltfShape20 = new GLTFShape("models/Mushrooms_04/Mushrooms_04.glb")
gltfShape20.withCollisions = true
gltfShape20.visible = true
wildLongMushrooms.addComponentOrReplace(gltfShape20)

const voidTulip = new Entity('voidTulip')
engine.addEntity(voidTulip)
voidTulip.setParent(_scene)
const transform34 = new Transform({
  position: new Vector3(23, 0, 10.608190536499023),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
voidTulip.addComponentOrReplace(transform34)
const gltfShape21 = new GLTFShape("models/Bush_Fantasy_02/Bush_Fantasy_02.glb")
gltfShape21.withCollisions = true
gltfShape21.visible = true
voidTulip.addComponentOrReplace(gltfShape21)

const mysticalMushroomTree2 = new Entity('mysticalMushroomTree2')
engine.addEntity(mysticalMushroomTree2)
mysticalMushroomTree2.setParent(_scene)
mysticalMushroomTree2.addComponentOrReplace(gltfShape11)
const transform35 = new Transform({
  position: new Vector3(34, 0, 28),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
mysticalMushroomTree2.addComponentOrReplace(transform35)

const mysticalMushroomTree3 = new Entity('mysticalMushroomTree3')
engine.addEntity(mysticalMushroomTree3)
mysticalMushroomTree3.setParent(_scene)
const transform36 = new Transform({
  position: new Vector3(44, 0, 22.5),
  rotation: new Quaternion(-2.1885240244462587e-16, 0.6343932747840881, -7.562556447737734e-8, -0.7730104327201843),
  scale: new Vector3(0.9999994039535522, 1, 0.9999994039535522)
})
mysticalMushroomTree3.addComponentOrReplace(transform36)
mysticalMushroomTree3.addComponentOrReplace(gltfShape11)

const pinkPurpleMysticalMushroomTree = new Entity('pinkPurpleMysticalMushroomTree')
engine.addEntity(pinkPurpleMysticalMushroomTree)
pinkPurpleMysticalMushroomTree.setParent(_scene)
const transform37 = new Transform({
  position: new Vector3(45, 0, 10.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
pinkPurpleMysticalMushroomTree.addComponentOrReplace(transform37)
const gltfShape22 = new GLTFShape("models/Tree_01/Tree_01.glb")
gltfShape22.withCollisions = true
gltfShape22.visible = true
pinkPurpleMysticalMushroomTree.addComponentOrReplace(gltfShape22)

const pinkPurpleMysticalMushroomTree2 = new Entity('pinkPurpleMysticalMushroomTree2')
engine.addEntity(pinkPurpleMysticalMushroomTree2)
pinkPurpleMysticalMushroomTree2.setParent(_scene)
pinkPurpleMysticalMushroomTree2.addComponentOrReplace(gltfShape22)
const transform38 = new Transform({
  position: new Vector3(38.5, 0, 28.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
pinkPurpleMysticalMushroomTree2.addComponentOrReplace(transform38)

const tallBlueAcaciaTree = new Entity('tallBlueAcaciaTree')
engine.addEntity(tallBlueAcaciaTree)
tallBlueAcaciaTree.setParent(_scene)
const transform39 = new Transform({
  position: new Vector3(23, 0, 28),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
tallBlueAcaciaTree.addComponentOrReplace(transform39)
const gltfShape23 = new GLTFShape("models/Tree_Forest_Blue_04/Tree_Forest_Blue_04.glb")
gltfShape23.withCollisions = true
gltfShape23.visible = true
tallBlueAcaciaTree.addComponentOrReplace(gltfShape23)

const sweetGeranium3 = new Entity('sweetGeranium3')
engine.addEntity(sweetGeranium3)
sweetGeranium3.setParent(_scene)
const transform40 = new Transform({
  position: new Vector3(28.204574584960938, 0, 19.165603637695312),
  rotation: new Quaternion(2.0787058851973834e-15, -0.5544357895851135, 6.609388236711311e-8, 0.832226574420929),
  scale: new Vector3(1.0000011920928955, 1, 1.0000011920928955)
})
sweetGeranium3.addComponentOrReplace(transform40)
sweetGeranium3.addComponentOrReplace(gltfShape9)

const mediumLuxuriousFenceModule2 = new Entity('mediumLuxuriousFenceModule2')
engine.addEntity(mediumLuxuriousFenceModule2)
mediumLuxuriousFenceModule2.setParent(_scene)
mediumLuxuriousFenceModule2.addComponentOrReplace(gltfShape10)
const transform41 = new Transform({
  position: new Vector3(0.8544340133666992, 0, 12.60954761505127),
  rotation: new Quaternion(-4.477151037873741e-15, -0.7063404321670532, 8.420234109962621e-8, 0.7078723907470703),
  scale: new Vector3(1.693082332611084, 1.6930615901947021, 1.693082332611084)
})
mediumLuxuriousFenceModule2.addComponentOrReplace(transform41)

const mediumLuxuriousFenceModule3 = new Entity('mediumLuxuriousFenceModule3')
engine.addEntity(mediumLuxuriousFenceModule3)
mediumLuxuriousFenceModule3.setParent(_scene)
mediumLuxuriousFenceModule3.addComponentOrReplace(gltfShape10)
const transform42 = new Transform({
  position: new Vector3(0.8544340133666992, 0, 17.811845779418945),
  rotation: new Quaternion(-4.477151037873741e-15, -0.7063404321670532, 8.420234109962621e-8, 0.7078723907470703),
  scale: new Vector3(1.6930882930755615, 1.6930615901947021, 1.6930882930755615)
})
mediumLuxuriousFenceModule3.addComponentOrReplace(transform42)

const mediumLuxuriousFenceModule4 = new Entity('mediumLuxuriousFenceModule4')
engine.addEntity(mediumLuxuriousFenceModule4)
mediumLuxuriousFenceModule4.setParent(_scene)
mediumLuxuriousFenceModule4.addComponentOrReplace(gltfShape10)
const transform43 = new Transform({
  position: new Vector3(0.8544340133666992, 0, 23.012723922729492),
  rotation: new Quaternion(-4.477151037873741e-15, -0.7063404321670532, 8.420234109962621e-8, 0.7078723907470703),
  scale: new Vector3(1.6930912733078003, 1.6930615901947021, 1.6930912733078003)
})
mediumLuxuriousFenceModule4.addComponentOrReplace(transform43)

const mediumLuxuriousFenceModule5 = new Entity('mediumLuxuriousFenceModule5')
engine.addEntity(mediumLuxuriousFenceModule5)
mediumLuxuriousFenceModule5.setParent(_scene)
mediumLuxuriousFenceModule5.addComponentOrReplace(gltfShape10)
const transform44 = new Transform({
  position: new Vector3(0.8544340133666992, 0, 28.235841751098633),
  rotation: new Quaternion(-4.477151037873741e-15, -0.7063404321670532, 8.420234109962621e-8, 0.7078723907470703),
  scale: new Vector3(1.693094253540039, 1.6930615901947021, 1.693094253540039)
})
mediumLuxuriousFenceModule5.addComponentOrReplace(transform44)

const mediumLuxuriousFenceModule6 = new Entity('mediumLuxuriousFenceModule6')
engine.addEntity(mediumLuxuriousFenceModule6)
mediumLuxuriousFenceModule6.setParent(_scene)
mediumLuxuriousFenceModule6.addComponentOrReplace(gltfShape10)
const transform45 = new Transform({
  position: new Vector3(4, 0, 30),
  rotation: new Quaternion(-7.80824616932168e-15, -0.9999994039535522, 1.1920920428565296e-7, 0.0010832546977326274),
  scale: new Vector3(1.6930972337722778, 1.6930615901947021, 1.6930972337722778)
})
mediumLuxuriousFenceModule6.addComponentOrReplace(transform45)

const mediumLuxuriousFenceModule7 = new Entity('mediumLuxuriousFenceModule7')
engine.addEntity(mediumLuxuriousFenceModule7)
mediumLuxuriousFenceModule7.setParent(_scene)
mediumLuxuriousFenceModule7.addComponentOrReplace(gltfShape10)
const transform46 = new Transform({
  position: new Vector3(9, 0, 30),
  rotation: new Quaternion(-7.80824616932168e-15, -0.9999994039535522, 1.1920920428565296e-7, 0.0010832546977326274),
  scale: new Vector3(1.6931002140045166, 1.6930615901947021, 1.6931002140045166)
})
mediumLuxuriousFenceModule7.addComponentOrReplace(transform46)

const mediumLuxuriousFenceModule8 = new Entity('mediumLuxuriousFenceModule8')
engine.addEntity(mediumLuxuriousFenceModule8)
mediumLuxuriousFenceModule8.setParent(_scene)
mediumLuxuriousFenceModule8.addComponentOrReplace(gltfShape10)
const transform47 = new Transform({
  position: new Vector3(14, 0, 30),
  rotation: new Quaternion(-7.80824616932168e-15, -0.9999994039535522, 1.1920920428565296e-7, 0.0010832546977326274),
  scale: new Vector3(1.6931061744689941, 1.6930615901947021, 1.6931061744689941)
})
mediumLuxuriousFenceModule8.addComponentOrReplace(transform47)

const mediumLuxuriousFenceModule8_1 = new Entity('mediumLuxuriousFenceModule8_1')
engine.addEntity(mediumLuxuriousFenceModule8_1)
mediumLuxuriousFenceModule8_1.setParent(_scene)
mediumLuxuriousFenceModule8_1.addComponentOrReplace(gltfShape10)
const transform47_1 = new Transform({
  position: new Vector3(19, 0, 30),
  rotation: new Quaternion(-7.80824616932168e-15, -0.9999994039535522, 1.1920920428565296e-7, 0.0010832546977326274),
  scale: new Vector3(1.6931061744689941, 1.6930615901947021, 1.6931061744689941)
})
mediumLuxuriousFenceModule8_1.addComponentOrReplace(transform47_1)

const mediumLuxuriousFenceModule8_2 = new Entity('mediumLuxuriousFenceModule8_2')
engine.addEntity(mediumLuxuriousFenceModule8_2)
mediumLuxuriousFenceModule8_2.setParent(_scene)
mediumLuxuriousFenceModule8_2.addComponentOrReplace(gltfShape10)
const transform47_2 = new Transform({
  position: new Vector3(24, 0, 30),
  rotation: new Quaternion(-7.80824616932168e-15, -0.9999994039535522, 1.1920920428565296e-7, 0.0010832546977326274),
  scale: new Vector3(1.6931061744689941, 1.6930615901947021, 1.6931061744689941)
})
mediumLuxuriousFenceModule8_2.addComponentOrReplace(transform47_2)

const mediumLuxuriousFenceModule8_3 = new Entity('mediumLuxuriousFenceModule8_3')
engine.addEntity(mediumLuxuriousFenceModule8_3)
mediumLuxuriousFenceModule8_3.setParent(_scene)
mediumLuxuriousFenceModule8_3.addComponentOrReplace(gltfShape10)
const transform47_3 = new Transform({
  position: new Vector3(29, 0, 30),
  rotation: new Quaternion(-7.80824616932168e-15, -0.9999994039535522, 1.1920920428565296e-7, 0.0010832546977326274),
  scale: new Vector3(1.6931061744689941, 1.6930615901947021, 1.6931061744689941)
})
mediumLuxuriousFenceModule8_3.addComponentOrReplace(transform47_3)

const mediumLuxuriousFenceModule9 = new Entity('mediumLuxuriousFenceModule9')
engine.addEntity(mediumLuxuriousFenceModule9)
mediumLuxuriousFenceModule9.setParent(_scene)
mediumLuxuriousFenceModule9.addComponentOrReplace(gltfShape10)
const transform48 = new Transform({
  position: new Vector3(45, 0, 7.435204982757568),
  rotation: new Quaternion(-4.477151037873741e-15, -0.7063404321670532, 8.420234109962621e-8, 0.7078723907470703),
  scale: new Vector3(1.6930900812149048, 1.6930615901947021, 1.6930900812149048)
})
mediumLuxuriousFenceModule9.addComponentOrReplace(transform48)

const mediumLuxuriousFenceModule10 = new Entity('mediumLuxuriousFenceModule10')
engine.addEntity(mediumLuxuriousFenceModule10)
mediumLuxuriousFenceModule10.setParent(_scene)
mediumLuxuriousFenceModule10.addComponentOrReplace(gltfShape10)
const transform49 = new Transform({
  position: new Vector3(45, 0, 12.677452087402344),
  rotation: new Quaternion(-4.477151037873741e-15, -0.7063404321670532, 8.420234109962621e-8, 0.7078723907470703),
  scale: new Vector3(1.6930930614471436, 1.6930615901947021, 1.6930930614471436)
})
mediumLuxuriousFenceModule10.addComponentOrReplace(transform49)

const mediumLuxuriousFenceModule11 = new Entity('mediumLuxuriousFenceModule11')
engine.addEntity(mediumLuxuriousFenceModule11)
mediumLuxuriousFenceModule11.setParent(_scene)
mediumLuxuriousFenceModule11.addComponentOrReplace(gltfShape10)
const transform50 = new Transform({
  position: new Vector3(45, 0, 17.895416259765625),
  rotation: new Quaternion(-4.477151037873741e-15, -0.7063404321670532, 8.420234109962621e-8, 0.7078723907470703),
  scale: new Vector3(1.6930960416793823, 1.6930615901947021, 1.6930960416793823)
})
mediumLuxuriousFenceModule11.addComponentOrReplace(transform50)

const mediumLuxuriousFenceModule12 = new Entity('mediumLuxuriousFenceModule12')
engine.addEntity(mediumLuxuriousFenceModule12)
mediumLuxuriousFenceModule12.setParent(_scene)
mediumLuxuriousFenceModule12.addComponentOrReplace(gltfShape10)
const transform51 = new Transform({
  position: new Vector3(45, 0, 23.057113647460938),
  rotation: new Quaternion(-4.477151037873741e-15, -0.7063404321670532, 8.420234109962621e-8, 0.7078723907470703),
  scale: new Vector3(1.6931020021438599, 1.6930615901947021, 1.6931020021438599)
})
mediumLuxuriousFenceModule12.addComponentOrReplace(transform51)

const mediumLuxuriousFenceModule13 = new Entity('mediumLuxuriousFenceModule13')
engine.addEntity(mediumLuxuriousFenceModule13)
mediumLuxuriousFenceModule13.setParent(_scene)
mediumLuxuriousFenceModule13.addComponentOrReplace(gltfShape10)
const transform52 = new Transform({
  position: new Vector3(45, 0, 28.199132919311523),
  rotation: new Quaternion(-4.477151037873741e-15, -0.7063404321670532, 8.420234109962621e-8, 0.7078723907470703),
  scale: new Vector3(1.6931049823760986, 1.6930615901947021, 1.6931049823760986)
})
mediumLuxuriousFenceModule13.addComponentOrReplace(transform52)

const mediumLuxuriousFenceModule14 = new Entity('mediumLuxuriousFenceModule14')
engine.addEntity(mediumLuxuriousFenceModule14)
mediumLuxuriousFenceModule14.setParent(_scene)
mediumLuxuriousFenceModule14.addComponentOrReplace(gltfShape10)
const transform53 = new Transform({
  position: new Vector3(39, 0, 1),
  rotation: new Quaternion(-7.80824616932168e-15, -0.9999994039535522, 1.1920920428565296e-7, 0.0010832546977326274),
  scale: new Vector3(1.693092942237854, 1.6930615901947021, 1.693092942237854)
})
mediumLuxuriousFenceModule14.addComponentOrReplace(transform53)

const mediumLuxuriousFenceModule15 = new Entity('mediumLuxuriousFenceModule15')
engine.addEntity(mediumLuxuriousFenceModule15)
mediumLuxuriousFenceModule15.setParent(_scene)
mediumLuxuriousFenceModule15.addComponentOrReplace(gltfShape10)
const transform54 = new Transform({
  position: new Vector3(34, 0, 1),
  rotation: new Quaternion(-7.80824616932168e-15, -0.9999994039535522, 1.1920920428565296e-7, 0.0010832546977326274),
  scale: new Vector3(1.693092942237854, 1.6930615901947021, 1.693092942237854)
})
mediumLuxuriousFenceModule15.addComponentOrReplace(transform54)

const mediumLuxuriousFenceModule16 = new Entity('mediumLuxuriousFenceModule16')
engine.addEntity(mediumLuxuriousFenceModule16)
mediumLuxuriousFenceModule16.setParent(_scene)
mediumLuxuriousFenceModule16.addComponentOrReplace(gltfShape10)
const transform55 = new Transform({
  position: new Vector3(29, 0, 1),
  rotation: new Quaternion(-7.80824616932168e-15, -0.9999994039535522, 1.1920920428565296e-7, 0.0010832546977326274),
  scale: new Vector3(1.693092942237854, 1.6930615901947021, 1.693092942237854)
})
mediumLuxuriousFenceModule16.addComponentOrReplace(transform55)

const mediumLuxuriousFenceModule17 = new Entity('mediumLuxuriousFenceModule17')
engine.addEntity(mediumLuxuriousFenceModule17)
mediumLuxuriousFenceModule17.setParent(_scene)
mediumLuxuriousFenceModule17.addComponentOrReplace(gltfShape10)
const transform56 = new Transform({
  position: new Vector3(24, 0, 1),
  rotation: new Quaternion(-7.80824616932168e-15, -0.9999994039535522, 1.1920920428565296e-7, 0.0010832546977326274),
  scale: new Vector3(1.693092942237854, 1.6930615901947021, 1.693092942237854)
})
mediumLuxuriousFenceModule17.addComponentOrReplace(transform56)

const mediumLuxuriousFenceModule18 = new Entity('mediumLuxuriousFenceModule18')
engine.addEntity(mediumLuxuriousFenceModule18)
mediumLuxuriousFenceModule18.setParent(_scene)
mediumLuxuriousFenceModule18.addComponentOrReplace(gltfShape10)
const transform57 = new Transform({
  position: new Vector3(19, 0, 1),
  rotation: new Quaternion(-7.80824616932168e-15, -0.9999994039535522, 1.1920920428565296e-7, 0.0010832546977326274),
  scale: new Vector3(1.693092942237854, 1.6930615901947021, 1.693092942237854)
})
mediumLuxuriousFenceModule18.addComponentOrReplace(transform57)

const mediumLuxuriousFenceModule19 = new Entity('mediumLuxuriousFenceModule19')
engine.addEntity(mediumLuxuriousFenceModule19)
mediumLuxuriousFenceModule19.setParent(_scene)
mediumLuxuriousFenceModule19.addComponentOrReplace(gltfShape10)
const transform58 = new Transform({
  position: new Vector3(14, 0, 1),
  rotation: new Quaternion(-7.80824616932168e-15, -0.9999994039535522, 1.1920920428565296e-7, 0.0010832546977326274),
  scale: new Vector3(1.6930923461914062, 1.6930615901947021, 1.6930923461914062)
})
mediumLuxuriousFenceModule19.addComponentOrReplace(transform58)

const tallPinkAcaciaTree = new Entity('tallPinkAcaciaTree')
engine.addEntity(tallPinkAcaciaTree)
tallPinkAcaciaTree.setParent(_scene)
const transform59 = new Transform({
  position: new Vector3(18.5, 0, 4.132787704467773),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
tallPinkAcaciaTree.addComponentOrReplace(transform59)
const gltfShape24 = new GLTFShape("models/Tree_Forest_Pink_04/Tree_Forest_Pink_04.glb")
gltfShape24.withCollisions = true
gltfShape24.visible = true
tallPinkAcaciaTree.addComponentOrReplace(gltfShape24)

const tallPinkAcaciaTree2 = new Entity('tallPinkAcaciaTree2')
engine.addEntity(tallPinkAcaciaTree2)
tallPinkAcaciaTree2.setParent(_scene)
const transform60 = new Transform({
  position: new Vector3(26.678062438964844, 0, 5),
  rotation: new Quaternion(8.518643173063205e-16, -0.5883726477622986, 7.013947112000096e-8, 0.8085898756980896),
  scale: new Vector3(0.9999997019767761, 1, 0.9999997019767761)
})
tallPinkAcaciaTree2.addComponentOrReplace(transform60)
tallPinkAcaciaTree2.addComponentOrReplace(gltfShape24)

const tallGreenAcaciaTree = new Entity('tallGreenAcaciaTree')
engine.addEntity(tallGreenAcaciaTree)
tallGreenAcaciaTree.setParent(_scene)
const transform61 = new Transform({
  position: new Vector3(22.869873046875, 0, 2.999999761581421),
  rotation: new Quaternion(6.9096017840555e-17, -0.40962085127830505, 4.883060711335929e-8, 0.9122558832168579),
  scale: new Vector3(1.000002384185791, 1, 1.000002384185791)
})
tallGreenAcaciaTree.addComponentOrReplace(transform61)
const gltfShape25 = new GLTFShape("models/Tree_Forest_Green_04/Tree_Forest_Green_04.glb")
gltfShape25.withCollisions = true
gltfShape25.visible = true
tallGreenAcaciaTree.addComponentOrReplace(gltfShape25)

const mysticalMushroomTree4 = new Entity('mysticalMushroomTree4')
engine.addEntity(mysticalMushroomTree4)
mysticalMushroomTree4.setParent(_scene)
mysticalMushroomTree4.addComponentOrReplace(gltfShape11)
const transform62 = new Transform({
  position: new Vector3(29.353313446044922, 0, 10.76895523071289),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
mysticalMushroomTree4.addComponentOrReplace(transform62)

const mysticalMushroomTree5 = new Entity('mysticalMushroomTree5')
engine.addEntity(mysticalMushroomTree5)
mysticalMushroomTree5.setParent(_scene)
mysticalMushroomTree5.addComponentOrReplace(gltfShape11)
const transform63 = new Transform({
  position: new Vector3(3.6103744506835938, 0, 12.494817733764648),
  rotation: new Quaternion(8.222734965796993e-15, 0.9715321063995361, -1.15815637968808e-7, -0.2369081676006317),
  scale: new Vector3(1.000002384185791, 1, 1.000002384185791)
})
mysticalMushroomTree5.addComponentOrReplace(transform63)

const tallBlueAcaciaTree2 = new Entity('tallBlueAcaciaTree2')
engine.addEntity(tallBlueAcaciaTree2)
tallBlueAcaciaTree2.setParent(_scene)
tallBlueAcaciaTree2.addComponentOrReplace(gltfShape23)
const transform64 = new Transform({
  position: new Vector3(4.281083106994629, 0, 14.999999046325684),
  rotation: new Quaternion(-1.1059513315930347e-15, 0.5555702447891235, -6.622912707143769e-8, 0.8314695954322815),
  scale: new Vector3(0.9999995231628418, 1, 0.9999995231628418)
})
tallBlueAcaciaTree2.addComponentOrReplace(transform64)

const voidTulip2 = new Entity('voidTulip2')
engine.addEntity(voidTulip2)
voidTulip2.setParent(_scene)
voidTulip2.addComponentOrReplace(gltfShape21)
const transform65 = new Transform({
  position: new Vector3(32, 0, 25),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
voidTulip2.addComponentOrReplace(transform65)

const sweetGeranium4 = new Entity('sweetGeranium4')
engine.addEntity(sweetGeranium4)
sweetGeranium4.setParent(_scene)
sweetGeranium4.addComponentOrReplace(gltfShape9)
const transform66 = new Transform({
  position: new Vector3(4, 0, 23.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
sweetGeranium4.addComponentOrReplace(transform66)

const wildChives2 = new Entity('wildChives2')
engine.addEntity(wildChives2)
wildChives2.setParent(_scene)
wildChives2.addComponentOrReplace(gltfShape19)
const transform67 = new Transform({
  position: new Vector3(26.5, 0, 10.723664283752441),
  rotation: new Quaternion(-6.65064594497863e-16, -0.4713967442512512, 5.6194867426029305e-8, 0.8819212913513184),
  scale: new Vector3(1, 1, 1)
})
wildChives2.addComponentOrReplace(transform67)

const wildChives3 = new Entity('wildChives3')
engine.addEntity(wildChives3)
wildChives3.setParent(_scene)
wildChives3.addComponentOrReplace(gltfShape19)
const transform68 = new Transform({
  position: new Vector3(21.5, 0, 13.189491271972656),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
wildChives3.addComponentOrReplace(transform68)

const sweetGeranium5 = new Entity('sweetGeranium5')
engine.addEntity(sweetGeranium5)
sweetGeranium5.setParent(_scene)
sweetGeranium5.addComponentOrReplace(gltfShape9)
const transform69 = new Transform({
  position: new Vector3(20.957685470581055, 0, 5.789920806884766),
  rotation: new Quaternion(2.0787058851973834e-15, -0.5544357895851135, 6.609388236711311e-8, 0.832226574420929),
  scale: new Vector3(1.0000011920928955, 1, 1.0000011920928955)
})
sweetGeranium5.addComponentOrReplace(transform69)

const yellowMagicStone = new Entity('yellowMagicStone')
engine.addEntity(yellowMagicStone)
yellowMagicStone.setParent(_scene)
const transform70 = new Transform({
  position: new Vector3(1.461240530014038, 5.808753967285156, 1.6289057731628418),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1.8176181316375732, 1.8176181316375732, 1.8176181316375732)
})
yellowMagicStone.addComponentOrReplace(transform70)
const gltfShape26 = new GLTFShape("models/Crystal_05/Crystal_05.glb")
gltfShape26.withCollisions = true
gltfShape26.visible = true
yellowMagicStone.addComponentOrReplace(gltfShape26)

const yellowMagicStone2 = new Entity('yellowMagicStone2')
engine.addEntity(yellowMagicStone2)
yellowMagicStone2.setParent(_scene)
yellowMagicStone2.addComponentOrReplace(gltfShape26)
const transform71 = new Transform({
  position: new Vector3(30.5, 5.808753967285156, 1.8318538665771484),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1.8176181316375732, 1.8176181316375732, 1.8176181316375732)
})
yellowMagicStone2.addComponentOrReplace(transform71)

const yellowMagicStone3 = new Entity('yellowMagicStone3')
engine.addEntity(yellowMagicStone3)
yellowMagicStone3.setParent(_scene)
yellowMagicStone3.addComponentOrReplace(gltfShape26)
const transform72 = new Transform({
  position: new Vector3(46, 5.808753967285156, 30),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1.8176181316375732, 1.8176181316375732, 1.8176181316375732)
})
yellowMagicStone3.addComponentOrReplace(transform72)

const yellowMagicStone4 = new Entity('yellowMagicStone4')
engine.addEntity(yellowMagicStone4)
yellowMagicStone4.setParent(_scene)
yellowMagicStone4.addComponentOrReplace(gltfShape26)
const transform73 = new Transform({
  position: new Vector3(46, 5.808753967285156, 1),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1.8176181316375732, 1.8176181316375732, 1.8176181316375732)
})
yellowMagicStone4.addComponentOrReplace(transform73)

const channelId = Math.random().toString(16).slice(2)
const channelBus = new MessageBus()
const inventory = createInventory(UICanvas, UIContainerStack, UIImage)
const options = { inventory }

const script1 = new Script1()
const script1_bis = new Script1()
const script2 = new Script2()
script1.init()
script1_bis.init()
script2.init()
script1.spawn(squareSignpost, {"text":"DRAGON\nNEST","fontSize":20}, createChannel(channelId, squareSignpost, channelBus))
script1_bis.spawn(squareSignpostBis, {"text":"FEEDING\nFIELD","fontSize":20}, createChannel(channelId, squareSignpostBis, channelBus))
script2.spawn(indicatorArrow, {"active":true}, createChannel(channelId, indicatorArrow, channelBus))