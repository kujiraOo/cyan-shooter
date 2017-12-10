/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import Player from '../sprites/Player'
import io from 'socket.io-client'
import Enemy from '../sprites/Enemy'

export default class extends Phaser.State {
  init () {}

  preload () {}

  create () {
    // this.game.physics.startSystem(Phaser.Physics.P2JS)

    const bannerText = 'Phaser + ES6 + Webpack'
    let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText)
    banner.font = 'Bangers'
    banner.padding.set(10, 16)
    banner.fontSize = 40
    banner.fill = '#77BFA3'
    banner.smoothed = false
    banner.anchor.setTo(0.5)

    this.game.stage.disableVisibilityChange = true

    this._enemies = {}
    this._inGame = false

    this.mushroom = new Mushroom({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'mushroom'
    })

    // this.game.add.existing(this.mushroom)

    this.socket = io('http://localhost:3000')

    this.socket.on('connect', () => {
      console.log('socket ok')

      this.socket.on('playerInitialized', (player) => {
        this.handlePlayerInitialization(player)
      })

      this.socket.on('enemyInitialized', (enemy) => {
        this.handleEnemyInitialization(enemy)
      })
    })
  }

  handlePlayerInitialization (player) {
    const {socket} = this

    if (!this._inGame) {
      const {x, y} = player
      console.log(player)

      this.player = new Player({
        game: this.game,
        x,
        y,
        asset: 'player',
        socket: socket
      })

      this.game.add.existing(this.player)

      this._inGame = true
    }
  }

  handleEnemyInitialization (enemy) {
    const {socket, _enemies} = this
    const {x, y, id} = enemy
    console.log('New enemy: ', enemy)

    _enemies[id] = new Enemy({
      game: this.game,
      x,
      y,
      asset: 'enemy',
      socket: socket
    })

    this.game.add.existing(_enemies[id])
  }

  render () {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
