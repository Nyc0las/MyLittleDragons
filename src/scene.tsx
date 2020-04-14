import * as DCL from "decentraland-api"
import { Vector3Component } from "decentraland-api"
import { createElement, ScriptableScene } from 'metaverse-api'

const networkHz = 6
const interval = 1000 / networkHz
//import ball from './scene.json'

export default class LittleDragon extends ScriptableScene<any, { time: number }>
{
  //Get boundaries
  jsontext = '{"boundaries":[[0,20],[0,10],[0,10]]}' //x min/max, y min/max and z min/max
  limits = JSON.parse(this.jsontext)

  jsitems = '{"dish":[2,0,2]}'
  dishes = JSON.parse(this.jsitems)

  landObjects = ["bush","tree"]
  landObjectsCoord = [[2+Math.random()*16,2+Math.random()*6],[4+Math.random()*14,3+Math.random()*4],[2+Math.random()*16,2+Math.random()*6],[4+Math.random()*14,3+Math.random()*4]]

  bushString = "models/nature/bush/scene.gltf"
  //console.log(contact.surname + ", " + contact.firstname);
  //console.log(contact.phone[1]);

  //////////// VARIABLES ///////////////////////////////////////////////////////

  // 0 = Run
  // 1 = Idle
  // 2 = SleepStart
  // 3 = SleepEnd
  // 4 = Sleep
  // 5 = Eat

  state = { time: 0 }
  visibility = true

  timeout = setInterval(() => {
    this.setState({
      time: performance.now() * 0.0001
    })
  }, interval)

  sceneWillUnmount() {
    clearInterval(this.timeout)
  }

  dragoOne = new Dragon(10,"drago1",2000,0.2,[5,0,5],this.limits.boundaries,this.dishes.dish)
  egg1 = new Egg(this.dragoOne)

  /*drago2 = new Dragon(10,"drago2",2000,0.2,[3,0,3],this.limits.boundaries,this.dishes.dish)
  drago3 = new Dragon(10,"drago3",2000,0.2,[5,0,2],this.limits.boundaries,this.dishes.dish)
  drago4 = new Dragon(10,"drago4",2000,0.2,[7,0,4],this.limits.boundaries,this.dishes.dish)
  drago5 = new Dragon(10,"drago5",2000,0.2,[9,0,2],this.limits.boundaries,this.dishes.dish)
  drago6 = new Dragon(10,"drago6",2000,0.2,[6,0,5],this.limits.boundaries,this.dishes.dish)*/
  //dragoTwo = new Dragon("drago2",1000,0.4,[15,0,5],this.limits.boundaries,this.dishes.dish)
  //test.push(dragoOne);

