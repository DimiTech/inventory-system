import CONFIG from './Config.js'

import { canvas, context } from './Canvas.js'

const { SCALE } = CONFIG

const INVENTORY_CONFIG = {
  ITEM_SIZE: 32,
  COLS: 8,
  ROWS: 6,
  COLORS: {
    GREEN: 'rgba(180, 220, 180, 0.5)',
    RED: 'rgba(220, 180, 180, 0.5)'
  }
}
INVENTORY_CONFIG.START = {
  X: (canvas.width / 2) - ((INVENTORY_CONFIG.ITEM_SIZE) * INVENTORY_CONFIG.COLS / 2), // center X
  Y: (canvas.height / 2) - ((INVENTORY_CONFIG.ITEM_SIZE) * INVENTORY_CONFIG.ROWS / 2) // center Y
}

const STATE = {
  inventorySlots: [],
  inventoryOpen: false,
  isMouseDragging: false,
  draggedInventorySlot: undefined
}

function createInventorySlot(col, row, x, y, color) {
  return {
    col,
    row,
    x,
    y,
    color
  }
}

// Initialize state
for (let col = 0; col < INVENTORY_CONFIG.COLS; ++col) {
  for (let row = 0; row < INVENTORY_CONFIG.ROWS; ++row) {
    STATE.inventorySlots.push(createInventorySlot(
      col,
      row,
      INVENTORY_CONFIG.START.X + col * INVENTORY_CONFIG.ITEM_SIZE,
      INVENTORY_CONFIG.START.Y + row * INVENTORY_CONFIG.ITEM_SIZE,
      INVENTORY_CONFIG.COLORS.GREEN
    ))
  }
}

function setup() {
  setupEventListeners()
}

function setupEventListeners() {
  if (STATE.inventoryOpen) {
    setupMouseListeners()
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'i') {
      STATE.inventoryOpen = !STATE.inventoryOpen

      if (STATE.inventoryOpen) {
        setupMouseListeners()
      }
      else {
        removeMouseListeners()
      }
    }
  })

}

function setupMouseListeners() {
  canvas.addEventListener('mousedown', handleMouseDown)
  canvas.addEventListener('mouseup', handleMouseUp)
}
function removeMouseListeners() {
  canvas.removeEventListener('mousedown', handleMouseDown)
  canvas.removeEventListener('mouseup', handleMouseUp)
}
function handleMouseDown(e) {
  STATE.isMouseDragging = true

  const { layerX, layerY } = e
  const x = Math.floor(layerX / SCALE)
  const y = Math.floor(layerY / SCALE)

  if (isWithinInventory(x, y)) {
    STATE.draggedInventorySlot = findClickedInventorySlot(x, y)
    STATE.draggedInventorySlot.color = INVENTORY_CONFIG.COLORS.RED
  }
}
function handleMouseUp(e) {
  STATE.isMouseDragging = false
  if (STATE.draggedInventorySlot) {
    STATE.draggedInventorySlot.color = INVENTORY_CONFIG.COLORS.GREEN
    STATE.draggedInventorySlot = null
  }
}


function isWithinInventory(x, y) {
  return (
    x > INVENTORY_CONFIG.START.X &&
    x < INVENTORY_CONFIG.START.X + INVENTORY_CONFIG.COLS * INVENTORY_CONFIG.ITEM_SIZE &&
    y > INVENTORY_CONFIG.START.Y &&
    y < INVENTORY_CONFIG.START.Y + INVENTORY_CONFIG.ROWS * INVENTORY_CONFIG.ITEM_SIZE
  )
}

function findClickedInventorySlot(x, y) {
  return STATE.inventorySlots.find(slot => (
    slot.x < x && slot.x + INVENTORY_CONFIG.ITEM_SIZE >= x &&
    slot.y < y && slot.y + INVENTORY_CONFIG.ITEM_SIZE >= y
  ))
}

function update() {
  // TODO: Implement (or delete)?
}

const strokeStyle = 'rgba(0, 0, 0, 0.5)';

function render() {
  if (!STATE.inventoryOpen) {
    return
  }

  for (const inventorySlot of STATE.inventorySlots) {
    const { x, y, color } = inventorySlot

    const lineWidth = 1
    context.lineWidth = lineWidth
    context.strokeStyle = strokeStyle
    context.strokeRect(x, y, INVENTORY_CONFIG.ITEM_SIZE - lineWidth, INVENTORY_CONFIG.ITEM_SIZE - lineWidth);

    context.fillStyle = color;
    context.fillRect(x, y, INVENTORY_CONFIG.ITEM_SIZE - (lineWidth * 2), INVENTORY_CONFIG.ITEM_SIZE - (lineWidth * 2));
  }
}

export default {
  setup,
  update,
  render
}
