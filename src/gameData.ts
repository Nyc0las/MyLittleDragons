import utils from "../node_modules/decentraland-ecs-utils/index"
//import { CloseMenu3D, UpdateMenu3D, OvenReady, closeOvenDoor} from "./kitchen";


@Component('boxState')
export class BoxState
{
  state: string

  constructor(state: string = "")
  {
    this.state = state
  }
}

//Add sound
let goldSound: Entity = new Entity()
let SFX_Money = new AudioSource(new AudioClip("sounds/money.wav"))
goldSound.addComponent(SFX_Money)
engine.addEntity(goldSound)

let popSound: Entity = new Entity()
let SFX_Pop = new AudioSource(new AudioClip("sounds/pop.wav"))
popSound.addComponent(SFX_Pop)
engine.addEntity(popSound)

const spawnSound: Entity = new Entity()
let SFX_Spawn = new AudioSource(new AudioClip("sounds/spawn.wav"))
spawnSound.addComponent(SFX_Spawn)
engine.addEntity(spawnSound)

let pickSound: Entity = new Entity()
let SFX_Pick = new AudioSource(new AudioClip("sounds/pick.wav"))
pickSound.addComponent(SFX_Pick)
engine.addEntity(pickSound)

export class GameData
{
  gold: number = 0

  carrot: number = 0
  pumpkin: number = 0
  beet: number = 0
  cabbage: number = 0
  cucumber: number = 0
  
  boxType: string = "" //oven, trash can, frying pan, table
  inOven: string = ""
  onTable: string = ""

  inventory: string[] = []

  constructor(inventory : string[] = [])
  {
    /*for(let i=0;i<4;i++)
    {
      inventory[i]="carrot"
      
    }*/
    inventory[0]=""
    inventory[1]=""
    inventory[2]=""
    inventory[3]=""
    this.inventory = inventory
  }
}

export const gameData = new GameData()

export class NodeData
{
  nodeUsed: boolean[] = []
  nodePos: Vector3[] = []

  constructor(nodeUsed: boolean[] = [false,false,false,false,false,false],nodePos: Vector3[] = [new Vector3(-10,1,42),new Vector3(-3,1,42),new Vector3(4,1,42),new Vector3(11,1,42),new Vector3(18,1,42),new Vector3(25,1,42)]) {
    this.nodeUsed = nodeUsed
    this.nodePos = nodePos
  }

  node1: boolean = false;
  node2: boolean = false;
  node3: boolean = false;
  node4: boolean = false;
  node5: boolean = false;
  node6: boolean = false;

  //25 18 11 4 -3 -10
  //nodePos: Vector3[] = [new Vector3(25,1,42),new Vector3(18,1,42),new Vector3(11,1,42),new Vector3(4,1,42),new Vector3(-3,1,42),new Vector3(-10,1,42)]

  node1Pos: Vector3 = new Vector3(25,1,42)
  node2Pos: Vector3 = new Vector3(18,1,42)
  node3Pos: Vector3 = new Vector3(11,1,42)
  node4Pos: Vector3 = new Vector3(4,1,42)
  node5Pos: Vector3 = new Vector3(-3,1,42)
  node6Pos: Vector3 = new Vector3(-10,1,42)


}

export class CarData
{
  spawned: boolean = false
  nodeObjective: number = 0
  nodeWaiting: number = 0
}

export function addData (x:string,y:any): void
{
  if(x=="gold")
  {
    gameData.gold+=y
  }
  else if(x=="boxType")
  {
    gameData.boxType = y
  }
  else if(x=="inOven")
  {
    gameData.inOven = y
  }
  /*else if(x=="carrot")
  {
    gameData.carrot+=y
  }
  else if(x=="pumpkin")
  {
    gameData.pumpkin+=y
  }
  else if(x=="beet")
  {
    gameData.beet+=y
  }
  else if(x=="cabbage")
  {
    gameData.cabbage+=y
  }
  else if(x=="cucumber")
  {
    gameData.cucumber+=y
  }*/
}

export function removeData (x:string,y:any): void
{
  if(x=="gold")
  {
    gameData.gold-=y
  }
  else if(x=="boxType")
  {
    gameData.boxType = ""
  }
  else if(x=="inOven")
  {
    gameData.inOven = ""
  }
  /*else if(x=="carrot")
  {
    gameData.carrot-=y
  }
  else if(x=="pumpkin")
  {
    gameData.pumpkin-=y
  }
  else if(x=="beet")
  {
    gameData.beet-=y
  }
  else if(x=="cabbage")
  {
    gameData.cabbage-=y
  }
  else if(x=="cucumber")
  {
    gameData.cucumber-=y
  }*/
}

export function checkData (x:string): any
{
  if(x=="gold")
  {
    return(gameData.gold)
  }
  else if(x=="boxType")
  {
    return(gameData.boxType)
  }
  else if(x=="inOven")
  {
    return(gameData.inOven)
  }
  /*else if(x=="carrot")
  {
    return(gameData.carrot)
  }
  else if(x=="pumpkin")
  {
    return(gameData.pumpkin)
  }
  else if(x=="beet")
  {
    return(gameData.beet)
  }
  else if(x=="cabbage")
  {
    return(gameData.cabbage)
  }
  else if(x=="cucumber")
  {
    return(gameData.cucumber)
  }
  else if(x=="inOven")
  {
    return(gameData.inOven)
  }*/
}

export function poppingSound()
{
  SFX_Pop.playOnce()
}

/**********************************************************
 * INVENTORY SYSTEM
 * ********************************************************/
const INV_SIZE: number = 5

export class inventory
{
  items: string[] = []

}
export const inv = new inventory()

export function inventoryAddItem(x: string, n: number)
{
  gameData.inventory[n]=x;
}

