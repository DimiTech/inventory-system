import CONFIG from './Config.js'

import inventorySlots from './InventorySlots.js'
import { createItem } from './Items.js'

const { SCALE } = CONFIG

const INVENTORY_CONFIG = {
  SLOT_SIZE: 28,
  SLOT_GAP: 4,
  COLS: 8,
  ROWS: 6,
}
if (INVENTORY_CONFIG.SLOT_SIZE % 2 !== 0) {
  throw new Error('INVENTORY_CONFIG.SLOT_SIZE must be an even number!')
}
if (INVENTORY_CONFIG.SLOT_GAP % 2 !== 0) {
  throw new Error('INVENTORY_CONFIG.SLOT_GAP must be an even number!')
}
INVENTORY_CONFIG.HALF_SLOT_SIZE = parseInt(INVENTORY_CONFIG.SLOT_SIZE / 2)
INVENTORY_CONFIG.HALF_GAP_SIZE = parseInt(INVENTORY_CONFIG.SLOT_GAP / 2)
const totalGapOffsetX = (INVENTORY_CONFIG.COLS * INVENTORY_CONFIG.SLOT_GAP) / 2
const totalGapOffsetY = (INVENTORY_CONFIG.ROWS * INVENTORY_CONFIG.SLOT_GAP) / 2
INVENTORY_CONFIG.START = {
  X: canvas.width / 2 - (INVENTORY_CONFIG.SLOT_SIZE * INVENTORY_CONFIG.COLS) / 2 - totalGapOffsetX, // center X
  Y: canvas.height / 2 - (INVENTORY_CONFIG.SLOT_SIZE * INVENTORY_CONFIG.ROWS) / 2 - totalGapOffsetY, // center Y
}

const STATE = {
  inventoryOpen: false,
  inventorySlots: [],
  isMouseDragging: false,
  draggingCoordinates: {
    x: null,
    y: null,
  },
  draggedItem: null,
  draggedInventorySlot: undefined,
}

// Initialize state
for (let row = 0; row < INVENTORY_CONFIG.ROWS; ++row) {
  for (let col = 0; col < INVENTORY_CONFIG.COLS; ++col) {
    STATE.inventorySlots.push(
      inventorySlots.create(
        col,
        row,
        INVENTORY_CONFIG.START.X + col * INVENTORY_CONFIG.SLOT_SIZE + col * INVENTORY_CONFIG.SLOT_GAP,
        INVENTORY_CONFIG.START.Y + row * INVENTORY_CONFIG.SLOT_SIZE + row * INVENTORY_CONFIG.SLOT_GAP,
      ),
    )
  }
}

// TODO: Temporary item initialization
STATE.inventorySlots[0].storedItem = createItem()
STATE.inventorySlots[1].storedItem = createItem()
STATE.inventorySlots[2].storedItem = createItem()

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
      } else {
        removeMouseListeners()
      }
    }
  })
}

