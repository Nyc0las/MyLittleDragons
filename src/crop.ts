import utils from "../node_modules/decentraland-ecs-utils/index"
import { GameData, addData, removeData, checkData, inventoryGet, updateInventoryUI, inventoryAddItem, showInventoryFull, PickItem, BoxState, poppingSound } from "./gameData";

// VALUES TO SET ////////////////////////////////////
let cropPosition = new Vector3(5,-0.1,20) //Position crop - World
let menu3DPosition = new Vector3(-1.5,1,-1.5) //Position menu 3D - Local
let menu3DEspacement = 0.6 //Espacement menu3D
let menuCountdown = 1.2 //Hauteur menu countdown - Local

let carrotCooldown = 20
let pumpkinCooldown = 40
let beetCooldown = 60
let cabbageCooldown = 80
let cucumberCooldown = 120

let foodReady = ""
let currentFood = new Entity()
/////////////////////////////////////////////////////

const plant: Entity = new Entity()
let SFX_Plant = new AudioSource(new AudioClip("sounds/plant.wav"))
plant.addComponent(SFX_Plant)
engine.addEntity(plant);

let hideUI = false

let menuBlocked = false
let growing = false

export const gameData = new GameData()

function formatTimeString(seconds: number): string{
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return(
    mins.toLocaleString(undefined, {minimumIntegerDigits: 2})
    + ":" +
    secs.toLocaleString(undefined, {minimumIntegerDigits: 2})
  )
}

Crop()
//
export class Test2
{
  update()
  {
    addData("pumpkin",1)
    //log("Carrot : "+checkData("carrot"))
    //log("Pumpkin : "+checkData("pumpkin"))
  }
}

engine.addSystem(new Test2())

export function Crop() : void{

  const crop = new Entity();
  engine.addEntity(crop);
  crop.addComponent(new GLTFShape("models/nature/Tile_normal.gltf"));
  crop.addComponent(new Transform({
    //position: new Vector3(1,-0.1,10)
    //position : new Vector3(0,0,0)
    position : cropPosition
  }))
  //crop.getComponent(Transform).position.set(cropPosition.x,cropPosition.y,cropPosition.z);
  crop.addComponent(new OnClick(
    e => {
	     //log("Clicked")
        if(!menuBlocked && !growing)
        {
          menuBlocked = true
          engine.addEntity(menu3D)
        }
        else
        {
          menuBlocked = false;
          engine.removeEntity(menu3D)
        }
  	}

  ))
}

/************************************************************************************************************************
 * CREATE 3D MENU
 * *********************************************************************************************************************/

const menu3D = new Entity()
/*menu3D.addComponent(new Transform({
    rotation: new Quaternion(90,90,0,0)
}))*/
//menu3D.visible = false

// ADD CARROT /////////////////////////////////////////////////
const carotMenu = new Entity()
carotMenu.addComponent(new BoxShape())
carotMenu.addComponent(new Transform({
    position : new Vector3(cropPosition.x+menu3DPosition.x, cropPosition.y+menu3DPosition.y, cropPosition.z+menu3DPosition.z),
    //rotation: new Quaternion(0,90,0,0),
    scale: new Vector3(0.01, 0.5, 0.5)
}))
//carotMenu.addComponent(new Billboard())
carotMenu.addComponent(
    new OnClick(e => {
        SFX_Plant.playOnce()
        createCarrot()
        engine.removeEntity(menu3D)
    })
)

//Create texture
const carotMenuTexture = new Texture("models/UI/menu_carrot.png")
const carotMenuMaterial = new Material()
carotMenuMaterial.albedoTexture = carotMenuTexture
carotMenu.addComponent(carotMenuMaterial)

// ADD PUMPKIN /////////////////////////////////////////////////
const pumpkinMenu = new Entity()
pumpkinMenu.addComponent(new BoxShape())
pumpkinMenu.addComponent(new Transform({
    position : new Vector3 (cropPosition.x+menu3DPosition.x, cropPosition.y+menu3DPosition.y+menu3DEspacement*1, cropPosition.z+menu3DPosition.z),
    //rotation: new Quaternion(0,90,0,0),
    scale: new Vector3(0.01, 0.5, 0.5)
}))
//pumpkinMenu.addComponent(new Billboard())
pumpkinMenu.addComponent(
    new OnClick(e => {
        SFX_Plant.playOnce()
        createPumpkin()
        engine.removeEntity(menu3D)
    })
)

