import CONFIG from '../Config.js'

const { SLOT_SIZE } = CONFIG.INVENTORY

const potionSpriteSegment = {
  x: 5,
  y: 348,
  gapX: 1,
}

function createPotionItemFactory(createItem) {
  function createPotionItem(...args) {
    return createItem('potion', ...args)
  }

  return {
    createHealthSmall(x, y) {
      return {
        ...createItem('health-small', x, y),
        spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 11,
        spriteY: potionSpriteSegment.y,
      }
    },
    createHealth(x, y) {
      return {
        ...createPotionItem(x, y),
        spriteX: potionSpriteSegment.x,
        spriteY: potionSpriteSegment.y,
      }
    },
    createHealthLarge(x, y) {
      return {
        ...createPotionItem(x, y),
        spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 1,
        spriteY: potionSpriteSegment.y,
      }
    },

    createMana(x, y) {
      return {
        ...createPotionItem(x, y),
        spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 2,
        spriteY: potionSpriteSegment.y,
      }
    },
    createManaLarge(x, y) {
      return {
        ...createPotionItem(x, y),
        spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 3,
        spriteY: potionSpriteSegment.y,
      }
    },

    createRejuvenation(x, y) {
      return {
        ...createPotionItem(x, y),
        spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 4,
        spriteY: potionSpriteSegment.y,
      }
    },
    createRejuvenationLarge(x, y) {
      return {
        ...createPotionItem(x, y),
        spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 5,
        spriteY: potionSpriteSegment.y,
      }
    },
    createStamina(x, y) {
      return {
        ...createPotionItem(x, y),
        spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 6,
        spriteY: potionSpriteSegment.y,
      }
    },
    createStaminaLarge(x, y) {
      return {
        ...createPotionItem(x, y),
        spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 7,
        spriteY: potionSpriteSegment.y,
      }
    },
    createAntidoteSmall(x, y) {
      return {
        ...createPotionItem(x, y),
        spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 8,
        spriteY: potionSpriteSegment.y,
      }
    },
    createAntidote(x, y) {
      return {
        ...createPotionItem(x, y),
        spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 9,
        spriteY: potionSpriteSegment.y,
      }
    },
    createAntidoteLarge(x, y) {
      return {
        ...createPotionItem(x, y),
        spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 10,
        spriteY: potionSpriteSegment.y,
      }
    },
    createUnknown1(x, y) {
      return {
        ...createPotionItem(x, y),
        spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 12,
        spriteY: potionSpriteSegment.y,
      }
    },
    createUnknown2(x, y) {
      return {
        ...createPotionItem(x, y),
        spriteX: potionSpriteSegment.x + (potionSpriteSegment.gapX + SLOT_SIZE) * 13,
        spriteY: potionSpriteSegment.y,
      }
    },
  }
}
export { createPotionItemFactory }
