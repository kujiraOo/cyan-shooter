import Phaser from 'phaser'
import Bullet from './Bullet'

export default class extends Phaser.Sprite {
  constructor ({game, x, y, asset, socket, id}) {
    super(game, x, y, asset)
    this.id = id
    this.socket = socket
    this.anchor.setTo(0.5)

    socket.on('enemyStateUpdate', ({x, y, rotation, id}) => {
      if (this.id === id) {
        this.x = x
        this.y = y
        this.rotation = rotation
      }
    })
  }

  update () {

  }
}