export function inventoryRemoveItem(x: string, n: number)
{

}

// Used to update UI
export function inventoryGet(): string[]
{
  /*gameData.inventory[0]="pumpkin"
  gameData.inventory[1]="beet"
  gameData.inventory[2]="cabbage"
  gameData.inventory[3]="cucumber"*/
  return gameData.inventory
}

// HUD //////////////////////////////////////////////
/**
 * CREATE CANVAS FOR UI
 * */

//create canvas
const canvas = new UICanvas()
// create container inside canvas
const rect = new UIContainerRect(canvas)
rect.adaptHeight = true
rect.adaptWidth = true
rect.hAlign = 'center'
rect.vAlign = 'bottom'
rect.opacity = 1.0

canvas.visible = true


/**
 * CREATE GOLD INFORMATIONS
 * */

// gold information screen
let goldUITexture = new Texture("models/UI/ui_gold.png")
const goldImgScreen = new UIImage(rect, goldUITexture)
goldImgScreen.name = "gold_screen"
goldImgScreen.hAlign = 'center'
goldImgScreen.vAlign = 'top'
goldImgScreen.sourceLeft = 0
goldImgScreen.sourceTop = 0
goldImgScreen.sourceWidth = 49
goldImgScreen.sourceHeight = 49
goldImgScreen.width = 30
goldImgScreen.height = 30
goldImgScreen.positionX = -100
goldImgScreen.positionY = 60
goldImgScreen.visible = false

// UI text for gold count
const goldTxt = new UIText(rect)
goldTxt.outlineColor = new Color4(0.7, 1, 0.8, 1)
goldTxt.value = ''
goldTxt.fontSize = 22
goldTxt.width = 500
goldTxt.height = 205
goldTxt.positionX = -30
goldTxt.positionY = 160
goldTxt.color = new Color4(0.7, 1, 0.8, 1)
goldTxt.textWrapping = false

export function UpdateGold(nb : number)
{
  log("UPDATING GOLD BY "+nb)
  gameData.gold += nb
  goldTxt.value = ""//+gameData.gold
  SFX_Money.playOnce()
}

// UI text for INVENTORY FULL

const invFullTxt = new UIText(rect)
invFullTxt.outlineColor = Color4.White()
invFullTxt.value = 'INVENTORY FULL'
invFullTxt.fontSize = 40
invFullTxt.width = 500
invFullTxt.height = 205
invFullTxt.positionX = -100
invFullTxt.positionY = 200
invFullTxt.color = Color4.Red()
invFullTxt.textWrapping = true
invFullTxt.visible = false

const invFullTimer = new Entity()
engine.addEntity(invFullTimer)

export function showInventoryFull()
{
  let timeRemaining: number = 2
  invFullTxt.visible = true
  invFullTimer.addComponent(new utils.Interval(1000, (): void => {
    timeRemaining--;
  
    if(timeRemaining > 0)
    {
  
    }
    else
    {
      invFullTxt.visible = false
      invFullTimer.removeComponent(utils.Interval)
    }
  }))
}

  // INGREDIENT MISSING /////////////////////////////////
  // UI text for INVENTORY FULL

  const missingTxt = new UIText(rect)
  missingTxt.outlineColor = Color4.White()
  missingTxt.value = 'MISSING INGREDIENT'
  missingTxt.fontSize = 40
  missingTxt.width = 500
  missingTxt.height = 205
  missingTxt.positionX = -100
  missingTxt.positionY = 200
  missingTxt.color = Color4.Red()
  missingTxt.textWrapping = true
  missingTxt.visible = false
  
  const missingTimer = new Entity()
  engine.addEntity(missingTimer)
  
  export function showMissing()
  {
    let timeRemaining: number = 2
    missingTxt.visible = true
    missingTimer.addComponent(new utils.Interval(1000, (): void => {
      timeRemaining--;
    
      if(timeRemaining > 0)
      {
    
      }
      else
      {
        missingTxt.visible = false
        missingTimer.removeComponent(utils.Interval)
      }
    }))
  }

  const cannotBakeTxt = new UIText(rect)
  cannotBakeTxt.outlineColor = Color4.White()
  cannotBakeTxt.value = 'CANNOT JELLIFY THIS INGREDIENT'
  cannotBakeTxt.fontSize = 40
  cannotBakeTxt.width = 500
  cannotBakeTxt.height = 205
  cannotBakeTxt.positionX = -100
  cannotBakeTxt.positionY = 200
  cannotBakeTxt.color = Color4.Red()
  cannotBakeTxt.textWrapping = true
  cannotBakeTxt.visible = false

  const cannotBakeTimer = new Entity()
  engine.addEntity(cannotBakeTimer)

  export function showCannotBake()
  {
    let timeRemaining: number = 2
    cannotBakeTxt.visible = true
    cannotBakeTimer.addComponent(new utils.Interval(1000, (): void => {
      timeRemaining--;
    
      if(timeRemaining > 0)
      {
    
      }
      else
      {
        cannotBakeTxt.visible = false
        cannotBakeTimer.removeComponent(utils.Interval)
      }
    }))
  }

  const noMoneyTxt = new UIText(rect)
  noMoneyTxt.outlineColor = Color4.White()
  noMoneyTxt.value = 'YOU NEED 50 coins TO LAUNCH CHICK RUN'
  noMoneyTxt.fontSize = 40
  noMoneyTxt.width = 500
  noMoneyTxt.height = 205
  noMoneyTxt.positionX = -100
  noMoneyTxt.positionY = 200
  noMoneyTxt.color = Color4.Red()
  noMoneyTxt.textWrapping = true
  noMoneyTxt.visible = false

  const noMoneyTimer = new Entity()
  engine.addEntity(noMoneyTimer)

  export function showNoMoney()
  {
    let timeRemaining: number = 2
    noMoneyTxt.visible = true
    noMoneyTimer.addComponent(new utils.Interval(1000, (): void => {
      timeRemaining--;
    
      if(timeRemaining > 0)
      {
    
      }
      else
      {
        noMoneyTxt.visible = false
        noMoneyTimer.removeComponent(utils.Interval)
      }
    }))
  }

  const ccTxt = new UIText(rect)
  ccTxt.outlineColor = Color4.White()
  ccTxt.value = '[License: CC-BY-SA-4.0]\nLow Poly Farm v2 by EdwinRC\nLow Poly Car by MohamedShirfy\nMicro Chick - Proto Series by BitGem\nPotted plant by Pixel-bit\nLow poly open crate by Frank Heuver'
  ccTxt.fontSize = 20
  ccTxt.width = 1000
  ccTxt.height = 500
  ccTxt.positionX = -100
  ccTxt.positionY = 500
  ccTxt.color = Color4.White()
  ccTxt.textWrapping = true
  ccTxt.visible = false
  
  const ccTimer = new Entity()
  engine.addEntity(ccTimer)
  
  export function showCC()
  {
    let timeRemaining: number = 5
    ccTxt.visible = true
    ccTimer.addComponent(new utils.Interval(1000, (): void => {
      timeRemaining--;
    
      if(timeRemaining > 0)
      {
    
      }
      else
      {
        ccTxt.visible = false
        ccTimer.removeComponent(utils.Interval)
      }
    }))
  }


