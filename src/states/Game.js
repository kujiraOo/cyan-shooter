/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'
import io from 'socket.io-client'
import Enemy from '../sprites/Enemy'
import Bullet from '../sprites/Bullet'

export default class extends Phaser.State {
  init () {}

  preload () {}

  create () {
    // this.game.physics.startSystem(Phaser.Physics.P2JS)

    this.game.stage.disableVisibilityChange = true

    this.enemies = {}
    this.inGame = false
    this.playerBullets = {}
    this.enemyBullets = {}
    this.playerBulletGroup = this.game.add.group()
    this.enemyBulletGroup = this.game.add.group()

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

      this.socket.on('playerRemoved', id => {
        this.handlePlayerRemove(id)
      })

      this.socket.on('playerBulletInitialized', data => {
        this.handlePlayerBulletInitialization(data)
      })

      this.socket.on('enemyBulletInitialized', data => {
        this.handleEnemyBulletInitialization(data)
      })

      this.socket.on('playerBulletMove', data => {
        this.handlePlayerBulletMove(data)
      })

      this.socket.on('enemyBulletMove', data => {
        this.handleEnemyBulletMove(data)
      })

      this.socket.on('playerBulletRemoved', bulletId => {
        this.handlePlayerBulletRemove(bulletId)
      })

      this.socket.on('enemyBulletRemoved', bulletId => {
        this.handleEnemyBulletRemove(bulletId)
      })
    })
  }

  handlePlayerInitialization (player) {
    const {socket} = this

    if (!this.inGame) {
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

      this.inGame = true
    }
  }

  handleEnemyInitialization (enemy) {
    const {socket, enemies} = this
    const {x, y, id} = enemy
    console.log('New enemy: ', enemy)

    enemies[id] = new Enemy({
      game: this.game,
      x,
      y,
      asset: 'enemy',
      socket: socket
    })

    this.game.add.existing(enemies[id])
  }

  handlePlayerRemove (enemyToRemoveId) {
    const {enemies} = this
    const enemyToRemove = enemies[enemyToRemoveId]
    delete enemies[enemyToRemoveId]
    enemyToRemove.destroy()
  }

  handlePlayerBulletInitialization ({id, x, y, playerId}) {
    const {playerBullets, playerBulletGroup} = this
    const bullet = new Bullet({game: this.game, x, y, id, playerId, group: playerBulletGroup, color: 0x00FFFF})
    playerBullets[id] = bullet
    playerBulletGroup.add(bullet)
  }

  handleEnemyBulletInitialization ({id, x, y, playerId}) {
    const {enemyBullets, enemyBulletGroup} = this
    const bullet = new Bullet({game: this.game, x, y, id, playerId, group: enemyBulletGroup, color: 0xFF0000})
    enemyBullets[id] = bullet
    enemyBulletGroup.add(bullet)
  }

  handlePlayerBulletMove ({id, x, y}) {
    const {playerBullets} = this

    const bullet = playerBullets[id]

    bullet.x = x
    bullet.y = y
  }

  handleEnemyBulletMove ({id, x, y}) {
    const {enemyBullets} = this

    const bullet = enemyBullets[id]

    bullet.x = x
    bullet.y = y
  }

  handlePlayerBulletRemove (bulletId) {
    const {playerBullets, playerBulletGroup} = this
    const bullet = playerBullets[bulletId]

    playerBulletGroup.remove(bullet)
    delete playerBullets[bulletId]
  }

  handleEnemyBulletRemove (bulletId) {
    const {enemyBullets, enemyBulletGroup} = this
    const bullet = enemyBullets[bulletId]

    enemyBulletGroup.remove(bullet)
    delete enemyBullets[bulletId]
  }

  render () {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