function setupMouseListeners() {
  canvas.addEventListener('mousedown', handleMouseDown)
  canvas.addEventListener('mousemove', handleMouseHover)
  canvas.addEventListener('mouseup', handleMouseUp)
}
function removeMouseListeners() {
  canvas.removeEventListener('mousedown', handleMouseDown)
  canvas.removeEventListener('mousemove', handleMouseHover)
  canvas.removeEventListener('mouseup', handleMouseUp)
}
function handleMouseDown(e) {
  STATE.isMouseDragging = true

  // TODO: Remove this repetition
  const { layerX, layerY } = e
  const x = Math.floor(layerX / SCALE)
  const y = Math.floor(layerY / SCALE)

  STATE.draggingCoordinates.x = x
  STATE.draggingCoordinates.y = y

  if (isWithinInventory(x, y)) {
    STATE.draggedInventorySlot = findInventorySlotAtCoordinates(x, y)
    STATE.draggedItem = STATE.draggedInventorySlot.storedItem || null
    if (STATE.draggedItem) {
      STATE.draggedItem.dragged = true
    }
  }
}
function handleMouseHover(e) {
  if (STATE.isMouseDragging) {
    const { layerX, layerY } = e
    const x = Math.floor(layerX / SCALE)
    const y = Math.floor(layerY / SCALE)

    STATE.draggingCoordinates.x = x
    STATE.draggingCoordinates.y = y

    STATE.inventorySlots.forEach(s => s.unhighlight())

    if (isWithinInventory(x, y)) {
      const slotUnderCursor = findInventorySlotAtCoordinates(x, y)
      slotUnderCursor && slotUnderCursor.highlight()
    }
  }
}
function handleMouseUp(e) {
  STATE.isMouseDragging = false
  STATE.draggingCoordinates.x = null
  STATE.draggingCoordinates.y = null

  if (STATE.draggedInventorySlot) {
    const { layerX, layerY } = e
    const x = Math.floor(layerX / SCALE)
    const y = Math.floor(layerY / SCALE)

    if (isWithinInventory(x, y)) {
      const targetInventorySlot = findInventorySlotAtCoordinates(x, y)
      if (targetInventorySlot.storedItem === null) {
        targetInventorySlot.storedItem = STATE.draggedItem
        STATE.draggedInventorySlot.storedItem = null
      }
    }

    STATE.inventorySlots.forEach(s => s.unhighlight())
    STATE.draggedInventorySlot = null
    if (STATE.draggedItem) {
      STATE.draggedItem.dragged = false
    }
    STATE.draggedItem = null
  }
}

function isWithinInventory(x, y) {
  return (
    x > INVENTORY_CONFIG.START.X &&
    x <
      INVENTORY_CONFIG.START.X +
        INVENTORY_CONFIG.COLS * INVENTORY_CONFIG.SLOT_SIZE +
        INVENTORY_CONFIG.COLS * INVENTORY_CONFIG.SLOT_GAP &&
    y > INVENTORY_CONFIG.START.Y &&
    y <
      INVENTORY_CONFIG.START.Y +
        INVENTORY_CONFIG.ROWS * INVENTORY_CONFIG.SLOT_SIZE +
        INVENTORY_CONFIG.ROWS * INVENTORY_CONFIG.SLOT_GAP
  )
}

function findInventorySlotAtCoordinates(x, y) {
  return STATE.inventorySlots.find(
    slot =>
      slot.x - INVENTORY_CONFIG.HALF_GAP_SIZE < x &&
      slot.x + INVENTORY_CONFIG.SLOT_SIZE + INVENTORY_CONFIG.HALF_GAP_SIZE >= x &&
      slot.y - INVENTORY_CONFIG.HALF_GAP_SIZE < y &&
      slot.y + INVENTORY_CONFIG.SLOT_SIZE + INVENTORY_CONFIG.HALF_GAP_SIZE >= y,
  )
}

function update() {
  // TODO: Implement (or delete)?
}

function render() {
  if (!STATE.inventoryOpen) {
    return
  }

  for (const inventorySlot of STATE.inventorySlots) {
    inventorySlot.render(INVENTORY_CONFIG.SLOT_SIZE)
  }

  // TODO: HINT: Possible spot for optimization!
  //       We are iterating through `STATE.inventorySlots` for the second time here
  //       to be sure that the Items are being rendered on top of the Slots
  for (const inventorySlot of STATE.inventorySlots.filter(slot => slot.storedItem)) {
    let x = inventorySlot.x
    let y = inventorySlot.y
    if (STATE.isMouseDragging && inventorySlot.storedItem.dragged) {
      x = STATE.draggingCoordinates.x - INVENTORY_CONFIG.HALF_SLOT_SIZE
      y = STATE.draggingCoordinates.y - INVENTORY_CONFIG.HALF_SLOT_SIZE
    }
    inventorySlot.storedItem.render(INVENTORY_CONFIG.SLOT_SIZE, x, y) // TODO: Somehow share the INVENTORY_CONFIG -> setup() function
  }
}

export default {
  setup,
  update,
  render,
}