/**********************************************************
 * CREATE UI INFORMATIONS
 * ********************************************************/

 // Create all UI images for inventory
 let invUITexture : Texture
 let invUITextureCarrot : Texture
 let invUITexturePumpkin : Texture
 let invUITextureBeet : Texture
 let invUITextureCabbage : Texture
 let invUITextureCucumber : Texture
 let invUITextureSoup : Texture
 let invUITexturePotion : Texture
 let invUITextureNoodles : Texture
 let invUITextureHotdog : Texture
 let invUITextureBento : Texture
 let invUITextureBlack : Texture
 let invUITextureRed : Texture
 let invUITextureGreen : Texture
 let invUITextureOrange : Texture
 const invImgScreen: UIImage[] = []
 const invImgScreenCarrot: UIImage[] = []
 const invImgScreenPumpkin: UIImage[] = []
 const invImgScreenBeet: UIImage[] = []
 const invImgScreenCabbage: UIImage[] = []
 const invImgScreenCucumber: UIImage[] = []
 const invImgScreenSoup : UIImage[] = []
 const invImgScreenPotion : UIImage[] = []
 const invImgScreenNoodles : UIImage[] = []
 const invImgScreenHotdog : UIImage[] = []
 const invImgScreenBento : UIImage[] = []
 const invImgScreenBlack : UIImage[] = []
 const invImgScreenRed : UIImage[] = []
 const invImgScreenGreen : UIImage[] = []
 const invImgScreenOrange : UIImage[] = []

 invUITexture = new Texture("models/UI/inv.png")
 invUITextureCarrot = new Texture("models/UI/inv_carrot.png")
 invUITexturePumpkin = new Texture("models/UI/inv_pumpkin.png")
 invUITextureBeet = new Texture("models/UI/inv_beet.png")
 invUITextureCabbage = new Texture("models/UI/inv_cabbage.png")
 invUITextureCucumber = new Texture("models/UI/inv_cucumber.png")
 invUITextureSoup = new Texture("models/UI/ui_soup.png")
 invUITexturePotion = new Texture("models/UI/ui_potion.png")
 invUITextureNoodles = new Texture("models/UI/ui_noodles.png")
 invUITextureHotdog = new Texture("models/UI/ui_hotdog.png")
 invUITextureBento = new Texture("models/UI/ui_bento.png")
 invUITextureBlack = new Texture("models/UI/ui_black.png")
 invUITextureRed = new Texture("models/UI/ui_red.png")
 invUITextureGreen = new Texture("models/UI/ui_green.png")
 invUITextureOrange = new Texture("models/UI/ui_orange.png")

 for(let i=0;i<4;i++)
 {
   invImgScreen[i] = new UIImage(rect, invUITexture)
   invImgScreenCarrot[i] = new UIImage(rect, invUITextureCarrot)
   invImgScreenPumpkin[i] = new UIImage(rect, invUITexturePumpkin)
   invImgScreenBeet[i] = new UIImage(rect, invUITextureBeet)
   invImgScreenCabbage[i] = new UIImage(rect, invUITextureCabbage)
   invImgScreenCucumber[i] = new UIImage(rect, invUITextureCucumber)

   invImgScreenSoup[i] = new UIImage(rect, invUITextureSoup)
   invImgScreenPotion[i] = new UIImage(rect, invUITexturePotion)
   invImgScreenNoodles[i] = new UIImage(rect, invUITextureNoodles)
   invImgScreenHotdog[i] = new UIImage(rect, invUITextureHotdog)
   invImgScreenBento[i] = new UIImage(rect, invUITextureBento)
   invImgScreenBlack[i] = new UIImage(rect, invUITextureBlack)
   invImgScreenRed[i] = new UIImage(rect, invUITextureRed)
   invImgScreenGreen[i] = new UIImage(rect, invUITextureGreen)
   invImgScreenOrange[i] = new UIImage(rect, invUITextureOrange)

   invImgScreenSoup[i].name = "inv_screen_"+i
   invImgScreenSoup[i].hAlign = 'left'
   invImgScreenSoup[i].vAlign = 'top'
   invImgScreenSoup[i].sourceLeft = 0
   invImgScreenSoup[i].sourceTop = 0
   invImgScreenSoup[i].sourceWidth = 100
   invImgScreenSoup[i].sourceHeight = 100
   invImgScreenSoup[i].width = 45
   invImgScreenSoup[i].height = 45
   invImgScreenSoup[i].positionX = -70+70*i
   invImgScreenSoup[i].positionY = 20
   invImgScreenSoup[i].visible = false

   invImgScreenPotion[i].name = "inv_screen_"+i
   invImgScreenPotion[i].hAlign = 'left'
   invImgScreenPotion[i].vAlign = 'top'
   invImgScreenPotion[i].sourceLeft = 0
   invImgScreenPotion[i].sourceTop = 0
   invImgScreenPotion[i].sourceWidth = 100
   invImgScreenPotion[i].sourceHeight = 100
   invImgScreenPotion[i].width = 45
   invImgScreenPotion[i].height = 45
   invImgScreenPotion[i].positionX = -70+70*i
   invImgScreenPotion[i].positionY = 20
   invImgScreenPotion[i].visible = false
   
   invImgScreenNoodles[i].name = "inv_screen_"+i
   invImgScreenNoodles[i].hAlign = 'left'
   invImgScreenNoodles[i].vAlign = 'top'
   invImgScreenNoodles[i].sourceLeft = 0
   invImgScreenNoodles[i].sourceTop = 0
   invImgScreenNoodles[i].sourceWidth = 100
   invImgScreenNoodles[i].sourceHeight = 100
   invImgScreenNoodles[i].width = 45
   invImgScreenNoodles[i].height = 45
   invImgScreenNoodles[i].positionX = -70+70*i
   invImgScreenNoodles[i].positionY = 20
   invImgScreenNoodles[i].visible = false

   invImgScreenHotdog[i].name = "inv_screen_"+i
   invImgScreenHotdog[i].hAlign = 'left'
   invImgScreenHotdog[i].vAlign = 'top'
   invImgScreenHotdog[i].sourceLeft = 0
   invImgScreenHotdog[i].sourceTop = 0
   invImgScreenHotdog[i].sourceWidth = 100
   invImgScreenHotdog[i].sourceHeight = 100
   invImgScreenHotdog[i].width = 45
   invImgScreenHotdog[i].height = 45
   invImgScreenHotdog[i].positionX = -70+70*i
   invImgScreenHotdog[i].positionY = 20
   invImgScreenHotdog[i].visible = false

   invImgScreenBento[i].name = "inv_screen_"+i
   invImgScreenBento[i].hAlign = 'left'
   invImgScreenBento[i].vAlign = 'top'
   invImgScreenBento[i].sourceLeft = 0
   invImgScreenBento[i].sourceTop = 0
   invImgScreenBento[i].sourceWidth = 100
   invImgScreenBento[i].sourceHeight = 100
   invImgScreenBento[i].width = 45
   invImgScreenBento[i].height = 45
   invImgScreenBento[i].positionX = -70+70*i
   invImgScreenBento[i].positionY = 20
   invImgScreenBento[i].visible = false

   invImgScreenBlack[i].name = "inv_screen_"+i
   invImgScreenBlack[i].hAlign = 'left'
   invImgScreenBlack[i].vAlign = 'top'
   invImgScreenBlack[i].sourceLeft = 0
   invImgScreenBlack[i].sourceTop = 0
   invImgScreenBlack[i].sourceWidth = 100
   invImgScreenBlack[i].sourceHeight = 100
   invImgScreenBlack[i].width = 45
   invImgScreenBlack[i].height = 45
   invImgScreenBlack[i].positionX = -70+70*i
   invImgScreenBlack[i].positionY = 20
   invImgScreenBlack[i].visible = false

   invImgScreenRed[i].name = "inv_screen_"+i
   invImgScreenRed[i].hAlign = 'left'
   invImgScreenRed[i].vAlign = 'top'
   invImgScreenRed[i].sourceLeft = 0
   invImgScreenRed[i].sourceTop = 0
   invImgScreenRed[i].sourceWidth = 100
   invImgScreenRed[i].sourceHeight = 100
   invImgScreenRed[i].width = 45
   invImgScreenRed[i].height = 45
   invImgScreenRed[i].positionX = -70+70*i
   invImgScreenRed[i].positionY = 20
   invImgScreenRed[i].visible = false

   invImgScreenGreen[i].name = "inv_screen_"+i
   invImgScreenGreen[i].hAlign = 'left'
   invImgScreenGreen[i].vAlign = 'top'
   invImgScreenGreen[i].sourceLeft = 0
   invImgScreenGreen[i].sourceTop = 0
   invImgScreenGreen[i].sourceWidth = 100
   invImgScreenGreen[i].sourceHeight = 100
   invImgScreenGreen[i].width = 45
   invImgScreenGreen[i].height = 45
   invImgScreenGreen[i].positionX = -70+70*i
   invImgScreenGreen[i].positionY = 20
   invImgScreenGreen[i].visible = false

   invImgScreenOrange[i].name = "inv_screen_"+i
   invImgScreenOrange[i].hAlign = 'left'
   invImgScreenOrange[i].vAlign = 'top'
   invImgScreenOrange[i].sourceLeft = 0
   invImgScreenOrange[i].sourceTop = 0
   invImgScreenOrange[i].sourceWidth = 100
   invImgScreenOrange[i].sourceHeight = 100
   invImgScreenOrange[i].width = 45
   invImgScreenOrange[i].height = 45
   invImgScreenOrange[i].positionX = -70+70*i
   invImgScreenOrange[i].positionY = 20
   invImgScreenOrange[i].visible = false

   ///////////////////////////////////////////////////////////
 
   invImgScreen[i].name = "inv_screen_"+i
   invImgScreen[i].hAlign = 'left'
   invImgScreen[i].vAlign = 'top'
   invImgScreen[i].sourceLeft = 0
   invImgScreen[i].sourceTop = 0
   invImgScreen[i].sourceWidth = 49
   invImgScreen[i].sourceHeight = 49
   invImgScreen[i].width = 49
   invImgScreen[i].height = 49
   invImgScreen[i].positionX = -70+70*i
   invImgScreen[i].positionY = 20
   invImgScreen[i].visible = false
 
   invImgScreenCarrot[i].name = "inv_screen_carrot_"+i
   invImgScreenCarrot[i].hAlign = 'left'
   invImgScreenCarrot[i].vAlign = 'top'
   invImgScreenCarrot[i].sourceLeft = 0
   invImgScreenCarrot[i].sourceTop = 0
   invImgScreenCarrot[i].sourceWidth = 100
   invImgScreenCarrot[i].sourceHeight = 100
   invImgScreenCarrot[i].width = 49
   invImgScreenCarrot[i].height = 49
   invImgScreenCarrot[i].positionX = -70+70*i
   invImgScreenCarrot[i].positionY = 20
   invImgScreenCarrot[i].visible = false
 
   invImgScreenPumpkin[i].name = "inv_screen_carrot_"+i
   invImgScreenPumpkin[i].hAlign = 'left'
   invImgScreenPumpkin[i].vAlign = 'top'
   invImgScreenPumpkin[i].sourceLeft = 0
   invImgScreenPumpkin[i].sourceTop = 0
   invImgScreenPumpkin[i].sourceWidth = 100
   invImgScreenPumpkin[i].sourceHeight = 100
   invImgScreenPumpkin[i].width = 49
   invImgScreenPumpkin[i].height = 49
   invImgScreenPumpkin[i].positionX = -70+70*i
   invImgScreenPumpkin[i].positionY = 20
   invImgScreenPumpkin[i].visible = false
 
   invImgScreenBeet[i].name = "inv_screen_carrot_"+i
   invImgScreenBeet[i].hAlign = 'left'
   invImgScreenBeet[i].vAlign = 'top'
   invImgScreenBeet[i].sourceLeft = 0
   invImgScreenBeet[i].sourceTop = 0
   invImgScreenBeet[i].sourceWidth = 100
   invImgScreenBeet[i].sourceHeight = 100
   invImgScreenBeet[i].width = 49
   invImgScreenBeet[i].height = 49
   invImgScreenBeet[i].positionX = -70+70*i
   invImgScreenBeet[i].positionY = 20
   invImgScreenBeet[i].visible = false
 
   invImgScreenCabbage[i].name = "inv_screen_carrot_"+i
   invImgScreenCabbage[i].hAlign = 'left'
   invImgScreenCabbage[i].vAlign = 'top'
   invImgScreenCabbage[i].sourceLeft = 0
   invImgScreenCabbage[i].sourceTop = 0
   invImgScreenCabbage[i].sourceWidth = 100
   invImgScreenCabbage[i].sourceHeight = 100
   invImgScreenCabbage[i].width = 49
   invImgScreenCabbage[i].height = 49
   invImgScreenCabbage[i].positionX = -70+70*i
   invImgScreenCabbage[i].positionY = 20
   invImgScreenCabbage[i].visible = false
 
   invImgScreenCucumber[i].name = "inv_screen_carrot_"+i
   invImgScreenCucumber[i].hAlign = 'left'
   invImgScreenCucumber[i].vAlign = 'top'
   invImgScreenCucumber[i].sourceLeft = 0
   invImgScreenCucumber[i].sourceTop = 0
   invImgScreenCucumber[i].sourceWidth = 100
   invImgScreenCucumber[i].sourceHeight = 100
   invImgScreenCucumber[i].width = 49
   invImgScreenCucumber[i].height = 49
   invImgScreenCucumber[i].positionX = -70+70*i
   invImgScreenCucumber[i].positionY = 20
   invImgScreenCucumber[i].visible = false
 }

