import utils from "../node_modules/decentraland-ecs-utils/index"
import { GameData, checkData, addData, removeData, inventoryGet, inventoryAddItem, updateInventoryUI, SpawnItem, showMissing, createOrangeSubstance, createRedSubstance, createGreenSubstance, createDarkSubstance, showCannotBake, showCC} from "./gameData";


/////////////////////////////////////////////////////////////////////////////////
// MENU 3D //////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

  //Create texture
  const normalTexture = new Texture("models/UI/inv.png")
  const normalMaterial = new Material()
  normalMaterial.albedoTexture = normalTexture
  const carrotMenuTexture = new Texture("models/UI/inv_carrot.png")
  const carrotMenuMaterial = new Material()
  carrotMenuMaterial.albedoTexture = carrotMenuTexture
  const pumpkinMenuTexture = new Texture("models/UI/inv_pumpkin.png")
  const pumpkinMenuMaterial = new Material()
  pumpkinMenuMaterial.albedoTexture = pumpkinMenuTexture
  const beetMenuTexture = new Texture("models/UI/inv_beet.png")
  const beetMenuMaterial = new Material()
  beetMenuMaterial.albedoTexture = beetMenuTexture
  const cabbageMenuTexture = new Texture("models/UI/inv_cabbage.png")
  const cabbageMenuMaterial = new Material()
  cabbageMenuMaterial.albedoTexture = cabbageMenuTexture
  const cucumberMenuTexture = new Texture("models/UI/inv_cucumber.png")
  const cucumberMenuMaterial = new Material()
  cucumberMenuMaterial.albedoTexture = cucumberMenuTexture

  const bentoTexture = new Texture("models/UI/menu_bento.png")
  const bentoMaterial = new Material()
  bentoMaterial.albedoTexture = bentoTexture
  const hotdogTexture = new Texture("models/UI/menu_hotdog.png")
  const hotdogMaterial = new Material()
  hotdogMaterial.albedoTexture = hotdogTexture
  const noodlesTexture = new Texture("models/UI/menu_noodles.png")
  const noodlesMaterial = new Material()
  noodlesMaterial.albedoTexture = noodlesTexture
  const potionTexture = new Texture("models/UI/menu_potion.png")
  const potionMaterial = new Material()
  potionMaterial.albedoTexture = potionTexture
  const soupTexture = new Texture("models/UI/menu_soup.png")
  const soupMaterial = new Material()
  soupMaterial.albedoTexture = soupTexture
  const potionTexture2 = new Texture("models/UI/ui_potion.png")
  const potionMaterial2 = new Material()
  potionMaterial2.albedoTexture = potionTexture2
  const noodlesTexture2 = new Texture("models/UI/ui_noodles.png")
  const noodlesMaterial2 = new Material()
  noodlesMaterial2.albedoTexture = noodlesTexture2
  const soupTexture2 = new Texture("models/UI/ui_soup.png")
  const soupMaterial2 = new Material()
  soupMaterial2.albedoTexture = soupTexture2

  const blackTexture = new Texture("models/UI/ui_black.png")
  const blackMaterial = new Material()
  blackMaterial.albedoTexture = blackTexture
  const greenTexture = new Texture("models/UI/ui_green.png")
  const greenMaterial = new Material()
  greenMaterial.albedoTexture = greenTexture
  const orangeTexture = new Texture("models/UI/ui_orange.png")
  const orangeMaterial = new Material()
  orangeMaterial.albedoTexture = orangeTexture
  const redTexture = new Texture("models/UI/ui_red.png")
  const redMaterial = new Material()
  redMaterial.albedoTexture = redTexture

  // We create the menu entities
  const menu3Dparent : Entity = new Entity()
  const menu3D : Entity[] = []

  function OpenMenu3D(pos: Vector3, rot: boolean = false)
  {
    let inv : string[] = inventoryGet()
    //log("INVENTORY == "+inv)

    for(let i=0;i<4;i++)
    {
      if(!rot)
      {
        menu3D[i].getComponent(Transform).position.x = pos.x-0.7*i+1.05;
        menu3D[i].getComponent(Transform).position.y = 1.5;
        menu3D[i].getComponent(Transform).position.z = pos.z+0.2;
        menu3D[i].getComponent(Transform).rotation = Quaternion.Euler(0,0,180)
      }
      else
      {
        menu3D[i].getComponent(Transform).position.x = pos.x;//-0.7*i+1.05;
        menu3D[i].getComponent(Transform).position.y = 1.5;
        menu3D[i].getComponent(Transform).position.z = pos.z+0.2-0.7*i+1.05;
        menu3D[i].getComponent(Transform).rotation = Quaternion.Euler(0,90,0)
      }

      if(inv[i]=="carrot")
        menu3D[i].addComponentOrReplace(carrotMenuMaterial)
      else if(inv[i]=="pumpkin")
        menu3D[i].addComponentOrReplace(pumpkinMenuMaterial)
      else if(inv[i]=="beet")
        menu3D[i].addComponentOrReplace(beetMenuMaterial)
      else if(inv[i]=="cabbage")
        menu3D[i].addComponentOrReplace(cabbageMenuMaterial)
      else if(inv[i]=="cucumber")
        menu3D[i].addComponentOrReplace(cucumberMenuMaterial)
      else if(inv[i]=="soup")
        menu3D[i].addComponentOrReplace(soupMaterial)
      else if(inv[i]=="potion")
        menu3D[i].addComponentOrReplace(potionMaterial)
      else if(inv[i]=="noodles")
        menu3D[i].addComponentOrReplace(noodlesMaterial)
      else if(inv[i]=="hotdog")
        menu3D[i].addComponentOrReplace(hotdogMaterial)
      else if(inv[i]=="bento")
        menu3D[i].addComponentOrReplace(bentoMaterial)
      else if(inv[i]=="dark")
        menu3D[i].addComponentOrReplace(blackMaterial)
      else if(inv[i]=="green")
        menu3D[i].addComponentOrReplace(greenMaterial)
      else if(inv[i]=="orange")
        menu3D[i].addComponentOrReplace(orangeMaterial)
      else if(inv[i]=="red")
        menu3D[i].addComponentOrReplace(redMaterial)
      else
        menu3D[i].addComponentOrReplace(normalMaterial)
    }
    engine.addEntity(menu3Dparent)
  }

  export function UpdateMenu3D()
  {
    let inv : string[] = inventoryGet()

    for(let i=0;i<4;i++)
    {
      if(inv[i]=="carrot")
        menu3D[i].addComponentOrReplace(carrotMenuMaterial)
      else if(inv[i]=="pumpkin")
        menu3D[i].addComponentOrReplace(pumpkinMenuMaterial)
      else if(inv[i]=="beet")
        menu3D[i].addComponentOrReplace(beetMenuMaterial)
      else if(inv[i]=="cabbage")
        menu3D[i].addComponentOrReplace(cabbageMenuMaterial)
      else if(inv[i]=="cucumber")
        menu3D[i].addComponentOrReplace(cucumberMenuMaterial)
      else if(inv[i]=="soup")
        menu3D[i].addComponentOrReplace(soupMaterial)
      else if(inv[i]=="potion")
        menu3D[i].addComponentOrReplace(potionMaterial)
      else if(inv[i]=="noodles")
        menu3D[i].addComponentOrReplace(noodlesMaterial)
      else if(inv[i]=="hotdog")
        menu3D[i].addComponentOrReplace(hotdogMaterial)
      else if(inv[i]=="bento")
        menu3D[i].addComponentOrReplace(bentoMaterial)
      else if(inv[i]=="black")
        menu3D[i].addComponentOrReplace(blackMaterial)
      else if(inv[i]=="green")
        menu3D[i].addComponentOrReplace(greenMaterial)
      else if(inv[i]=="orange")
        menu3D[i].addComponentOrReplace(orangeMaterial)
      else if(inv[i]=="red")
        menu3D[i].addComponentOrReplace(redMaterial)
      else
        menu3D[i].addComponentOrReplace(normalMaterial)
    }
  }

  export function CloseMenu3D()
  {
    /*for(let i=0;i<4;i++)
    {
      if(gameData.inventory[i]=="carrot")
        menu3D[i].removeComponent(carrotMenuuMaterial)
    }*/

    engine.removeEntity(menu3Dparent)
  }

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

  /*SpawnItem("cucumber", "models/farm/Food_cucumber.glb", new Vector3(19,0.4,19.4), new Quaternion(0,0,0,0), new Vector3(3,3,3), "",0)
  SpawnItem("cabbage", "models/farm/Food_cabbage.glb", new Vector3(19,0.6,20), new Quaternion(0,0,0,0), new Vector3(3,3,3), "",0)
  SpawnItem("pumpkin", "models/farm/Food_pumpkin.glb", new Vector3(19,0.4,20.4), new Quaternion(0,0,0,0), new Vector3(1,1,1), "",0)
  SpawnItem("carrot", "models/farm/Food_carrot.glb", new Vector3(19.05,0.6,20.8), new Quaternion(0,0,0,0), new Vector3(3,3,3), "",0)*/

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
