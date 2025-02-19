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
    export const Dart = SpriteKind.create()

}
//Classes
class Tank extends sprites.ExtendableSprite {
    hitPoints: number = null
    gas: number = null
    constructor(image: Image, kind: number) {
        super(image, kind)
        this.hitPoints = 100
        this.gas = 75
    }
    hit(dmg: number, sprite: Sprite) {
        this.hitPoints = this.hitPoints - dmg
        if (this.hitPoints <= 0) {
            sprite.destroy()
        }
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
            this.damage = this.maxDamage/this.distDet 
        } else if (this.distDet == 0) {
            this.damage = this.maxDamage
        } else {
            this.damage = 0
        }
        return this.damage
    }
}

// global variables
let dart: Dart = null
let shell: Shell = null

let attackReady: boolean = false
let shellSi: number = null

let pauseDam: boolean = null

let index: number = null
let damageGlobal: number = null

let player: Tank = null
let enemyNum: number = null
let tankArray: Image[] = [assets.image`tankBlue`, assets.image`tankRed`, assets.image`tankPurple`, assets.image`tankPink`, assets.image`tankBlack`]
let tileMapArray: tiles.TileMapData[] = [assets.tilemap`grassMap`, assets.tilemap`sandMap`]
let backgrounds:Image[] = [assets.image`sky`, assets.image`dust`]


let maxEnemyNum: number = tankArray.length

let moveX: number = 16

let gravity: number = 75

// game update
game.onUpdate(function() {

})

// event handler
scene.onHitWall(SpriteKind.Shell, function (sprite: Shell, location: tiles.Location) {
    shell.destroy()
    for (let i = 0; i < sprites.allOfKind(SpriteKind.Tank).length; i++) {
        damageGlobal = sprite.boom(sprites.allOfKind(SpriteKind.Tank)[i], sprite)

        let proj = sprites.createProjectileFromSprite(assets.image`shell`, sprites.allOfKind(SpriteKind.Projectile)[i], 0, 0)
        if (sprites.allOfKind(SpriteKind.Projectile).length > 0) {
            proj.setPosition(sprites.allOfKind(SpriteKind.Tank)[i].x, sprites.allOfKind(SpriteKind.Tank)[i].y)
        }
    }
})
sprites.onOverlap(SpriteKind.Tank, SpriteKind.Projectile, function (sprite: Tank, otherSprite: Sprite) {
    otherSprite.destroy()
    sprite.hit(damageGlobal, sprite)
    pauseDam = true
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
function movement(tf:boolean, sprite:Tank) {
    if (sprite.move()) {
        if (tf) {
            sprite.x += moveX
        } else {
            sprite.x -= moveX
        }
        while (tiles.tileAtLocationIsWall(sprite.tilemapLocation())) {
            sprite.y -= 16
        }
        sprite.vy = gravity
    }
}
function setShellSi () {
    shellSi = game.askForNumber("Select a shell size", 1)
    if (shellSi > 5 || shellSi < 0) {
        setShellSi()
    }
}
// on start
while (!(enemyNum < maxEnemyNum && enemyNum > 0)) {
    enemyNum = game.askForNumber("Select 1-" + (maxEnemyNum - 1) + " enemies", 1)
}
startGame()

// controller
controller.left.onEvent(ControllerButtonEvent.Pressed, function() {
    if (attackReady == false) {
        movement(false, player)
    }
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (attackReady == false) {
        movement(true, player)
    }
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function() {
    if (attackReady == false) {
        sprites.destroyAllSpritesOfKind(SpriteKind.Shell)
        sprites.destroyAllSpritesOfKind(SpriteKind.Dart)

        setShellSi()
        dart = darts.create(assets.image`blank`, SpriteKind.Dart)
        shell = new Shell (assets.image`shell`, SpriteKind.Shell, shellSi * 75, shellSi)

        dart.setFlag(SpriteFlag.AutoDestroy, true)
        dart.setFlag(SpriteFlag.Ghost, true)

        dart.setPosition(player.x, player.y)
        dart.controlWithArrowKeys()
        
        dart.setTrace(false)

        shell.setPosition(dart.x, dart.y)
        shell.setFlag(SpriteFlag.AutoDestroy, true)

        shell.follow(dart, 1000, 0)

        attackReady = true
    }
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (attackReady == true) {
        dart.throwDart()
        attackReady = false
    }
})
