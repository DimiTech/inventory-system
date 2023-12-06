import CONFIG from './Config.js'

import { calculateFrameRate, drawFPS } from './FrameRate.js'
import { setupEventListeners } from './Keyboard.js'

// ----------------------------------------------------------------------------
// Canvas
// ----------------------------------------------------------------------------

const canvas = document.getElementById('canvas')

canvas.width  = CONFIG.CANVAS_WIDTH
canvas.height = CONFIG.CANVAS_HEIGHT
canvas.style.width  = CONFIG.SCALE !== 1 ? (CONFIG.SCALE * CONFIG.CANVAS_WIDTH ) + 'px' : 'auto'
canvas.style.height = CONFIG.SCALE !== 1 ? (CONFIG.SCALE * CONFIG.CANVAS_HEIGHT) + 'px' : 'auto'

const context = canvas.getContext('2d')

// ----------------------------------------------------------------------------
// Time
// ----------------------------------------------------------------------------

const TIME = { // Milliseconds
  previousTimestamp: undefined,
  frameElapsedTime: undefined,
}


// ----------------------------------------------------------------------------
// Player
// ----------------------------------------------------------------------------

const player = {
  x : 100,
  y : 100,
  width  : 10,
  height : 10,
  moving: {
    up    : false,
    right : false,
    down  : false,
    left  : false,
  },
  speed  : 0.1,
}

player.update = function() {
  if (this.moving.up) {
    this.y -= Math.round(this.speed * TIME.frameElapsedTime)
  }
  if (this.moving.right) {
    this.x += Math.round(this.speed * TIME.frameElapsedTime)
  }
  if (this.moving.down) {
    this.y += Math.round(this.speed * TIME.frameElapsedTime)
  }
  if (this.moving.left) {
    this.x -= Math.round(this.speed * TIME.frameElapsedTime)
  }
}

player.render = function() {
  context.beginPath();
    context.rect(
      this.x - (this.width  / 2),
      this.y - (this.height / 2),
      this.width,
      this.height
    );
  context.fill();
}

// ----------------------------------------------------------------------------
// Event Listeners
// ----------------------------------------------------------------------------

setupEventListeners(player)

// ----------------------------------------------------------------------------
// Game Loop
// ----------------------------------------------------------------------------

function update() {
  player.update()
}

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  player.render()
  drawFPS(context)
}

function gameLoopStep() {
  update()
  render()
}

function gameLoop(timestamp) {
  if (TIME.previousTimestamp === undefined) {
    TIME.previousTimestamp = timestamp
  }
  TIME.frameElapsedTime = timestamp - TIME.previousTimestamp

  gameLoopStep(TIME.frameElapsedTime)
  calculateFrameRate(TIME.previousTimestamp, TIME.frameElapsedTime)

  TIME.previousTimestamp = timestamp
  window.requestAnimationFrame(gameLoop)
}
window.requestAnimationFrame(gameLoop)
