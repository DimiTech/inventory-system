import CONFIG from './Config.js'

const canvas = document.getElementById('canvas')

canvas.width = CONFIG.CANVAS_WIDTH
canvas.height = CONFIG.CANVAS_HEIGHT
canvas.style.width = CONFIG.SCALE !== 1 ? CONFIG.SCALE * CONFIG.CANVAS_WIDTH + 'px' : 'auto'
canvas.style.height = CONFIG.SCALE !== 1 ? CONFIG.SCALE * CONFIG.CANVAS_HEIGHT + 'px' : 'auto'

const context = canvas.getContext('2d')

export { canvas, context }
