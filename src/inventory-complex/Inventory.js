import CONFIG from '../Config.js'

import { context } from '../Canvas.js'

import inventorySlots from './InventorySlots.js'

const { SCALE } = CONFIG

const INVENTORY_CONFIG = {
  SLOT_SIZE: CONFIG.INVENTORY.SLOT_SIZE,
  COLS: 8,
  ROWS: 6,
}
if (INVENTORY_CONFIG.SLOT_SIZE % 2 !== 0) {
  throw new Error('INVENTORY_CONFIG.SLOT_SIZE must be an even number!')
}
INVENTORY_CONFIG.HALF_SLOT_SIZE = parseInt(INVENTORY_CONFIG.SLOT_SIZE / 2)
INVENTORY_CONFIG.START = {
  X: canvas.width / 2 - (INVENTORY_CONFIG.SLOT_SIZE * INVENTORY_CONFIG.COLS) / 2, // center X
  Y: canvas.height / 2 - (INVENTORY_CONFIG.SLOT_SIZE * INVENTORY_CONFIG.ROWS) / 2, // center Y
}
INVENTORY_CONFIG.FRAME = { THICKNESS: 12 }
INVENTORY_CONFIG.FRAME = {
  ...INVENTORY_CONFIG.FRAME,
  COLOR: 'rgba(0, 0, 0, 0.5)',
  X: INVENTORY_CONFIG.START.X - INVENTORY_CONFIG.FRAME.THICKNESS,
  Y: INVENTORY_CONFIG.START.Y - INVENTORY_CONFIG.FRAME.THICKNESS,
  WIDTH: INVENTORY_CONFIG.COLS * INVENTORY_CONFIG.SLOT_SIZE + INVENTORY_CONFIG.FRAME.THICKNESS * 2,
  HEIGHT: INVENTORY_CONFIG.ROWS * INVENTORY_CONFIG.SLOT_SIZE + INVENTORY_CONFIG.FRAME.THICKNESS * 2,
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
        INVENTORY_CONFIG.START.X + col * INVENTORY_CONFIG.SLOT_SIZE,
        INVENTORY_CONFIG.START.Y + row * INVENTORY_CONFIG.SLOT_SIZE,
      ),
    )
  }
}

function DEBUG_inventoryPrettyPrint() {
  const printableArray = []
  for (let row = 0; row < INVENTORY_CONFIG.ROWS; ++row) {
    printableArray.push([])
    for (let col = 0; col < INVENTORY_CONFIG.COLS; ++col) {
      printableArray[row].push(STATE.inventorySlots[col + row * INVENTORY_CONFIG.COLS])
    }
  }

  let printString = ''
  printableArray.forEach(row => {
    row.map(slot => {
      printString += `${slot.col} ${slot.row} ${(slot.storedItem?.name || (slot?.masterSlot && '(slave)') || '').padEnd(
        12,
      )} | `
    }),
      (printString += '\n')
  })
  console.log(printString)
}

function addItem(item) {
  const firstEmptySlot = findEnoughSlotsForItem(item)

  if (!firstEmptySlot) {
    console.log('Inventory Full!')
    return
  }

  item.storedInInventory = true
  item.x = null
  item.y = null

  occupySpaceAroundSlot(firstEmptySlot, item)
}

function removeItem(item, worldX, worldY) {
  const parentSlot = STATE.inventorySlots.find(slot => slot.storedItem === item)
  releaseSpaceAroundSlot(parentSlot, item)
  item.x = worldX
  item.y = worldY
  item.storedInInventory = false
}

function occupySpaceAroundSlot(slot, item) {
  const startCol = slot.col
  const startRow = slot.row
  let currentSlot
  for (let col = 0; col < item.sizeCols; ++col) {
    for (let row = 0; row < item.sizeRows; ++row) {
      currentSlot = STATE.inventorySlots[startCol + col + (startRow + row) * INVENTORY_CONFIG.COLS]
      currentSlot.occupied = true
      currentSlot.masterSlot = slot
    }
  }
  slot.storedItem = item
}

