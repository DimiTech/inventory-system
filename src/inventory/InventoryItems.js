import { context } from '../Canvas.js'

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

function render(SLOT_SIZE, x, y) {
  if ((!healthPotionSprite) instanceof Image) {
    return
  }

  const canvasX = x
  const canvasY = y

  context.drawImage(
    healthPotionSprite,
    5, // Sprite start coordinates
    348,
    28, // Sprite crop dimensions
    28,
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

export { createItem }
