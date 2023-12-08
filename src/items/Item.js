import CONFIG from '../Config.js'

import { context } from '../Canvas.js'
import { createPotionItemFactory } from './PotionItems.js'

const { SLOT_SIZE } = CONFIG.INVENTORY

const itemSpriteSheetURLS = {
  healthPotion: './assets/sprites/items.png',
}

function loadSprite(spriteURL) {
  return new Promise(resolve => {
    const image = new Image()
    image.src = spriteURL
    image.onload = () => resolve(image)
  })
}

const healthPotionSprite = await loadSprite(itemSpriteSheetURLS.healthPotion)

function renderInInventory(x, y) {
  if ((!healthPotionSprite) instanceof Image) {
    return
  }

  const canvasX = x
  const canvasY = y

  context.drawImage(
    healthPotionSprite,
    this.spriteX, // Sprite start coordinates
    this.spriteY,
    SLOT_SIZE * this.sizeCols, // Sprite crop dimensions
    SLOT_SIZE * this.sizeRows,
    canvasX, // Canvas destination
    canvasY,
    SLOT_SIZE * this.sizeCols, // Canvas dimensions
    SLOT_SIZE * this.sizeRows,
  )
}

function renderInWorld() {
  if (this.storedInInventory === false && this.x && this.y) {
    context.drawImage(
      healthPotionSprite,
      this.spriteX, // Sprite start coordinates
      this.spriteY,
      SLOT_SIZE * this.sizeCols, // Sprite crop dimensions
      SLOT_SIZE * this.sizeRows,
      this.x, // Canvas destination
      this.y,
      SLOT_SIZE * this.sizeCols, // Canvas dimensions
      SLOT_SIZE * this.sizeRows,
    )
  }
}

function createItem(x, y) {
  return {
    x,
    y,
    sizeCols: 1,
    sizeRows: 1,
    dragged: false,
    storedInInventory: false,
    renderInInventory,
    renderInWorld,
  }
}

const PotionItemFactory = createPotionItemFactory(createItem)

export { PotionItemFactory }