function spaceAroundSlotIsOccupied(slot, item) {
  const startCol = slot.col
  const startRow = slot.row
  let currentSlot
  for (let col = 0; col < item.sizeCols; ++col) {
    for (let row = 0; row < item.sizeRows; ++row) {
      if (col === 0 && row === 0) {
        continue
      }

      if (startCol + col >= INVENTORY_CONFIG.COLS) {
        return true
      }
      if (col >= INVENTORY_CONFIG.COLS - 1 && row >= INVENTORY_CONFIG.ROWS - 1) {
        return true
      }

      currentSlot = STATE.inventorySlots[startCol + col + (startRow + row) * INVENTORY_CONFIG.COLS]
      if (!currentSlot || currentSlot.occupied) {
        return true
      }
    }
  }
  return false
}

function spaceAroundSlotIsOnlyOccupiedByAllowedItem(targetSlot, allowedItem) {
  const startCol = targetSlot.col
  const startRow = targetSlot.row
  let currentSlot
  for (let col = 0; col < allowedItem.sizeCols; ++col) {
    for (let row = 0; row < allowedItem.sizeRows; ++row) {
      if (col >= INVENTORY_CONFIG.COLS - 1 && row >= INVENTORY_CONFIG.ROWS - 1) {
        return false
      }

      if (startCol + col >= INVENTORY_CONFIG.COLS) {
        return false
      }

      currentSlot = STATE.inventorySlots[startCol + col + (startRow + row) * INVENTORY_CONFIG.COLS]
      if (!currentSlot) {
        return false
      }
      if (currentSlot.storedItem === allowedItem || currentSlot.masterSlot?.storedItem === allowedItem) {
        continue
      } else if (currentSlot.occupied) {
        return false
      }
    }
  }
  return true
}

function spaceAroundSlotIsOccupiedByItemsOtherThanTheOneAtTheSlot(slot, item) {
  const startCol = slot.col
  const startRow = slot.row
  let currentSlot
  for (let col = 0; col < item.sizeCols; ++col) {
    for (let row = 0; row < item.sizeRows; ++row) {
      if (col === 0 && row === 0) {
        continue
      }
      if (col >= INVENTORY_CONFIG.COLS - 1 && row >= INVENTORY_CONFIG.ROWS - 1) {
        return true
      }

      currentSlot = STATE.inventorySlots[startCol + col + (startRow + row) * INVENTORY_CONFIG.COLS]
      if (!currentSlot) {
        return true
      }
      if (currentSlot.masterSlot === slot || currentSlot.masterSlot === slot.masterSlot) {
        continue
      } else if (currentSlot.occupied) {
        return true
      }
    }
  }
  return false
}

function releaseSpaceAroundSlot(slot, item) {
  const startCol = slot.col
  const startRow = slot.row
  let currentSlot
  for (let col = 0; col < item.sizeCols; ++col) {
    for (let row = 0; row < item.sizeRows; ++row) {
      currentSlot = STATE.inventorySlots[startCol + col + (startRow + row) * INVENTORY_CONFIG.COLS]
      currentSlot.occupied = false
      currentSlot.masterSlot = null
    }
  }
  slot.storedItem = null
}

function findEnoughSlotsForItem(item) {
  return STATE.inventorySlots.find(slot => {
    if (slot.occupied) {
      return false
    }

    // Bigger items require more calculation
    if (item.sizeCols > 1 || item.sizeRows > 1) {
      let currentSlot = STATE.inventorySlots[slot.col + slot.row * INVENTORY_CONFIG.COLS]

      for (let relativeCol = 0; relativeCol < item.sizeCols; ++relativeCol) {
        if (!currentSlot || currentSlot.occupied) {
          return false
        }

        if (slotsBelowAreTaken(currentSlot.col, currentSlot.row, item.sizeRows - 1)) {
          return false
        }

        currentSlot = getSlotToTheRight(currentSlot)
      }
    }

    return true
  })
}

