export default class ConfirmationController {
  #originalSubmitter
  #config = {
    dialogSelector: '#confirm',
    activeClass: 'modal--active',
    acceptSelector: '#confirm-accept',
    denySelector: '.confirm-cancel',
    animationDuration: 300,
    contentSlots: {
      title: {
        contentAttribute: 'turbo-confirm',
        slotSelector: '#confirm-title'
      },
      body: {
        contentAttribute: 'confirm-details',
        slotSelector: '#confirm-body'
      }
    }
  }

  constructor(options = {}) {
    // override default config with any options passed in
    for(const [key, value] of Object.entries(options)) {
      this.#config[key] = value
    }
    // bind methods for use as event listeners
    this.accept = this.accept.bind(this)
    this.deny = this.deny.bind(this)
  }

  perform(event) {
    // If present, the confirmation dialog was already accepted.
    // We just need to clean up and the original action will proceed as normal.
    if (this.#originalSubmitter) return this.#teardown()
    // Otherwise, we need to prevent the default action
    event.preventDefault()
    // and store a reference to the original submitter
    this.#originalSubmitter = event.target
    // event.target might be an icon or other element nested inside the element we want.
    this.#showConfirm(event.target.closest(`[data-turbo-confirm]`))
  }

  accept() {
    // re-trigger the original action
    this.#originalSubmitter.click()
  }

  deny() {
    this.#teardown()
  }

  get dialogTarget() {
    return document.querySelector(this.#config.dialogSelector)
  }

  #slotTarget(slotName) {
    return document.querySelector(this.#config.contentSlots[slotName].slotSelector)
  }

  #slotContent(slotName, element) {
    return element.getAttribute(`data-${this.#config.contentSlots[slotName].contentAttribute}`)
  }

  #showConfirm(element) {
    this.#fillSlots(element)
    this.dialogTarget.classList.add(this.#config.activeClass)
    this.#setupListeners()
  }

  #teardown() {
    this.dialogTarget.classList.remove(this.#config.activeClass)
    this.#originalSubmitter = undefined
    this.#teardownListeners()
    this.#clearSlots()
  }

  #fillSlots(sourceElement) {
    // transfer content from source element's data attributes to dialog slots, defined by config object.
    for(const slotName of Object.keys(this.#config.contentSlots)) {
      const slotTarget = this.#slotTarget(slotName)
      const slotContent = this.#slotContent(slotName, sourceElement)
      if (slotTarget && slotContent) {
        slotTarget.innerHTML = slotContent
      }
    }
  }

  #clearSlots() {
    const slots = []
    for(const [slotName, _slotConfig] of Object.entries(this.#config.contentSlots)) {
      slots.push(this.#slotTarget(slotName))
    }
    // allow for hide animation to complete before removing content
    setTimeout(()=> {
      slots.forEach(slot => slot.innerHTML = '')
    }, this.#config.animationDuration)
  }

  #setupListeners() {
    this.dialogTarget.querySelectorAll(this.#config.acceptSelector).forEach(element => element.addEventListener('click', this.accept))
    this.dialogTarget.querySelectorAll(this.#config.denySelector).forEach(element => element.addEventListener('click', this.deny))
  }

  #teardownListeners() {
    this.dialogTarget.querySelectorAll(this.#config.acceptSelector).forEach(element => element.removeEventListener('click', this.accept))
    this.dialogTarget.querySelectorAll(this.#config.denySelector).forEach(element => element.removeEventListener('click', this.deny))
  }
}
