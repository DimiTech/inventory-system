import CONFIG from '../Config.js'

import { context } from '../Canvas.js'
import { createPotionItemFactory } from './PotionItems.js'
import { createSwordItemFactory } from './SwordItems.js'
import { createStaffItemFactory } from './StaffItems.js'

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

  if (this.dragged) {
    context.globalAlpha = 0.7
    context.drawImage(
      healthPotionSprite,
      this.spriteX, // Sprite start coordinates
      this.spriteY,
      this.width, // Sprite crop dimensions
      this.height,
      this.dragged && this.sizeCols > 1 ? canvasX - ((this.sizeCols - 1) * SLOT_SIZE) / 2 : canvasX, // Canvas destination
      this.dragged && this.sizeRows > 1 ? canvasY - ((this.sizeRows - 1) * SLOT_SIZE) / 2 : canvasY,
      this.width, // Sprite crop dimensions
      this.height,
    )
    context.globalAlpha = 1
  } else {
    context.drawImage(
      healthPotionSprite,
      this.spriteX, // Sprite start coordinates
      this.spriteY,
      this.width, // Sprite crop dimensions
      this.height,
      canvasX, // Canvas destination
      canvasY,
      this.width, // Sprite crop dimensions
      this.height,
    )
  }
}

function renderInWorld() {
  if (this.storedInInventory === false && this.x && this.y) {
    context.drawImage(
      healthPotionSprite,
      this.spriteX, // Sprite start coordinates
      this.spriteY,
      this.width, // Sprite crop dimensions
      this.height,
      this.x, // Canvas destination
      this.y,
      this.width, // Sprite crop dimensions
      this.height,
    )
  }
}

function createItem(name, x, y, sizeCols = 1, sizeRows = 1) {
  return {
    name,
    x,
    y,
    sizeCols,
    sizeRows,
    width: SLOT_SIZE * sizeCols,
    height: SLOT_SIZE * sizeRows,
    dragged: false,
    storedInInventory: false,
    renderInInventory,
    renderInWorld,
  }
}

const PotionItemFactory = createPotionItemFactory(createItem)
const SwordItemFactory = createSwordItemFactory(createItem)
const StaffItemFactory = createStaffItemFactory(createItem)

export { PotionItemFactory, SwordItemFactory, StaffItemFactory }
