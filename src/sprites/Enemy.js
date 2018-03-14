import Phaser from 'phaser'
import Bullet from './Bullet'
import HpBar from './HpBar'

export default class extends Phaser.Sprite {
  constructor ({game, x, y, hp, asset, socket, id, teamId}) {
    super(game, x, y)
    this.id = id
    this.teamId = teamId
    this.socket = socket
    this.anchor.setTo(0.5)

    this.hpBar = new HpBar({game, hp, x: -20, y: -28, color: 0x00FF00})
    this.gfx = new Phaser.Sprite(game, 0, 0, asset)
    this.gfx.anchor.setTo(0.5)
    this.addChild(this.gfx)
    this.addChild(this.hpBar)

    socket.on('enemyStateUpdate', ({x, y, rotation, id}) => {
      if (this.id === id) {
        this.x = x
        this.y = y
        this.gfx.rotation = rotation
      }
    })
  }

  update () {

  }
}
