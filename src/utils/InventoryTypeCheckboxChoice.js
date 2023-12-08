const complexInventoryCheckbox = document.getElementById('complexInventory')

const complexInventoryTypeString = 'complexInventory'

await new Promise(resolve => {
  document.addEventListener('DOMContentLoaded', () => {
    complexInventoryCheckbox.addEventListener('change', updateURL)
    resolve()
  })

  const urlParams = new URLSearchParams(window.location.search)
  complexInventoryCheckbox.checked = urlParams.has(complexInventoryTypeString)

  function updateURL() {
    const url = new URL(window.location.href)
    if (complexInventoryCheckbox.checked) {
      url.searchParams.set(complexInventoryTypeString, 'true')
    } else {
      url.searchParams.delete(complexInventoryTypeString)
    }
    history.replaceState(null, '', url.toString())
    location.reload()
  }
})

const complex = complexInventoryCheckbox.checked
export { complex }
