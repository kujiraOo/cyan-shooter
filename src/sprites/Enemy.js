import Phaser from 'phaser'
import Bullet from './Bullet'

export default class extends Phaser.Sprite {
  constructor ({game, x, y, asset, socket}) {
    super(game, x, y, asset)

    this._socket = socket

    this.anchor.setTo(0.5)

    socket.on('enemyMove', ({x, y}) => {
      this.x = x
      this.y = y
    })
  }

  update () {

  }
}
