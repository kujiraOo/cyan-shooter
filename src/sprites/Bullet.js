import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor (game, x, y) {
    const gfx = game.add.graphics(0, 0)
    gfx.beginFill(0xFF0000, 1)
    gfx.drawCircle(0, 0, 10)

    super(game, x, y)

    this.addChild(gfx)
  }

  update () {
  }
}