//Create texture
const pumpkinMenuTexture = new Texture("models/UI/menu_pumpkin.png")
const pumpkinMenuMaterial = new Material()
pumpkinMenuMaterial.albedoTexture = pumpkinMenuTexture
pumpkinMenu.addComponent(pumpkinMenuMaterial)

// ADD BEET /////////////////////////////////////////////////
const beetMenu = new Entity()
beetMenu.addComponent(new BoxShape())
beetMenu.addComponent(new Transform({
    position : new Vector3 (cropPosition.x+menu3DPosition.x, cropPosition.y+menu3DPosition.y+menu3DEspacement*2, cropPosition.z+menu3DPosition.z),
    //rotation: new Quaternion(0,90,0,0),
    scale: new Vector3(0.01, 0.5, 0.5)
}))
//beetMenu.addComponent(new Billboard())
beetMenu.addComponent(
    new OnClick(e => {
        SFX_Plant.playOnce()
        createBeet()
        engine.removeEntity(menu3D)
    })
)

//Create texture
const beetMenuTexture = new Texture("models/UI/menu_beet.png")
const beetMenuMaterial = new Material()
beetMenuMaterial.albedoTexture = beetMenuTexture
beetMenu.addComponent(beetMenuMaterial)

// ADD CABBAGE /////////////////////////////////////////////////
const cabbageMenu = new Entity()
cabbageMenu.addComponent(new BoxShape())
cabbageMenu.addComponent(new Transform({
    position : new Vector3 (cropPosition.x+menu3DPosition.x, cropPosition.y+menu3DPosition.y+menu3DEspacement*3, cropPosition.z+menu3DPosition.z),
    //rotation: new Quaternion(0,90,0,0),
    scale: new Vector3(0.01, 0.5, 0.5)
}))
//cabbageMenu.addComponent(new Billboard())
cabbageMenu.addComponent(
    new OnClick(e => {
        SFX_Plant.playOnce()
        createCabbage()
        engine.removeEntity(menu3D)
    })
)

//Create texture
const cabbageMenuTexture = new Texture("models/UI/menu_cabbage.png")
const cabbageMenuMaterial = new Material()
cabbageMenuMaterial.albedoTexture = cabbageMenuTexture
cabbageMenu.addComponent(cabbageMenuMaterial)

// ADD CUCUMBER /////////////////////////////////////////////////
const cucumberMenu = new Entity()
cucumberMenu.addComponent(new BoxShape())
cucumberMenu.addComponent(new Transform({
    position : new Vector3 (cropPosition.x+menu3DPosition.x, cropPosition.y+menu3DPosition.y+menu3DEspacement*4, cropPosition.z+menu3DPosition.z),
    //rotation: new Quaternion(0,90,0,0),
    scale: new Vector3(0.01, 0.5, 0.5)
}))
//cucumberMenu.addComponent(new Billboard())
cucumberMenu.addComponent(
    new OnClick(e => {
        SFX_Plant.playOnce()
        createCucumber()
        engine.removeEntity(menu3D)
    })
)

//Create texture
const cucumberMenuTexture = new Texture("models/UI/menu_cucumber.png")
const cucumberMenuMaterial = new Material()
cucumberMenuMaterial.albedoTexture = cucumberMenuTexture
cucumberMenu.addComponent(cucumberMenuMaterial)

carotMenu.setParent(menu3D)
pumpkinMenu.setParent(menu3D)
beetMenu.setParent(menu3D)
cabbageMenu.setParent(menu3D)
cucumberMenu.setParent(menu3D)

/************************************************************************************************************************
 * VEGETABLE APPEARS
 * *********************************************************************************************************************/

