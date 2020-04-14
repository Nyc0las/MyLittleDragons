import utils from "../node_modules/decentraland-ecs-utils/index"
import { sendToServer, GetFoodPos, RemoveIndicatorArrow, UpdateUI, SetDragonMood, SetDragonName, ShowButtons } from "./game";
import { GetFood, GetCropPos, ResetFood } from "./crop";

@Component('Stats')
export class Stats {
    //DATAS
    name: string

    //STATS
    stamina: number
    staminaMax: number
    food: number
    foodMax: number
    walkSpeed: number
    runSpeed: number
    flySpeed: number

    constructor(name: string = "Drago") {
        /*this.drago.addComponent(new GLTFShape("assets/models/DragoYellow/DragoGrey.gltf"))
        this.drago.addComponent(new Transform({
            position: new Vector3(0, 0, 0),
            scale: new Vector3(1,1,1)
        }))*/

        const rand = Math.floor(Math.random() * 10)

        this.name = name + rand
    }

    Create()
    {

    }

    Test()
    {
        //log("TEST");
        /*this.flySpeed = 2
        log("FLYSPEED: "+this.flySpeed)*/
    }
}

@Component('DragonBehavior')
export class DragonBehavior {
	//DATAS
    state : string = "idle"
    happyness: number //From 0->1: ,2->4: sad, 5->7: normal, 8->10: happy

    GetState() {
        return this.state
    }
}

@Component('lerpData')
export class LerpData {
    /*origin: Vector3 = new Vector3(5, 0.2, 5)
    target: Vector3 = new Vector3(Math.floor(Math.random() * 20), 0.2, Math.floor(Math.random() * 20))*/
    fraction: number = 0
}

// MUSICS -----------------------------------------------------------------------------
  /*const Entity_Hatch: Entity = new Entity()
  let SFX_Hatch = new AudioSource(new AudioClip("sounds/Hatch.wav"))
  Entity_Hatch.addComponent(SFX_Ambiance)
  engine.addEntity(Entity_Hatch)
  SFX_Hatch.loop = true
  SFX_Hatch.playing = true*/
//-------------------------------------------------------------------------------------

export class Dragon extends Entity {
    state: string
    id: number
    color: number
    waitingTime: number
    originPosition: Vector3
    targetPosition: Vector3

    health: number
    healthMax: number
    energy: number
    energyMax: number
    food: number
    foodMax: number
    mood: number
    moodMax: number

    clipIdle: AnimationState
    clipRun: AnimationState
    clipSleepDown: AnimationState
    clipSleepUp: AnimationState
    clipSleep: AnimationState
    clipWalk: AnimationState
    clipDig: AnimationState
    clipLook: AnimationState
    clipFlyUp: AnimationState
    clipFlyIdle: AnimationState
    clipFlyDown: AnimationState
    clipAttackHead: AnimationState
    clipTurnRight: AnimationState
    clipFlyLand: AnimationState
    clipSmell: AnimationState
    clipSmellHimself: AnimationState
    clipJump: AnimationState
    clipHappy: AnimationState
    clipAfraid: AnimationState
    clipHatch: AnimationState
    clipSad: AnimationState
    clipScratch: AnimationState

    SFX_Hatch : AudioSource
    SFX_HappyMiaule : AudioSource
    SFX_HappyRonronne : AudioSource
    SFX_Happy_RonronneMiaule : AudioSource
    SFX_NormalMiaule1 : AudioSource
    SFX_NormalMiaule2 : AudioSource
    SFX_SadHiss : AudioSource
    SFX_SadMeowing : AudioSource
    SFX_SadMiaule : AudioSource
    SFX_SadRale : AudioSource
    SFX_Hungry : AudioSource
    SFX_HungryDrink : AudioSource
    SFX_HungryEat : AudioSource
    DragonSound : AudioSource

    cameraPos : Vector3

