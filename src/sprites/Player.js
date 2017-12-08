import Phaser from 'phaser'
import Bullet from './Bullet'

export default class extends Phaser.Sprite {
  constructor ({game, x, y, asset}) {
    super(game, x, y, asset)

    this._fireRate = 100
    this._nextFire = 0

    this.anchor.setTo(0.5)

    const debugOpacity = 0

    this.speed = 200

    this.keys = this.game.input.keyboard.addKeys({
      'up': Phaser.KeyCode.W,
      'down': Phaser.KeyCode.S,
      'left': Phaser.KeyCode.A,
      'right': Phaser.KeyCode.D
    })

    this._bullets = game.add.group()
    this._bullets.enableBody = true
    this._bullets.physicsBodyType = Phaser.Physics.ARCADE

    this._bullets.setAll('checkWorldBounds', true)
    this._bullets.setAll('outOfBoundsKill', true)

    this._pointerThreshold1 = 50
    this._pointerThreshold2 = 100

    this._pointerBounds = game.add.graphics(0, 0)
    this._pointerBounds.beginFill(0xFFFFFF, debugOpacity)
    this._pointerBounds.drawCircle(game.world.centerX, game.world.centerY, this._pointerThreshold2 * 2)

    this._pointerBounds = game.add.graphics(0, 0)
    this._pointerBounds.beginFill(0x000000, debugOpacity)
    this._pointerBounds.drawCircle(game.world.centerX, game.world.centerY, this._pointerThreshold1 * 2)

    this._pointerGfx = game.add.graphics(0, 0)
    this._pointerGfx.beginFill(0xFF0000, debugOpacity)
    this._pointerGfx.drawCircle(game.world.centerX, game.world.centerY, 10)

    game.physics.p2.enable(this)
    game.canvas.addEventListener('click', () => {
      game.input.mouse.requestPointerLock()
    })

    game.input.addMoveCallback(() => {
      this.handleAimingInput()
    }, this)

    this.initInput()
  }

  initInput () {
    this.keys.up.onDown.add(() => {
      console.log('UP')
    })

    this.keys.up.onUp.add(() => {
      console.log('UP released')
    })

    // const key1 = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE)
    // key1.onDown.add(addPhaserDude, this)
  }

  handleAimingInput () {
    const {game} = this

    this._pointerGfx.x += game.input.activePointer.rawMovementX
    this._pointerGfx.y += game.input.activePointer.rawMovementY

    if (Phaser.Math.distance(0, 0, this._pointerGfx.x, this._pointerGfx.y) > this._pointerThreshold2) {
      const pointerAngle = Phaser.Math.angleBetween(0, 0, this._pointerGfx.x, this._pointerGfx.y)
      this._pointerGfx.x = this._pointerThreshold2 * Math.cos(pointerAngle)
      this._pointerGfx.y = this._pointerThreshold2 * Math.sin(pointerAngle)
    }

    if (Phaser.Math.distance(0, 0, this._pointerGfx.x, this._pointerGfx.y) > this._pointerThreshold1) {
      this.body.rotation = Phaser.Math.angleBetween(
        0,
        0,
        this._pointerGfx.x,
        this._pointerGfx.y)
    }
  }

  handleMovementInput () {
    const {keys, body, speed} = this

    body.velocity.x = 0
    body.velocity.y = 0

    if (keys.up.isDown) {
      body.velocity.y = -speed
    }

    if (keys.right.isDown) {
      body.velocity.x = speed
    }

    if (keys.down.isDown) {
      body.velocity.y = speed
    }

    if (keys.left.isDown) {
      body.velocity.x = -speed
    }

    if (keys.down.isDown && keys.right.isDown) {
      body.velocity.x = Math.cos(0.25 * Math.PI) * speed
      body.velocity.y = Math.sin(0.25 * Math.PI) * speed
    }

    if (keys.down.isDown && keys.left.isDown) {
      body.velocity.x = Math.cos(0.75 * Math.PI) * speed
      body.velocity.y = Math.sin(0.75 * Math.PI) * speed
    }

    if (keys.up.isDown && keys.right.isDown) {
      body.velocity.x = Math.cos(-0.25 * Math.PI) * speed
      body.velocity.y = Math.sin(-0.25 * Math.PI) * speed
    }

    if (keys.up.isDown && keys.left.isDown) {
      body.velocity.x = Math.cos(-0.75 * Math.PI) * speed
      body.velocity.y = Math.sin(-0.75 * Math.PI) * speed
    }
  }

  fire () {
    if (this.game.time.now > this._nextFire) {
      this._nextFire = this.game.time.now + this._fireRate

      const bullet = new Bullet(this.game, this.x, this.y)
      this._bullets.add(bullet)
      // console.log(this.rotation, Math.cos(this.rotation) * 1000, Math.sin(this.rotation) * 1000)
      this.game.physics.arcade.moveToXY(bullet, this.x + Math.cos(this.body.rotation) * 1000, this.y + Math.sin(this.body.rotation) * 1000, 300)
    }
  }

  update () {
    // this.rotation = this.game.physics.arcade.angleToPointer(this)
    // this.handleMovementInput()

    if (this.game.input.activePointer.isDown) {
      this.fire()
    }

    // console.log(this.game.input.pointer)
    //
    // if (this.game.input.activePointer.isDown) {
    //   console.log('ok')
    //   this.game.input.mouse.requestPointerLock()
    // }
  }
}
