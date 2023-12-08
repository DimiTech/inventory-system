import { isFirefox } from '../utils/BrowserDetection.js'

import { context } from '../Canvas.js'

// Occupied - good word

const INVENTORY_SLOT_CONFIG = {
  STROKE_STYLE: 'rgba(0, 0, 0, 0.5)',
  COLORS: {
    BLUE: 'rgba(180, 180, 220, 0.5)',
    RED: 'rgba(220, 180, 180, 0.5)',
  },
}

function create(col, row, x, y, color = INVENTORY_SLOT_CONFIG.COLORS.BLUE) {
  return {
    col,
    row,
    x,
    y,
    color,
    render,
    storedItem: null,
    occupied: false,
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
        this.color = INVENTORY_SLOT_CONFIG.COLORS.BLUE
        this.isHighlighted = false
      }
    },
  }
}

function render(SLOT_SIZE) {
  const { x, y, color } = this

  // Fill Rect
  context.fillStyle = color
  context.fillRect(x, y, SLOT_SIZE, SLOT_SIZE)

  // Stroke Rect
  const lineWidth = 2
  context.lineWidth = lineWidth
  context.strokeStyle = INVENTORY_SLOT_CONFIG.STROKE_STYLE
  if (this.occupied) {
    context.strokeStyle = 'red'
  }

  let outlineX = x - lineWidth / 2
  let outlineY = y - lineWidth / 2
  if (isFirefox) {
    outlineX += 0.5
    outlineY += 0.5
  }
  context.strokeRect(outlineX + lineWidth, outlineY + lineWidth, SLOT_SIZE - lineWidth, SLOT_SIZE - lineWidth)
}

export default {
  create,
}
