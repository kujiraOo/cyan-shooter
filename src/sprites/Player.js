import Phaser from 'phaser'
import HpBar from './HpBar'

export default class extends Phaser.Sprite {
  constructor ({game, x, y, asset, socket, hp}) {
    super(game, x, y)

    this._socket = socket

    this.anchor.setTo(0.5)

    this.hp = hp
    this.hpBar = new HpBar({game, hp, x: -20, y: -28, color: 0x00FF00})
    this.gfx = new Phaser.Sprite(game, 0, 0, asset)
    this.gfx.anchor.setTo(0.5)
    this.addChild(this.gfx)
    this.addChild(this.hpBar)

    const debugOpacity = 0

    this.keys = this.game.input.keyboard.addKeys({
      'up': Phaser.KeyCode.W,
      'down': Phaser.KeyCode.S,
      'left': Phaser.KeyCode.A,
      'right': Phaser.KeyCode.D
    })

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

    // game.physics.p2.enable(this)
    game.canvas.addEventListener('click', () => {
      game.input.mouse.requestPointerLock()
    })

    game.input.addMoveCallback(() => {
      this.handleAimingInput()
    }, this)

    this.initInput()

    socket.on('playerStateUpdate', (data) => {
      this.handleStateUpdate(data)
    })
  }

  handleStateUpdate ({x, y, rotation}) {
    this.x = x
    this.y = y
    this.gfx.rotation = rotation
  }

  initInput () {
    const {_socket, keys, game} = this

    game.input.activePointer.leftButton.onDown.add(() => {
      console.log('left button pressed')
      _socket.emit('playerInput', {leftButton: true})
    })

    game.input.activePointer.leftButton.onUp.add(() => {
      console.log('left button released')
      _socket.emit('playerInput', {leftButton: false})
    })

    keys.up.onDown.add(() => {
      console.log('UP pressed')
      _socket.emit('playerInput', {up: true})
    })

    keys.up.onUp.add(() => {
      console.log('UP released')
      _socket.emit('playerInput', {up: false})
    })

    keys.down.onDown.add(() => {
      console.log('down pressed')
      _socket.emit('playerInput', {down: true})
    })

    keys.down.onUp.add(() => {
      console.log('down released')
      _socket.emit('playerInput', {down: false})
    })

    keys.left.onDown.add(() => {
      console.log('left pressed')
      _socket.emit('playerInput', {left: true})
    })

    keys.left.onUp.add(() => {
      console.log('left released')
      _socket.emit('playerInput', {left: false})
    })

    keys.right.onDown.add(() => {
      console.log('right pressed')
      _socket.emit('playerInput', {right: true})
    })

    keys.right.onUp.add(() => {
      console.log('right released')
      _socket.emit('playerInput', {right: false})
    })
  }

  handleAimingInput () {
    const {game, _socket} = this

    this._pointerGfx.x += game.input.activePointer.rawMovementX
    this._pointerGfx.y += game.input.activePointer.rawMovementY

    if (Phaser.Math.distance(0, 0, this._pointerGfx.x, this._pointerGfx.y) > this._pointerThreshold2) {
      const pointerAngle = Phaser.Math.angleBetween(0, 0, this._pointerGfx.x, this._pointerGfx.y)
      this._pointerGfx.x = this._pointerThreshold2 * Math.cos(pointerAngle)
      this._pointerGfx.y = this._pointerThreshold2 * Math.sin(pointerAngle)
    }

    if (Phaser.Math.distance(0, 0, this._pointerGfx.x, this._pointerGfx.y) > this._pointerThreshold1) {
      _socket.emit(
        'playerInput',
        {
          rotation: Phaser.Math.angleBetween(
            0,
            0,
            this._pointerGfx.x,
            this._pointerGfx.y)
        })
    }
  }

  update () {
  }
}
