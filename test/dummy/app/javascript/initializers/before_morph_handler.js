document.addEventListener('turbo:before-morph-element', (event) => {
  // ensure flash notification animations are always run
  // ** requires adding a role="alert" attribute on Flash message elements **
  if (event.target.role === 'alert' && event.detail.newElement) {
    const parent = event.target.parentElement
    event.target.remove()
    parent.appendChild(event.detail.newElement)
  }
})

document.addEventListener('turbo:before-morph-attribute', (event) => {
  // Prevent lost Stimulus Controller State
  if (/^data-.*-value$/.test(event.detail.attributeName)) {
    event.preventDefault()
  }

  // Preserve open element states
  if (event.detail.attributeName === 'open') {
    event.preventDefault()
  }
})
