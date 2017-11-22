import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({game, x, y, asset}) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)

    this.speed = 200

    this.keys = this.game.input.keyboard.addKeys({
      'up': Phaser.KeyCode.W,
      'down': Phaser.KeyCode.S,
      'left': Phaser.KeyCode.A,
      'right': Phaser.KeyCode.D
    })

    game.physics.enable(this, Phaser.Physics.ARCADE)
  }

  handleMovementInput () {
    const {keys, game, body, speed} = this

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
      game.physics.arcade.velocityFromAngle(45, speed, body.velocity)
    }

    if (keys.down.isDown && keys.left.isDown) {
      game.physics.arcade.velocityFromAngle(135, speed, body.velocity)
    }

    if (keys.up.isDown && keys.right.isDown) {
      game.physics.arcade.velocityFromAngle(-45, speed, body.velocity)
    }

    if (keys.up.isDown && keys.left.isDown) {
      game.physics.arcade.velocityFromAngle(-135, speed, body.velocity)
    }

    if (this.x < 0) {
      this.x = 0
    }

    if (this.x > game.world.width) {
      this.x = game.world.width
    }
  }

  update () {
    this.rotation = this.game.physics.arcade.angleToPointer(this)
    this.handleMovementInput()
  }
}