// Create all UI images for trash can, fry pan, table & oven
/*let normalUITexture = new Texture("models/UI/inv.png")
const normalImageScreen = new UIImage(rect, normalUITexture)
let validUITexture = new Texture("models/UI/inv.png")
const validImageScreen = new UIImage(rect, validUITexture)
let closeUITexture = new Texture("images/UI/close.png")
const closeImageScreen = new UIImage(rect, closeUITexture)

normalImageScreen.name = "inv_screen_normal"
normalImageScreen.hAlign = 'left'
normalImageScreen.vAlign = 'top'
normalImageScreen.sourceLeft = 0
normalImageScreen.sourceTop = 0
normalImageScreen.sourceWidth = 49
normalImageScreen.sourceHeight = 49
normalImageScreen.width = 100
normalImageScreen.height = 100
normalImageScreen.positionX = 10
normalImageScreen.positionY = 300
normalImageScreen.visible = false

closeImageScreen.name = "inv_screen_close"
closeImageScreen.hAlign = 'left'
closeImageScreen.vAlign = 'top'
closeImageScreen.sourceLeft = 0
closeImageScreen.sourceTop = 0
closeImageScreen.sourceWidth = 112
closeImageScreen.sourceHeight = 112
closeImageScreen.width = 30
closeImageScreen.height = 30
closeImageScreen.positionX = 95
closeImageScreen.positionY = 315
closeImageScreen.visible = false
closeImageScreen.onClick = new OnClick(() => {
  hideBoxUI()
})

validImageScreen.name = "inv_screen_valid"
validImageScreen.hAlign = 'left'
validImageScreen.vAlign = 'top'
validImageScreen.sourceLeft = 0
validImageScreen.sourceTop = 0
validImageScreen.sourceWidth = 49
validImageScreen.sourceHeight = 49
validImageScreen.width = 100
validImageScreen.height = 40
validImageScreen.positionX = 10
validImageScreen.positionY = 210
validImageScreen.visible = false
validImageScreen.onClick = new OnClick(() => {
  hideBoxUI()
})

const boxImgScreenCarrot: UIImage = new UIImage(rect, invUITextureCarrot)
const boxImgScreenPumpkin: UIImage = new UIImage(rect, invUITexturePumpkin)
const boxImgScreenBeet: UIImage = new UIImage(rect, invUITextureBeet)
const boxImgScreenCabbage: UIImage = new UIImage(rect, invUITextureCabbage)
const boxImgScreenCucumber: UIImage = new UIImage(rect, invUITextureCucumber)

boxImgScreenCarrot.name = "inv_screen_normal"
boxImgScreenCarrot.hAlign = 'left'
boxImgScreenCarrot.vAlign = 'top'
boxImgScreenCarrot.sourceLeft = 0
boxImgScreenCarrot.sourceTop = 0
boxImgScreenCarrot.sourceWidth = 49
boxImgScreenCarrot.sourceHeight = 49
boxImgScreenCarrot.width = 100
boxImgScreenCarrot.height = 100
boxImgScreenCarrot.positionX = 10
boxImgScreenCarrot.positionY = 300
boxImgScreenCarrot.visible = false

boxImgScreenPumpkin.name = "inv_screen_normal"
boxImgScreenPumpkin.hAlign = 'left'
boxImgScreenPumpkin.vAlign = 'top'
boxImgScreenPumpkin.sourceLeft = 0
boxImgScreenPumpkin.sourceTop = 0
boxImgScreenPumpkin.sourceWidth = 49
boxImgScreenPumpkin.sourceHeight = 49
boxImgScreenPumpkin.width = 100
boxImgScreenPumpkin.height = 100
boxImgScreenPumpkin.positionX = 10
boxImgScreenPumpkin.positionY = 300
boxImgScreenPumpkin.visible = false

boxImgScreenBeet.name = "inv_screen_normal"
boxImgScreenBeet.hAlign = 'left'
boxImgScreenBeet.vAlign = 'top'
boxImgScreenBeet.sourceLeft = 0
boxImgScreenBeet.sourceTop = 0
boxImgScreenBeet.sourceWidth = 49
boxImgScreenBeet.sourceHeight = 49
boxImgScreenBeet.width = 100
boxImgScreenBeet.height = 100
boxImgScreenBeet.positionX = 10
boxImgScreenBeet.positionY = 300
boxImgScreenBeet.visible = false

boxImgScreenCabbage.name = "inv_screen_normal"
boxImgScreenCabbage.hAlign = 'left'
boxImgScreenCabbage.vAlign = 'top'
boxImgScreenCabbage.sourceLeft = 0
boxImgScreenCabbage.sourceTop = 0
boxImgScreenCabbage.sourceWidth = 49
boxImgScreenCabbage.sourceHeight = 49
boxImgScreenCabbage.width = 100
boxImgScreenCabbage.height = 100
boxImgScreenCabbage.positionX = 10
boxImgScreenCabbage.positionY = 300
boxImgScreenCabbage.visible = false

boxImgScreenCucumber.name = "inv_screen_normal"
boxImgScreenCucumber.hAlign = 'left'
boxImgScreenCucumber.vAlign = 'top'
boxImgScreenCucumber.sourceLeft = 0
boxImgScreenCucumber.sourceTop = 0
boxImgScreenCucumber.sourceWidth = 49
boxImgScreenCucumber.sourceHeight = 49
boxImgScreenCucumber.width = 100
boxImgScreenCucumber.height = 100
boxImgScreenCucumber.positionX = 10
boxImgScreenCucumber.positionY = 300
boxImgScreenCucumber.visible = false

export function hideBoxUI()
{
  addData("boxType","")
  normalImageScreen.visible = false
  closeImageScreen.visible = false
  validImageScreen.visible = false
  boxImgScreenCarrot.visible = false
  boxImgScreenPumpkin.visible = false
  boxImgScreenBeet.visible = false
  boxImgScreenCabbage.visible = false
  boxImgScreenCucumber.visible = false
}

export function showBoxUI(x: string)
{
  normalImageScreen.visible = true
  closeImageScreen.visible = true
  validImageScreen.visible = true

  if(x=="carrot")
    boxImgScreenCarrot.visible = true
  else if(x=="pumpkin")
    boxImgScreenPumpkin.visible = true
  else if(x=="beet")
    boxImgScreenBeet.visible = true
  else if(x=="cabbage")
    boxImgScreenCabbage.visible = true
  else if(x=="cucumber")
    boxImgScreenCucumber.visible = true
}*/

 // INVENTORY MANAGEMENT //////////////////////////////////////////////////////////
 

