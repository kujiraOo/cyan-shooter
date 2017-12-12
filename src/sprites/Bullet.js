import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({game, x, y, id, playerId, color}) {
    const gfx = game.add.graphics(0, 0)
    gfx.beginFill(color, 1)
    gfx.drawCircle(0, 0, 5)

    super(game, x, y)

    this.addChild(gfx)
    this.id = id
    this.playerId = playerId
  }

  updatePosition (x, y) {
    this.x = x
    this.y = y
  }

  update () {

  }
}