function slotsBelowAreTaken(col, row, numberOfSlotsToCheck) {
  let currentSlot
  for (let relativeRow = 0; relativeRow < numberOfSlotsToCheck; ++relativeRow) {
    currentSlot = STATE.inventorySlots[col + (row + relativeRow) * INVENTORY_CONFIG.COLS]

    if (!currentSlot) {
      return true
    }

    const slotToTheBottom = getSlotToTheBottom(currentSlot)
    if (!slotToTheBottom || slotToTheBottom.occupied) {
      return true
    }
  }
}

function getSlotToTheRight(slot) {
  const nextCol = slot.col + 1
  if (slot.col % INVENTORY_CONFIG.COLS === (nextCol % INVENTORY_CONFIG.COLS) - 1) {
    return STATE.inventorySlots[nextCol + slot.row * INVENTORY_CONFIG.COLS]
  } else {
    return null
  }
}
function getSlotToTheBottom(slot) {
  const nextRow = slot.row + 1

  if (nextRow > INVENTORY_CONFIG.ROWS) {
    return null
  }

  return STATE.inventorySlots[slot.col + nextRow * INVENTORY_CONFIG.COLS]
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
        .map(slot => {
          slot.occupied = false
          slot.masterSlot = null
          return slot
        })
        .filter(slot => slot.storedItem)
        .map(slot => {
          const item = slot.storedItem
          slot.storedItem = null
          return item
        })
        // Sort by item size
        .sort((itemA, itemB) => itemB.sizeCols * itemB.sizeRows - itemA.sizeCols * itemA.sizeRows)
        .forEach((item, index) => {
          const slot = findEnoughSlotsForItem(item)
          slot.storedItem = item
          occupySpaceAroundSlot(slot, item)
        })
    }
  })
}

