/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import Player from '../sprites/Player'
import io from 'socket.io-client'

export default class extends Phaser.State {
  init () {}

  preload () {}

  create () {
    this.game.physics.startSystem(Phaser.Physics.P2JS)

    const bannerText = 'Phaser + ES6 + Webpack'
    let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText)
    banner.font = 'Bangers'
    banner.padding.set(10, 16)
    banner.fontSize = 40
    banner.fill = '#77BFA3'
    banner.smoothed = false
    banner.anchor.setTo(0.5)

    this.mushroom = new Mushroom({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'mushroom'
    })

    this.player = new Player({
      game: this.game,
      x: 20,
      y: 20,
      asset: 'player'
    })
    // this.game.add.existing(this.mushroom)
    this.game.add.existing(this.player)

    const socket = io('http://localhost:3000')

    socket.on('connect', () => {
      console.log('socket ok')
    })
  }

  render () {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
