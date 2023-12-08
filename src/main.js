import CONFIG from './Config.js'

import { canvas, context } from './Canvas.js'

import { calculateFrameRate, drawFPS } from './FrameRate.js'
import { setupEventListeners } from './Keyboard.js'

import inventorySimple from './inventory/Inventory.js'
import inventoryComplex from './inventory-complex/Inventory.js'
import { PotionItemFactory, SwordItemFactory, StaffItemFactory } from './items/Item.js'

const { SLOT_SIZE } = CONFIG.INVENTORY

// Inventory strategy
const inventory = CONFIG.INVENTORY.COMPLEX ? inventoryComplex : inventorySimple

// ----------------------------------------------------------------------------
// Time
// ----------------------------------------------------------------------------

const TIME = {
  // Milliseconds
  previousTimestamp: undefined,
  frameElapsedTime: undefined,
}

// ----------------------------------------------------------------------------
// Player
// ----------------------------------------------------------------------------

const player = {
  x: 100,
  y: 100,
  width: 28,
  height: 28,
  moving: {
    up: false,
    right: false,
    down: false,
    left: false,
  },
  speed: 0.2,
}

player.update = function () {
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

  let item
  if ((item = this.collidesWithItem())) {
    inventory.addItem(item)
  }
}

player.collidesWithItem = function () {
  return items.find(i => {
    return (
      i.storedInInventory === false &&
      rectangleCollision(
        {
          x: this.x - this.width / 2,
          y: this.y - this.height / 2,
          width: this.width,
          height: this.height,
        },
        {
          x: i.x,
          y: i.y,
          width: SLOT_SIZE,
          height: SLOT_SIZE,
        },
      )
    )
  })
}

// TODO: Move to Math Module
function rectangleCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  )
}

player.render = function () {
  context.beginPath()
  context.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height)
  context.fillStyle = 'black'
  context.fill()
}

// ----------------------------------------------------------------------------
// Event Listeners
// ----------------------------------------------------------------------------

setupEventListeners(player)
inventory.setup()

const items = []

// TODO: Temporary item initialization
function generateItemPositionX() {
  const x = Math.floor(Math.random() * (canvas.width - SLOT_SIZE))
  if (x < player.x + player.width && x > player.x) {
    return generateItemPositionX()
  }
  return x
}
function generateItemPositionY() {
  const y = Math.floor(Math.random() * (canvas.height - SLOT_SIZE))
  if (y < player.y + player.height && y > player.y) {
    return generateItemPositionY()
  }
  return y
}
const itemFactories = [
  PotionItemFactory.createHealthLarge,
  PotionItemFactory.createHealthSmall,
  PotionItemFactory.createHealth,
  PotionItemFactory.createManaLarge,
  PotionItemFactory.createMana,
  PotionItemFactory.createRejuvenationLarge,
  PotionItemFactory.createRejuvenation,
  PotionItemFactory.createStaminaLarge,
  PotionItemFactory.createStamina,
  PotionItemFactory.createAntidoteLarge,
  PotionItemFactory.createAntidote,
  PotionItemFactory.createAntidoteSmall,
  PotionItemFactory.createUnknown1,
  PotionItemFactory.createUnknown2,
]
if (CONFIG.INVENTORY.COMPLEX) {
  itemFactories.push(SwordItemFactory.createSword1)
  itemFactories.push(SwordItemFactory.createSword2)
  itemFactories.push(SwordItemFactory.createSword3)
  itemFactories.push(StaffItemFactory.createStaff1)
  itemFactories.push(StaffItemFactory.createStaff2)
  itemFactories.push(StaffItemFactory.createStaff3)
}

for (let i = 0; i < 5 + Math.ceil(Math.random() * 40); ++i) {
  const randomFactoryIndex = Math.floor(Math.random() * itemFactories.length)
  items.push(itemFactories[randomFactoryIndex](generateItemPositionX(), generateItemPositionY()))
}
for (let i = 0; i < 40; ++i) {
  const newItem = PotionItemFactory.createHealthSmall(100, 100)
  items.push(newItem)
  inventory.addItem(newItem)
}

// ----------------------------------------------------------------------------
// Game Loop
// ----------------------------------------------------------------------------

function update() {
  player.update()
  inventory.update()
}

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  items.forEach(i => i.renderInWorld())
  drawFPS()
  player.render()
  inventory.render()
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
