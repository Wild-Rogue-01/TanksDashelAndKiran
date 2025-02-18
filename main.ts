// always check for things to pull 

// screen
namespace userconfig {
    export const ARCADE_SCREEN_WIDTH = 320
    export const ARCADE_SCREEN_HEIGHT = 240
}

// sprite kinds
namespace SpriteKind {
    export const Tank = SpriteKind.create()
    export const Shell = SpriteKind.create()
}
//Classes
class Tank extends sprites.ExtendableSprite {
    hitPoints: number = null
    gas: number = null
    constructor(image: Image, kind: number) {
        super(image, kind)
        this.hitPoints = 100
        this.gas = 10
    }
    hit(dmg: number) {
        this.hitPoints = this.hitPoints - dmg
    }
    move(): boolean {
        if(this.gas > 0) {
            this.gas--
            return true
        } else {
            game.showLongText("Out Of Gas", DialogLayout.Bottom)
            return false
        }
    }
}
class Shell extends sprites.ExtendableSprite {
    maxDamage: number
    damRadius: number
    distDet: number
    damage: number
    constructor(image: Image, kind: number, dmg: number, rad: number) {
        super(image, kind)
        this.maxDamage = dmg
        this.damRadius = rad
    }
    boom(otherSprite: Sprite, sprite: Sprite): number {
        this.distDet = Math.sqrt((otherSprite.x - sprite.x) ** 2 + (otherSprite.y - sprite.y) ** 2)
        
        if (this.distDet < this.damRadius) {
            this.damage = this.maxDamage/(this.distDet**2) 
        } else {
            this.damage = 0
        }
        return this.damage
    }
}

// global variables
let playerTurn: boolean = true
let tnt: boolean = null
let tanksCreate: boolean = null
let tankAir: boolean = null

let index: number = null
let damageGlobal: number = null

let player: Tank = null
let enemyNum: number = null
let tankArray: Image[] = [assets.image`tankBlue`, assets.image`tankRed`, assets.image`tankPurple`, assets.image`tankPink`, assets.image`tankBlack`]
let tileMapArray: tiles.TileMapData[] = [assets.tilemap`grassMap`, assets.tilemap`sandMap`]
let backgrounds:Image[] = [assets.image`sky`, assets.image`dust`]

let maxEnemyNum: number = tankArray.length

let moveX: number = 16
let moveY: number = null

let gravity: number = 75

// game update

// event handler
scene.onHitWall(SpriteKind.Shell, function (sprite: Shell, location: tiles.Location) {
    sprite.destroy()
    for (let i = 0; i < sprites.allOfKind(SpriteKind.Tank).length; i++) {
        damageGlobal = sprite.boom(sprites.allOfKind(SpriteKind.Tank)[i], sprite)

        let proj = sprites.createProjectileFromSprite(assets.image`blank`, sprites.allOfKind(SpriteKind.Projectile)[i], 0, 0)
        if (sprites.allOfKind(SpriteKind.Projectile).length > 0) {
            proj.setPosition(sprites.allOfKind(SpriteKind.Tank)[i].x, sprites.allOfKind(SpriteKind.Tank)[i].y)
        }
    }
})
sprites.onOverlap(SpriteKind.Tank, SpriteKind.Projectile, function (sprite: Tank, otherSprite: Sprite) {
    otherSprite.destroy()
    sprite.hit(damageGlobal)
})

// functions
function startGame() {
    index = randint(0, tileMapArray.length - 1)
    tiles.setCurrentTilemap(tileMapArray[index])
    scene.setBackgroundImage(backgrounds[index])

    for(let i = 0; i < enemyNum - 1; i++){
        let tank: Tank = new Tank(tankArray[i], SpriteKind.Tank)
        tiles.placeOnRandomTile(tank, assets.tile`grid`)
        tank.vy = gravity
    }
    player = new Tank(tankArray[tankArray.length-1], SpriteKind.Tank)
    tiles.placeOnRandomTile(player, assets.tile`grid`)
    player.vy = gravity
    scene.cameraFollowSprite(player)
}
function selectWep() {

}
function attack() {
    
}
function movement(tf:boolean, sprite:Tank) {
    if (tf) {
        sprite.setPosition(sprite.x + moveX, moveY)
    } else {
        sprite.setPosition(sprite.x - moveX, moveY)
    }
}
// on start
while (!tnt) {
    enemyNum = game.askForNumber("Select 1-" + (maxEnemyNum - 1) + " enemies", 1)
    tnt = enemyNum < maxEnemyNum && enemyNum > 0
}
startGame()

// controller
controller.left.onEvent(ControllerButtonEvent.Pressed, function() {
    movement(false, player)
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    movement(true, player)
})