// CARROT /////////////////////////////////////////////////
function createCarrot() : void
{
  let grown = false;
  let canBePick = false;

  growing = true;
  let startSize = new Vector3(1,1,1)
  let endSize = new Vector3(4,4,4)


  const carrot = new Entity();
  engine.addEntity(carrot);
  carrot.addComponent(new GLTFShape("models/farm/Food_carrot.glb"));
  carrot.addComponent(new Transform({
    position : new Vector3 (cropPosition.x-1.5, cropPosition.y+0.4, cropPosition.z-1.5),
    rotation: new Quaternion(90,90,0,0),
    scale: new Vector3(1,1,1)
  }))
  carrot.addComponent(new utils.ScaleTransformComponent(startSize,endSize, carrotCooldown, () => {canBePick = true}))
  carrot.addComponent(new BoxState())
  carrot.addComponent(new OnClick(
    e => {
      log("canBePick "+canBePick)
      if(canBePick)
      {
        growing = false
        menuBlocked = false
        //PickItem(carrot,carrotUI,"carrot","plant")
      }
    }
  ))

  //Adding text countdown
  const carrotUI = new Entity()
  const carrotText = new TextShape(formatTimeString(carrotCooldown))
  carrotText.fontSize = 5
  carrotText.color = Color3.White()
  carrotUI.addComponent(carrotText)
  carrotUI.addComponent(new Transform({
    position : new Vector3 (cropPosition.x-1.5, cropPosition.y+menuCountdown, cropPosition.z-1.5),
    rotation : Quaternion.Euler(0,-90,0)
  }))
  //carrotUI.addComponent(new Billboard())
  let timeRemaining = carrotCooldown;
  carrotUI.addComponent(new utils.Interval(1000, (): void => {
    timeRemaining--;

    if(timeRemaining > 0)
    {
      carrotText.value = formatTimeString(timeRemaining);
    }
    else
    {
      carrotUI.removeComponent(utils.Interval);
      carrotText.color = Color3.Green();
      carrotText.value = "";
      currentFood = carrot;
      //engine.removeComponent(carrotText);
      foodReady = "carrot";
    }
  }))
  //itemUI = carrotUI
  //carrotUI.getComponent(Transform).lookAt(Camera.instance.position)
  engine.addEntity(carrotUI)
  }

