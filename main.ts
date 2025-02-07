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
class Shell extends sprites.ExtendableSprite {
    maxDamage: number
    damRadius: number
    distDet: number
    damage: number
    constructor(image: Image, kind: number) {
        super(image, kind)

    }
    boom(tanks:Sprite[], shellDet: Sprite, num: number): number {
        this.distDet = Math.sqrt((tanks[num].x - shellDet.x) ** 2 + (tanks[num].y - shellDet.y) ** 2)

        if (this.distDet < this.damRadius) {
            this.damage = this.maxDamage/this.distDet
        } else {
            this.damage = 0
        }
        return this.damage
    }
}

// global variables

// game update

// event handler
scene.onHitWall(SpriteKind.Shell, function(sprite: Sprite, location: tiles.Location) {
    for (let i = 0; i < sprites.allOfKind(SpriteKind.Tank).length; i++) {
        boom(sprites.allOfKind(SpriteKind.Tank), sprite, i)
    }
    
})

// functions
function createTank() {

}
function selectWep() {

}
function attack() {
    
}
// on start
createTank()

// controller