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
    SLOT_SIZE, // Sprite crop dimensions
    SLOT_SIZE,
    canvasX, // Canvas destination
    canvasY,
    SLOT_SIZE,
    SLOT_SIZE,
  )
}

function renderInWorld() {
  if (this.storedInInventory === false && this.x && this.y) {
    context.drawImage(
      healthPotionSprite,
      this.spriteX, // Sprite start coordinates
      this.spriteY,
      SLOT_SIZE, // Sprite crop dimensions
      SLOT_SIZE,
      this.x,
      this.y,
      SLOT_SIZE,
      SLOT_SIZE,
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

const potionSpriteSegment = {
  x: 5,
  y: 348,
  gapX: 1,
}

const ItemFactory = {
  createItemPotionHealthSmall(x, y) {
    return {
      ...createItem(x, y),
      spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 11,
      spriteY: potionSpriteSegment.y,
    }
  },
  createItemPotionHealth(x, y) {
    return {
      ...createItem(x, y),
      spriteX: potionSpriteSegment.x,
      spriteY: potionSpriteSegment.y,
    }
  },
  createItemPotionHealthLarge(x, y) {
    return {
      ...createItem(x, y),
      spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 1,
      spriteY: potionSpriteSegment.y,
    }
  },

  createItemPotionMana(x, y) {
    return {
      ...createItem(x, y),
      spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 2,
      spriteY: potionSpriteSegment.y,
    }
  },
  createItemPotionManaLarge(x, y) {
    return {
      ...createItem(x, y),
      spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 3,
      spriteY: potionSpriteSegment.y,
    }
  },

  createItemPotionRejuvenation(x, y) {
    return {
      ...createItem(x, y),
      spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 4,
      spriteY: potionSpriteSegment.y,
    }
  },
  createItemPotionRejuvenationLarge(x, y) {
    return {
      ...createItem(x, y),
      spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 5,
      spriteY: potionSpriteSegment.y,
    }
  },
  createItemPotionStamina(x, y) {
    return {
      ...createItem(x, y),
      spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 6,
      spriteY: potionSpriteSegment.y,
    }
  },
  createItemPotionStaminaLarge(x, y) {
    return {
      ...createItem(x, y),
      spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 7,
      spriteY: potionSpriteSegment.y,
    }
  },
  createItemPotionAntidoteSmall(x, y) {
    return {
      ...createItem(x, y),
      spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 8,
      spriteY: potionSpriteSegment.y,
    }
  },
  createItemPotionAntidote(x, y) {
    return {
      ...createItem(x, y),
      spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 9,
      spriteY: potionSpriteSegment.y,
    }
  },
  createItemPotionAntidoteLarge(x, y) {
    return {
      ...createItem(x, y),
      spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 10,
      spriteY: potionSpriteSegment.y,
    }
  },
  createItemPotionUnknown1(x, y) {
    return {
      ...createItem(x, y),
      spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 12,
      spriteY: potionSpriteSegment.y,
    }
  },
  createItemPotionUnknown2(x, y) {
    return {
      ...createItem(x, y),
      spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 13,
      spriteY: potionSpriteSegment.y,
    }
  },
}

export { ItemFactory }
