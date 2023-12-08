import CONFIG from '../Config.js'

import { context } from '../Canvas.js'

import inventorySlots from './InventorySlots.js'

const { SCALE } = CONFIG

const INVENTORY_CONFIG = {
  SLOT_SIZE: CONFIG.INVENTORY.SLOT_SIZE,
  SLOT_GAP: 10,
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
INVENTORY_CONFIG.FRAME = {
  COLOR: 'rgba(0, 0, 0, 0.5)',
  X: INVENTORY_CONFIG.START.X - INVENTORY_CONFIG.HALF_GAP_SIZE,
  Y: INVENTORY_CONFIG.START.Y - INVENTORY_CONFIG.HALF_GAP_SIZE,
  WIDTH: INVENTORY_CONFIG.COLS * INVENTORY_CONFIG.SLOT_SIZE + INVENTORY_CONFIG.COLS * INVENTORY_CONFIG.SLOT_GAP,
  HEIGHT: INVENTORY_CONFIG.ROWS * INVENTORY_CONFIG.SLOT_SIZE + INVENTORY_CONFIG.ROWS * INVENTORY_CONFIG.SLOT_GAP,
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

function addItem(item) {
  const firstEmptySlot = STATE.inventorySlots.find(slot => !slot.storedItem)
  if (!firstEmptySlot) {
    console.log('Inventory Full!')
    return
  }

  item.storedInInventory = true
  item.x = null
  item.y = null
  firstEmptySlot.storedItem = item
}

function removeItem(item, worldX, worldY) {
  const parentSlot = STATE.inventorySlots.find(slot => slot.storedItem === item)
  parentSlot.storedItem = null
  item.x = worldX
  item.y = worldY
  item.storedInInventory = false
}

function setup() {
  setupEventListeners()
}

function setupEventListeners() {
  if (STATE.inventoryOpen) {
    setupMouseListeners()
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'i' || e.key === 'I') {
      STATE.inventoryOpen = !STATE.inventoryOpen

      if (STATE.inventoryOpen) {
        setupMouseListeners()
      } else {
        removeMouseListeners()
      }
    }

    if (e.key === 'r' || e.key === 'R') {
      // Sort Items (in a very basic way)
      STATE.inventorySlots
        .filter(slot => slot.storedItem)
        .map(slot => {
          const item = slot.storedItem
          slot.storedItem = null
          return item
        })
        .forEach((item, index) => {
          STATE.inventorySlots[index].storedItem = item
        })
    }
  })
}

function setupMouseListeners() {
  canvas.addEventListener('mousedown', handleMouseDown)
  canvas.addEventListener('mousemove', handleMouseHover)
  document.addEventListener('mouseup', handleMouseUp)
}
function removeMouseListeners() {
  canvas.removeEventListener('mousedown', handleMouseDown)
  canvas.removeEventListener('mousemove', handleMouseHover)
  document.removeEventListener('mouseup', handleMouseUp)
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
      if (!targetInventorySlot) {
        return
      }
      if (targetInventorySlot.storedItem === null) {
        targetInventorySlot.storedItem = STATE.draggedItem
        STATE.draggedInventorySlot.storedItem = null
      } else if (CONFIG.INVENTORY.ITEM_SWAPPING_ENABLED) {
        const targetItem = targetInventorySlot.storedItem
        if (STATE.draggedItem && targetItem !== STATE.draggedItem) {
          // If we're actually dragging an item and we're not dropping an item on itself:
          targetInventorySlot.storedItem = STATE.draggedItem
          STATE.draggedInventorySlot.storedItem = targetItem
        }
      }
    } else if (STATE.draggedItem) {
      removeItem(STATE.draggedItem, x - INVENTORY_CONFIG.HALF_SLOT_SIZE, y - INVENTORY_CONFIG.HALF_SLOT_SIZE)
    }

    STATE.inventorySlots.forEach(s => s.unhighlight())
    // STATE.draggedInventorySlot.storedItem = null
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

// Used to render the Dragged Item on top of other Items
let draggedItemRenderFunction = null

function render() {
  if (!STATE.inventoryOpen) {
    return
  }

  // Render Inventory

  context.fillStyle = INVENTORY_CONFIG.FRAME.COLOR
  context.fillRect(
    INVENTORY_CONFIG.FRAME.X,
    INVENTORY_CONFIG.FRAME.Y,
    INVENTORY_CONFIG.FRAME.WIDTH,
    INVENTORY_CONFIG.FRAME.HEIGHT,
  )

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
    if (STATE.draggedItem && STATE.draggedItem === inventorySlot.storedItem) {
      draggedItemRenderFunction = () => inventorySlot.storedItem.renderInInventory(x, y)
    } else {
      inventorySlot.storedItem.renderInInventory(x, y)
    }
  }
  draggedItemRenderFunction && draggedItemRenderFunction()
  draggedItemRenderFunction = null
}

export default {
  setup,
  update,
  render,
  addItem,
}
