import CONFIG from './Config.js'

import inventorySlots from './InventorySlots.js'
import { createItem } from './Items.js'

const { SCALE } = CONFIG

const INVENTORY_CONFIG = {
  SLOT_SIZE: 28,
  COLS: 8,
  ROWS: 6,
}
INVENTORY_CONFIG.START = {
  X: canvas.width / 2 - (INVENTORY_CONFIG.SLOT_SIZE * INVENTORY_CONFIG.COLS) / 2, // center X
  Y: canvas.height / 2 - (INVENTORY_CONFIG.SLOT_SIZE * INVENTORY_CONFIG.ROWS) / 2, // center Y
}

const STATE = {
  inventoryOpen: false,
  inventorySlots: [],
  isMouseDragging: false,
  draggedItem: null,
  draggedInventorySlot: undefined,
}

// Initialize state
for (let col = 0; col < INVENTORY_CONFIG.COLS; ++col) {
  for (let row = 0; row < INVENTORY_CONFIG.ROWS; ++row) {
    STATE.inventorySlots.push(
      inventorySlots.create(
        col,
        row,
        INVENTORY_CONFIG.START.X + col * INVENTORY_CONFIG.SLOT_SIZE,
        INVENTORY_CONFIG.START.Y + row * INVENTORY_CONFIG.SLOT_SIZE,
      ),
    )
  }
}

// TODO: Temporary item initialization
STATE.inventorySlots[0].storedItem = createItem()
STATE.inventorySlots[INVENTORY_CONFIG.ROWS * 1].storedItem = createItem()

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

  const { layerX, layerY } = e
  const x = Math.floor(layerX / SCALE)
  const y = Math.floor(layerY / SCALE)

  if (isWithinInventory(x, y)) {
    STATE.draggedInventorySlot = findInventorySlotAtCoordinates(x, y)
    STATE.draggedItem = STATE.draggedInventorySlot.storedItem || null
  }
}
function handleMouseHover(e) {
  if (STATE.isMouseDragging) {
    const { layerX, layerY } = e
    const x = Math.floor(layerX / SCALE)
    const y = Math.floor(layerY / SCALE)

    if (isWithinInventory(x, y)) {
      STATE.inventorySlots.forEach(s => s.unhighlight())
      const slotUnderCursor = findInventorySlotAtCoordinates(x, y)
      slotUnderCursor.highlight()
    }
  }
}
function handleMouseUp(e) {
  STATE.isMouseDragging = false
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
      targetInventorySlot.unhighlight()
    }

    STATE.draggedInventorySlot.unhighlight()
    STATE.draggedInventorySlot = null
    STATE.draggedItem = null
  }
}

function getMouseCoordinatesFromEvent(e) {}

function isWithinInventory(x, y) {
  return (
    x > INVENTORY_CONFIG.START.X &&
    x < INVENTORY_CONFIG.START.X + INVENTORY_CONFIG.COLS * INVENTORY_CONFIG.SLOT_SIZE &&
    y > INVENTORY_CONFIG.START.Y &&
    y < INVENTORY_CONFIG.START.Y + INVENTORY_CONFIG.ROWS * INVENTORY_CONFIG.SLOT_SIZE
  )
}

function findInventorySlotAtCoordinates(x, y) {
  return STATE.inventorySlots.find(
    slot =>
      slot.x < x && slot.x + INVENTORY_CONFIG.SLOT_SIZE >= x && slot.y < y && slot.y + INVENTORY_CONFIG.SLOT_SIZE >= y,
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

  const slotsThatStoreItems = STATE.inventorySlots.filter(slot => slot.storedItem !== null)

  for (const slot of slotsThatStoreItems) {
    slot.storedItem.render(INVENTORY_CONFIG.SLOT_SIZE, slot) // TODO: Somehow share the INVENTORY_CONFIG -> setup() function
  }
}

export default {
  setup,
  update,
  render,
}
