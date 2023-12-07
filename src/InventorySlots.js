import { context } from './Canvas.js'

// Occupied - good word

const INVENTORY_SLOT_CONFIG = {
  STROKE_STYLE: 'rgba(0, 0, 0, 0.5)',
  COLORS: {
    GREEN: 'rgba(180, 220, 180, 0.5)',
    RED: 'rgba(220, 180, 180, 0.5)',
  },
}

function create(col, row, x, y, color = INVENTORY_SLOT_CONFIG.COLORS.GREEN) {
  return {
    col,
    row,
    x,
    y,
    color,
    render,
    storedItem: null,
    isHighlighted: false, // Just for optimization
    highlight() {
      if (this.isHighlighted) {
        return
      }
      this.color = INVENTORY_SLOT_CONFIG.COLORS.RED
      this.isHighlighted = true
    },
    unhighlight() {
      if (this.isHighlighted) {
        this.color = INVENTORY_SLOT_CONFIG.COLORS.GREEN
        this.isHighlighted = false
      }
    },
  }
}

function render(SLOT_SIZE) {
  const { x, y, color } = this

  const lineWidth = 1
  context.lineWidth = lineWidth
  context.strokeStyle = INVENTORY_SLOT_CONFIG.STROKE_STYLE
  context.strokeRect(x, y, SLOT_SIZE - lineWidth, SLOT_SIZE - lineWidth)

  context.fillStyle = color
  context.fillRect(x, y, SLOT_SIZE - lineWidth * 2, SLOT_SIZE - lineWidth * 2)
}

export default {
  create,
}
