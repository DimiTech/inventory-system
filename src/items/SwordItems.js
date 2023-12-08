import CONFIG from '../Config.js'

const { SLOT_SIZE } = CONFIG.INVENTORY

const swordSpriteSegment = {
  x: 4,
  y: 613,
  gapX: 1,
}

const swordRows = 3

function createSwordItemFactory(createItem) {
  return {
    createSword1(x, y) {
      return {
        ...createItem(x, y, undefined, swordRows),
        spriteX: swordSpriteSegment.x,
        spriteY: swordSpriteSegment.y,
      }
    },
    createSword2(x, y) {
      return {
        ...createItem(x, y, undefined, swordRows),
        spriteX: swordSpriteSegment.x + (swordSpriteSegment.gapX + SLOT_SIZE) * 1,
        spriteY: swordSpriteSegment.y,
      }
    },

    createSword3(x, y) {
      return {
        ...createItem(x, y, undefined, swordRows),
        spriteX: swordSpriteSegment.x + (swordSpriteSegment.gapX + SLOT_SIZE) * 2,
        spriteY: swordSpriteSegment.y,
      }
    },
  }
}
export { createSwordItemFactory }