    constructor(id: number, color: number, originPosition: Vector3, state: string, energy: number = 1000, food = 1000, health: number = 1000, name: string = "Dragonou", mood: number = 1000
    )
    {
        super();
        this.id = id
        this.color = color
        this.state = state
        this.originPosition = originPosition
        //getFromServer(this);

        this.healthMax = 1000
        this.health = health
        this.energyMax = 1000
        this.energy = energy
        this.foodMax = 1000
        this.food = food
        this.moodMax = 1000
        this.mood = mood
        this.name = name

        SetDragonName(this.name)

        const rand = Math.floor(Math.random() * 20)
        if (this.color == 0) {
            this.addComponent(new GLTFShape("assets/models/DragoYellow/DragoYellow.gltf"))
        }

        else if (this.color == 1) {
            this.addComponent(new GLTFShape("assets/models/DragoGrey/DragoGrey.gltf"))
        }
        else
        {
            this.addComponent(new GLTFShape("assets/models/DragoDark/DragoDark.gltf"))
        }            
        this.addComponent(new Transform({
            position: new Vector3(this.originPosition.x, this.originPosition.y, this.originPosition.z),
            scale: new Vector3(2, 2, 2)
        }))
        this.addComponent(new Stats)
        //this.addComponent(DragonUpdate)
		//engine.addSystem(DragonUpdate)

        this.cameraPos = Camera.instance.position //We need to initialize it here first or it will not work the first time we call the dragon

        //Animations ---------------------------------------------------------------------------------
        let animator = new Animator()
        this.addComponent(animator)
        this.clipIdle = new AnimationState("Idle")
        this.clipRun = new AnimationState("Run")

        this.clipSleepDown = new AnimationState("SleepDown")
        this.clipSleepUp = new AnimationState("SleepUp")
        this.clipSleep = new AnimationState("Sleep")
        this.clipWalk = new AnimationState("Walk")
        this.clipDig = new AnimationState("Dig")
        this.clipLook = new AnimationState("Look")
        this.clipFlyUp = new AnimationState("FlyUp")
        this.clipFlyIdle = new AnimationState("FlyIdle")
        this.clipFlyDown = new AnimationState("FlyDown")
        this.clipAttackHead = new AnimationState("AttackHead")
        this.clipTurnRight = new AnimationState("TurnRight")
        this.clipFlyLand = new AnimationState("FlyLand")
        this.clipSmell = new AnimationState("Smell")
        this.clipSmellHimself = new AnimationState("SmellHimself")
        this.clipJump = new AnimationState("Jump")
        this.clipHappy = new AnimationState("Happy")
        this.clipAfraid = new AnimationState("Afraid")
        this.clipHatch = new AnimationState("Hatch")
        this.clipSad = new AnimationState("Sad")
        this.clipScratch = new AnimationState("Scratch")

        animator.addClip(this.clipIdle)
        animator.addClip(this.clipRun)
        animator.addClip(this.clipSleepDown)
        animator.addClip(this.clipSleepUp)
        animator.addClip(this.clipSleep)
        animator.addClip(this.clipWalk)
        animator.addClip(this.clipDig)
        animator.addClip(this.clipLook)
        animator.addClip(this.clipFlyUp)
        animator.addClip(this.clipFlyIdle)
        animator.addClip(this.clipFlyDown)
        animator.addClip(this.clipAttackHead)
        animator.addClip(this.clipTurnRight)
        animator.addClip(this.clipFlyLand)
        animator.addClip(this.clipSmell)
        animator.addClip(this.clipSmellHimself)
        animator.addClip(this.clipJump)
        animator.addClip(this.clipHappy)
        animator.addClip(this.clipAfraid)
        animator.addClip(this.clipHatch)
        animator.addClip(this.clipSad)
        animator.addClip(this.clipScratch)

        //Sounds ----------------------------------------------------------------------------------------
        this.SFX_Hatch = new AudioSource(new AudioClip("sounds/Hatch.wav"))
        this.SFX_HappyMiaule = new AudioSource(new AudioClip("sounds/Happy_Miaule.wav"))
        this.SFX_HappyRonronne = new AudioSource(new AudioClip("sounds/Happy_Ronronne.wav"))
        this.SFX_Happy_RonronneMiaule = new AudioSource(new AudioClip("sounds/Happy_RonronneEtMiaule.wav"))
        this.SFX_NormalMiaule1 = new AudioSource(new AudioClip("sounds/Normal_Miaule1.wav"))
        this.SFX_NormalMiaule2 = new AudioSource(new AudioClip("sounds/Normal_Miaule2.wav"))
        this.SFX_SadHiss = new AudioSource(new AudioClip("sounds/Sad_Hiss.wav"))
        this.SFX_SadMeowing = new AudioSource(new AudioClip("sounds/Sad_Meowing.wav"))
        this.SFX_SadMiaule = new AudioSource(new AudioClip("sounds/Sad_Miaule.wav"))
        this.SFX_SadRale = new AudioSource(new AudioClip("sounds/Sad_Rale.wav"))
        this.SFX_Hungry = new AudioSource(new AudioClip("sounds/Hungry.wav"))
        this.SFX_HungryDrink = new AudioSource(new AudioClip("sounds/Hungry_Drink.wav"))
        this.SFX_HungryEat = new AudioSource(new AudioClip("sounds/Hungry_Eat.wav"))
        this.DragonSound = new AudioSource(new AudioClip("sounds/Hatch.wav"))
        
        /*DragonSound = SFX_HappyMiaule
        this.addComponentOrReplace(DragonSound)
        DragonSound.playOnce()*/
        /*SFX_Hatch.loop = true
        SFX_Hatch.playing = true*/
        if(this.mood>0)
            this.Sound_Hatch()
        else
            this.Sound_SadHiss
        //this.clipIdle.play()

        //log(this.originPosition)
        //log(this.targetPosition)

        //To manage the dragon's states -----------------------------------------------------------------
        //let currentState: String = "idle"
        //const currentObjective: 
        this.addComponent(new LerpData())

        this.waitingTime = Math.floor(Math.random() * 400) //Between 1 and 4s
        //let timeRemaining = rand2

        //this.originPosition = this.getComponent(Transform).position
        this.targetPosition = new Vector3(Math.floor(Math.random() * 20)+2, 0.2, Math.floor(Math.random() * 20)+2)

        //log("SET ANIM TO "+this.state)
        this.ChangeAnim(this.state)
        //this.ChangeAnim(this.state)
        this.addComponent(new utils.Interval(20, (): void =>
        {
            this.DepleteFood(0.1)

            if(this.food >= this.foodMax/2)
                this.RefillMood(0.1)

            //log("waiting time = "+this.waitingTime)
            //log("Food before calculus:"+this.food)
            let h = this.health/this.healthMax*20
            let e = this.energy/this.energyMax*20
            let f = this.food/this.foodMax*20
            let m = this.mood/this.moodMax*20
            //log("health:"+h+" energy:"+e+" food:"+f+" mood:"+m)
            //log("Food calculus: "+f+"="+this.food+"/"+this.foodMax+"*20")
            UpdateUI(h,e,f,m)

            if (this.state == "idle" || this.state == "dig" || this.state == "look" || this.state == "smell" || this.state == "happy") {
                this.waitingTime--
                if (this.waitingTime <= 0) {
                    this.ChangeState()
                    //this.waitingTime = Math.floor(Math.random() * 400)
                }
            }
            else if (this.state == "run") {
                this.DepleteEnergy(0.5)

                let transform = this.getComponent(Transform)
                let lerp = this.getComponent(LerpData)

                if (lerp.fraction < 1) {
                    transform.lookAt(new Vector3(this.originPosition.x, this.getComponent(Transform).position.y, this.originPosition.z))
                    lerp.fraction += 0.01
                    //log("POSITION " + this.getComponent(Transform).position)
                    //sendToServer(this);
                    if (lerp.fraction < 1)
                        transform.position = Vector3.Lerp(this.originPosition, this.targetPosition, lerp.fraction)
                    else
                        transform.position = this.targetPosition
                }
                else {
                    lerp.fraction = 0
                    this.ChangeState()
                }
            }
            else if (this.state == "fly")
            {
                this.DepleteEnergy(1);

                let transform = this.getComponent(Transform)
                let lerp = this.getComponent(LerpData)              


                if (lerp.fraction < 1) {
                    transform.lookAt(new Vector3(this.originPosition.x, this.getComponent(Transform).position.y, this.originPosition.z))
                    lerp.fraction += 0.01
                    if (lerp.fraction < 1)
                        transform.position = Vector3.Lerp(this.originPosition, this.targetPosition, lerp.fraction)
                    else
                        transform.position = this.targetPosition
                }
                else {
                    lerp.fraction = 0
                    this.ChangeState()
                }
            }
            else if (this.state == "flyidle")
            {
                this.waitingTime--
                if (this.waitingTime <= 0) {
                    this.ChangeState()
                    //this.waitingTime = Math.floor(Math.random() * 400)
                }
            }
            else if (this.state == "goToSleep") {
                let transform = this.getComponent(Transform)
                let lerp = this.getComponent(LerpData)

                if (lerp.fraction < 1) {
                    transform.lookAt(new Vector3(this.originPosition.x, this.getComponent(Transform).position.y, this.originPosition.z))
                    lerp.fraction += 0.01

                    if (lerp.fraction < 1)
                        transform.position = Vector3.Lerp(this.originPosition, this.targetPosition, lerp.fraction)
                    else
                        transform.position = this.targetPosition
                }
                else {
                    lerp.fraction = 0
                    this.Sleep()
                }
            }
            else if (this.state == "sleep")
            {
                this.RefillEnergy(1)
            }
            else if (this.state == "goToEat") {
                let transform = this.getComponent(Transform)
                let lerp = this.getComponent(LerpData)

                if (lerp.fraction < 1) {
                    transform.lookAt(new Vector3(this.originPosition.x, this.getComponent(Transform).position.y, this.originPosition.z))
                    lerp.fraction += 0.01

                    if (lerp.fraction < 1)
                        transform.position = Vector3.Lerp(this.originPosition, this.targetPosition, lerp.fraction)
                    else
                        transform.position = this.targetPosition
                }
                else {
                    lerp.fraction = 0
                    this.Eat()
                }
            }
            else if (this.state == "eat")
            {
                this.RefillFood(1)
            }
            else if (this.state == "landing")
            {
                this.DepleteEnergy(1);

                let transform = this.getComponent(Transform)
                let lerp = this.getComponent(LerpData)              


                if (lerp.fraction < 1) {
                    transform.lookAt(new Vector3(this.originPosition.x, this.getComponent(Transform).position.y, this.originPosition.z))
                    lerp.fraction += 0.01
                    if (lerp.fraction < 1)
                        transform.position = Vector3.Lerp(this.originPosition, this.targetPosition, lerp.fraction)
                    else
                        transform.position = this.targetPosition
                }
                else {
                    lerp.fraction = 0
                    this.ChangeState()
                }
            }
            else if (this.state == "incoming")
            {
                this.DepleteEnergy(1);

                let transform = this.getComponent(Transform)
                let lerp = this.getComponent(LerpData)              


                if (lerp.fraction < 1) {
                    transform.lookAt(new Vector3(this.originPosition.x, this.getComponent(Transform).position.y, this.originPosition.z))
                    lerp.fraction += 0.01
                    if (lerp.fraction < 0.9)
                        transform.position = Vector3.Lerp(this.originPosition, this.targetPosition, lerp.fraction)
                    else
                        transform.position = this.targetPosition
                }
                else {
                    lerp.fraction = 0
                    this.ChangeState()
                }
            }

        }))
        engine.addEntity(this)
    }