/*export function createDarkSubstance(txt: string = "oven", ovenTime: number = 0): Entity
{
  const darkMaterial = new Material()
  darkMaterial.albedoColor = Color3.Black()
  darkMaterial.metallic = 0.9
  darkMaterial.roughness = 0.9
  
  const darkSubstanceUI: Entity = new Entity()
  const darkSubstance: Entity = new Entity()
  darkSubstance.addComponent(new BoxShape);
  darkSubstance.addComponent(new Transform({
    position: new Vector3(0,0,0),
    scale: new Vector3(0.5,0.5,0.5),
  }))
  darkSubstance.addComponent(darkMaterial)
  darkSubstance.addComponent(new BoxState())
  darkSubstance.getComponent(BoxState).state = txt
  darkSubstance.addComponent(new OnClick(
    e => {
      log("PICK GREEN SUBSTANCE")
      PickItem(darkSubstance,darkSubstanceUI,"dark")
    }
  ))

  ////
  if(ovenTime>0)
  {
    let timeRemaining: number = ovenTime
    darkSubstance.addComponent(new utils.Interval(1000, (): void => {
      timeRemaining--;

      if(timeRemaining > 0)
      {

      }
      else
      {
        darkSubstance.removeComponent(utils.Interval);
        let substance: Entity
        OvenReady();
        substance = createDarkSubstance()
        engine.addEntity(substance)
        engine.removeEntity(darkSubstance)
      }
    }))
  }
  ////

  return(darkSubstance)
}

export function createGreenSubstance(txt: string = "oven", ovenTime: number = 0): Entity
{
  const greenMaterial = new Material()
  greenMaterial.albedoColor = Color3.Green()
  greenMaterial.metallic = 0.9
  greenMaterial.roughness = 0.9
  
  let greenSubstanceUI: Entity = new Entity()
  let greenSubstance: Entity = new Entity()
  greenSubstance.addComponent(new BoxShape);
  greenSubstance.addComponent(new Transform({
    position: new Vector3(0,0,0),
    scale: new Vector3(0.5,0.5,0.5),
  }))
  greenSubstance.addComponent(greenMaterial)
  greenSubstance.addComponent(new BoxState())
  greenSubstance.getComponent(BoxState).state = txt
  greenSubstance.addComponent(new OnClick(
    e => {
      log("PICK GREEN SUBSTANCE")
      PickItem(greenSubstance,greenSubstanceUI,"green")
    }
  ))

  ////
  if(ovenTime>0)
  {
    log("BAKING GREEN SUBSTANCE in "+ovenTime)
    let timeRemaining: number = ovenTime
    log("BAKING GREEN SUBSTANCE in "+timeRemaining)
    greenSubstance.addComponent(new utils.Interval(1000, (): void => {
      log("IN LOOP")
      timeRemaining--;
  
      if(timeRemaining > 0)
      {
        log("REMAINING")
      }
      else
      {
        log("BAKING GREEN READY")
        greenSubstance.removeComponent(utils.Interval);
        let substance: Entity
        OvenReady();
        substance = createDarkSubstance()
        engine.addEntity(substance)
        engine.removeEntity(greenSubstance)
      }
    }))
  }
  ////

  return(greenSubstance)
}

export function createOrangeSubstance(txt: string = "oven", ovenTime: number = 0): Entity
{
  const orangeMaterial = new Material()
  orangeMaterial.albedoColor = Color3.Yellow()
  orangeMaterial.metallic = 0.9
  orangeMaterial.roughness = 0.9
  
  const orangeSubstanceUI: Entity = new Entity()
  const orangeSubstance: Entity = new Entity()
  orangeSubstance.addComponent(new BoxShape);
  orangeSubstance.addComponent(new Transform({
    position: new Vector3(0,0,0),
    scale: new Vector3(0.5,0.5,0.5),
  }))
  orangeSubstance.addComponent(orangeMaterial)
  orangeSubstance.addComponent(new BoxState())
  orangeSubstance.getComponent(BoxState).state = txt
  orangeSubstance.addComponent(new OnClick(
    e => {
      log("PICK GREEN SUBSTANCE")
      PickItem(orangeSubstance,orangeSubstanceUI,"orange")
    }
  ))

  ////
  if(ovenTime>0)
  {
    let timeRemaining: number = ovenTime
    orangeSubstance.addComponent(new utils.Interval(1000, (): void => {
      timeRemaining--;
  
      if(timeRemaining > 0)
      {
  
      } 
      else
      {
        orangeSubstance.removeComponent(utils.Interval);
        let substance: Entity
        OvenReady();
        substance = createDarkSubstance()
        engine.addEntity(substance)
        engine.removeEntity(orangeSubstance)
      }
    }))
  }
  ////

  return(orangeSubstance)
}

export function createRedSubstance(txt: string = "oven", ovenTime: number = 0): Entity
{
  const redMaterial = new Material()
  redMaterial.albedoColor = Color3.Red()
  redMaterial.metallic = 0.9
  redMaterial.roughness = 0.9
  
  const redSubstanceUI: Entity = new Entity()
  const redSubstance: Entity = new Entity()
  redSubstance.addComponent(new BoxShape);
  redSubstance.addComponent(new Transform({
    position: new Vector3(0,0,0),
    scale: new Vector3(0.5,0.5,0.5),
  }))
  redSubstance.addComponent(redMaterial)
  redSubstance.addComponent(new BoxState())
  redSubstance.getComponent(BoxState).state = txt
  redSubstance.addComponent(new OnClick(
    e => {
      log("PICK GREEN SUBSTANCE")
      PickItem(redSubstance,redSubstanceUI,"red")
    }
  ))

  ////
  if(ovenTime>0)
  {
    let timeRemaining: number = ovenTime
    redSubstance.addComponent(new utils.Interval(1000, (): void => {
      timeRemaining--;
  
      if(timeRemaining > 0)
      {
  
      }
      else
      {
        redSubstance.removeComponent(utils.Interval);
        let substance: Entity
        OvenReady();
        substance = createDarkSubstance()
        engine.addEntity(substance)
        engine.removeEntity(redSubstance)
      }
    }))
  }
  ////

  return(redSubstance)*/
}

