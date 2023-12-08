import CONFIG from '../Config.js'

const { SLOT_SIZE } = CONFIG.INVENTORY

const staffSpriteSegment = {
  x: 669,
  y: 126,
  gapX: 1,
}

const staffCols = 2
const staffRows = 3

function createStaffItemFactory(createItem) {
  return {
    createStaff1(x, y) {
      return {
        ...createItem(x, y, staffCols, staffRows),
        spriteX: staffSpriteSegment.x,
        spriteY: staffSpriteSegment.y,
      }
    },
    createStaff2(x, y) {
      return {
        ...createItem(x, y, staffCols, staffRows),
        spriteX: staffSpriteSegment.x + staffSpriteSegment.gapX * 1 + SLOT_SIZE * staffCols * 1,
        spriteY: staffSpriteSegment.y,
      }
    },

    createStaff3(x, y) {
      return {
        ...createItem(x, y, staffCols, staffRows),
        spriteX: staffSpriteSegment.x + staffSpriteSegment.gapX * 2 + SLOT_SIZE * staffCols * 2,
        spriteY: staffSpriteSegment.y,
      }
    },
  }
}
export { createStaffItemFactory }
