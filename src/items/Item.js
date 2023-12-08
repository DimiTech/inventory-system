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
  createItemPotionHealthSmall() {
    return {
      ...createItem(),
      spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 11,
      spriteY: potionSpriteSegment.y,
    }
  },
  createItemPotionHealth() {
    return {
      ...createItem(),
      spriteX: potionSpriteSegment.x,
      spriteY: potionSpriteSegment.y,
    }
  },
  createItemPotionHealthLarge() {
    return {
      ...createItem(),
      spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 1,
      spriteY: potionSpriteSegment.y,
    }
  },

  createItemPotionMana() {
    return {
      ...createItem(),
      spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 2,
      spriteY: potionSpriteSegment.y,
    }
  },
  createItemPotionManaLarge() {
    return {
      ...createItem(),
      spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 3,
      spriteY: potionSpriteSegment.y,
    }
  },

  createItemPotionRejuvenation() {
    return {
      ...createItem(),
      spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 4,
      spriteY: potionSpriteSegment.y,
    }
  },
  createItemPotionRejuvenationLarge() {
    return {
      ...createItem(),
      spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 5,
      spriteY: potionSpriteSegment.y,
    }
  },
  createItemPotionStamina() {
    return {
      ...createItem(),
      spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 6,
      spriteY: potionSpriteSegment.y,
    }
  },
  createItemPotionStaminaLarge() {
    return {
      ...createItem(),
      spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 7,
      spriteY: potionSpriteSegment.y,
    }
  },
  createItemPotionAntidoteSmall() {
    return {
      ...createItem(),
      spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 8,
      spriteY: potionSpriteSegment.y,
    }
  },
  createItemPotionAntidote() {
    return {
      ...createItem(),
      spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 9,
      spriteY: potionSpriteSegment.y,
    }
  },
  createItemPotionAntidoteLarge() {
    return {
      ...createItem(),
      spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 10,
      spriteY: potionSpriteSegment.y,
    }
  },
  createItemPotionUnknown1() {
    return {
      ...createItem(),
      spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 12,
      spriteY: potionSpriteSegment.y,
    }
  },
  createItemPotionUnknown2() {
    return {
      ...createItem(),
      spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 13,
      spriteY: potionSpriteSegment.y,
    }
  },
}

export { ItemFactory }
