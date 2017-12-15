import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({game, x, y, hp, color}) {
    super(game, x, y)

    this.fullHp = hp
    this.initialWidth = 42
    this.gfx = game.add.graphics(0, 0)
    this.gfx.beginFill(color, 1)
    this.gfx.drawRect(0, 0, this.initialWidth, 5)

    this.addChild(this.gfx)
  }

  setHp (hp) {
    this.gfx.width = hp / this.fullHp * this.initialWidth
  }

  update () { }
}