        ChangeState()
        {
            
            let newRand = Math.floor(Math.random() * 6)
            //log("CHANGING STATE: "+newRand)

            if(this.food <= this.foodMax && GetFood() != "")
            {
                this.GoToEat()     
			}

            else
            {
                if (newRand <= 0)
                {
                    if (this.state == "fly" || this.state == "flyidle")
                        this.FlyIdle()
                    else
                        this.Run()
                }
                else if (newRand > 0 && newRand <= 1)
                {
                    if (this.state == "fly" || this.state == "flyidle")
                        this.FlyIdle()
                    else
                        this.Run()
                }
                else if (newRand > 1 && newRand <= 2)
                {
                    if (this.state == "fly" || this.state == "flyidle")
                        this.Fly()
                    else
                        this.Dig()
                }
                else if (newRand > 2 && newRand <= 3)
                {
                    if (this.state == "fly" || this.state == "flyidle")
                        this.Fly()
                    else
                        this.Look()
                }
                else if (newRand > 3 && newRand <= 4)
                {
                    if (this.state == "fly" || this.state == "flyidle")
                        this.Fly()
                    else
                        this.Smell()
                }
                else
                {
                    this.Fly()
                }
            }

        }

        SetState(name: string)
        {
              if(name=="idle")
              {
                this.Idle()
			  }
              else if(name=="dig")
              {
                this.Dig()
			  }
              else if(name=="run")
              {
                this.Run()
			  }
              else if(name=="look")
              {
                this.Look()
			  }
              else if(name=="smell")
              {
                this.Smell()
			  }
              else if(name=="fly")
              {
                this.Fly()
			  }
              else if(name=="flyidle")
              {
                this.FlyIdle()
			  }
		}

