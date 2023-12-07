import CONFIG from '../Config.js'

import { context } from '../Canvas.js'

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

function render(x, y) {
  if ((!healthPotionSprite) instanceof Image) {
    return
  }

  const canvasX = x
  const canvasY = y

  context.drawImage(
    healthPotionSprite,
    this.spriteX, // Sprite start coordinates
    this.spriteY,
    SLOT_SIZE, // Sprite crop dimensions
    SLOT_SIZE,
    canvasX, // Canvas destination
    canvasY,
    SLOT_SIZE,
    SLOT_SIZE,
  )
}

function createItem() {
  return {
    sizeCols: 1,
    sizeRows: 1,
    dragged: false,
    render,
  }
}

const potionSpriteSegment = {
  x: 5,
  y: 348,
  gapX: 1,
}

const ItemFactory = {
  createItemHealthPotion() {
    const itemBase = createItem()
    return {
      ...itemBase,
      spriteX: potionSpriteSegment.x,
      spriteY: potionSpriteSegment.y,
    }
  },

  createItemHealthPotionLarge() {
    const itemBase = createItem()
    return {
      ...itemBase,
      spriteX: potionSpriteSegment.x + potionSpriteSegment.gapX + SLOT_SIZE,
      spriteY: potionSpriteSegment.y,
    }
  },
}

export { ItemFactory }
