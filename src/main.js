// Code Practice: RNGolf
// Name: Drullkus
// Date: 1/30/26

'use strict'

const urlQueryParams = new URLSearchParams(window.location.search);

const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 960,
    physics: {
        default: 'arcade',
        arcade: {
            debug: urlQueryParams.get('debug') || false
        }
    },
    scene: [ Play ]
}

const game = new Phaser.Game(config)

const { width, height } = game.config