        DepleteEnergy(nb: number)
        {
            this.energy -= nb
            if (this.energy <= 0)
            {
                this.energy = 0
                this.GoToSleep()
            }
        }

        RefillEnergy(nb: number)
        {
            this.energy += nb
            if (this.energy >= this.energyMax)
            {
                this.energy = this.energyMax
                this.ChangeState()
            }
        }

        DepleteFood(nb: number)
        {
            this.food -= nb
            if (this.food <= 0)
            {
                this.food = 0
                this.DepleteMood(0.1)
            }
        }

        RefillFood(nb: number)
        {
            this.food += nb
            if (this.food >= this.foodMax)
            {
                ResetFood()

                this.food = this.foodMax
                this.ChangeState()

            }
        }

        DepleteMood(nb: number)
        {
            this.mood -= nb
            if(this.mood <= 500)
                SetDragonMood("Normal")

            if (this.mood <= 0)
            {
                this.mood = 0
                SetDragonMood("Sad")
                //log("DOES NOTHING")
            }
        }

        RefillMood(nb: number)
        {
            this.mood += nb
            if (this.mood >= this.moodMax)
            {
                this.mood = this.moodMax
            }
        }

        Idle()
        {
            //log("IDLE")
            this.waitingTime = Math.floor(Math.random() * 400)
            this.getComponent(Transform).position.y = -0.2
            this.state = "idle"
            this.ChangeAnim(this.state)
        }