function setupMouseListeners() {
  canvas.addEventListener('mousedown', handleMouseDown)
  canvas.addEventListener('mousemove', handleMouseDrag)
  document.addEventListener('mouseup', handleMouseUp)
}
function removeMouseListeners() {
  canvas.removeEventListener('mousedown', handleMouseDown)
  canvas.removeEventListener('mousemove', handleMouseDrag)
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
    if (STATE.draggedInventorySlot.storedItem === null && STATE.draggedInventorySlot.occupied === true) {
      STATE.draggedInventorySlot = STATE.draggedInventorySlot.masterSlot
      STATE.draggedItem = STATE.draggedInventorySlot.masterSlot.storedItem
    }

    if (STATE.draggedItem) {
      STATE.draggedItem.dragged = true
    }
  }
}
function handleMouseDrag(e) {
  if (STATE.isMouseDragging) {
    const { layerX, layerY } = e
    const x = Math.floor(layerX / SCALE)
    const y = Math.floor(layerY / SCALE)

    STATE.draggingCoordinates.x = x
    STATE.draggingCoordinates.y = y

    STATE.inventorySlots.forEach(s => s.unhighlight())

    if (isWithinInventory(x, y)) {
      const slotUnderCursor = findInventorySlotAtCoordinates(x, y)
      if (slotUnderCursor) {
        highlightSlots(slotUnderCursor)
      }
    }

    function highlightSlots(slotUnderCursor) {
      if (STATE.draggedItem) {
        for (let i = 0; i < STATE.draggedItem.sizeCols; ++i) {
          for (let j = 0; j < STATE.draggedItem.sizeRows; ++j) {
            if (slotUnderCursor.col + i >= INVENTORY_CONFIG.COLS) {
              return
            }
            STATE.inventorySlots[
              slotUnderCursor.col + i + (slotUnderCursor.row + j) * INVENTORY_CONFIG.COLS
            ]?.highlight()
          }
        }
      } else {
        slotUnderCursor.highlight()
      }
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

    if (isWithinInventory(x, y) === false && STATE.draggedItem) {
      removeItem(STATE.draggedItem, x - INVENTORY_CONFIG.HALF_SLOT_SIZE, y - INVENTORY_CONFIG.HALF_SLOT_SIZE)
      return cleanDraggingState()
    }

    const targetInventorySlot = findInventorySlotAtCoordinates(x, y)
    if (!targetInventorySlot) {
      return
    }
    if (targetInventorySlot.storedItem === null && targetInventorySlot.occupied === false) {
      if (
        STATE.draggedItem &&
        (!spaceAroundSlotIsOccupied(targetInventorySlot, STATE.draggedItem) ||
          spaceAroundSlotIsOnlyOccupiedByAllowedItem(targetInventorySlot, STATE.draggedItem))
      ) {
        targetInventorySlot.storedItem = STATE.draggedItem
        releaseSpaceAroundSlot(STATE.draggedInventorySlot, STATE.draggedItem)
        occupySpaceAroundSlot(targetInventorySlot, targetInventorySlot.storedItem)
        return cleanDraggingState()
      }
    } else if (CONFIG.INVENTORY.ITEM_SWAPPING_ENABLED) {
      const targetSlot = targetInventorySlot
      const targetSlotMaster = targetInventorySlot.masterSlot
      const targetItem = targetSlot.storedItem
      const targetSlotMasterItem = targetSlot.masterSlot?.storedItem || null

      // If we're actually dropping an Item on one of its own slots
      if (
        targetSlotMasterItem === STATE.draggedItem &&
        !spaceAroundSlotIsOccupiedByItemsOtherThanTheOneAtTheSlot(targetSlot, STATE.draggedItem) &&
        !spaceAroundSlotIsOccupiedByItemsOtherThanTheOneAtTheSlot(targetSlotMaster, STATE.draggedItem)
      ) {
        if (
          // This if guard prevents the item from going out of bounds:
          targetSlot.row + STATE.draggedItem.sizeRows <= INVENTORY_CONFIG.ROWS &&
          targetSlot.col + STATE.draggedItem.sizeCols <= INVENTORY_CONFIG.COLS
        ) {
          releaseSpaceAroundSlot(STATE.draggedInventorySlot, STATE.draggedItem)
          targetSlot.storedItem = targetSlotMasterItem
          occupySpaceAroundSlot(targetSlot, targetSlot.storedItem)
          return cleanDraggingState()
        } else {
          return cleanDraggingState()
        }
      }

      if (
        STATE.draggedItem &&
        !spaceAroundSlotIsOccupiedByItemsOtherThanTheOneAtTheSlot(targetSlot, STATE.draggedItem) &&
        !spaceAroundSlotIsOccupiedByItemsOtherThanTheOneAtTheSlot(
          STATE.draggedInventorySlot,
          targetItem || targetSlotMasterItem,
        )
      ) {
        if (targetSlot && targetItem) {
          releaseSpaceAroundSlot(targetSlot, targetItem)
        }
        if (targetSlotMaster) {
          releaseSpaceAroundSlot(targetSlotMaster, targetItem || targetSlotMasterItem)
        }

        releaseSpaceAroundSlot(STATE.draggedInventorySlot, STATE.draggedInventorySlot.storedItem)
        if (STATE.draggedInventorySlot.masterSlot) {
          releaseSpaceAroundSlot(
            STATE.draggedInventorySlot.masterSlot,
            STATE.draggedInventorySlot.masterSlot.storedItem,
          )
        }

        targetSlot.storedItem = STATE.draggedItem

        occupySpaceAroundSlot(targetSlot, targetSlot.storedItem)

        STATE.draggedInventorySlot.storedItem = targetItem || targetSlotMasterItem

        occupySpaceAroundSlot(STATE.draggedInventorySlot, targetItem || targetSlotMasterItem)
      }
    }
  }

  cleanDraggingState()

  // Basically a function that serves as a GOTO >:D
  function cleanDraggingState() {
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
