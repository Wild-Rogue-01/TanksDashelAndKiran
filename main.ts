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
    hitPoints: number
    gas: number
    constructor(image: Image, kind: number) {
        super(image, kind)
        this.hitPoints = 100
        this.gas = 10
    }
    hit(dmg: number) {
        this.hitPoints = this.hitPoints - dmg
    }
    move() {
        if(this.gas > 0) {
            this.gas--
            console.log(this.gas)
        } else {
            game.showLongText("Out Of Gas", DialogLayout.Bottom)
        }
    }
}
class Shell extends sprites.ExtendableSprite {
    maxDamage: number
    damRadius: number
    distDet: number
    damage: number
    constructor(image: Image, kind: number) {
        super(image, kind)
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
let damageGlobal: number = null

let tankArray: Image[] = [assets.image`tankBlue`, assets.image`tankRed`, assets.image`tankPurple`]
let tileMapArray: tiles.TileMapData[] = [assets.tilemap`grassMap`, assets.tilemap`sandMap`]
let backgrounds: Image[] = []

let tank1: Tank =
    new Tank(tankArray[1], SpriteKind.Tank)

let tankSpriteArray: Sprite[] = sprites.allOfKind(SpriteKind.Tank)
// game update


// event handler
scene.onHitWall(SpriteKind.Shell, function (sprite: Shell, location: tiles.Location) {
    sprite.destroy()
    for (let i = 0; i < sprites.allOfKind(SpriteKind.Tank).length; i++) {
        damageGlobal = sprite.boom(sprites.allOfKind(SpriteKind.Tank)[i], sprite)
        tankSpriteArray[i].hit(damageGlobal)
    }
})

// functions
function startGame() {

}
function createTank() {

}
function selectWep() {

}
function attack() {
    
}
// on start
startGame()

// controller