        Run()
        {
            //log("RUN")
            this.waitingTime = Math.floor(Math.random() * 400)
            this.getComponent(Transform).position.y = -0.2
            this.state = "run"
            this.ChangeAnim("run")
            this.originPosition = this.getComponent(Transform).position
            this.targetPosition = new Vector3(Math.floor(Math.random() * 20) + 2, -0.2, Math.floor(Math.random() * 20) + 2)
        }

        GoToSleep()
        {
            //log("WALK TO SLEEPING ROOM")
            this.getComponent(LerpData).fraction = 0
            if (this.state == "fly")
                this.ChangeAnim("fly")
            else
            {
                this.getComponent(Transform).position.y = -0.2
                this.ChangeAnim("run")
            }
            this.state = "goToSleep"
            this.originPosition = this.getComponent(Transform).position
            this.targetPosition = new Vector3(8.078312873840332, -0.25, 4.580322742462158)
        }

        SleepDown()
        {
            //log("GO TO SLEEP")
            this.state = "SleepDown"
            this.ChangeAnim(this.state)
        }

        Sleep()
        {
            //log("SLEEPING")
            //let transform = this.getComponent(Transform).position
            this.getComponent(Transform).position.y = -0.4
            this.state = "sleep"
            this.ChangeAnim(this.state)
            this.Sound_HappyRonronne()
        }

        SleepUp()
        {
            //log("WAKE UP")
            this.state = "sleepUp"
            this.ChangeAnim(this.state)
        }

        GoToEat()
        {
            //log("WALK TO EATING ROOM")
            this.getComponent(LerpData).fraction = 0
            if (this.state == "fly")
                this.ChangeAnim("fly")
            else
                this.ChangeAnim("run")
            this.state = "goToEat"
            this.originPosition = this.getComponent(Transform).position
            this.targetPosition = new Vector3(GetCropPos().x-1, -0.2, GetCropPos().z-2)              
		}

        Eat()
        {
            //log("EATING")
            this.state = "eat"
            this.ChangeAnim(this.state)
            this.Sound_HappyRonronne()
		}