// PUMPKIN /////////////////////////////////////////////////
function createPumpkin() : void
{
  let grown = false;
  let canBePick = false;

  growing = true;
  let startSize = new Vector3(0.5,0.5,0.5)
  let endSize = new Vector3(2,2,2)


  const pumpkin = new Entity();
  engine.addEntity(pumpkin);
  pumpkin.addComponent(new GLTFShape("models/farm/Food_pumpkin.glb"));
  pumpkin.addComponent(new Transform({
    position : new Vector3 (cropPosition.x-1.5, cropPosition.y+0.2, cropPosition.z-1.5),
    rotation: new Quaternion(0,0,0,0),
    scale: new Vector3(1,1,1)
  }))
  pumpkin.addComponent(new utils.ScaleTransformComponent(startSize,endSize, pumpkinCooldown, () => {canBePick = true}))
  pumpkin.addComponent(new BoxState())
  pumpkin.addComponent(new OnClick(
    e => {
      if(canBePick)
      {
        growing = false
        menuBlocked = false
        //PickItem(pumpkin,pumpkinUI,"pumpkin","plant")
      }
    }
  ))

  //Adding text countdown
  const pumpkinUI = new Entity()
  const pumpkinText = new TextShape(formatTimeString(pumpkinCooldown))
  pumpkinText.fontSize = 5
  pumpkinText.color = Color3.White()
  pumpkinUI.addComponent(pumpkinText)
  pumpkinUI.addComponent(new Transform({
    position : new Vector3 (cropPosition.x-1.5, cropPosition.y+menuCountdown, cropPosition.z-1.5),
    //position: new Vector3(-0.5,1.0,8.5),
    rotation : Quaternion.Euler(0,-90,0)
    //rotation: new Quaternion(0,0,0,0)
  }))
  //pumpkinUI.addComponent(new Billboard())
  let timeRemaining = pumpkinCooldown;
  pumpkinUI.addComponent(new utils.Interval(1000, (): void => {
    timeRemaining--;

    if(timeRemaining > 0)
    {
      pumpkinText.value = formatTimeString(timeRemaining);
    }
    else
    {
      pumpkinUI.removeComponent(utils.Interval);
      pumpkinText.color = Color3.Green();
      pumpkinText.value = "";
      currentFood = pumpkin
      foodReady = "pumpkin"
    }
  }))
  //itemUI = pumpkinUI
  //pumpkinUI.getComponent(Transform).lookAt(Camera.instance.position)
  engine.addEntity(pumpkinUI)
}
  // BEET /////////////////////////////////////////////////
  function createBeet() : void
  {
    let grown = false;
    let canBePick = false;

    growing = true;
    let startSize = new Vector3(1,1,1)
    let endSize = new Vector3(4,4,4)


    const beet = new Entity();
    engine.addEntity(beet);
    beet.addComponent(new GLTFShape("models/farm/Food_beet.glb"));
    beet.addComponent(new Transform({
      position : new Vector3 (cropPosition.x-1.5, cropPosition.y+0.4, cropPosition.z-1.5),
      rotation: new Quaternion(90,90,0,0),
      scale: new Vector3(1,1,1)
    }))
    beet.addComponent(new utils.ScaleTransformComponent(startSize,endSize, beetCooldown, () => {canBePick = true}))
    beet.addComponent(new BoxState())
    beet.addComponent(new OnClick(
      e => {
        if(canBePick)
        {
          growing = false
          menuBlocked = false
          //PickItem(beet,beetUI,"beet","plant")
        }
      }
    ))

    //Adding text countdown
    const beetUI = new Entity()
    const beetText = new TextShape(formatTimeString(beetCooldown))
    beetText.fontSize = 5
    beetText.color = Color3.White()
    beetUI.addComponent(beetText)
    beetUI.addComponent(new Transform({
      position : new Vector3 (cropPosition.x-1.5, cropPosition.y+menuCountdown, cropPosition.z-1.5),
      //position: new Vector3(-0.5,1.0,8.5),
    rotation : Quaternion.Euler(0,-90,0)
      //rotation: new Quaternion(0,0,0,0)
    }))
    //beetUI.addComponent(new Billboard())
    let timeRemaining = beetCooldown;
    beetUI.addComponent(new utils.Interval(1000, (): void => {
      timeRemaining--;

      if(timeRemaining > 0)
      {
        beetText.value = formatTimeString(timeRemaining);
      }
      else
      {
        beetUI.removeComponent(utils.Interval);
        beetText.color = Color3.Green();
        beetText.value = "";
        currentFood = beet
        foodReady = "beet"
      }
    }))
    //itemUI = carrotUI
    //carrotUI.getComponent(Transform).lookAt(Camera.instance.position)
    engine.addEntity(beetUI)
  }

  // CABBAGE /////////////////////////////////////////////////
  function createCabbage() : void
  {
    let grown = false;
    let canBePick = false;

    growing = true;
    let startSize = new Vector3(1,1,1)
    let endSize = new Vector3(4,4,4)


    const cabbage = new Entity();
    engine.addEntity(cabbage);
    cabbage.addComponent(new GLTFShape("models/farm/Food_cabbage.glb"));
    cabbage.addComponent(new Transform({
      position : new Vector3 (cropPosition.x-1.5, cropPosition.y+0.4, cropPosition.z-1.5),
      rotation: new Quaternion(0,0,0,0),
      scale: new Vector3(1,1,1)
    }))
    cabbage.addComponent(new utils.ScaleTransformComponent(startSize,endSize, cabbageCooldown, () => {canBePick = true}))
    cabbage.addComponent(new BoxState())
    cabbage.addComponent(new OnClick(
      e => {
        if(canBePick)
        {
          growing = false
          menuBlocked = false
          //PickItem(cabbage,cabbageUI,"cabbage","plant")
        }
      }
    ))

    //Adding text countdown
    const cabbageUI = new Entity()
    const cabbageText = new TextShape(formatTimeString(cabbageCooldown))
    cabbageText.fontSize = 5
    cabbageText.color = Color3.White()
    cabbageUI.addComponent(cabbageText)
    cabbageUI.addComponent(new Transform({
      position : new Vector3 (cropPosition.x-1.5, cropPosition.y+menuCountdown, cropPosition.z-1.5),
      //position: new Vector3(-0.5,1.0,8.5),
    rotation : Quaternion.Euler(0,-90,0)
      //rotation: new Quaternion(0,0,0,0)
    }))
    //cabbageUI.addComponent(new Billboard())
    let timeRemaining = cabbageCooldown;
    cabbageUI.addComponent(new utils.Interval(1000, (): void => {
      timeRemaining--;

      if(timeRemaining > 0)
      {
        cabbageText.value = formatTimeString(timeRemaining);
      }
      else
      {
        cabbageUI.removeComponent(utils.Interval);
        cabbageText.color = Color3.Green();
        cabbageText.value = "";
        currentFood = cabbage
        foodReady = "cabbage"
      }
    }))
    //itemUI = carrotUI
    //carrotUI.getComponent(Transform).lookAt(Camera.instance.position)
    engine.addEntity(cabbageUI)
  }

  // CUCUMBER /////////////////////////////////////////////////
  function createCucumber() : void
  {
    let grown = false;
    let canBePick = false;

    growing = true;
    let startSize = new Vector3(1,1,1)
    let endSize = new Vector3(4,4,4)


    const cucumber = new Entity();
    engine.addEntity(cucumber);
    cucumber.addComponent(new GLTFShape("models/farm/Food_cucumber.glb"));
    cucumber.addComponent(new Transform({
      position : new Vector3 (cropPosition.x-1.5, cropPosition.y+0.4, cropPosition.z-1.5),
      rotation: new Quaternion(90,90,0,0),
      scale: new Vector3(1,1,1)
    }))
    cucumber.addComponent(new utils.ScaleTransformComponent(startSize,endSize, cucumberCooldown, () => {canBePick = true}))
    cucumber.addComponent(new BoxState())
    cucumber.addComponent(new OnClick(
      e => {
        if(canBePick)
        {
          growing = false
          menuBlocked = false
          //PickItem(cucumber,cucumberUI,"cucumber","plant")
        }
      }
    ))

    //Adding text countdown
    const cucumberUI = new Entity()
    const cucumberText = new TextShape(formatTimeString(cucumberCooldown))
    cucumberText.fontSize = 5
    cucumberText.color = Color3.White()
    cucumberUI.addComponent(cucumberText)
    cucumberUI.addComponent(new Transform({
      position : new Vector3 (cropPosition.x-1.5, cropPosition.y+menuCountdown, cropPosition.z-1.5),
      //position: new Vector3(-0.5,1.0,8.5),
     rotation : Quaternion.Euler(0,-90,0)
      //rotation: new Quaternion(0,0,0,0)
    }))
    //cucumberUI.addComponent(new Billboard())
    let timeRemaining = cucumberCooldown;
    cucumberUI.addComponent(new utils.Interval(1000, (): void => {
      timeRemaining--;

      if(timeRemaining > 0)
      {
        cucumberText.value = formatTimeString(timeRemaining);
      }
      else
      {
        cucumberUI.removeComponent(utils.Interval);
        cucumberText.color = Color3.Green();
        cucumberText.value = "";
        currentFood = cucumber
        foodReady = "cucumber"
      }
    }))
    //itemUI = carrotUI
    //carrotUI.getComponent(Transform).lookAt(Camera.instance.position)
    engine.addEntity(cucumberUI)
  }

  export function GetFood(): string
  {
    return foodReady
  }

  export function ResetFood()
  {
    growing = false
    menuBlocked = false
    engine.removeEntity(currentFood)
    foodReady = ""
  }

  export function GetCropPos(): Vector3
  {
      return cropPosition
  }
  

// GENERAL /////////////////////////////////////////////////
  //Function HIDE UI
  function hideAllUI()
  {
    if(hideUI)
    {

    }
  }
