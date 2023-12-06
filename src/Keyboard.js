const KEYBOARD_KEYS = {
  w: 87,
  a: 65,
  s: 83,
  d: 68,
  up    : 38,
  left  : 37,
  down  : 40,
  right : 39,
}

export function setupEventListeners(player) {
  document.addEventListener('keydown', e => {
    switch (e.keyCode) {
      case KEYBOARD_KEYS.w:
      case KEYBOARD_KEYS.up:
        player.moving.up = true
        break
      case KEYBOARD_KEYS.a:
      case KEYBOARD_KEYS.left:
        player.moving.left = true
        break
      case KEYBOARD_KEYS.s:
      case KEYBOARD_KEYS.down:
        player.moving.down = true
        break
      case KEYBOARD_KEYS.d:
      case KEYBOARD_KEYS.right:
        player.moving.right = true
        break
      default:
        break
    }
  })
  document.addEventListener('keyup', e => {
    switch (e.keyCode) {
      case KEYBOARD_KEYS.w:
      case KEYBOARD_KEYS.up:
        player.moving.up = false
        break
      case KEYBOARD_KEYS.a:
      case KEYBOARD_KEYS.left:
        player.moving.left = false
        break
      case KEYBOARD_KEYS.s:
      case KEYBOARD_KEYS.down:
        player.moving.down = false
        break
      case KEYBOARD_KEYS.d:
      case KEYBOARD_KEYS.right:
        player.moving.right = false
        break
      default:
        break
    }
  })
}