  //////////// RENDU ///////////////////////////////////////////////////////////
  async render()
  {
    //console.log("interval "+performance.now()*0.001)
    this.dragoOne.move()
    console.log("This position "+this.dragoOne.position[1])
    /*this.drago2.move()
    this.drago3.move()
    this.drago4.move()
    this.drago5.move()
    this.drago6.move()*/
    //if(!this.egg1.hatching && !this.egg1.hatched)
    this.egg1.hatch()
    //this.dragoOne.moveTo(this.dragoTwo.position)
    //this.dragoTwo.move()
    //this.dragoTwo.moveTo([this.dragoOne.position[0],this.dragoOne.position[2]])

    //Calcul de distance
    //var distance = 0
    //distance = Math.sqrt(Math.pow(this.dragoTwo.position[0]-this.dragoOne.position[0],2)+Math.pow(this.dragoTwo.position[2]-this.dragoOne.position[2],2))

    //Get JSON infos
    /*var responseText = ""
    function levelRequestListener () {
    var levels = JSON.parse(responseText);
    }

    var request = new XMLHttpRequest();
    request.onload = levelRequestListener;
    request.open("get", "scene.json", true);
    request.send();*/


    /*var jsontext = '{"firstname":"Jesper","surname":"Aaberg","phone":["555-0100","555-0120"]}';
    //var jsonTest = ./scene.json
    var contact = JSON.parse(jsontext);
    console.log(contact.surname + ", " + contact.firstname);
    console.log(contact.phone[1]);
    //var word = parseJson(json, 'scene.json')*/

    return (
      <scene>

        <entity position={{ x: this.dishes.dish[0], y: this.dishes.dish[1], z: this.dishes.dish[2] }} rotation={{ x: 0, y: 0, z: 0 }}>
            <box position={{ x: 0, y: 0, z: 0 }} scale={{ x: 0.5, y: 0.2, z: 0.5 }} color="red"  />
            <box position={{ x: 0, y: 0.2, z: 0 }} scale={{ x: 0.2, y: 0.2, z: 0.2 }} visible = {true} color="blue" />
        </entity>

        <gltf-model
            id="egg1"
            position={{ x: this.egg1.position[0], y: this.egg1.position[1], z: this.egg1.position[2] }}
            rotation={{ x: 0, y: 0, z: 0 }}
            scale={1.0}
            src="models/Egg/scene.gltf"
            visible={this.egg1.visibility}
            transition=
            {{
              position: { duration: interval },
              rotation: { duration: interval }
            }}
            skeletalAnimation=
            {
              [
                { clip: 0, playing: this.egg1.hatched }
              ]
            }
        />

        <gltf-model
            id="drago1"
            position={{ x: this.dragoOne.position[0], y: this.dragoOne.position[1], z: this.dragoOne.position[2] }}
            rotation={{ x: this.dragoOne.rotation[0], y: this.dragoOne.rotation[1], z: this.dragoOne.rotation[2] }}
            scale={2.0}
            visible={this.dragoOne.visibility}
            src={this.dragoOne.getModel()}
            transition=
            {{
              position: { duration: interval },
              rotation: { duration: interval }
            }}
            skeletalAnimation=
            {
              [
                { clip: "Run", playing: this.dragoOne.animState[0] },
                { clip: "Idle", playing: this.dragoOne.animState[1] },
                { clip: "SleepStart", playing: this.dragoOne.animState[2] },
                { clip: "SleepEnd", playing: this.dragoOne.animState[3] },
                { clip: "Sleep", playing: this.dragoOne.animState[4] },
                { clip: "Eat", playing: this.dragoOne.animState[5] },
                { clip: "Walk", playing: this.dragoOne.animState[6] },
                { clip: "Dig", playing: this.dragoOne.animState[7] },
                { clip: "Search", playing: this.dragoOne.animState[8] },
                { clip: "FlyUpForward", playing: this.dragoOne.animState[9] },
                { clip: "FlyIdle", playing: this.dragoOne.animState[10] },
                { clip: "FlyDownForward", playing: this.dragoOne.animState[11] },
                { clip: "AttackHead", playing: this.dragoOne.animState[12] },
                { clip: "AttackTail", playing: this.dragoOne.animState[13] },
                { clip: "FlyLand", playing: this.dragoOne.animState[14] },
                { clip: "Smell", playing: this.dragoOne.animState[15] },
                { clip: "Wash", playing: this.dragoOne.animState[16] },
                { clip: "Jump", playing: this.dragoOne.animState[17] },
                { clip: "Happy", playing: this.dragoOne.animState[18] },
                { clip: "Afraid", playing: this.dragoOne.animState[19] },
                { clip: "EggOut", playing: this.dragoOne.animState[20] },
                { clip: "Sad", playing: this.dragoOne.animState[21] },
                { clip: "Caress", playing: this.dragoOne.animState[22] }
              ]
            }
        />
      </scene>
    )
  }
}

/*class Animal {
    name: string;
    constructor(theName: string) { this.name = theName; }
    move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}*/

class Dragon
{
  //main infos
  model : string
  visibility : boolean
  hatchTime : number