/*const test1: Entity = createDarkSubstance()
const test2: Entity = createDarkSubstance()
test2.getComponent(Transform).position.x = 2
engine.addEntity(test1)
engine.addEntity(test2)*/

 
 export function updateInventoryUI(): void
 {
   let inv : string[] = inventoryGet()
   //log("UPDATE INVENTORY UI: "+inv)
 
   for(let i=0;i<4;i++)
   {
     invImgScreenCarrot[i].visible = false
     invImgScreenPumpkin[i].visible = false
     invImgScreenBeet[i].visible = false
     invImgScreenCabbage[i].visible = false
     invImgScreenCucumber[i].visible = false
     invImgScreenSoup[i].visible = false
     invImgScreenPotion[i].visible = false
     invImgScreenNoodles[i].visible = false
     invImgScreenHotdog[i].visible = false
     invImgScreenBento[i].visible = false
     invImgScreenBlack[i].visible = false
     invImgScreenRed[i].visible = false
     invImgScreenGreen[i].visible = false
     invImgScreenOrange[i].visible = false
 
     if(inv[i]=="carrot")
     {
       invImgScreenCarrot[i].visible = true
     }
     else if(inv[i]=="pumpkin")
     {
       invImgScreenPumpkin[i].visible = true
     }
     else if(inv[i]=="beet")
     {
       invImgScreenBeet[i].visible = true
     }
     else if(inv[i]=="cabbage")
     {
       invImgScreenCabbage[i].visible = true
     }
     else if(inv[i]=="cucumber")
     {
       invImgScreenCucumber[i].visible = true
     }
     else if(inv[i]=="soup")
     {
       invImgScreenSoup[i].visible = true
     }
     else if(inv[i]=="potion")
     {
       invImgScreenPotion[i].visible = true
     }
     else if(inv[i]=="noodles")
     {
       invImgScreenNoodles[i].visible = true
     }
     else if(inv[i]=="hotdog")
     {
       invImgScreenHotdog[i].visible = true
     }
     else if(inv[i]=="bento")
     {
       invImgScreenBento[i].visible = true
     }
     else if(inv[i]=="dark")
     {
       invImgScreenBlack[i].visible = true
     }
     else if(inv[i]=="green")
     {
       invImgScreenGreen[i].visible = true
     }
     else if(inv[i]=="orange")
     {
       invImgScreenOrange[i].visible = true
     }
     else if(inv[i]=="red")
     {
       invImgScreenRed[i].visible = true
     }
   }
 }

 export function PickItem(ent: Entity, entUI: Entity, name: string, type: string = "")
 {
  if(name=="carrot" || name=="pumpkin" || name=="beet" || name=="cabbage" || name=="cucumber")
    poppingSound()
  else
    SFX_Pick.playOnce()

  let inv: string[] = inventoryGet()
  log("inventory "+inv)
  if(inv[0]!="" && inv[1]!="" && inv[2]!="" && inv[3]!="")
    showInventoryFull()
  else
  {
    for(let i=0;i<4;i++)
    {
      log("CHECK INVENTORY")
      if(inv[i]=="")
      {
        /*log("PUTING ITEM IN PLACE "+i)
        log("REMOVE "+ent)
        log("BoxState BEFORE "+ent.getComponent(BoxState).state)*/
        if(type=="plant")
        {
          ent.removeComponent(OnClick)
          popAnimation(ent)
        }
        else
        {
          engine.removeEntity(ent)
        }

        if(ent.getComponent(BoxState).state=="oven")
          gameData.inOven = ""
        log("BoxState AFTER "+ent.getComponent(BoxState).state)
        addData(name,1)
        engine.removeEntity(entUI)
        inventoryAddItem(name,i)
        updateInventoryUI()
        CloseMenu3D()
        break
      }
    }
  }  
 }

 function popAnimation(ent: Entity)
 {
    //We remove some component and put some feedbacks animations
    let newPos: Vector3 = ent.getComponent(Transform).position
    newPos.y+=0.5
    ent.addComponent(new utils.MoveTransformComponent(ent.getComponent(Transform).position,newPos, 0.2, () => {
      engine.removeEntity(ent)
    }))
    ////////////////////////////////////////////////////////////
 }

 export function SpawnItem(name: string, path: string, pos: Vector3, rot: Quaternion, sca: Vector3, box: string="", ovenTime: number = 0): Entity
 {
  if(name=="soup" || name=="potion" || name=="noodles" || name=="hotdog" || name=="bento")
    SFX_Spawn.playOnce()

  //closeOvenDoor();
  const ent = new Entity();
  const entUI = new Entity();
  
  ent.addComponent(new GLTFShape(path));
  ent.addComponent(new Transform({
  }))
  ent.getComponent(Transform).position = pos,
  ent.getComponent(Transform).rotation = rot,
  ent.getComponent(Transform).scale = sca
  ent.addComponent(new OnClick(
    e => {
      PickItem(ent,entUI,name)
    }
  ))
  ent.addComponent(new BoxState())
  ent.getComponent(BoxState).state = box

  if(ovenTime>0)
  {
    let timeRemaining: number = ovenTime
    ent.addComponent(new utils.Interval(1000, (): void => {
      timeRemaining--;
  
      if(timeRemaining > 0)
      {
  
      }
      else
      {
        ent.removeComponent(utils.Interval);
        let substance: Entity
        OvenReady();
        if(name=="carrot" || name=="pumpkin")
          substance = createOrangeSubstance()
        else if(name=="beet")
          substance = createRedSubstance()
        else if(name=="cucumber" || name=="cabbage")
          substance = createGreenSubstance()
        else if(name=="darkSubstance" || name=="greenSubstance" || name=="orangeSubstance" || name=="redSubstance")
          substance = createDarkSubstance()
        substance.getComponent(Transform).position = ent.getComponent(Transform).position;
        engine.addEntity(substance)
        engine.removeEntity(ent)
      }
    }))
  }

  engine.addEntity(ent);
  //log("BOX STATE = "+ent.getComponent(BoxState).state)
  return(ent)
 }
 //UpdateMenu3D()

 //SpawnItem("carrot", "models/farm/Food_carrot.glb", new Vector3(0,0,0), new Quaternion(0,0,0,0), new Vector3(3,3,3))
 
 updateInventoryUI()