        Fly()
        {
            //log("FLY")
            this.waitingTime = Math.floor(Math.random() * 400)
            let lerp = this.getComponent(LerpData)
            lerp.fraction = 0
            this.originPosition = this.getComponent(Transform).position
            this.targetPosition = new Vector3(Math.floor(Math.random() * 20) + 2, 2 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 20) + 2)

            this.state = "fly"
            this.ChangeAnim(this.state)
        }

        FlyIdle()
        {
            //log("FLY IDLE")
            this.waitingTime = Math.floor(Math.random() * 400)
            this.originPosition = this.getComponent(Transform).position
            this.state = "flyidle"
            this.ChangeAnim(this.state)
        }

        Land()
        {
            if(this.state=="fly" || this.state=="flyidle")
            {
                //log("LANDING")
                let lerp = this.getComponent(LerpData)
                lerp.fraction = 0
                this.originPosition = this.getComponent(Transform).position
                this.targetPosition = new Vector3(this.getComponent(Transform).position.x, -0.2, this.getComponent(Transform).position.z)
                this.state = "landing"
                this.ChangeAnim(this.state)
			}
            else
                //log("ALREADY LANDED")

		}

        Dig()
        {//070
            //log("DIG")
            this.waitingTime = 70
            this.getComponent(Transform).position.y = -0.3
            this.state = "dig"
            this.ChangeAnim(this.state)
        }

        Look()
        {//160
            //log("LOOK")
            this.waitingTime = 240
            this.getComponent(Transform).position.y = -0.3
            this.state = "look"
            this.ChangeAnim(this.state)
        }

        Smell()
        {
            //log("SMELL")
            this.waitingTime = 100
            this.getComponent(Transform).position.y = -0.25
            this.state = "smell"
            this.ChangeAnim(this.state)
        }

        CallDragon()
        {
            //log("COMING TO YOU")
            let lerp = this.getComponent(LerpData)
            lerp.fraction = 0
            this.cameraPos = Camera.instance.position
            if(this.state!="fly" && this.state!="flyidle")
                this.ChangeAnim("run")
            this.state = "incoming"
            this.originPosition = this.getComponent(Transform).position
            this.targetPosition = new Vector3(this.cameraPos.x, -0.2, this.cameraPos.z)

		}

        ChangeAnim(animName: string)
        {
            //log("state = "+this.state)
            //this.waitingTime = Math.floor(Math.random() * 400) //Between 1 and 4s
            //this.getComponent(Transform).position.y = -0.2
            //log("POSITION Y = "+this.getComponent(Transform).position.y)

            this.clipRun.pause()
            this.clipIdle.pause()            
            this.clipSleepDown.pause()
            this.clipSleepUp.pause()
            this.clipSleep.pause()
            this.clipWalk.pause()
            this.clipDig.pause()
            this.clipLook.pause()
            this.clipFlyUp.pause()
            this.clipFlyIdle.pause()
            this.clipFlyDown.pause()
            this.clipAttackHead.pause()
            this.clipTurnRight.pause()
            this.clipFlyLand.pause()
            this.clipSmell.pause()
            this.clipSmellHimself.pause()
            this.clipJump.pause()
            this.clipHappy.pause()
            this.clipAfraid.pause()
            this.clipHatch.pause()
            this.clipSad.pause()
            this.clipScratch.pause()

            if (animName == "idle")
                this.clipIdle.play()
            else if (animName == "run")
                this.clipRun.play()
            else if (animName == "sleepDown")
                this.clipSleepDown.play()
            else if (animName == "sleepUp")
                this.clipSleepUp.play()
            else if (animName == "sleep")
                this.clipSleep.play()
            else if (animName == "walk")
                this.clipWalk.play()
            else if (animName == "dig")
                this.clipDig.play()
            else if (animName == "look")
                this.clipLook.play()
            else if (animName == "flyUp")
                this.clipFlyUp.play()
            else if (animName == "fly" || animName == "flyidle" || animName == "landing")
                this.clipFlyIdle.play()
            else if (animName == "flyDown")
                this.clipFlyDown.play()
            else if (animName == "attackHead")
                this.clipAttackHead.play()
            else if (animName == "turnRight")
                this.clipTurnRight.play()
            else if (animName == "flyLand")
                this.clipFlyLand.play()
            else if (animName == "smell")
                this.clipSmell.play()
            else if (animName == "smellHimself")
                this.clipSmellHimself.play()
            else if (animName == "jump")
                this.clipJump.play()
            else if (animName == "happy")
                this.clipHappy.play()
            else if (animName == "afraid")
                this.clipAfraid.play()
            else if (animName == "hatch")
                this.clipHatch.play()
            else if (animName == "sad")
                this.clipSad.play()
            else if (animName == "scratch")
                this.clipScratch.play()
            else
                this.clipIdle.play()
        }

        /*let SFX_Hatch = new AudioSource(new AudioClip("sounds/Hatch.wav"))

        let SFX_HappyMiaule = new AudioSource(new AudioClip("sounds/Happy_Miaule.wav"))
        let SFX_HappyRonronne = new AudioSource(new AudioClip("sounds/Happy_Ronronne.wav"))
        let SFX_Happy_RonronneMiaule = new AudioSource(new AudioClip("sounds/Happy_RonronneEtMiaule.wav"))

        let SFX_NormalMiaule1 = new AudioSource(new AudioClip("sounds/Normal_Miaule1.wav"))
        let SFX_NormalMiaule2 = new AudioSource(new AudioClip("sounds/Normal_Miaule2.wav"))

        let SFX_SadHiss = new AudioSource(new AudioClip("sounds/Sad_Hiss.wav"))
        let SFX_SadMeowing = new AudioSource(new AudioClip("sounds/Sad_Meowing.wav"))
        let SFX_SadMiaule = new AudioSource(new AudioClip("sounds/Sad_Miaule.wav"))
        let SFX_SadRale = new AudioSource(new AudioClip("sounds/Sad_Rale.wav"))

        let SFX_Hungry = new AudioSource(new AudioClip("sounds/Hungry.wav"))
        let SFX_HungryDrink = new AudioSource(new AudioClip("sounds/Hungry_Drink.wav"))
        let SFX_HungryEat = new AudioSource(new AudioClip("sounds/Hungry_Eat.wav"))

        let DragonSound = new AudioSource(new AudioClip("sounds/Hatch.wav"))
        
        DragonSound = SFX_HappyMiaule
        this.addComponentOrReplace(DragonSound)
        DragonSound.playOnce()*/
        Sound_Hatch()
        {
            this.DragonSound = this.SFX_Hatch
            this.addComponentOrReplace(this.DragonSound)
            this.DragonSound.playOnce()
		}

        Sound_HappyMiaule()
        {
            this.DragonSound = this.SFX_HappyMiaule
            this.addComponentOrReplace(this.DragonSound)
            this.DragonSound.playOnce()
		}

        Sound_HappyRonronne()
        {
            this.DragonSound = this.SFX_HappyRonronne
            this.addComponentOrReplace(this.DragonSound)
            this.DragonSound.playOnce()
		}

        Sound_HappyRonronneMiaule()
        {
            this.DragonSound = this.SFX_Happy_RonronneMiaule
            this.addComponentOrReplace(this.DragonSound)
            this.DragonSound.playOnce()
		}

        Sound_NormalMiaule1()
        {
            this.DragonSound = this.SFX_NormalMiaule1
            this.addComponentOrReplace(this.DragonSound)
            this.DragonSound.playOnce()
		}

        Sound_NormalMiaule2()
        {
            this.DragonSound = this.SFX_NormalMiaule2
            this.addComponentOrReplace(this.DragonSound)
            this.DragonSound.playOnce()
		}

        Sound_SadHiss()
        {
            this.DragonSound = this.SFX_SadHiss
            this.addComponentOrReplace(this.DragonSound)
            this.DragonSound.playOnce()
		}

        Sound_SadMeowing()
        {
            this.DragonSound = this.SFX_SadMeowing
            this.addComponentOrReplace(this.DragonSound)
            this.DragonSound.playOnce()
		}

        Sound_SadMiaule()
        {
            this.DragonSound = this.SFX_SadMiaule
            this.addComponentOrReplace(this.DragonSound)
            this.DragonSound.playOnce()
		}

        Sound_SadRale()
        {
            this.DragonSound = this.SFX_SadRale
            this.addComponentOrReplace(this.DragonSound)
            this.DragonSound.playOnce()
		}

        Sound_Hungry()
        {
            this.DragonSound = this.SFX_Hungry
            this.addComponentOrReplace(this.DragonSound)
            this.DragonSound.playOnce()
		}

        Sound_HungryDrink()
        {
            this.DragonSound = this.SFX_HungryDrink
            this.addComponentOrReplace(this.DragonSound)
            this.DragonSound.playOnce()
		}

        Sound_HungryEat()
        {
            this.DragonSound = this.SFX_HungryEat
            this.addComponentOrReplace(this.DragonSound)
            this.DragonSound.playOnce()
		}
}