  //Items
  dish : number[]

  //Datas
  //age : string
  name : string
  //gender : string
  //race : string
  //owner : string
  //mother : string
  //father : string
  //siblings : string[]

  //Stats
  life : number
  lifeMax : number
  stamina : number
  staminaMax : number
  food : number
  foodMax : number
  //satisfaction : number
  //satisfactionMax : number
  //relation : number
  //relationMax : number

  //Physic
  //endurance : number
  //resistance : number
  speed : number
  speedMax : number
  //speedFly : number
  //speedFlyMax : number
  //strength : number
  //magic : number
  //agility : number
  //intelligence : number
  //luck : number

  //Influencers
  //sleep : number

  //Behavior
  //friendly : number
  //curious : number
  //fighter : number
  //motivation : number
  //wild : number

  //Special perks
  /*
  POSITIVE
  "good sleeper"

  NEGATIVE
  "can't fly"
  "lazy"
  "dumb"
  "wild"
  "big eater"
  */

  //Special actions (teachable)
  /*

  */

  //Movement
  going : string
  position : number[]
  direction : number[]
  rotation : number[]
  animState : boolean[]
  boundaries : number[][]
  //private moveRandom : number
  //private moveRandomReached : number
  private target : number[]
  private busy : boolean
  private busyCount : number

  //Behavior
  state : string //"egg","sleep","walk","hungry","eat","looking"

  constructor (theHatchTime : number, theName : string, theStamina : number, theSpeed : number, thePosition : number[], theBoundaries : number[][], theDish : number[])
  {
    this.name = theName
    this.model = "models/Drago/scene.gltf"
    this.visibility = false
    this.hatchTime = theHatchTime

    //Items
    this.dish = theDish

    //Stats
    this.lifeMax = 100
    this.life = this.lifeMax
    this.staminaMax = theStamina
    this.stamina = this.staminaMax
    this.speedMax = theSpeed
    this.speed = this.speedMax
    this.foodMax = 200
    this.food = this.foodMax

    //Movement
    this.position = thePosition
    this.target = [2+Math.random()*16,0,2+Math.random()*6]
    this.direction = [0,0,0]
    this.rotation = [0,0,0]
    this.animState = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false] // [run,idle,sleepstart,sleepend,sleep,eat]
    this.boundaries = theBoundaries
    this.going = ""

    //Behavior
    this.state = ""

    //Used for waitForSeconds function
    this.busy = false
    this.busyCount = 0