let dragonID: number = 0;
let allDragons: Dragon[] = new Array();//[new Dragon(dragonID, "idle")]
//allDragons.
/*CreateDragon()
CreateDragon()
CreateDragon()
CreateDragon()*/

export function LoadDragons(color: number[], x: number[], y: number[], z: number[], state: string[], energy: number[], food: number[], life: number[], name: string[], mood: number[]) {
    //log("LOADING ALL DRAGONS")
    for (let i = 0; i < color.length; i++)
    {
        LoadDragon(color[i], x[i], y[i], z[i], state[i], energy[i], food[i], life[i], name[i], mood[i]);
    }
}

export function CreateEgg()
{
    let dragonCreated = false
    let eggTimer = 0
    //log("CREATE EGG function")

    const egg = new Entity()
    egg.addComponent(new GLTFShape("assets/models/Egg/Egg.gltf"))
    engine.addEntity(egg)
    egg.addComponent(new Transform({
    position: new Vector3(8.078312873840332, 0, 4.580322742462158),
    scale: new Vector3(2,2,2)
    }))
    let animator = new Animator()
    egg.addComponent(animator)
    const clipSwim = new AnimationState("PolyArt Egg")
    animator.addClip(clipSwim)
    clipSwim.pause()
    clipSwim.looping = false
    egg.addComponent(new OnClick(
    e => {
	        //log("EGG CLICKED")
            RemoveIndicatorArrow()
            if(!dragonCreated)
            {
                dragonCreated = true
                clipSwim.play()
                CreateDragon(Math.floor(Math.random() * 3))
                ShowButtons()
            }
  	    }
    ))
    egg.addComponent(new utils.Interval(1000, (): void => {
        if(dragonCreated)
        {
            eggTimer += 1
            /*if(eggTimer>=3)
                clipSwim.pause()*/

            if(eggTimer>=5)
                engine.removeEntity(egg)
	    }
    }))
    /*const egg = new Entity('egg')
    engine.addEntity(egg)
    //egg.setParent(_scene)
    const transform = new Transform({
      position: new Vector3(8.078312873840332, 1, 4.580322742462158),
      //rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(10, 10, 10)
    })
    egg.addComponentOrReplace(transform)
    const gltfShape = new GLTFShape("assets/models/Egg/Egg.gltf")
    gltfShape.withCollisions = true
    gltfShape.visible = true
    egg.addComponentOrReplace(gltfShape)
    egg.addComponent(new OnClick(
    e => {
	        log("EGG CLICKED")

  	}
    ))*/
}

export function CreateDragon(color: number)
{
    //log("CREATE DRAGON")
    allDragons.push(new Dragon(dragonID, color, new Vector3(8.078312873840332, 0, 4.580322742462158), "idle"));
    dragonID += 1;
}

export function LoadDragon(color: number, x: number, y: number, z: number, state: string, energy: number, food: number, life: number, name: string, mood: number)
{
    //log("LOADING 1 DRAGON")
    //log("FOOD BEFORE LOAD: "+food)
    let newDragon: Dragon = new Dragon(dragonID, color,new Vector3(x, y, z), state, energy, food, life, name, mood);
    allDragons.push(newDragon);
    dragonID += 1;
}

export function GetDragons(): Dragon[]
{
    return allDragons;
}

//loadDragons()


//log(GetDragons()[3].id)