    //console.log(this.name+" instantiated")
  }

  setName(newName : string)
  {
    this.name = newName
  }
  getName()
  {
    return this.name
  }
  getModel()
  {
    return this.model
  }

  setStats(theStamina : number)
  {
    this.stamina = theStamina
  }
  getStats()
  {
    return(this.stamina)
  }

  getDistance(t : number[])
  {
    var distance = Math.sqrt(Math.pow(t[0]-this.position[0],2)+Math.pow(t[2]-this.position[2],2))
    return distance
  }

  /*waitForSeconds(s : number)
  {
    if(!this.busy)
    {
      this.busy = true
      this.busyCount=performance.now()*0.001
    }
    else
    {
      if((performance.now()*0.001-this.busyCount)>=s)
      {
        this.busy = false
        return true
      }
    }
    //setTimeout(function(){ return true; }, s*1000);
  }*/

  lookAt(t : number[])
  {
        //Calculus of angle between 3 coordinates
        var Xa = this.position[0]
        var Ya = this.position[2]
        var Xb = t[0]
        var Yb = t[2]
        var Xc = this.position[0]
        var Yc = 0
        var fA = Math.sqrt(Math.pow((Xc - Xb),2) + Math.pow((Yc - Yb),2))
        var fB = Math.sqrt(Math.pow((Xc - Xa),2) + Math.pow((Yc - Ya),2))
        var fC = Math.sqrt(Math.pow((Xb - Xa),2) + Math.pow((Yb - Ya),2))
        var fAngle = (Math.pow(fA,2) + Math.pow(fC,2) - Math.pow(fB,2)) / (2 * fA * fC)
        var angle3 = Math.acos(fAngle)*180/Math.PI+180

        if(t[0]<this.position[0])
          angle3 = 360-angle3

        this.rotation[1] = angle3
  }

  moveTo(t : number[])
  {
    //Getting difference between 2 coordinates
    var tempX = t[0]-this.position[0]
    var tempY = t[1]-this.position[1]
    var tempZ = t[2]-this.position[2]

    //console.log("posdiff "+tempX+" "+tempZ)

    //Getting a vector (while keeping the signed format)
    if(Math.abs(tempX)>=Math.abs(tempY) && Math.abs(tempX)>=Math.abs(tempZ))
    {
     var divX = tempX
      if(tempX<0)
        {tempX = Math.abs(tempX/divX)*-1}
      else
        {tempX = Math.abs(tempX/divX)}

      if(tempY<0)
        {tempY = Math.abs(tempY/divX)*-1}
      else
        {tempY = Math.abs(tempY/divX)}

      if(tempZ<0)
        {tempZ = Math.abs(tempZ/divX)*-1}
      else
        {tempZ = Math.abs(tempZ/divX)}
    }
    else if(Math.abs(tempY)>=Math.abs(tempX) && Math.abs(tempY)>=Math.abs(tempZ))
    {
       var divY = tempY
      if(tempX<0)
        {tempX = Math.abs(tempX/divY)*-1}
      else
        {tempX = Math.abs(tempX/divY)}

      if(tempY<0)
        {tempY = Math.abs(tempY/divY)*-1}
      else
        {tempY = Math.abs(tempY/divY)}

      if(tempZ<0)
        {tempZ = Math.abs(tempZ/divY)*-1}
      else
        {tempZ = Math.abs(tempZ/divY)}
    }
    else
    {
       var divZ = tempZ
      if(tempX<0)
        {tempX = Math.abs(tempX/divZ)*-1}
      else
        {tempX = Math.abs(tempX/divZ)}

      if(tempY<0)
        {tempY = Math.abs(tempY/divZ)*-1}
      else
        {tempY = Math.abs(tempY/divZ)}

      if(tempZ<0)
        {tempZ = Math.abs(tempZ/divZ)*-1}
      else
        {tempZ = Math.abs(tempZ/divZ)}
    }

    //Updatig the direction
    this.direction[0] = tempX
    this.direction[1] = tempY
    this.direction[2] = tempZ

    //Updating the rotation
    this.lookAt(this.target)
  }

  eat()
  {
    console.log("EAT")
    this.target = this.dish
    if(this.getDistance(this.target)>=1)
    {
      this.moveTo(this.target)
      if(this.position[1]>0)
        this.fly()
      else
        this.run()
    }
    else
    {
      //We have to land if needed
      if(this.position[1]>0)
      {
        this.target=[this.position[0],0,this.position[2]]
        this.lookAt(this.dish)
        this.fly()
      }
      else
      {
        this.lookAt(this.dish)
        for(let i in this.animState)
        {
          this.animState[i] = false
        }
        this.animState[5] = true
        this.food = this.food+2
        if(this.food>=this.foodMax)
          this.state="walk"
      }
    }
  }

  sleep()
  {
    console.log("SLEEP")
    for(let i in this.animState)
    {
      this.animState[i] = false
    }
    this.animState[4] = true

    //Adding some stamina
    this.stamina = this.stamina+2
    if(this.stamina >= this.staminaMax)
      this.state = "walk"
  }

  searchActivity()
  {
    console.log("SEARCH ACTIVITY")

    //Select a new target position for states that will need it
    this.target = [2+Math.random()*16,0,2+Math.random()*6]

    var rand : number
    rand = Math.random()*6
    if(rand<1)
      this.state = "dig"
    else if(rand<2)
      this.state = "searchFriend"
    else if(rand<3)
      this.state = "walk"
    else if(rand<4)
      this.state = "run"
    else if(rand<5)
      this.state = "fly"
    else
      this.state = "wait"
  }

  dig()
  {
      console.log("DIGING")
      for(let i in this.animState)
      {
        this.animState[i] = false
      }
      this.animState[7] = true

      if(!this.busy)
      {
        this.busy = true
        this.busyCount=performance.now()*0.001
      }
      else
      {
        if((performance.now()*0.001-this.busyCount)>=2)
        {
          this.busy = false
          this.state = "searchActivity"
        }
      }
  }

  searchFriend()
  {
    console.log("SEARCH FRIEND")
    for(let i in this.animState)
    {
      this.animState[i] = false
    }
    this.animState[8] = true

    if(!this.busy)
    {
      this.busy = true
      this.busyCount=performance.now()*0.001
    }
    else
    {
      if((performance.now()*0.001-this.busyCount)>=8)
      {
        this.busy = false
        this.state = "searchActivity"
      }
    }
  }

  wait()
  {
    console.log("WAITING")
    for(let i in this.animState)
    {
      this.animState[i] = false
    }
    this.animState[16] = true

    if(!this.busy)
    {
      this.busy = true
      this.busyCount=performance.now()*0.001
    }
    else
    {
      if((performance.now()*0.001-this.busyCount)>=4)
      {
        this.busy = false
        this.state = "searchActivity"
      }
    }
  }

  walk()
  {
    console.log("WALK")
    for(let i in this.animState)
    {
      this.animState[i] = false
    }
    this.animState[6] = true

    if(this.state=="walk" && this.getDistance(this.target)<=1)
    {
      this.state = "searchActivity"
    }
    this.moveTo(this.target)

    //Updationg drago's coordinates depending on its direction and speed
    this.position[0] = this.position[0]+(this.direction[0]*this.speed*0.4)
    this.position[1] = this.position[1]+(this.direction[1]*this.speed*0.4)
    this.position[2] = this.position[2]+(this.direction[2]*this.speed*0.4)

    //Removing some stamina and food
    this.stamina = this.stamina-0.5
    if(this.stamina<0)
      this.stamina = 0
    this.food = this.food-0.5
    if(this.food<0)
      this.food = 0
  }

  run()
  {
    console.log("RUN")
    for(let i in this.animState)
    {
      this.animState[i] = false
    }
    this.animState[0] = true

    if(this.state=="run" && this.getDistance(this.target)<=1)
    {
      this.state = "searchActivity"
    }
    this.moveTo(this.target)

    //Updationg drago's coordinates depending on its direction and speed
    this.position[0] = this.position[0]+(this.direction[0]*this.speed)
    this.position[1] = this.position[1]+(this.direction[1]*this.speed)
    this.position[2] = this.position[2]+(this.direction[2]*this.speed)

    //Removing some stamina and food
    this.stamina = this.stamina-2
    if(this.stamina<0)
      this.stamina = 0
    this.food = this.food-2
    if(this.food<0)
      this.food = 0
  }

  fly()
  {
    console.log("FLY")
    for(let i in this.animState)
    {
      this.animState[i] = false
    }
    this.animState[10] = true

    if(this.position[1]<=0)
    {
      this.searchFlyTarget()
    }

    if(this.state=="fly" && this.getDistance(this.target)<=1)
    {
      this.searchFlyTarget()
      //this.state = "searchActivity"
    }
    this.moveTo(this.target)

    //Updationg drago's coordinates depending on its direction and speed
    this.position[0] = this.position[0]+(this.direction[0]*this.speed)
    this.position[1] = this.position[1]+(this.direction[1]*this.speed)
    this.position[2] = this.position[2]+(this.direction[2]*this.speed)

    //Removing some stamina and food
    this.stamina = this.stamina-2
    if(this.stamina<0)
      this.stamina = 0
    this.food = this.food-2
    if(this.food<0)
      this.food = 0
  }

  searchFlyTarget()
  {
    var newY = Math.random()*8
    //this.position[1] = newY
    this.target = [2+Math.random()*16,newY,2+Math.random()*6]
  }

  hatch()
  {
    console.log("DRAGON HATCHING")
    for(let i in this.animState)
    {
      this.animState[i] = false
    }
    this.animState[20] = true

    if(!this.busy)
    {
      this.busy = true
      this.busyCount=performance.now()*0.001
    }
    else
    {
      if((performance.now()*0.001-this.busyCount)>=3)
      {
        this.busy = false
        this.state = "run"
      }
    }
  }

  move()
  {
    console.log(this.name+" state="+this.state+" sleep="+this.stamina+" food="+this.food)

    //CHECKING STATES
    //Sleepy?
    if(this.stamina<=0 && this.state!="hungry")
      this.state = "sleep"

    //Hungry?
    if(this.food <= 0)
      this.state = "hungry"

    //REACTING TO STATES
    if(this.state=="hatching")
    {
      this.hatch()
    }
    //hungry
    else if(this.state=="hungry")
    {
      this.eat()
    }

    //Search an activity
    else if(this.state=="searchActivity")
    {
      this.searchActivity()
    }

    //walking
    else if(this.state=="walk")
    {
      this.walk()
    }

    //running
    else if(this.state=="run")
    {
      this.run()
    }

    //Sleepy
    else if(this.state=="sleep")
    {
      this.sleep()
    }

    else if(this.state=="dig")
    {
      this.dig()
    }

    else if(this.state=="wait")
    {
      this.wait()
    }

    else if(this.state=="searchFriend")
    {
      this.searchFriend()
    }

    else if(this.state=="fly")
    {
      this.fly()
    }

    //Check boundaries and change direction if needed
    var delta = 1
    //console.log(this.boundaries[0][1])
    if(this.position[0]-delta<=this.boundaries[0][0]) // Check X min
    {
      this.going = "E"
      this.direction[0]=1
      this.direction[2]=0
    }
    else if(this.position[0]+delta>=this.boundaries[0][1]) // Check X max
    {
      this.going = "W"
      this.direction[0]=-1
      this.direction[2]=0
    }
    else if(this.position[2]-delta<=this.boundaries[2][0]) // Check Z min
    {
      this.going = "S"
      this.direction[0]=0
      this.direction[2]=1
    }
    else if(this.position[2]+delta>=this.boundaries[2][1]) // Check Z max
    {
      this.going = "N"
      this.direction[0]=0
      this.direction[2]=-1
    }
  }
}

class Egg
{
  color : string
  hatching : boolean
  hatched : boolean
  hatchTime : number
  dragon : Dragon
  visibility : boolean
  position : number[]

  constructor (theDragon : Dragon)
  {
    this.color = "green"
    this.hatching = false
    this.hatched = false
    this.hatchTime = 5
    this.dragon = theDragon
    this.visibility = true
    this.position = this.dragon.position
  }

  hatch()
  {
    var count = 0
    if(!this.hatching)
    {
      console.log("HATCHING...")
      this.hatching = true
      count = performance.now()*0.001
    }
    else
    {
      if(!this.dragon.visibility && (performance.now()*0.001-count)>=this.hatchTime)
      {
        this.hatched = true
        this.dragon.visibility = true
        this.dragon.state = "hatching"
      }
      else if((performance.now()*0.001-count)>=this.hatchTime+2.5)
        this.visibility = false
    }
  }
}
/*class RedDragon extends Dragon
{

}*/

/*function test()
{
  return 5;
}*/

/*function walk(x,y,z)
{

  return(x,y,z);
}*/
